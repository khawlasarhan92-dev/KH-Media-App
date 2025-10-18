"use client"
import React, { useEffect } from 'react';
import AppLayout from '../../components/Layout/AppLayout'; 
import useSearch from '@/components/hooks/use-search'; 
import { Input } from '@/components/ui/input';
import { SearchIcon, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'; 
import UserSearchResult from '../../components/Search/UserSearchResult';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import useSuggestedUsers from '@/components/hooks/use-suggested';
import { User } from '@/types';

const SearchPage = () => {
    const { results, isLoading, searchTerm, handleSearch, fetchSearchResults } = useSearch();
    const searchParams = useSearchParams();
    const source = searchParams?.get('source') || '';

    const { suggested, isLoading: isSuggestLoading, fetchSuggested } = useSuggestedUsers();

    const isSearchActive = searchTerm.trim().length > 0 && searchTerm.trim().length >= 2;

    useEffect(() => {
        if (source === 'suggested' && !isSearchActive) {
            fetchSuggested();
        }
    }, [source, isSearchActive, fetchSuggested]);

    return (
        <AppLayout>
            <div className="max-w-2xl mx-auto w-full pt-6 sm:pt-12 px-4 sm:px-0">
                {/* شريط البحث */}
                <div className="relative mb-6 sm:mb-10">
                    <div className="bg-white/90 dark:bg-muted/70 shadow-sm border 
                            border-gray-200 rounded-full px-2 py-0.5 flex items-center w-full">
                        <SearchIcon className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5
                                     text-muted-foreground rtl:left-5 rtl:right-auto" />
                        <Input
                            type="search"
                            placeholder="Search for people or posts..."
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                       className="w-full py-2.5 pr-12 pl-4 rounded-full text-base sm:text-lg bg-transparent
                           focus-visible:ring-primary border-0 shadow-none"
                        />
                    </div>
                </div>

                {/* حالة التحميل */}
                {(isLoading || isSuggestLoading) && (
                    <div className="flex justify-center items-center py-10">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                )}

                {/* عرض النتائج */}
                {!isLoading && isSearchActive && (
                    <Tabs defaultValue="people" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 shadow-sm rounded-xl mb-2 bg-white/80 dark:bg-muted/60">
                            <TabsTrigger value="people" className="data-[state=active]:bg-primary/90
                             data-[state=active]:text-white rounded-xl">
                                People ({results.users.length})
                            </TabsTrigger>
                            <TabsTrigger value="posts" className="data-[state=active]:bg-primary/90
                             data-[state=active]:text-white rounded-xl">
                                Posts ({results.posts.length})
                            </TabsTrigger>
                        </TabsList>

                        {/* تبويب نتائج الأشخاص */}
                        <TabsContent value="people" className="mt-4">
                            <div className="space-y-2">
                                {results.users.length > 0 ? (
                                    results.users.map((user, idx) => (
                                        <div
                                            key={user._id}
                                            className={`bg-gray-50 dark:bg-muted/80 rounded-xl p-1.5 sm:p-2
                                                 transition hover:shadow-sm ${idx !== results.users.length - 1 ? ' border-b' : ''}`}>
                                            <UserSearchResult user={user} />
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-muted-foreground py-10">
                                        No users found.
                                    </p>
                                )}
                            </div>
                        </TabsContent>

                        {/* تبويب نتائج المنشورات */}
                        <TabsContent value="posts" className="mt-4">
                            {results.posts.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {results.posts.map(post => (
                                        <Link href={`/post/${post._id}`} key={post._id}
                                            className="aspect-square relative group block rounded-xl overflow-hidden
                                             shadow-sm hover:shadow-md transition">
                                            {post.image?.url && (
                                                <Image
                                                    src={post.image.url}
                                                    alt={post.caption || 'Post'}
                                                    fill
                                                    className="object-cover transition-transform duration-300
                                                     group-hover:scale-105"
                                                    sizes="(max-width: 600px) 50vw, 200px"
                                                />
                                            )}
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-muted-foreground py-10">No posts found.</p>
                            )}
                        </TabsContent>
                    </Tabs>
                )}

                {/* حالة الاكتشاف الافتراضية أو قائمة المقترحات */}
                {!isLoading && !isSearchActive && (
                    <div>
                        {source === 'suggested' ? (
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold mb-3">Suggested for you</h2>
                                {suggested.length > 0 ? (
                                    suggested.map((user: User) => (
                                        <div key={user._id} className={`bg-gray-50 dark:bg-muted/80 rounded-xl p-1.5 sm:p-2 transition hover:shadow-sm`}>
                                            <UserSearchResult user={user} />
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-muted-foreground py-10">No suggestions right now.</p>
                                )}
                            </div>
                        ) : (
                            <div className="py-10 text-center flex flex-col items-center">
                                <div className="mb-4">
                                    <SearchIcon className="w-12 h-12 text-primary/60 mx-auto" />
                                </div>
                                <h2 className="text-2xl font-bold mb-2">
                                    Discover the world around you
                                </h2>
                                <p className="text-muted-foreground">Enter a username or keyword to find new people and content.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
};

export default SearchPage;