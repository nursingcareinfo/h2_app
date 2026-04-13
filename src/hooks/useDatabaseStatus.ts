import { useState, useEffect } from 'react';

export function useDatabaseStatus() {
  const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [lastCheck, setLastCheck] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkStatus = async () => {
    try {
      const response = await fetch('/api/db-check');
      const data = await response.json();
      if (data.status === 'ok') {
        setStatus('connected');
        setLastCheck(new Date(data.time).toLocaleString());
        setError(null);
      } else {
        setStatus('error');
        setError(data.message || 'Unknown error');
      }
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Failed to fetch database status');
    }
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return { status, lastCheck, error, refetch: checkStatus };
}
