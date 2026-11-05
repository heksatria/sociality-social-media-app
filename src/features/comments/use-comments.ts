import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { commentService } from '@/lib/services';

export function useComments(postId: number) {
  return useInfiniteQuery({
    queryKey: ['comments', postId],
    queryFn: ({ pageParam }) => commentService.list(postId, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.page < lastPage.pagination.totalPages
        ? lastPage.pagination.page + 1
        : undefined,
  });
}

function useRefreshAfterComment(postId: number) {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    queryClient.invalidateQueries({ queryKey: ['post', postId] });
    queryClient.invalidateQueries({ queryKey: ['posts'] });
  };
}

export function useAddComment(postId: number) {
  const refresh = useRefreshAfterComment(postId);
  return useMutation({
    mutationFn: (text: string) => commentService.add(postId, text),
    onSuccess: refresh,
  });
}

export function useDeleteComment(postId: number) {
  const refresh = useRefreshAfterComment(postId);
  return useMutation({
    mutationFn: (commentId: number) => commentService.remove(commentId),
    onSuccess: refresh,
  });
}
