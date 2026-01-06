interface BaseApiResponse {
  timestamp: string;
}

interface ApiResponseSuccess<T = unknown> extends BaseApiResponse {
  success: true;
  data: T;
}

interface ApiError {
  title: string;
  message: string | object;
}

interface ApiResponseError extends BaseApiResponse {
  success: false;
  error: ApiError;
}

export type ApiResponse<T = unknown> = ApiResponseSuccess<T> | ApiResponseError;
