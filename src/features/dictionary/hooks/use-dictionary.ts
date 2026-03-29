'use client';

import { useState } from 'react';
import { message } from 'antd';
import type { DictionaryResult } from '../schemas/dictionary.schema';

interface UseDictionaryReturn {
  result: DictionaryResult | null;
  isLoading: boolean;
  error: string | null;
  lookup: (word: string) => Promise<void>;
  reset: () => void;
}

export function useDictionary(): UseDictionaryReturn {
  const [result, setResult] = useState<DictionaryResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lookup = async (word: string) => {
    if (!word.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/dictionary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: word.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Có lỗi xảy ra');
      }

      setResult(data);
    } catch (err: any) {
      const errMsg = err.message || 'Không tra được từ này. Thử lại nhé!';
      setError(errMsg);
      message.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  return { result, isLoading, error, lookup, reset };
}
