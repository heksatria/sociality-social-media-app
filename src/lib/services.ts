import { api } from './api';
import type {
  ApiResponse,
  AuthData,
  Comment,
  CommentPage,
  MyProfile,
  Pagination,
  Post,
  PostPage,
  PublicProfile,
  RegisterBody,
  UpdatedProfile,
  UserPage,
} from '@/types/api';

const LIMIT = 12;

async function get<T>(url: string, params?: Record<string, unknown>) {
  const res = await api.get<ApiResponse<T>>(url, { params });
  return res.data.data;
}

// feed & me/posts memakai "items" -> samakan jadi "posts"
async function getItems(url: string, page: number): Promise<PostPage> {
  const d = await get<{ items: Post[]; pagination: Pagination }>(url, {
    page,
    limit: LIMIT,
  });
  return { posts: d.items, pagination: d.pagination };
}

export const authService = {
  login: async (body: { email: string; password: string }) =>
    (await api.post<ApiResponse<AuthData>>('/api/auth/login', body)).data.data,
  // isi data register belum pasti (bisa { token, user }, bisa user saja)
  register: async (body: RegisterBody) =>
    (
      await api.post<ApiResponse<Partial<AuthData> | null>>(
        '/api/auth/register',
        body
      )
    ).data.data,
};

type RawMe = {
  profile: Omit<MyProfile, 'counts'>;
  stats: { posts: number; followers: number; following: number; likes: number };
};

export const meService = {
  get: async (): Promise<MyProfile> => {
    const { profile, stats } = await get<RawMe>('/api/me');
    return {
      ...profile,
      counts: {
        post: stats.posts,
        followers: stats.followers,
        following: stats.following,
        likes: stats.likes,
      },
    };
  },
  update: async (form: FormData) =>
    (await api.patch<ApiResponse<UpdatedProfile>>('/api/me', form)).data.data,
};

export const postService = {
  feed: (page: number) => getItems('/api/feed', page),
  myPosts: (page: number) => getItems('/api/me/posts', page),
  explore: (page: number) =>
    get<PostPage>('/api/posts', { page, limit: LIMIT }),
  saved: (page: number, limit = LIMIT) =>
    get<PostPage>('/api/me/saved', { page, limit }),
  myLikes: (page: number) =>
    get<PostPage>('/api/me/likes', { page, limit: LIMIT }),
  byUser: (username: string, kind: 'posts' | 'likes', page: number) =>
    get<PostPage>(`/api/users/${encodeURIComponent(username)}/${kind}`, {
      page,
      limit: LIMIT,
    }),
  detail: (id: number) => get<Post>(`/api/posts/${id}`),
  create: async (form: FormData) =>
    (await api.post<ApiResponse<Post>>('/api/posts', form)).data.data,
  remove: (id: number) => api.delete(`/api/posts/${id}`),
  like: (id: number) => api.post(`/api/posts/${id}/like`),
  unlike: (id: number) => api.delete(`/api/posts/${id}/like`),
  save: (id: number) => api.post(`/api/posts/${id}/save`),
  unsave: (id: number) => api.delete(`/api/posts/${id}/save`),
  likers: (id: number, page: number) =>
    get<UserPage>(`/api/posts/${id}/likes`, { page, limit: 20 }),
};

export const commentService = {
  list: (postId: number, page: number) =>
    get<CommentPage>(`/api/posts/${postId}/comments`, { page, limit: 10 }),
  add: async (postId: number, text: string) =>
    (
      await api.post<ApiResponse<Comment>>(`/api/posts/${postId}/comments`, {
        text,
      })
    ).data.data,
  remove: (id: number) => api.delete(`/api/comments/${id}`),
};

export const userService = {
  search: (q: string) =>
    get<UserPage>('/api/users/search', { q, page: 1, limit: 10 }),
  profile: (username: string) =>
    get<PublicProfile>(`/api/users/${encodeURIComponent(username)}`),
  // username === "me" -> endpoint milik sendiri
  list: (username: string, kind: 'followers' | 'following', page: number) =>
    get<UserPage>(
      username === 'me'
        ? `/api/me/${kind}`
        : `/api/users/${encodeURIComponent(username)}/${kind}`,
      { page, limit: 20 }
    ),
  follow: (username: string) =>
    api.post(`/api/follow/${encodeURIComponent(username)}`),
  unfollow: (username: string) =>
    api.delete(`/api/follow/${encodeURIComponent(username)}`),
};
