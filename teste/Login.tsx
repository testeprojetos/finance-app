import { useState, useEffect } from "react";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className={`login-root ${mounted ? "mounted" : ""}`}>
      {/* Background grid + glow */}
      <div className="bg-grid" />
      <div className="bg-glow" />

      {/* Floating tickers */}
      <div className="ticker-strip">
        {["IBOV +1.42%", "USD/BRL 5.08", "SELIC 10.5%", "BTC +3.21%", "PETR4 +0.87%", "VALE3 -0.34%", "CDI 10.4%", "IPCA 4.62%"].map((t, i) => (
          <span key={i} className={`ticker-item ${t.includes("-") ? "neg" : "pos"}`}>{t}</span>
        ))}
      </div>

      <div className="login-card">
        {/* Logo */}
        <div className="logo-block">
          <div className="logo-icon">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="20" width="6" height="14" rx="1" fill="currentColor" opacity="0.4"/>
              <rect x="13" y="12" width="6" height="22" rx="1" fill="currentColor" opacity="0.65"/>
              <rect x="22" y="6" width="6" height="28" rx="1" fill="currentColor"/>
              <path d="M8 18 L16 10 L24 14 L34 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="34" cy="4" r="2.5" fill="currentColor"/>
            </svg>
          </div>
          <div className="logo-text">
            <span className="logo-name">Vaultix</span>
            <span className="logo-tagline">Controle Financeiro</span>
          </div>
        </div>

        {/* Header */}
        <div className="card-header">
          <h1 className="card-title">Bem-vindo de volta</h1>
          <p className="card-subtitle">Acesse sua carteira e acompanhe seu patrimônio</p>
        </div>

        {/* Stats row */}
        <div className="stats-row">
          <div className="stat-pill">
            <span className="stat-label">Portfólio</span>
            <span className="stat-value pos">+12.4%</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-pill">
            <span className="stat-label">Meta Mensal</span>
            <span className="stat-value">87%</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-pill">
            <span className="stat-label">Alertas</span>
            <span className="stat-value neg">3</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="field-group">
            <label className="field-label" htmlFor="email">E-mail</label>
            <div className="field-wrapper">
              <span className="field-icon">
                <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M2 7l8 5 8-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </span>
              <input
                id="email"
                type="email"
                className="field-input"
                placeholder="seu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="password">Senha</label>
            <div className="field-wrapper">
              <span className="field-icon">
                <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="4" y="9" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M7 9V6a3 3 0 016 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="field-input"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(v => !v)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg viewBox="0 0 20 20" fill="none"><path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" stroke="currentColor" strokeWidth="1.5"/><circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5"/><line x1="3" y1="3" x2="17" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                ) : (
                  <svg viewBox="0 0 20 20" fill="none"><path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" stroke="currentColor" strokeWidth="1.5"/><circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5"/></svg>
                )}
              </button>
            </div>
          </div>

          <div className="form-options">
            <label className="remember-label">
              <input type="checkbox" className="remember-check" />
              <span className="check-custom" />
              Lembrar-me
            </label>
            <a href="#" className="forgot-link">Esqueci a senha</a>
          </div>

          <button type="submit" className={`submit-btn ${isLoading ? "loading" : ""}`} disabled={isLoading}>
            {isLoading ? (
              <span className="spinner" />
            ) : (
              <>
                <span>Entrar na plataforma</span>
                <svg viewBox="0 0 20 20" fill="none"><path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </>
            )}
          </button>
        </form>

        <p className="register-text">
          Não tem conta? <a href="#" className="register-link">Criar conta gratuita</a>
        </p>

        {/* Security badge */}
        <div className="security-badge">
          <svg viewBox="0 0 16 16" fill="none"><path d="M8 1L2 3.5v5C2 12 5 14.5 8 15c3-0.5 6-3 6-6.5v-5L8 1z" stroke="currentColor" strokeWidth="1.2"/><path d="M5.5 8l1.5 1.5 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span>Conexão segura · Criptografia 256-bit</span>
        </div>
      </div>
    </div>
  );
}
