'use client'
import { useSelector } from 'react-redux';
import { ImagePlus, Loader2, SendHorizontal, Smile, Video, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import EmojiPicker from 'emoji-picker-react';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';

export default function CreatePost() {
    const queryClient = useQueryClient();
    const [content, setContent] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
    const [showEmojis, setShowEmojis] = useState(false);
    const [creatingPost, setCreatingPost] = useState(false);
    const { user, token } = useSelector((state: any) => state.userCache);
    const [mediaPreview, setMediaPreview] = useState<string | null>(null);
    const [mediaType, setMediaType] = useState<'photo' | 'video' | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const emojiPickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
                setShowEmojis(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const onEmojiClick = (emojiObject: any) => {
        setContent(content + emojiObject.emoji);
    };

    const handleMediaClick = (type: 'photo' | 'video') => {
        setMediaType(type);
        if (fileInputRef.current) {
            fileInputRef.current.accept = type === 'photo' ? 'image/*' : 'video/*';
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setMediaPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeMedia = () => {
        setMediaPreview(null);
        setMediaType(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('body', content || ' ');

        if (fileInputRef.current?.files?.[0]) {
            formData.append('image', fileInputRef.current.files[0]);
        }
        setCreatingPost(true);

        axios.post('https://linked-posts.routemisr.com/posts', formData, { headers: { token: token } })
            .then(({ data }) => {
                if (data.message === 'success') {
                    setContent('');
                    setMediaPreview(null);
                    setMediaType(null);
                    setIsExpanded(false);
                    if (fileInputRef.current)
                        fileInputRef.current.value = '';
                    setShowEmojis(false);

                    queryClient.invalidateQueries({ queryKey: ['myPosts'] });
                }
            }).catch((error) => {
                console.log(error);
            }).finally(() => {
                setCreatingPost(false);
            });
    };

    return (
        <div className="rounded-xl bg-[var(--bg-secondary)] p-4 shadow-[var(--bg-secondary)] mx-auto text-center">
            {(!user || !token) ? <Link href="/Auth/Login" className='p-4 bg-[var(--bg-secondary)] rounded-xl text-xl font-semibold cursor-pointer hover:text-[var(--text-secondary)]'>Login to create a post</Link> :
                <div className="flex items-start space-x-4">
                    <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-[var(--bg-secondary)]">
                        {user?.photo ? (
                            <img src={user.photo} alt={user.name} className="h-full w-full object-cover" />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-[var(--text-secondary)]">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>

                    <div className="flex-grow">
                        <form onSubmit={handleSubmit}>
                            <textarea
                                placeholder={`What's on your mind, ${user?.name?.split(' ')[0]}?`}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                onFocus={() => setIsExpanded(true)}
                                className="w-full resize-none rounded-lg bg-[var(--bg-tertiary)] p-3 text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none"
                                rows={isExpanded ? 4 : 1}
                            />

                            {/* Preview */}
                            {mediaPreview && (
                                <div className="relative mt-4 rounded-lg overflow-hidden">
                                    <button
                                        type="button"
                                        onMouseDown={removeMedia}
                                        className="absolute right-2 top-2 rounded-full bg-black/50 p-1 hover:bg-black/70 z-10"
                                    >
                                        <X className="h-6 w-6 text-white" />
                                    </button>
                                    {mediaType === 'photo' ? (
                                        <img src={mediaPreview} alt="Preview" className="max-h-[300px] w-full object-cover rounded-lg" />
                                    ) : (
                                        <video src={mediaPreview} controls className="max-h-[300px] w-full rounded-lg" />
                                    )}
                                </div>
                            )}

                            {/* Buttons */}
                            <div className={`mt-4 transition-all duration-200 ${isExpanded ? 'block' : 'hidden'}`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex space-x-2">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleMediaClick('photo')}
                                            className="flex items-center space-x-2 rounded-lg px-3 py-2 text-[var(--text-secondary)] cursor-pointer hover:bg-[var(--bg-primary)]"
                                        >
                                            <ImagePlus className="h-5 w-5" />
                                            <span>Photo</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleMediaClick('video')}
                                            className="flex items-center space-x-2 rounded-lg px-3 py-2 text-[var(--text-secondary)] cursor-pointer hover:bg-[var(--bg-primary)]"
                                        >
                                            <Video className="h-5 w-5" />
                                            <span>Video</span>
                                        </button>
                                        <div className="relative">
                                            <button
                                                type="button"
                                                onClick={() => setShowEmojis(!showEmojis)}
                                                className="flex items-center space-x-2 rounded-lg px-3 py-2 text-[var(--text-secondary)] cursor-pointer hover:bg-[var(--bg-primary)]"
                                            >
                                                <Smile className="h-5 w-5" />
                                                <span>Emoji</span>
                                            </button>

                                            {showEmojis && (
                                                <div ref={emojiPickerRef} className="absolute bottom-full left-0 mb-2">
                                                    <div className="relative">
                                                        <div className="absolute z-50">
                                                            <EmojiPicker
                                                                onEmojiClick={onEmojiClick}
                                                                // theme="dark"
                                                                searchDisabled
                                                                skinTonesDisabled
                                                                height={400}
                                                                width={300}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={!content.trim() && !mediaPreview}
                                        className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {creatingPost ? <Loader2 className='animate-spin w-6 h-6' /> : <SendHorizontal className='w-4 h-4' />}
                                        Post
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            }
        </div>
    );
}
