export interface ApiListResponse<T> {
  status_code: number;
  status: string;
  message: string;
  data: T[];
}

export interface ApiSingleResponse<T> {
  status_code: number;
  status: string;
  message: string;
  data: T;
}
