import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/lib/services';

export function useToggleFollow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      username,
      following,
    }: {
      username: string;
      following: boolean;
    }) =>
      following ? userService.unfollow(username) : userService.follow(username),
    onSuccess: (_data, { username }) => {
      queryClient.invalidateQueries({ queryKey: ['user', username] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['me'] });
      queryClient.invalidateQueries({ queryKey: ['posts', 'feed'] });
    },
  });
}
