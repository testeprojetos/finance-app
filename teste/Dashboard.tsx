import { useState } from "react";
import "./Dashboard.css";

// ─── Types ────────────────────────────────────────────────
interface Category {
  id: string;
  label: string;
  emoji: string;
  value: number;
  type: "income" | "expense";
}

// ─── Data ─────────────────────────────────────────────────
const MONTHS = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
];

const INCOME_CATEGORIES: Category[] = [
  { id: "salario",       label: "Salário Principal", emoji: "💼", value: 2341.58, type: "income" },
  { id: "freelances",    label: "Freelances",         emoji: "💻", value: 0,       type: "income" },
  { id: "investimentos", label: "Investimentos",      emoji: "📈", value: 0,       type: "income" },
  { id: "vendas",        label: "Vendas",             emoji: "🛒", value: 0,       type: "income" },
  { id: "outras",        label: "Outras Receitas",    emoji: "💰", value: 0,       type: "income" },
];

const EXPENSE_CATEGORIES: Category[] = [
  { id: "moradia",     label: "Moradia",           emoji: "🏠", value: 0,      type: "expense" },
  { id: "energia",     label: "Energia Elétrica",  emoji: "⚡", value: 0,      type: "expense" },
  { id: "agua",        label: "Água",              emoji: "💧", value: 0,      type: "expense" },
  { id: "internet",    label: "Internet / Telefone",emoji: "📡", value: 0,      type: "expense" },
  { id: "alimentacao", label: "Alimentação",       emoji: "🍽️", value: 0,      type: "expense" },
  { id: "transporte",  label: "Transporte",        emoji: "🚗", value: 0,      type: "expense" },
  { id: "saude",       label: "Saúde",             emoji: "🏥", value: 0,      type: "expense" },
  { id: "educacao",    label: "Educação",          emoji: "📚", value: 0,      type: "expense" },
  { id: "lazer",       label: "Lazer",             emoji: "🎮", value: 0,      type: "expense" },
  { id: "roupas",      label: "Roupas",            emoji: "👕", value: 0,      type: "expense" },
  { id: "credito",     label: "Cartão de Crédito", emoji: "💳", value: 362.48, type: "expense" },
  { id: "emprestimos", label: "Empréstimos",       emoji: "🏦", value: 500.00, type: "expense" },
  { id: "seguros",     label: "Seguros",           emoji: "🛡️", value: 0,      type: "expense" },
  { id: "impostos",    label: "Impostos",          emoji: "📋", value: 0,      type: "expense" },
  { id: "diversos",    label: "Gastos Diversos",   emoji: "🛍️", value: 0,      type: "expense" },
];

// ─── Helpers ──────────────────────────────────────────────
const fmt = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// ─── Sub-components ───────────────────────────────────────
function SummaryCard({
  label, value, icon, color, sub,
}: { label: string; value: number; icon: string; color: string; sub?: string }) {
  return (
    <div className={`summary-card summary-card--${color}`}>
      <div className="summary-card__icon">{icon}</div>
      <div className="summary-card__body">
        <span className="summary-card__label">{label}</span>
        <span className="summary-card__value">{fmt(value)}</span>
        {sub && <span className="summary-card__sub">{sub}</span>}
      </div>
    </div>
  );
}

