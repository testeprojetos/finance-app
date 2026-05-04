// ============================================================
// DASHBOARD V2 — proposta visual (preview)
// Conectado aos dados reais do app
// ============================================================

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUIStore } from '../../store/ui.store';
import { useTransactionStore } from '../../store/transaction.store';
import { useVaultStore } from '../../store/vault.store';
import { useAuthStore } from '../../store/auth.store';
import { getTransactionsByMonth } from '../../services/transaction.service';
import { getSavingsGoalByMonth } from '../../services/savingsGoal.service';
import { getAllSubcategories } from '../../services/subcategory.service';
import { getVaultEntries } from '../../services/vault.service';
import { logOut } from '../../services/auth.service';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../../config/categories';
import { formatCurrency } from '../../utils/currency';
import { formatMonthLabel, addMonths } from '../../utils/date';
import { useToast } from '../../components/ui/Toast';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { CategoryDetail } from '../Dashboard/components/CategoryDetail';
import { SavingsGoalModal } from '../Dashboard/components/SavingsGoalModal';
import type { Category } from '../../types';
import styles from './DashboardV2.module.css';

export const DashboardV2 = () => {
  const navigate = useNavigate();
  const { selectedMonthKey, setSelectedMonthKey } = useUIStore();
  const { transactions, monthlySummary, setTransactions, setSubcategories, loadingTransactions } = useTransactionStore();
  const { entries: vaultEntries, balance: vaultBalance, setEntries: setVaultEntries } = useVaultStore();
  const { user } = useAuthStore();
  const { showToast } = useToast();

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [goalModalOpen, setGoalModalOpen] = useState(false);

  // Carrega dados do mês
  useEffect(() => {
    if (!user) return;
    const load = async () => {
      useTransactionStore.getState().setLoadingTransactions(true);
      try {
        const [txs, goal] = await Promise.all([
          getTransactionsByMonth(user.uid, selectedMonthKey),
          getSavingsGoalByMonth(user.uid, selectedMonthKey),
        ]);
        setTransactions(txs, selectedMonthKey, goal);
      } catch {
        showToast('Erro ao carregar dados do mês.', 'error');
        useTransactionStore.getState().setLoadingTransactions(false);
      }
    };
    load();
  }, [selectedMonthKey, user]);

  // Carrega subcategorias e cofre uma vez
  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const [subs, vault] = await Promise.all([
          getAllSubcategories(user.uid),
          getVaultEntries(user.uid),
        ]);
        setSubcategories(subs);
        setVaultEntries(vault);
      } catch {
        showToast('Erro ao carregar dados.', 'error');
      }
    };
    load();
  }, [user]);

  const getTotalByCategory = (categoryId: string) =>
    transactions.filter(tx => tx.categoryId === categoryId).reduce((s, tx) => s + tx.amount, 0);

  const totalIncome  = monthlySummary?.totalIncome  ?? 0;
  const totalExpense = monthlySummary?.totalExpense ?? 0;
  const balance      = monthlySummary?.balance      ?? 0;
  const savingsGoal  = monthlySummary?.savingsGoal  ?? 0;
  const balancePct   = totalIncome > 0 ? Math.min(100, (balance / totalIncome) * 100) : 0;

  const handleLogout = async () => {
    try { await logOut(); } catch { showToast('Erro ao sair.', 'error'); }
  };

  return (
    <div className={styles.dash}>
      {/* ── Navbar desktop ── */}
      <nav className={styles.dashNav}>
        <div className={styles.dashNavBrand}>
          <span className={styles.dashNavLogo}>
            <svg viewBox="0 0 32 32" fill="none">
              <rect x="3" y="16" width="5" height="11" rx="1.5" fill="currentColor" opacity=".35"/>
              <rect x="10.5" y="10" width="5" height="17" rx="1.5" fill="currentColor" opacity=".6"/>
              <rect x="18" y="4" width="5" height="23" rx="1.5" fill="currentColor"/>
              <path d="M6 14 L13 7 L20 11 L27 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <span className={styles.dashNavName}>Finance App</span>
        </div>
        <div className={styles.dashNavLinks}>
          <button className={`${styles.dashNavLink} ${styles.dashNavLinkActive}`}>🏠 Início</button>
          <button className={styles.dashNavLink} onClick={() => navigate('/transactions')}>💸 Lançamentos</button>
          <button className={styles.dashNavLink} onClick={() => navigate('/vault')}>🏦 Cofre</button>
          <button className={styles.dashNavLink} onClick={() => navigate('/reports')}>📊 Relatórios</button>
        </div>
        <div className={styles.dashNavUser}>
          <span className={styles.dashNavEmail}>{user?.email}</span>
          <button className={styles.dashNavLogout} onClick={handleLogout}>Sair</button>
        </div>
      </nav>

      <main className={styles.dashMain}>
        {/* ── Month nav ── */}
        <div className={styles.monthNav}>
          <button className={styles.monthNavBtn} onClick={() => setSelectedMonthKey(addMonths(selectedMonthKey, -1))}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div className={styles.monthNavCenter}>
            <h2 className={styles.monthNavLabel}>{formatMonthLabel(selectedMonthKey)}</h2>
          </div>
          <button className={styles.monthNavBtn} onClick={() => setSelectedMonthKey(addMonths(selectedMonthKey, 1))}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* ── Section header ── */}
        <div className={styles.sectionHeader}>
          <div>
            <h3 className={styles.sectionHeaderTitle}>{formatMonthLabel(selectedMonthKey)}</h3>
            <p className={styles.sectionHeaderSub}>
              {savingsGoal > 0 ? `Meta: ${formatCurrency(savingsGoal)}` : 'Sem meta definida'}
            </p>
          </div>
          <button className={styles.sectionHeaderMetaBtn} onClick={() => setGoalModalOpen(true)}>
            <span>🎯</span> Meta
          </button>
        </div>

        {loadingTransactions ? (
          <div className={styles.loading}><LoadingSpinner size="lg" /></div>
        ) : (
          <>
            {/* ── Summary cards ── */}
            <div className={styles.summaryGrid}>
              <div className={`${styles.summaryCard} ${styles.summaryCardIncome}`}>
                <div className={styles.summaryCardIcon}>📈</div>
                <div className={styles.summaryCardBody}>
                  <span className={styles.summaryCardLabel}>RECEITAS</span>
                  <span className={`${styles.summaryCardValue} ${styles.income}`}>{formatCurrency(totalIncome)}</span>
                </div>
              </div>
              <div className={`${styles.summaryCard} ${styles.summaryCardExpense}`}>
                <div className={styles.summaryCardIcon}>📉</div>
                <div className={styles.summaryCardBody}>
                  <span className={styles.summaryCardLabel}>GASTOS</span>
                  <span className={`${styles.summaryCardValue} ${styles.expense}`}>{formatCurrency(totalExpense)}</span>
                </div>
              </div>
              <div className={`${styles.summaryCard} ${styles.summaryCardBalance}`}>
                <div className={styles.summaryCardIcon}>💵</div>
                <div className={styles.summaryCardBody}>
                  <span className={styles.summaryCardLabel}>SALDO</span>
                  <span className={`${styles.summaryCardValue} ${balance >= 0 ? styles.balancePos : styles.expense}`}>{formatCurrency(balance)}</span>
                </div>
              </div>
              <div className={`${styles.summaryCard} ${styles.summaryCardMeta}`}>
                <div className={styles.summaryCardIcon}>🎯</div>
                <div className={styles.summaryCardBody}>
                  <span className={styles.summaryCardLabel}>META</span>
                  <span className={`${styles.summaryCardValue} ${styles.meta}`}>{formatCurrency(savingsGoal)}</span>
                  {!savingsGoal && <span className={styles.summaryCardSub}>Não definida</span>}
                </div>
              </div>
            </div>

            {/* ── Progress bar ── */}
            {totalIncome > 0 && (
              <div className={styles.balanceBar}>
                <div className={styles.balanceBarTrack}>
                  <div className={styles.balanceBarFill} style={{ width: `${balancePct}%` }} />
                </div>
                <span className={styles.balanceBarLabel}>
                  {balancePct.toFixed(0)}% do saldo em relação à receita
                </span>
              </div>
            )}

            {/* ── Cofre ── */}
            <div className={styles.cofreBanner} onClick={() => navigate('/vault')} role="button" tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && navigate('/vault')}>
              <div className={styles.cofreBannerLeft}>
                <span className={styles.cofreBannerIcon}>🏦</span>
                <div>
                  <span className={styles.cofreBannerTitle}>Cofre</span>
                  <span className={styles.cofreBannerSub}>
                    {vaultEntries.length} movimentação{vaultEntries.length !== 1 ? 'ões' : ''}
                  </span>
                </div>
              </div>
              <div className={styles.cofreBannerRight}>
                <span className={styles.cofreBannerValue}>{formatCurrency(vaultBalance)}</span>
                <span className={styles.cofreBannerArrow}>›</span>
              </div>
            </div>

            {/* ── Receitas ── */}
            <section className={styles.catSection}>
              <div className={styles.catSectionHeader}>
                <span className={styles.catSectionIcon}>💰</span>
                <h4 className={`${styles.catSectionTitle} ${styles.catSectionTitleIncome}`}>Receitas Mensais</h4>
              </div>
              <div className={styles.catList}>
                {INCOME_CATEGORIES.map(cat => {
                  const total = getTotalByCategory(cat.id);
                  return (
                    <button key={cat.id} className={`${styles.catRow} ${total > 0 ? styles.catRowActive : ''}`}
                      onClick={() => setSelectedCategory(cat)}>
                      <span className={styles.catRowEmoji}>{cat.icon}</span>
                      <span className={styles.catRowLabel}>{cat.name}</span>
                      <div className={styles.catRowRight}>
                        <span className={`${styles.catRowValue} ${total > 0 ? styles.catRowValueIncome : ''}`}>
                          {formatCurrency(total)}
                        </span>
                        <span className={styles.catRowArrow}>›</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* ── Gastos ── */}
            <section className={styles.catSection}>
              <div className={styles.catSectionHeader}>
                <span className={styles.catSectionIcon}>📊</span>
                <h4 className={`${styles.catSectionTitle} ${styles.catSectionTitleExpense}`}>Gastos Mensais</h4>
              </div>
              <div className={styles.catList}>
                {EXPENSE_CATEGORIES.map(cat => {
                  const total = getTotalByCategory(cat.id);
                  return (
                    <button key={cat.id} className={`${styles.catRow} ${total > 0 ? styles.catRowActive : ''}`}
                      onClick={() => setSelectedCategory(cat)}>
                      <span className={styles.catRowEmoji}>{cat.icon}</span>
                      <span className={styles.catRowLabel}>{cat.name}</span>
                      <div className={styles.catRowRight}>
                        <span className={`${styles.catRowValue} ${total > 0 ? styles.catRowValueExpense : ''}`}>
                          {formatCurrency(total)}
                        </span>
                        <span className={styles.catRowArrow}>›</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          </>
        )}
      </main>

      {/* Bottom nav mobile */}
      <nav className={styles.bottomNav}>
        <button className={`${styles.bottomNavItem} ${styles.bottomNavItemActive}`}>
          <span>🏠</span><span className={styles.bottomNavLabel}>Início</span>
        </button>
        <button className={styles.bottomNavItem} onClick={() => navigate('/transactions')}>
          <span>💸</span><span className={styles.bottomNavLabel}>Lançamentos</span>
        </button>
        <button className={styles.bottomNavItem} onClick={() => navigate('/vault')}>
          <span>🏦</span><span className={styles.bottomNavLabel}>Cofre</span>
        </button>
        <button className={styles.bottomNavItem} onClick={() => navigate('/reports')}>
          <span>📊</span><span className={styles.bottomNavLabel}>Relatórios</span>
        </button>
      </nav>

      {/* Modais */}
      {selectedCategory && (
        <CategoryDetail
          category={selectedCategory}
          monthKey={selectedMonthKey}
          onClose={() => setSelectedCategory(null)}
        />
      )}
      <SavingsGoalModal
        open={goalModalOpen}
        onClose={() => setGoalModalOpen(false)}
        monthKey={selectedMonthKey}
      />
    </div>
  );
};
