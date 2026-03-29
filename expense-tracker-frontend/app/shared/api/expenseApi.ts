import { request } from './apiClient';

export interface ExpenseCreatePayload {
  amount: number;
  category: string;
  date: string;
  note?: string;
}

export interface ExpenseFilterParams {
  category?: string;
  startDate?: string;
  endDate?: string;
}

function formatParams(params: ExpenseFilterParams): string {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) qs.append(key, value);
  });
  const qsString = qs.toString();
  return qsString ? `?${qsString}` : '';
}

export async function getExpenses(token: string, params: ExpenseFilterParams = {}) {
  const query = formatParams(params);
  return request(`/expenses${query}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getSummary(token: string, params: ExpenseFilterParams = {}) {
  const query = formatParams(params);
  return request(`/expenses/summary${query}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function createExpense(token: string, payload: ExpenseCreatePayload) {
  return request('/expenses', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export async function updateExpense(token: string, id: string, payload: Partial<ExpenseCreatePayload>) {
  return request(`/expenses/${id}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export async function deleteExpense(token: string, id: string) {
  return request(`/expenses/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}