function CategoryRow({ cat }: { cat: Category }) {
  const hasValue = cat.value > 0;
  return (
    <div className={`cat-row ${hasValue ? "cat-row--active" : ""}`}>
      <span className="cat-row__emoji">{cat.emoji}</span>
      <span className="cat-row__label">{cat.label}</span>
      <div className="cat-row__right">
        <span className={`cat-row__value ${hasValue ? (cat.type === "income" ? "cat-row__value--income" : "cat-row__value--expense") : ""}`}>
          {fmt(cat.value)}
        </span>
        <span className="cat-row__arrow">›</span>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────
export default function Dashboard() {
  const now = new Date();
  const [monthIdx, setMonthIdx] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());

  const prevMonth = () => {
    if (monthIdx === 0) { setMonthIdx(11); setYear(y => y - 1); }
    else setMonthIdx(m => m - 1);
  };
  const nextMonth = () => {
    if (monthIdx === 11) { setMonthIdx(0); setYear(y => y + 1); }
    else setMonthIdx(m => m + 1);
  };

  const totalIncome  = INCOME_CATEGORIES.reduce((s, c) => s + c.value, 0);
  const totalExpense = EXPENSE_CATEGORIES.reduce((s, c) => s + c.value, 0);
  const balance      = totalIncome - totalExpense;
  const balancePct   = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;

  return (
    <div className="dash">
      {/* ── Nav ── */}
      <nav className="dash-nav">
        <div className="dash-nav__brand">
          <span className="dash-nav__logo">
            <svg viewBox="0 0 32 32" fill="none"><rect x="3" y="16" width="5" height="11" rx="1.5" fill="currentColor" opacity=".35"/><rect x="10.5" y="10" width="5" height="17" rx="1.5" fill="currentColor" opacity=".6"/><rect x="18" y="4" width="5" height="23" rx="1.5" fill="currentColor"/><path d="M6 14 L13 7 L20 11 L27 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </span>
          <span className="dash-nav__name">Finance App</span>
        </div>
        <div className="dash-nav__links">
          <a href="#" className="dash-nav__link dash-nav__link--active">🏠 Início</a>
          <a href="#" className="dash-nav__link">💸 Lançamentos</a>
          <a href="#" className="dash-nav__link">🏦 Cofre</a>
          <a href="#" className="dash-nav__link">📊 Relatórios</a>
        </div>
        <div className="dash-nav__user">
          <span className="dash-nav__email">moises@financeapp.com</span>
          <button className="dash-nav__logout">Sair</button>
        </div>
      </nav>

      <main className="dash-main">
        {/* ── Month nav ── */}
        <div className="month-nav">
          <button className="month-nav__btn" onClick={prevMonth}>‹</button>
          <div className="month-nav__center">
            <h2 className="month-nav__label">{MONTHS[monthIdx]} de {year}</h2>
            <div className="month-nav__dot" />
          </div>
          <button className="month-nav__btn" onClick={nextMonth}>›</button>
        </div>

        {/* ── Section header ── */}
        <div className="section-header">
          <div>
            <h3 className="section-header__title">{MONTHS[monthIdx]} de {year}</h3>
            <p className="section-header__sub">Sem meta definida</p>
          </div>
          <button className="section-header__meta-btn">
            <span>🎯</span> Meta
          </button>
        </div>

        {/* ── Summary cards ── */}
        <div className="summary-grid">
          <SummaryCard label="RECEITAS"  value={totalIncome}  icon="📝" color="income"  />
          <SummaryCard label="GASTOS"    value={totalExpense} icon="📉" color="expense" />
          <SummaryCard label="SALDO"     value={balance}      icon="💵" color="balance" />
          <SummaryCard label="META"      value={0}            icon="🎯" color="meta"    sub="Não definida" />
        </div>

        {/* ── Progress bar ── */}
        {totalIncome > 0 && (
          <div className="balance-bar">
            <div className="balance-bar__track">
              <div
                className="balance-bar__fill"
                style={{ width: `${Math.min(100, balancePct)}%` }}
              />
            </div>
            <span className="balance-bar__label">
              {balancePct.toFixed(0)}% do saldo em relação à receita
            </span>
          </div>
        )}

        {/* ── Cofre ── */}
        <div className="cofre-banner">
          <div className="cofre-banner__left">
            <span className="cofre-banner__icon">🏦</span>
            <div>
              <span className="cofre-banner__title">Cofre</span>
              <span className="cofre-banner__sub">0 movimentações</span>
            </div>
          </div>
          <div className="cofre-banner__right">
            <span className="cofre-banner__value">{fmt(0)}</span>
            <span className="cofre-banner__arrow">›</span>
          </div>
        </div>

        {/* ── Receitas ── */}
        <section className="cat-section">
          <div className="cat-section__header">
            <span className="cat-section__icon">🔥</span>
            <h4 className="cat-section__title cat-section__title--income">Receitas Mensais</h4>
          </div>
          <div className="cat-list">
            {INCOME_CATEGORIES.map(c => <CategoryRow key={c.id} cat={c} />)}
          </div>
        </section>

        {/* ── Gastos ── */}
        <section className="cat-section">
          <div className="cat-section__header">
            <span className="cat-section__icon">📊</span>
            <h4 className="cat-section__title cat-section__title--expense">Gastos Mensais</h4>
          </div>
          <div className="cat-list">
            {EXPENSE_CATEGORIES.map(c => <CategoryRow key={c.id} cat={c} />)}
          </div>
        </section>
      </main>
    </div>
  );
}
