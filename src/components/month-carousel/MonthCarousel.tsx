// ============================================================
// COMPONENTE: MonthCarousel
// Navegação de mês no estilo "rodada de campeonato":
// ← | MÊS ANO | →
// ============================================================

import React from 'react';
import { formatMonthLabel, addMonths } from '../../utils/date';
import styles from './MonthCarousel.module.css';

interface MonthCarouselProps {
  selectedMonthKey: string;
  onSelect: (monthKey: string) => void;
  monthsWithData?: string[];
}

export const MonthCarousel: React.FC<MonthCarouselProps> = ({
  selectedMonthKey,
  onSelect,
  monthsWithData = [],
}) => {
  const prevMonth = addMonths(selectedMonthKey, -1);
  const nextMonth = addMonths(selectedMonthKey, 1);
  const hasData = monthsWithData.includes(selectedMonthKey);

  return (
    <div className={styles.wrapper}>
      <button
        className={styles.arrow}
        onClick={() => onSelect(prevMonth)}
        aria-label="Mês anterior"
      >
        ←
      </button>

      <div className={styles.center}>
        <span className={styles.label}>
          {formatMonthLabel(selectedMonthKey)}
        </span>
        {hasData && <span className={styles.dot} aria-hidden="true" />}
      </div>

      <button
        className={styles.arrow}
        onClick={() => onSelect(nextMonth)}
        aria-label="Próximo mês"
      >
        →
      </button>
    </div>
  );
};
