// =========================================================
// ESTADO GLOBAL DE ACCESIBILIDAD Y AUDIO
// =========================================================

let synth = window.speechSynthesis;

let lecturaActual = null;

let volumenGlobal = 1;

let sonidoActivado = true;

// Tamaños de letra disponibles
const tamanosLetra = [
    'letra-normal',
    'letra-grande',
    'letra-extragrande'
];

// Índice del tamaño actual
let indiceTamano = 0;


// =========================================================
// INICIALIZACIÓN
// =========================================================

document.addEventListener('DOMContentLoaded', function () {

    // Establecer tamaño de letra inicial
    document.body.classList.add(
        tamanosLetra[indiceTamano]
    );


    // =====================================================
    // BOTÓN LEER
    // =====================================================

    const btnLeer =
        document.getElementById('btnLeer');

    if (btnLeer) {

        btnLeer.addEventListener('click', function () {

            const contenido =
                document.getElementById('contenidoLectura');

            if (contenido) {

                leerTexto(contenido.innerText);

            }

        });

    }


    // =====================================================
    // BOTÓN REPETIR
    // =====================================================

    const btnRepetir =
        document.getElementById('btnRepetir');

    if (btnRepetir) {

        btnRepetir.addEventListener('click', function () {

            repetirAudio();

        });

    }


    // =====================================================
    // BOTÓN DETENER
    // =====================================================

    const btnDetener =
        document.getElementById('btnDetener');

    if (btnDetener) {

        btnDetener.addEventListener('click', function () {

            detenerAudio();

        });

    }


    // =====================================================
    // BOTÓN SILENCIAR
    // =====================================================

    const btnSilenciar =
        document.getElementById('btn-silenciar');

    if (btnSilenciar) {

        btnSilenciar.addEventListener('click', function () {

            alternarSonido();

        });

    }


    // =====================================================
    // CONTROL DE VOLUMEN
    // =====================================================

    const controlVolumen =
        document.getElementById('volumen');

    if (controlVolumen) {

        controlVolumen.addEventListener('input', function () {

            cambiarVolumen(this.value);

        });

    }


    // =====================================================
    // BOTÓN CAMBIAR TAMAÑO DE LETRA
    // =====================================================

    const btnLetra =
        document.getElementById('btnLetra');

    if (btnLetra) {

        btnLetra.addEventListener('click', function () {

            aumentarLetra();

        });

    }


    // =====================================================
    // BOTÓN LETRA NORMAL
    // =====================================================

    const btnLetraNormal =
        document.getElementById('btnLetraNormal');

    if (btnLetraNormal) {

        btnLetraNormal.addEventListener('click', function () {

            cambiarTamanoLetra('letra-normal');

        });

    }


    // =====================================================
    // BOTÓN LETRA GRANDE
    // =====================================================

    const btnLetraGrande =
        document.getElementById('btnLetraGrande');

    if (btnLetraGrande) {

        btnLetraGrande.addEventListener('click', function () {

            cambiarTamanoLetra('letra-grande');

        });

    }


    // =====================================================
    // BOTÓN LETRA EXTRA GRANDE
    // =====================================================

    const btnLetraExtraGrande =
        document.getElementById('btnLetraExtraGrande');

    if (btnLetraExtraGrande) {

        btnLetraExtraGrande.addEventListener('click', function () {

            cambiarTamanoLetra('letra-extragrande');

        });

    }


    // =====================================================
    // BOTÓN ALTO CONTRASTE
    // =====================================================

    const btnContraste =
        document.getElementById('btnContraste');

    if (btnContraste) {

        btnContraste.addEventListener('click', function () {

            activarContraste();

        });

    }


    // =====================================================
    // BOTÓN AYUDA
    // =====================================================

    const btnAyuda =
        document.getElementById('btnAyuda');

    if (btnAyuda) {

        btnAyuda.addEventListener('click', function () {

            mostrarAyuda();

        });

    }


    // =====================================================
    // BOTÓN CERRAR AYUDA
    // =====================================================

    const btnCerrarAyuda =
        document.getElementById('btnCerrarAyuda');

    if (btnCerrarAyuda) {

        btnCerrarAyuda.addEventListener('click', function () {

            cerrarAyuda();

        });

    }

});


