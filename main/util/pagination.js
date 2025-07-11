import { query } from "express-validator";

export function computePagination(page, totalItems, itemsPerPage) {
  return {
    page,
    nextPage: page + 1,
    previousPage: page - 1,
    hasNextPage: itemsPerPage * page < totalItems,
    hasPreviousPage: page > 1,
    lastPage: Math.ceil(totalItems / itemsPerPage)
  };
}

export function checkPagination() {
  return query('page', 'The page is incorrectly formatted')
    .optional()
    .isInt({ min: 1 });
}
