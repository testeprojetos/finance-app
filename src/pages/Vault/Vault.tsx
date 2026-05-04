// ============================================================
// PÁGINA: Vault — Cofre
// ============================================================

import React, { useEffect, useState } from 'react';
import { useVaultStore } from '../../store/vault.store';
import { useAuthStore } from '../../store/auth.store';
import { getVaultEntries, deleteVaultEntry } from '../../services/vault.service';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/date';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useToast } from '../../components/ui/Toast';
import { VaultEntryModal } from './components/VaultEntryModal';
import type { VaultEntryType } from '../../types';
import styles from './Vault.module.css';

export const Vault: React.FC = () => {
  const { entries, balance, loading, setEntries, setLoading, removeEntry } = useVaultStore();
  const { user } = useAuthStore();
  const { showToast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<VaultEntryType>('deposit');

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      try {
        const data = await getVaultEntries(user.uid);
        setEntries(data);
      } catch {
        showToast('Erro ao carregar cofre.', 'error');
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const handleDelete = async (id: string, description: string) => {
    if (!user) return;
    if (!confirm(`Excluir "${description}"?`)) return;
    try {
      await deleteVaultEntry(user.uid, id);
      removeEntry(id);
      showToast('Movimentação excluída.', 'success');
    } catch {
      showToast('Erro ao excluir.', 'error');
    }
  };

  const openModal = (type: VaultEntryType) => {
    setModalType(type);
    setModalOpen(true);
  };

  return (
    <div className={styles.page}>
      {/* Saldo */}
      <div className={styles.balanceCard}>
        <span className={styles.balanceIcon}>🏦</span>
        <span className={styles.balanceLabel}>Saldo do Cofre</span>
        <span className={styles.balanceValue}>{formatCurrency(balance)}</span>
      </div>

      {/* Ações */}
      <div className={styles.actions}>
        <Button
          variant="income"
          fullWidth
          onClick={() => openModal('deposit')}
          icon="⬇️"
        >
          Depositar
        </Button>
        <Button
          variant="expense"
          fullWidth
          onClick={() => openModal('withdraw')}
          icon="⬆️"
        >
          Retirar
        </Button>
      </div>

      {/* Histórico */}
      <div className={styles.history}>
        <h2 className={styles.historyTitle}>Histórico</h2>

        {loading ? (
          <div className={styles.loading}><LoadingSpinner /></div>
        ) : entries.length === 0 ? (
          <p className={styles.empty}>Nenhuma movimentação ainda.</p>
        ) : (
          <div className={styles.list}>
            {entries.map((entry) => (
              <div key={entry.id} className={styles.entry}>
                <div className={styles.entryIcon}>
                  {entry.type === 'deposit' ? '⬇️' : '⬆️'}
                </div>
                <div className={styles.entryInfo}>
                  <span className={styles.entryDesc}>{entry.description}</span>
                  <span className={styles.entryDate}>{formatDate(entry.date)}</span>
                  {entry.observation && (
                    <span className={styles.entryObs}>{entry.observation}</span>
                  )}
                </div>
                <div className={styles.entryRight}>
                  <span className={[
                    styles.entryAmount,
                    entry.type === 'deposit' ? styles.deposit : styles.withdraw,
                  ].join(' ')}>
                    {entry.type === 'deposit' ? '+' : '-'} {formatCurrency(entry.amount)}
                  </span>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(entry.id, entry.description)}
                    aria-label="Excluir"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalOpen && (
        <VaultEntryModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          type={modalType}
        />
      )}
    </div>
  );
};
