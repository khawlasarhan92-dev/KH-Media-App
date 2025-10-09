"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { BASE_API_URL } from '@/server';

const PostDetailsPage = () => {
  const params = useParams();
  const postId = params?.id;
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!postId) return;
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${BASE_API_URL}/posts/post/${postId}`, { withCredentials: true });
        setPost(res.data.data.post);
      } catch (err: any) {
        setError('Post not found or error loading post.');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!post) return null;

  return (
    <div className="max-w-2xl mx-auto py-10">
      <div className="bg-white rounded-xl shadow p-6">
        <div className="mb-4">
          <Image src={post.image.url} alt="Post" width={400} height={400} className="rounded-xl object-cover" />
        </div>
        <div className="mb-2 flex items-center gap-2">
          <Link href={`/profile/${post.user._id}`}
            className="font-bold text-primary hover:underline">
            {post.user.username}
          </Link>
        </div>
        <div className="mb-4 text-lg text-gray-700">
          {post.caption}
        </div>
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Comments</h3>
          {post.comments && post.comments.length > 0 ? (
            <ul className="space-y-2">
              {post.comments.map((comment: any) => (
                <li key={comment._id} className="bg-gray-100 rounded p-2">
                  <span className="font-bold">{comment.user?.username || 'User'}:</span> {comment.text}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No comments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetailsPage;