// =========================================================
// LEER TEXTO EN VOZ ALTA
// =========================================================

/**
 * Lee un texto utilizando Web Speech API.
 *
 * @param {string} texto
 */

function leerTexto(texto) {

    // Si el sonido está desactivado,
    // no reproducir nada.

    if (!sonidoActivado) {

        return;

    }


    // Verificar soporte del navegador

    if (!('speechSynthesis' in window)) {

        alert(
            'Tu navegador no admite la síntesis de voz automática.'
        );

        return;

    }


    // Verificar que exista texto

    if (!texto || texto.trim() === '') {

        return;

    }


    // Detener cualquier lectura anterior

    detenerAudio();


    // Crear nueva lectura

    lecturaActual =
        new SpeechSynthesisUtterance(texto);


    // Idioma español

    lecturaActual.lang = 'es-ES';


    // Volumen

    lecturaActual.volume =
        volumenGlobal;


    // Velocidad

    lecturaActual.rate = 0.9;


    // Tono

    lecturaActual.pitch = 1;


    // Cuando comienza

    lecturaActual.onstart = function () {

        actualizarIndicadorAudio(
            true,
            'Reproduciendo...'
        );

    };


    // Cuando termina

    lecturaActual.onend = function () {

        actualizarIndicadorAudio(
            false,
            'En reposo'
        );

    };


    // Cuando ocurre un error

    lecturaActual.onerror = function () {

        actualizarIndicadorAudio(
            false,
            'Error de audio'
        );

    };


    // Reproducir

    synth.speak(lecturaActual);

}


// =========================================================
// DETENER AUDIO
// =========================================================

/**
 * Detiene cualquier locución que esté reproduciéndose.
 */

function detenerAudio() {

    if (synth && synth.speaking) {

        synth.cancel();

    }


    actualizarIndicadorAudio(
        false,
        'En reposo'
    );

}


// =========================================================
// REPETIR AUDIO
// =========================================================

/**
 * Repite el último texto reproducido.
 */

function repetirAudio() {

    // Verificar que exista una lectura anterior

    if (!lecturaActual) {

        return;

    }


    // Verificar que el sonido esté activado

    if (!sonidoActivado) {

        return;

    }


    // Guardar el texto anterior

    const textoAnterior =
        lecturaActual.text;


    // Detener reproducción actual

    detenerAudio();


    // Reproducir nuevamente

    leerTexto(textoAnterior);

}


// =========================================================
// CAMBIAR VOLUMEN
// =========================================================

/**
 * Controla el volumen del sintetizador.
 *
 * @param {number|string} valor
 */

function cambiarVolumen(valor) {

    volumenGlobal =
        parseFloat(valor);


    // Asegurar que el volumen
    // esté entre 0 y 1

    if (isNaN(volumenGlobal)) {

        volumenGlobal = 1;

    }


    volumenGlobal =
        Math.max(
            0,
            Math.min(
                1,
                volumenGlobal
            )
        );


    const btn =
        document.getElementById(
            'btn-silenciar'
        );


    // Si el volumen llega a cero

    if (volumenGlobal === 0) {

        sonidoActivado = false;


        if (btn) {

            btn.innerText =
                '🔕 Sonido desactivado';

        }


        detenerAudio();

    }

    else {

        sonidoActivado = true;


        if (btn) {

            btn.innerText =
                '🔔 Sonido activo';

        }

    }

}


// =========================================================
// ACTIVAR / DESACTIVAR SONIDO
// =========================================================

/**
 * Alterna entre sonido activado y desactivado.
 */

