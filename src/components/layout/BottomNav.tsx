// ============================================================
// COMPONENTE: BottomNav — navegação inferior (mobile)
// ============================================================

import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './BottomNav.module.css';

const NAV_ITEMS = [
  { to: '/dashboard', icon: '🏠', label: 'Início' },
  { to: '/transactions', icon: '💸', label: 'Lançamentos' },
  { to: '/reports', icon: '📊', label: 'Relatórios' },
];

export const BottomNav: React.FC = () => (
  <nav className={styles.nav} aria-label="Navegação principal">
    {NAV_ITEMS.map((item) => (
      <NavLink
        key={item.to}
        to={item.to}
        className={({ isActive }) =>
          [styles.item, isActive ? styles.active : ''].filter(Boolean).join(' ')
        }
        aria-label={item.label}
      >
        <span className={styles.icon} aria-hidden="true">
          {item.icon}
        </span>
        <span className={styles.label}>{item.label}</span>
      </NavLink>
    ))}
  </nav>
);
