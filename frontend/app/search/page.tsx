'use client'
import React from 'react';
import AppLayout from '../../components/Layout/AppLayout'; 
import useSearch from '@/components/hooks/use-search'; 
import { Input } from '@/components/ui/input';
import { SearchIcon, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'; 
import UserSearchResult from '../../components/Search/UserSearchResult';
import Link from 'next/link';
import Image from 'next/image';

const SearchPage = () => {
    const { results, isLoading, searchTerm, handleSearch } = useSearch();

    const isSearchActive = searchTerm.trim().length > 0 && searchTerm.trim().length >= 2;

    return (
        <AppLayout>
            <div className="max-w-2xl mx-auto w-full pt-12 sm:pt-16">
                {/* شريط البحث */}
                <div className="relative mb-10">
                    <div className="bg-white/90 dark:bg-muted/70 shadow-md border 
                            border-gray-200 rounded-full px-2 py-1 flex items-center w-full">
                        <SearchIcon className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5
                                     text-muted-foreground rtl:left-6 rtl:right-auto" />
                        <Input
                            type="search"
                            placeholder="Search for people or posts..."
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full py-3 pr-12 pl-4 rounded-full text-lg bg-transparent
                                 focus-visible:ring-primary border-0 shadow-none"
                        />
                    </div>
                </div>

                {/* حالة التحميل */}
                {isLoading && (
                    <div className="flex justify-center items-center py-10">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                )}

                {/* عرض النتائج */}
                {!isLoading && isSearchActive && (
                    <Tabs defaultValue="people" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 shadow rounded-xl mb-2 bg-white/80 dark:bg-muted/60">
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
                            <div className="space-y-4">
                                {results.users.length > 0 ? (
                                    results.users.map((user, idx) => (
                                        <div
                                            key={user._id}
                                            className={`bg-gray-50 dark:bg-muted/80 rounded-xl p-2
                                                 transition hover:shadow-sm
                                                 ${idx !== results.users.length - 1 ? ' border-b' : ''}`}
                                        >
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

                {/* حالة الاكتشاف الافتراضية */}
                {!isLoading && !isSearchActive && (
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
        </AppLayout>
    );
};

export default SearchPage;