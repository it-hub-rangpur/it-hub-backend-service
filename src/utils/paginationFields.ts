export const paginationFields = ["page", "limit", "sortBy", "sortOrder"];
export interface IPaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
