import { Pagination } from '@counsy-ai/types';

export type ExamplesQuery = {
  search?: string;
  orderBy?: 'newest' | 'oldest';
} & Pagination;
