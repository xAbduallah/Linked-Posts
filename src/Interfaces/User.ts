export interface IUser {
    _id: string
    name: string
    email: string
    dateOfBirth: string
    gender: string
    photo: string
    createdAt: string
}

export interface UserState {
    user: IUser | null;
    token: string | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    message: string | null;
}
