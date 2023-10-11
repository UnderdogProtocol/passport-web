// This hook is used to fetch data from `GET:/api/mail` APIs

import { useState, useEffect } from 'react';

export function useMailApi(apiUrl: string) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${apiUrl}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'cache-control': 'no-cache',
          },
        });
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result);
      } catch (error: any) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [apiUrl]);

  return { data, loading, error };
}
