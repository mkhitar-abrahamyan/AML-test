'use client';

import { FormEvent, useState } from 'react';
import { login, register } from '@/app/shared/api/authApi';
import { setToken } from '@/app/shared/lib/auth';
import { Input, Button } from '@/app/shared/ui';
import styles from './AuthForm.module.css';

interface AuthFormProps {
  onLoginSuccess: () => void;
}

export function AuthForm({ onLoginSuccess }: AuthFormProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (mode === 'register') {
        await register({ email, password, name });
        setSuccess('Registration successful! Please login.');
        setMode('login');
        setName('');
        setPassword('');
      } else {
        const res = await login({ email, password });
        if (res?.accessToken) {
          setToken(res.accessToken);
          onLoginSuccess();
        } else {
          setError('Invalid response from server');
        }
      }
    } catch (err) {
      setError((err as Error).message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{mode === 'login' ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        {mode === 'register' && (
          <Input
            label="Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}
        <Input
          label="Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button 
          type="submit" 
          label={loading ? 'Submitting…' : mode === 'login' ? 'Login' : 'Register'}
          disabled={loading}
        />
        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}
      </form>
      <div className={styles.toggleMode}>
        <span>{mode === 'login' ? 'No account?' : 'Already have account?'}</span>
        <button 
          type="button" 
          onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); setSuccess(''); }}
          className={styles.toggleBtn}
        >
          {mode === 'login' ? 'Register' : 'Login'}
        </button>
      </div>
    </div>
  );
}
