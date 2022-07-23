import { createReactQueryHooks } from '@trpc/react';
import type { AppRouter } from '../pages/api/trpc/[trpc]';

// eslint-disable-next-line
export const trpc = createReactQueryHooks<AppRouter>();
// => { useQuery: ..., useMutation: ...}
