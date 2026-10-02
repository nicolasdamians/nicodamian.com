/** Marks content the owner still has to confirm. Rendered visibly, listed by `npm run todos`. */
export const TODO_PREFIX = 'TODO(nico):';
export const todo = (what: string): string => `${TODO_PREFIX} ${what}`;
export const isTodo = (value: string | undefined): boolean => value?.startsWith(TODO_PREFIX) ?? false;
