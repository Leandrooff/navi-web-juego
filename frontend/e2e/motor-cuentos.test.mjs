import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { existsSync } from 'node:fs';
import { chromium, expect } from '@playwright/test';

const base = process.env.NAVI_TEST_URL || 'http://127.0.0.1:5173';
const windowsChrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const executablePath = process.env.NAVI_BROWSER_PATH || (existsSync(windowsChrome) ? windowsChrome : undefined);

async function abrirPartida(page) {
  const password = `NaviPrueba-${randomUUID()}`;
  await page.goto(base);
  await page.getByRole('button', { name: 'Familias y docentes' }).click();
  await page.getByRole('button', { name: 'Crear una cuenta de familia o docente' }).click();
  await page.getByLabel('Tu nombre', { exact: true }).fill('Familia de prueba');
  await page.getByLabel('Correo electrónico').fill(`${randomUUID()}@example.test`);
  await page.getByLabel('Contraseña', { exact: true }).fill(password);
  await page.getByLabel('Repite la contraseña').fill(password);
  await page.getByRole('button', { name: 'Crear mi cuenta', exact: true }).click();
  await page.getByRole('button', { name: 'Crear primer perfil', exact: true }).click();
  await page.getByLabel('Alias del niño o niña').fill('Luna');
  await page.getByRole('button', { name: 'Guardar perfil', exact: true }).click();
  await page.getByRole('button', { name: 'Abrir su mundo' }).click();
}

test('recupera la primera decisión al perder su respuesta y elegir otra opción', async () => {
  const browser = await chromium.launch({ headless: true, executablePath });
  try {
    const page = await browser.newPage({ reducedMotion: 'reduce' });
    const stage = page.locator('.journey-stage');
    const choices = page.locator('.navi-choice');
    const continueButton = page.locator('.consequence-actions .navi-button');
    await abrirPartida(page);
    await expect(stage).toHaveAttribute('data-scene', 'cielo');
    for (const next of ['puente', 'encuentro']) {
      await choices.first().click();
      await continueButton.click();
      await expect(stage).toHaveAttribute('data-scene', next);
    }
    await expect(choices).toHaveCount(2);

    let savedResponse;
    let submissions = 0;
    const decisionUrl = '**/api/game-sessions/*/decisions';
    await page.route(decisionUrl, async route => {
      submissions++;
      const response = await route.fetch();
      savedResponse = await response.json();
      // Laravel confirma el guardado. El navegador pierde la respuesta.
      await route.abort();
    });
    await choices.first().evaluate(button => {
      button.click();
      button.click();
    });
    await expect(page.getByRole('alert')).toContainText('conexión');
    await expect(stage).toHaveAttribute('data-phase', 'jugando');
    assert.equal(submissions, 1);
    const saved = savedResponse.data;
    assert.equal(saved.decisions.length, 3);
    await page.unroute(decisionUrl);

    const conflict = page.waitForResponse(response =>
      response.url().endsWith('/decisions') && response.status() === 409);
    await choices.nth(1).click();
    await conflict;
    await expect(stage).toHaveAttribute('data-phase', 'consecuencia');
    const consequence = page.locator('.consequence-box');
    await expect(consequence).toHaveCount(1);
    await expect(consequence.locator('.speaker-label')).toContainText(saved.pending.choice_text);

    await page.getByRole('button', { name: 'Volver', exact: true }).click();
    await page.getByRole('button', { name: 'Volver al mapa', exact: true }).click();
    await page.getByRole('button', { name: 'Continuar mi aventura', exact: true }).click();
    await page.getByRole('button', { name: 'Continuar donde me quedé', exact: true }).click();
    await expect(stage).toHaveAttribute('data-scene', 'encuentro');
    await expect(consequence.locator('.speaker-label')).toContainText(saved.pending.choice_text);

    const continuation = page.waitForResponse(response => response.ok() && response.url().endsWith('/continue'));
    await continueButton.click();
    const advanced = (await (await continuation).json()).data;
    assert.equal(advanced.session.id, saved.session.id);
    assert.equal(advanced.session.current_scene_id, saved.pending.target_scene_id);
    assert.equal(advanced.pending, null);
    assert.deepEqual(advanced.decisions.map(decision => decision.id), saved.decisions.map(decision => decision.id));
  } finally {
    await browser.close();
  }
});
