'use client';

import { useEffect, useState } from 'react';
import { Input, Button, Select } from '@/app/shared/ui';
import { sanitize } from '@/app/shared/lib/sanitize';
import styles from './ExpenseForm.module.css';

const CATEGORIES = [
  { value: 'food', label: 'Food' },
  { value: 'transport', label: 'Transport' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'health', label: 'Health' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'other', label: 'Other' },
];

function sanitizeAmount(value: string): string {
  let sanitized = value.replace(/[eE]/g, '');
  sanitized = sanitized.replace(/[^0-9.]/g, '');
  const parts = sanitized.split('.');
  if (parts.length > 2) {
    sanitized = parts[0] + '.' + parts.slice(1).join('');
  }
  if (parts[0] && parts[0].length > 1 && parts[0].startsWith('0')) {
    parts[0] = parts[0].replace(/^0+/, '') || '0';
    sanitized = parts.length > 1 ? parts[0] + '.' + parts[1] : parts[0];
  }
  return sanitized;
}

export interface ExpenseFormProps {
  onSubmit: (values: { amount: number; category: string; date: string; note?: string }) => void;
  initial?: {
    id?: string;
    amount?: number;
    category?: string;
    date?: string;
    note?: string;
  };
  submitLabel: string;
}

export function ExpenseForm({ onSubmit, initial, submitLabel }: ExpenseFormProps) {
  const [amount, setAmount] = useState(initial?.amount?.toString() ?? '');
  const [category, setCategory] = useState(initial?.category ?? '');
  const [date, setDate] = useState(initial?.date ? initial.date.slice(0, 10) : '');
  const [note, setNote] = useState(initial?.note ?? '');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initial) {
      setAmount(initial.amount?.toString() ?? '');
      setCategory(initial.category ?? '');
      setDate(initial.date ? initial.date.slice(0, 10) : '');
      setNote(initial.note ?? '');
    } else {
      setAmount('');
      setCategory('');
      setDate('');
      setNote('');
    }
  }, [initial]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeAmount(e.target.value);
    setAmount(sanitized);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid amount greater than 0');
      return;
    }

    const dateValue = date.trim();
    const isoDate = dateValue ? `${dateValue}T00:00:00+00:00` : '';
    
    onSubmit({
      amount: parsedAmount,
      category,
      date: isoDate,
      note: sanitize(note),
    });

    if (!initial) {
      setAmount('');
      setCategory('');
      setDate('');
      setNote('');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && <p className={styles.error}>{error}</p>}
      <Input
        label="Amount (USD)"
        type="text"
        inputMode="decimal"
        pattern="[0-9]*\.?[0-9]*"
        required
        value={amount}
        onChange={handleAmountChange}
        placeholder="0.00"
      />
      <Select
        label="Category"
        required
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        options={CATEGORIES}
        placeholder="Select a category"
      />
      <Input
        label="Date"
        type="date"
        required
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <Input
        label="Note (optional)"
        type="text"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <Button type="submit" label={submitLabel} className={styles.submitBtn} />
    </form>
  );
}
