export interface PaginationParams {
  page: number
  perPage: number
}

export const DEFAULT_PER_PAGE: number = 20
export const DEFAULT_PAGE: number = 1 // should always be at least 1
