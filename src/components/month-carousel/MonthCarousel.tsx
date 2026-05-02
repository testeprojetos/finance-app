// ============================================================
// COMPONENTE: MonthCarousel
// Carrossel de seleção de mês com scroll horizontal.
// ============================================================

import React, { useRef, useEffect } from 'react';
import { generateCarouselMonths, formatMonthLabel, formatMonthShort } from '../../utils/date';
import styles from './MonthCarousel.module.css';

interface MonthCarouselProps {
  selectedMonthKey: string;
  onSelect: (monthKey: string) => void;
  /** Meses que possuem dados (exibe indicador visual) */
  monthsWithData?: string[];
}

export const MonthCarousel: React.FC<MonthCarouselProps> = ({
  selectedMonthKey,
  onSelect,
  monthsWithData = [],
}) => {
  const months = generateCarouselMonths(selectedMonthKey);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);

  // Centraliza o mês selecionado ao montar e ao mudar
  useEffect(() => {
    if (selectedRef.current && containerRef.current) {
      const container = containerRef.current;
      const selected = selectedRef.current;
      const offset =
        selected.offsetLeft - container.clientWidth / 2 + selected.clientWidth / 2;
      container.scrollTo({ left: offset, behavior: 'smooth' });
    }
  }, [selectedMonthKey]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.track} ref={containerRef} role="tablist" aria-label="Selecionar mês">
        {months.map((monthKey) => {
          const isSelected = monthKey === selectedMonthKey;
          const hasData = monthsWithData.includes(monthKey);

          return (
            <button
              key={monthKey}
              ref={isSelected ? selectedRef : null}
              className={[styles.item, isSelected ? styles.selected : ''].filter(Boolean).join(' ')}
              onClick={() => onSelect(monthKey)}
              role="tab"
              aria-selected={isSelected}
              aria-label={formatMonthLabel(monthKey)}
              title={formatMonthLabel(monthKey)}
            >
              <span className={styles.label}>{formatMonthShort(monthKey)}</span>
              {hasData && <span className={styles.dot} aria-hidden="true" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
