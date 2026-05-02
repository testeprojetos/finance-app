// ============================================================
// PÁGINA: Login
// ============================================================

import React, { useState } from 'react';
import { signIn, resetPassword } from '../../services/auth.service';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import styles from './Login.module.css';

type LoginMode = 'signin' | 'reset';

export const Login: React.FC = () => {
  const [mode, setMode] = useState<LoginMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'signin') {
        await signIn(email, password);
      } else {
        await resetPassword(email);
        showToast('Email de redefinição enviado!', 'success');
        setMode('signin');
      }
    } catch (err: any) {
      const messages: Record<string, string> = {
        'auth/user-not-found': 'Usuário não encontrado.',
        'auth/wrong-password': 'Senha incorreta.',
        'auth/invalid-credential': 'Email ou senha incorretos.',
        'auth/invalid-email': 'Email inválido.',
        'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde.',
      };
      showToast(messages[err.code] ?? 'Ocorreu um erro. Tente novamente.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const TITLES: Record<LoginMode, string> = {
    signin: 'Entrar',
    reset: 'Redefinir senha',
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.logo}>💰</span>
          <h1 className={styles.title}>Finance App</h1>
          <p className={styles.subtitle}>Controle seus gastos com facilidade</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <h2 className={styles.formTitle}>{TITLES[mode]}</h2>

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
            autoComplete="email"
          />

          {mode === 'signin' && (
            <Input
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          )}

          <Button type="submit" fullWidth loading={loading}>
            {TITLES[mode]}
          </Button>
        </form>

        <div className={styles.links}>
          {mode === 'signin' && (
            <button className={styles.link} onClick={() => setMode('reset')}>
              Esqueceu a senha?
            </button>
          )}
          {mode === 'reset' && (
            <button className={styles.link} onClick={() => setMode('signin')}>
              ← Voltar para o login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
