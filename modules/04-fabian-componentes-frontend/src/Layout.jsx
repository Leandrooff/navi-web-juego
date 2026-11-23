import React from "react";

export default function Layout({ children, active = "Inicio", userName = "Navi", onNavigate }) {
  const links = ["Inicio", "Aventuras", "Mi progreso", "Logros"];
  return <div className="navi-layout">
    <aside className="navi-sidebar"><a className="navi-brand" href="#inicio" aria-label="NAVI, inicio"><span className="navi-brand__mark">N</span><span>NAVI<small>Aprender jugando</small></span></a>
      <nav className="navi-menu" aria-label="Navegación principal">{links.map((label) => <button key={label} type="button" className={active === label ? "is-active" : ""} aria-current={active === label ? "page" : undefined} onClick={() => onNavigate?.(label)}>{label}</button>)}</nav>
      <div className="navi-profile"><span aria-hidden="true">👧</span><div><strong>{userName}</strong><small>Mi perfil</small></div></div>
    </aside><main className="navi-layout__main">{children}</main>
  </div>;
}
