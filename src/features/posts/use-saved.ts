import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { postService } from '@/lib/services';
import { useAuthStore } from '@/store/auth-store';

// hasilnya array id, misalnya [3, 8, 12]
export function useSavedIds() {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: ['saved-ids'],
    enabled: !!token,
    queryFn: async () => {
      const data = await postService.saved(1, 50);
      return data.posts.map((p) => p.id);
    },
  });
}

export function useToggleSave() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, saved }: { id: number; saved: boolean }) =>
      saved ? postService.unsave(id) : postService.save(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-ids'] });
      queryClient.invalidateQueries({ queryKey: ['posts', 'me', 'saved'] });
    },
  });
}
