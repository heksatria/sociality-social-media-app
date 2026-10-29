export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type Author = {
  id: number;
  username: string;
  name: string;
  avatarUrl: string | null;
};

export type Post = {
  id: number;
  imageUrl: string;
  caption: string | null;
  createdAt: string;
  author: Author;
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
};

export type Comment = {
  id: number;
  text: string;
  createdAt: string;
  author: Author;
};

export type UserListItem = Author & {
  isFollowedByMe: boolean;
  isMe?: boolean;
};

export type AuthUser = Author & {
  email: string;
};

export type AuthData = {
  token: string;
  user: AuthUser;
};

export type Counts = {
  post: number;
  followers: number;
  following: number;
  likes: number;
};

// Profil saya (sudah dinormalkan di services.ts)
export type MyProfile = Author & {
  email: string;
  phone: string | null;
  bio: string | null;
  counts: Counts;
};

// Profil yang dikembalikan PATCH /api/me
export type UpdatedProfile = Author & {
  email: string;
  phone: string | null;
  bio: string | null;
};

export type PublicProfile = Author & {
  bio: string | null;
  counts: Counts;
  isFollowing: boolean;
  isMe: boolean;
};

export type PostPage = {
  posts: Post[];
  pagination: Pagination;
};

export type UserPage = {
  users: UserListItem[];
  pagination: Pagination;
};

export type CommentPage = {
  comments: Comment[];
  pagination: Pagination;
};

export type RegisterBody = {
  name: string;
  username: string;
  email: string;
  phone: string;
  password: string;
};
