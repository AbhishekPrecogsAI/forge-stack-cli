import type { ReactNode } from "react";
import { NavLink, Navigate, Outlet, Route, Routes } from "react-router-dom";

function ShellLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "rounded-full px-4 py-2 text-sm font-medium transition",
          isActive
            ? "bg-cyan-400 text-slate-950"
            : "border border-white/10 bg-white/5 text-slate-200 hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-100"
        ].join(" ")
      }
    >
      {children}
    </NavLink>
  );
}

function AppLayout() {
  return (
    <main className="app-shell">
      <div className="app-shell-grid">
        <aside className="shell-sidebar">
          <div className="space-y-2">
            <p className="eyebrow">Forge Stack</p>
            <h1 className="shell-brand">React Vite Starter</h1>
            <p className="shell-copy">
              A routed starter with a shared shell, nested layout, and 404 handling.
            </p>
          </div>

          <nav className="shell-nav">
            <ShellLink to="/">Home</ShellLink>
            <ShellLink to="/about">About</ShellLink>
          </nav>

          <div className="info-card">
            <div className="info-label">Stack</div>
            <div className="info-value">Vite + React Router</div>
          </div>
        </aside>

        <section className="shell-content">
          <Outlet />
        </section>
      </div>
    </main>
  );
}

function Home() {
  return (
    <section className="shell-card">
      <p className="badge">Home</p>
      <h2 className="hero-title">Production-ready foundation for a modern frontend.</h2>
      <p className="lead">
        This starter keeps the structure small, predictable, and ready to extend
        with feature folders, shared components, and data layers.
      </p>

      <div className="actions">
        <a className="button button-primary" href="https://vite.dev">
          Vite docs
        </a>
        <a className="button button-secondary" href="https://react.dev">
          React docs
        </a>
      </div>

      <div className="mini-grid">
        <div className="panel-row">
          <span>Language</span>
          <strong>TypeScript</strong>
        </div>
        <div className="panel-row">
          <span>Router</span>
          <strong>Nested layout</strong>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="shell-card">
      <p className="badge">About</p>
      <h2 className="hero-title">The shell is shared across pages.</h2>
      <p className="lead">
        The route tree is nested under a layout route, and the header/sidebar stay
        consistent while the content area changes.
      </p>
    </section>
  );
}

function NotFound() {
  return (
    <section className="shell-card">
      <p className="badge">404</p>
      <h2 className="hero-title">Page not found.</h2>
      <p className="lead">The route you requested does not exist.</p>
      <div className="actions">
        <ShellLink to="/">Back home</ShellLink>
      </div>
    </section>
  );
}

export function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
      </Route>
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate replace to="/404" />} />
    </Routes>
  );
}
