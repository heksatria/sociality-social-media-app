import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postService } from '@/lib/services';
import type { Post } from '@/types/api';

export function useToggleLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (post: Post) =>
      post.likedByMe ? postService.unlike(post.id) : postService.like(post.id),
    onSuccess: (_data, post) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', post.id] });
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });
}
