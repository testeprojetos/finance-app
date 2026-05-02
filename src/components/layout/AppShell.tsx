// ============================================================
// COMPONENTE: AppShell — estrutura base de layout autenticado
// ============================================================

import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopNav } from './TopNav';
import { BottomNav } from './BottomNav';
import styles from './AppShell.module.css';

export const AppShell: React.FC = () => (
  <div className={styles.shell}>
    <TopNav />
    <main className={styles.main}>
      <div className={styles.content}>
        <Outlet />
      </div>
    </main>
    <BottomNav />
  </div>
);