function alternarSonido() {

    sonidoActivado =
        !sonidoActivado;


    const btn =
        document.getElementById(
            'btn-silenciar'
        );


    // Sonido desactivado

    if (!sonidoActivado) {

        detenerAudio();


        if (btn) {

            btn.innerText =
                '🔕 Sonido desactivado';

        }

    }

    // Sonido activado

    else {

        if (btn) {

            btn.innerText =
                '🔔 Sonido activo';

        }

    }

}


// =========================================================
// CAMBIAR TAMAÑO DE LETRA
// =========================================================

/**
 * Cambia entre los tres tamaños de letra.
 */

function aumentarLetra() {

    // Eliminar tamaño actual

    document.body.classList.remove(
        tamanosLetra[indiceTamano]
    );


    // Pasar al siguiente tamaño

    indiceTamano =
        (indiceTamano + 1)
        % tamanosLetra.length;


    // Aplicar nuevo tamaño

    document.body.classList.add(
        tamanosLetra[indiceTamano]
    );

}


// CAMBIAR A UN TAMAÑO ESPECÍFICO

function cambiarTamanoLetra(tamano) {

    // Eliminar todos los tamaños

    tamanosLetra.forEach(function (clase) {

        document.body.classList.remove(clase);

    });


    // Agregar el tamaño seleccionado

    document.body.classList.add(tamano);


    // Actualizar índice

    const nuevoIndice =
        tamanosLetra.indexOf(tamano);


    if (nuevoIndice !== -1) {

        indiceTamano = nuevoIndice;

    }

}

// ALTO CONTRASTE

function activarContraste() {

    document.body.classList.toggle(
        'alto-contraste'
    );

}

// MOSTRAR AYUDA


function mostrarAyuda() {

    // Primero intenta encontrar el ID
    // utilizado por el audio_control.

    let modal =
        document.getElementById(
            'modal-ayuda'
        );


    if (!modal) {

        modal =
            document.getElementById(
                'modalAyuda'
            );

    }


    if (modal) {

        modal.showModal();

    }

}

// CERRAR AYUDA

function cerrarAyuda() {

    let modal =
        document.getElementById(
            'modal-ayuda'
        );


    if (!modal) {

        modal =
            document.getElementById(
                'modalAyuda'
            );

    }


    if (modal) {

        modal.close();

    }

}

// ACTUALIZAR INDICADOR DE AUDIO

function actualizarIndicadorAudio(
    activo,
    mensaje
) {

    // Buscar el indicador por el ID
    // utilizado en audio_control.js.

    let indicador =
        document.getElementById(
            'indicador-audio'
        );


    // Si no existe, buscar el ID
    // utilizado en accesibilidad.html.

    if (!indicador) {

        indicador =
            document.getElementById(
                'indicadorAudio'
            );

    }


    // Si no existe el indicador,
    // terminar la función.

    if (!indicador) {

        return;

    }


    // Buscar el texto del estado.

    let texto =
        indicador.querySelector(
            '.texto-estado'
        );


    // Si no existe, buscar el elemento
    // utilizado por accesibilidad.html.

    if (!texto) {

        texto =
            document.getElementById(
                'estadoAudio'
            );

    }


    // Audio activo

    if (activo) {

        indicador.classList.add(
            'activo'
        );

        indicador.classList.remove(
            'desactivado'
        );

    }

    // Audio inactivo

    else {

        indicador.classList.remove(
            'activo'
        );

        indicador.classList.add(
            'desactivado'
        );

    }


    // Cambiar texto del indicador

    if (texto) {

        texto.innerText =
            mensaje;

    }

}

// DETENER AUDIO AL SALIR DE LA PÁGINA

window.addEventListener(
    'beforeunload',
    function () {

        if (
            'speechSynthesis'
            in window
        ) {

            window.speechSynthesis.cancel();

        }

    }
);
