export interface UserData {
  bio: string;
  email: string;
  image?: string;
  token: string;
  username: string;
}

export interface UserResponse {
  user: UserData;
}
