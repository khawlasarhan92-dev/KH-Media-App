
import { useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { BASE_API_URL } from '@/server';
import { handleAuthRequest } from '../utils/apiRequest'; 
import { User, Post } from '@/types';
import debounce from 'lodash.debounce';


interface UserResult extends Omit<User, 'posts' | 'savedPosts' | 'isVerified'
         | 'email' | 'password' | 'following' | 'followers' | 'createdAt' | 'updatedAt'> {
    bio?: string;
    following: string[];
}

interface PostResult extends Omit<Post, 'user'> {
   
    user: { _id: string; username: string; profilePicture: string }; 
}

interface SearchResults {
    users: UserResult[];
    posts: PostResult[];
}

const useSearch = () => {
    const [results, setResults] = useState<SearchResults>({ users: [], posts: [] });
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchSearchResults = useCallback(async (query: string) => {
        const trimmedQuery = query.trim();
       
        if (trimmedQuery.length < 2) {
            setResults({ users: [], posts: [] });
            return;
        }
        
        setIsLoading(true);

        const fetchReq = () => 
            axios.get(`${BASE_API_URL}/search?q=${encodeURIComponent(trimmedQuery)}`, { withCredentials: true });

        const result = await handleAuthRequest(fetchReq, setIsLoading);

        if (result?.data.status === 'success') {
            setResults(result.data.data as SearchResults);
        } else {
            setResults({ users: [], posts: [] });
        }
    }, []);

   
    const debouncedSearch = useMemo(() => {
      
        return debounce(fetchSearchResults, 500); 
    }, [fetchSearchResults]);

    const handleSearch = useCallback((value: string) => {
        setSearchTerm(value);
        debouncedSearch(value); 
    }, [debouncedSearch]);

    return { results, isLoading, searchTerm, handleSearch, fetchSearchResults };
};

export default useSearch;