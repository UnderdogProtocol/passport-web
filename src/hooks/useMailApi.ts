// This hook is used to fetch data from `GET:/api/mail` APIs

import axios from "axios";
import { DAS } from "helius-sdk";
import httpStatus from "http-status";
import { useState, useEffect } from "react";

export function useMailApi(apiUrl: string) {
  const [data, setData] = useState<DAS.GetAssetResponseList>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(Error);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await axios.get(`${apiUrl}`, {
          headers: { "cache-control": "no-cache" },
        });

        if (response.status >= httpStatus.BAD_REQUEST) {
          throw new Error("Network response was not ok");
        }
        const result = response.data;
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
