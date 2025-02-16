import { IPost } from '@/Interfaces/Post'
import { addComment, deletePost } from '@/lib/postActions';
import { AppDispatch } from '@/lib/store';
import { useQueryClient } from '@tanstack/react-query';
import { Heart, Loader2, MessageCircleMore, TrashIcon } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import PostDetails from '../PostDetails'

function formatDateString(dateString: string): { date: string; timeAgo: string } {
    const inputDate = new Date(dateString);
    const now = new Date();

    // Format the date as YYYY/MM/DD
    const formattedDate: string = `${inputDate.getFullYear()}/${(inputDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${inputDate.getDate().toString().padStart(2, "0")}`;

    // Calculate the difference in seconds
    const differenceInSeconds: number = Math.floor((now.getTime() - inputDate.getTime()) / 1000);

    let timeAgo: string = "";

    if (differenceInSeconds < 60) {
        timeAgo = `${differenceInSeconds} sec${differenceInSeconds === 1 ? "" : "s"} ago`;
    } else if (differenceInSeconds < 3600) {
        const minutes: number = Math.floor(differenceInSeconds / 60);
        timeAgo = `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
    } else if (differenceInSeconds < 86400) {
        const hours: number = Math.floor(differenceInSeconds / 3600);
        timeAgo = `${hours} hour${hours === 1 ? "" : "s"} ago`;
    } else if (differenceInSeconds < 2592000) {
        const days: number = Math.floor(differenceInSeconds / 86400);
        timeAgo = `${days} day${days === 1 ? "" : "s"} ago`;
    } else if (differenceInSeconds < 31536000) {
        const months: number = Math.floor(differenceInSeconds / 2592000);
        timeAgo = `${months} month${months === 1 ? "" : "s"} ago`;
    } else {
        const years: number = Math.floor(differenceInSeconds / 31536000);
        timeAgo = `${years} year${years === 1 ? "" : "s"} ago`;
    }

    return {
        date: formattedDate,
        timeAgo,
    };
}

export default function PostItem({ post, showComments = true }: { post: IPost, showComments?: boolean }) {
    if (!post) return <p>No post found</p>;

    const queryClient = useQueryClient();
    const dispatch = useDispatch<AppDispatch>();
    const { user, token } = useSelector((state: any) => state.userCache);
    const [deletingPost, setDeletingPost] = useState('');
    const [addingComment, setAddingComment] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    async function handleDeletePost(postId: string) {
        setDeletingPost(postId);
        const response: any = await dispatch(deletePost({ postId, token }));
        if (response.payload.message === "success") {
            queryClient.invalidateQueries({ queryKey: ['myPosts'] });
        }
        setDeletingPost('');
    }
    async function handleAddComment(e: React.KeyboardEvent<HTMLInputElement>, postId: string) {
        if (e.key === 'Enter') {
            const event = e.currentTarget;
            setAddingComment(true);
            const response: any = await dispatch(addComment({ values: { content: event.value, post: postId }, token }));
            if (response.payload.message === "success") {
                queryClient.invalidateQueries({ queryKey: ['myPosts'] });
            }
            event.value = '';
            setAddingComment(false);
        }
    }

    return <>
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
                <img src={post.user.photo} alt="User Avatar" className="w-8 h-8 rounded-full bg-[var(--bg-tertiary)]" />
                <div>
                    <p className="text-[var(--text-primary)] font-semibold cursor-pointer">{post.user.name}</p>
                    <p className="text-[var(--text-secondary)] text-sm">{formatDateString(post.createdAt).timeAgo}</p>
                </div>
            </div>
            {post.user._id === user?._id &&
                <div className="text-gray-500">
                    {deletingPost === post._id ?
                        <div className="flex items-center justify-center">
                            <Loader2 className='w-7 h-7 animate-spin' />
                        </div>
                        :
                        <TrashIcon className='w-7 h-7 cursor-pointer hover:text-red-400 rounded-full p-1' onClick={() => { handleDeletePost(post._id) }} />
                    }
                </div>
            }
        </div>
        <div className="mb-4">
            <p className="text-[var(--text-primary)]">{post.body}</p>
        </div>
        {post.image && <div className="mb-4">
            <img src={post.image} alt="Post Image" className="w-full max-h-96 object-cover rounded-md cursor-pointer" onClick={() => setShowDetails(true)} />
        </div>}
        {/* Like and Comment Section */}
        <hr className="my-2 text-[var(--border-secondary)]" />
        <div className="flex items-center justify-between text-[var(--text-secondary)]">
            <div className="flex items-center space-x-2">
                <button className="flex justify-center items-center gap-2 px-2 rounded-full p-1 cursor-pointer hover:text-[var(--text-primary)]" onClick={() => setShowDetails(true)}>
                    <Heart className='text-red-500' />
                    <span>{Math.floor(Math.random() * 150)} Likes</span>
                </button>
            </div>
            <button
                onClick={() => setShowDetails(true)}
                className="flex justify-center items-center gap-2 px-2 rounded-full p-1 cursor-pointer hover:text-[var(--text-primary)]"
            >
                <MessageCircleMore />
                <span>{post.comments.length} Comments</span>
            </button>
        </div>
        <hr className="mt-2 text-[var(--border-secondary)]" />
        {showComments &&
            <>
                {post.comments.slice(0, 2).map((comment) => (
                    <div key={comment._id} className="flex items-center space-x-2 mt-4">
                        {
                            comment.commentCreator.photo.includes('undefined') ?
                                <img src={post.user.photo} alt="User Avatar" className="w-10 h-10 rounded-full bg-[var(--bg-tertiary)]" /> :
                                <img src={comment.commentCreator.photo} alt="User Avatar" className="w-10 h-10 rounded-full bg-[var(--bg-tertiary)]" />
                        }
                        <div className='bg-[var(--bg-tertiary)] py-1 px-3 w-fit rounded-xl'>
                            <p className="text-[var(--text-secondary)] font-semibold">{comment.commentCreator.name}</p>
                            <p className="text-[var(--text-tertiary)] text-sm">{comment.content}</p>
                        </div>
                    </div>
                ))}
                {post.comments.length > 2 &&
                    <p className="pt-5 text-[var(--text-primary)] text-sm">
                        <span className='cursor-pointer'>View all {post.comments.length} comments</span></p>
                }

                <div className="flex items-center gap-2 mt-5">
                    <Link href='/User/Profile'>
                        <img src={user?.photo} alt="User Avatar" className="w-10 h-10 rounded-full bg-[var(--bg-tertiary)]" />
                    </Link>

                {/* Comment Input */}
                <div className="relative flex items-center gap-2">
                    <input
                        onKeyDown={(e) => { handleAddComment(e, post._id) }}
                        type="text"
                        placeholder="Add a comment"
                        className="w-full p-2 ps-4 focus:outline-none bg-[var(--bg-tertiary)] rounded-xl"
                        disabled={addingComment}
                    />
                    {addingComment && <Loader2 className="h-5 w-5 animate-spin text-white" />}
                </div>

                </div>
            </>
        }
        {showDetails && (
            <PostDetails
                post={post}
                onClose={() => setShowDetails(false)}
            />
        )}
    </>
}
