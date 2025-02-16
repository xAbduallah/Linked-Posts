'use client'
import { useEffect } from 'react'
import { X } from 'lucide-react'
import PostItem from './Items/PostItem'
import { IPost, IPostDetailsProps } from '@/Interfaces/Post'

export default function PostDetails({ post, onClose }: IPostDetailsProps) {

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <div 
            className="fixed inset-0 bg-black/70 z-50 top-5% flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            {/* Post Container */}
            <div 
                className="bg-[var(--bg-secondary)] w-full max-w-3xl max-h-[90vh] rounded-xl shadow-xl relative overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1 rounded-full hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] 
                        hover:text-[var(--text-primary)] transition-colors z-10"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Content */}
                <div className="overflow-y-auto max-h-[90vh] p-6">
                    <PostItem post={post} showComments={false} />
                    
                    {/* All Comments Section */}
                    <div className="mt-6">
                        <h3 className="text-[var(--text-primary)] font-semibold mb-4">
                            All Comments ({post.comments.length})
                        </h3>
                        <div className="space-y-4">
                            {post.comments.map((comment) => (
                                <div key={comment._id} className="flex items-start space-x-3">
                                    <img 
                                        src={comment.commentCreator.photo.includes('undefined') 
                                            ? post.user.photo 
                                            : comment.commentCreator.photo
                                        } 
                                        alt={comment.commentCreator.name} 
                                        className="w-8 h-8 rounded-full bg-[var(--bg-tertiary)]"
                                    />
                                    <div className="flex-1 bg-[var(--bg-tertiary)] p-3 rounded-xl">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="text-[var(--text-secondary)] font-medium">
                                                {comment.commentCreator.name}
                                            </p>
                                            <span className="text-xs text-[var(--text-tertiary)]">
                                                {new Date(comment.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-[var(--text-primary)]">{comment.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
