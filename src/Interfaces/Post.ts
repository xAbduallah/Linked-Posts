export interface IPost {
    _id: string
    body: string
    image: string
    user: IPostUser
    createdAt: string
    comments: IPostComment[]
    id: string
}

export interface IPostUser {
    _id: string
    name: string
    photo: string
}

export interface IPostComment {
    _id: string
    content?: string
    commentCreator: IPostCommentCreator
    post: string
    createdAt: string
}

export interface IPostCommentCreator {
    _id: string
    name: string
    photo: string
}

export interface IPostDetailsProps {
    post: IPost;
    onClose: () => void;
}