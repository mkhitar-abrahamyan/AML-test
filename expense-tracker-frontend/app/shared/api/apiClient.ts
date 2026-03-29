const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

function formatErrorMessage(body: unknown): string {
  if (typeof body === 'string') return body;
  
  if (typeof body === 'object' && body !== null) {
    const errorObj = body as Record<string, unknown>;
    
    if (Array.isArray(errorObj.message)) {
      const messages = errorObj.message as Array<{ field?: string; constraints?: string[] }>;
      return messages
        .map((m) => {
          if (m.constraints && Array.isArray(m.constraints)) {
            return m.constraints.join(', ');
          }
          return String(m);
        })
        .join('; ');
    }
    
    if (typeof errorObj.message === 'string') {
      return errorObj.message;
    }
  }
  
  return 'An error occurred';
}

export async function request(path: string, options: RequestInit = {}) {
  const { headers, ...restOptions } = options;
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...restOptions,
    headers: {
      'Content-Type': 'application/json',
      ...(headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    let body: unknown = text;
    try {
      body = JSON.parse(text);
    } catch {}
    throw new Error(formatErrorMessage(body));
  }

  return res.status === 204 ? null : res.json();
}
