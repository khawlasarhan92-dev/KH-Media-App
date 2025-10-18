import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { User } from '@/types';
import { BASE_API_URL } from '@/server';
import { handleAuthRequest } from '@/components/utils/apiRequest';

export default function useSuggestedUsers() {
  const [suggested, setSuggested] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSuggested = useCallback(async () => {
    const req = () => axios.get(`${BASE_API_URL}/users/suggested-user`, { withCredentials: true });
    const res = await handleAuthRequest(req, setIsLoading);
    if (res && res.data?.data?.users) setSuggested(res.data.data.users);
  }, []);

  useEffect(() => {
    fetchSuggested();
  }, [fetchSuggested]);

  return { suggested, isLoading, fetchSuggested };
}
