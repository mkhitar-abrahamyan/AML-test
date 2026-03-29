'use client';

import { useEffect, useState, useCallback } from 'react';
import { ExpenseForm } from './ExpenseForm';
import { AuthForm } from '../../auth/ui/AuthForm';
import { clearToken, getToken, setToken } from '@/app/shared/lib/auth';
import { createExpense, deleteExpense, getExpenses, getSummary, updateExpense } from '@/app/shared/api/expenseApi';
import { Button, Input, Select, Card } from '@/app/shared/ui';
import styles from './ExpenseApp.module.css';

interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string;
  note?: string;
}

interface Summary {
  totalAmount: number;
  totalCount: number;
  byCategory: { category: string; total: number; count: number }[];
}

interface ExpenseResponse {
  data: Expense[];
  total: number;
  page: number;
  limit: number;
}

const CATEGORIES = [
  { value: 'food', label: 'Food' },
  { value: 'transport', label: 'Transport' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'health', label: 'Health' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'other', label: 'Other' },
];

export default function ExpenseApp() {
  const [isClient, setIsClient] = useState(false);
  const [token, setTokenState] = useState<string | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editExpense, setEditExpense] = useState<Expense | null>(null);

  const [filterCategory, setFilterCategory] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [appliedFilters, setAppliedFilters] = useState({ category: '', startDate: '', endDate: '' });

  useEffect(() => {
    setIsClient(true);
    const stored = getToken();
    if (stored) {
      setTokenState(stored);
    }
  }, []);

  const fetchData = useCallback(async (authToken: string, category?: string, startDate?: string, endDate?: string) => {
    setLoading(true);
    setError('');
    try {
      const params = {
        category: category || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      };
      const [expenseRes, summaryRes] = await Promise.all([
        getExpenses(authToken, params),
        getSummary(authToken, params),
      ]);
      const expenseList = Array.isArray(expenseRes) 
        ? expenseRes 
        : (expenseRes as ExpenseResponse)?.data ?? [];
      setExpenses(expenseList);
      setSummary(summaryRes as Summary);
    } catch (err) {
      setError((err as Error).message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isClient || !token) return;
    fetchData(token, appliedFilters.category, appliedFilters.startDate, appliedFilters.endDate);
  }, [isClient, token, appliedFilters, fetchData]);

  const handleLogin = () => {
    const t = getToken();
    if (t) {
      setTokenState(t);
      setToken(t);
    }
  };

  const handleLogout = () => {
    clearToken();
    setTokenState(null);
    setExpenses([]);
    setSummary(null);
  };

  const handleApplyFilters = () => {
    if (filterStartDate && filterEndDate && new Date(filterEndDate) < new Date(filterStartDate)) {
      setError('End date cannot be before start date');
      return;
    }
    setError('');
    setAppliedFilters({ category: filterCategory, startDate: filterStartDate, endDate: filterEndDate });
  };

  const handleClearFilters = () => {
    setFilterCategory('');
    setFilterStartDate('');
    setFilterEndDate('');
    setAppliedFilters({ category: '', startDate: '', endDate: '' });
  };

  const handleCreate = async (data: { amount: number; category: string; date: string; note?: string }) => {
    if (!token) return;
    setError('');
    setLoading(true);
    try {
      await createExpense(token, data);
      await fetchData(token, appliedFilters.category, appliedFilters.startDate, appliedFilters.endDate);
    } catch (err) {
      setError((err as Error).message || 'Cannot create expense');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (data: { amount: number; category: string; date: string; note?: string }) => {
    if (!token || !editExpense?.id) return;
    setError('');
    setLoading(true);
    try {
      await updateExpense(token, editExpense.id, data);
      setEditExpense(null);
      await fetchData(token, appliedFilters.category, appliedFilters.startDate, appliedFilters.endDate);
    } catch (err) {
      setError((err as Error).message || 'Cannot update expense');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    setError('');
    setLoading(true);
    try {
      await deleteExpense(token, id);
      await fetchData(token, appliedFilters.category, appliedFilters.startDate, appliedFilters.endDate);
    } catch (err) {
      setError((err as Error).message || 'Cannot delete expense');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditExpense(null);
  };

  if (!isClient || !token) {
    return <AuthForm onLoginSuccess={handleLogin} />;
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Expense Tracker</h1>
        <Button label="Logout" onClick={handleLogout} className={styles.logoutBtn} />
      </header>

      <Card title="Filters" className={styles.filtersCard}>
        <div className={styles.filtersGrid}>
          <Select
            label="Category"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            options={CATEGORIES}
            placeholder="All categories"
          />
          <Input
            label="Start Date"
            type="date"
            value={filterStartDate}
            onChange={(e) => setFilterStartDate(e.target.value)}
          />
          <Input
            label="End Date"
            type="date"
            value={filterEndDate}
            onChange={(e) => setFilterEndDate(e.target.value)}
          />
          <div className={styles.filterActions}>
            <Button label="Apply" onClick={handleApplyFilters} disabled={loading} />
            <Button label="Clear" onClick={handleClearFilters} disabled={loading} className={styles.secondaryBtn} />
          </div>
        </div>
      </Card>

      <div className={styles.grid}>
        <Card title={editExpense ? 'Edit Expense' : 'Add Expense'}>
          <ExpenseForm
            onSubmit={editExpense ? handleUpdate : handleCreate}
            initial={editExpense || undefined}
            submitLabel={editExpense ? 'Update' : 'Create'}
          />
          {editExpense && (
            <Button label="Cancel" onClick={handleCancelEdit} className={styles.cancelBtn} />
          )}
        </Card>

        <Card title="Summary">
          {summary ? (
            <div className={styles.summary}>
              <div className={styles.summaryTotal}>
                <span className={styles.summaryLabel}>Total Spent</span>
                <span className={styles.summaryValue}>${summary.totalAmount.toFixed(2)}</span>
              </div>
              <div className={styles.summaryCount}>
                <span className={styles.summaryLabel}>Transactions</span>
                <span className={styles.summaryValue}>{summary.totalCount}</span>
              </div>
              {summary.byCategory.length > 0 && (
                <div className={styles.categoryBreakdown}>
                  <span className={styles.summaryLabel}>By Category</span>
                  <ul className={styles.categoryList}>
                    {summary.byCategory.map((item) => (
                      <li key={item.category} className={styles.categoryItem}>
                        <span className={styles.categoryName}>{item.category}</span>
                        <span className={styles.categoryValue}>${item.total.toFixed(2)} ({item.count})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p className={styles.noData}>No summary available</p>
          )}
        </Card>
      </div>

      <Card title="Expenses">
        {error && <p className={styles.error}>{error}</p>}
        {loading ? (
          <p className={styles.loading}>Loading...</p>
        ) : expenses.length === 0 ? (
          <p className={styles.noData}>No expenses found</p>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Note</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp) => (
                  <tr key={exp.id}>
                    <td>${exp.amount.toFixed(2)}</td>
                    <td className={styles.categoryCell}>{exp.category}</td>
                    <td>{new Date(exp.date).toLocaleDateString()}</td>
                    <td>{exp.note || '—'}</td>
                    <td className={styles.actionsCell}>
                      <Button label="Edit" onClick={() => setEditExpense(exp)} className={styles.smallBtn} />
                      <Button label="Delete" onClick={() => handleDelete(exp.id)} className={styles.deleteBtn} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
