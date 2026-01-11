import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { UiNotyfService } from '../ui/ui-notyf/ui-notyf.service';

interface BaseApiResponse {
  timestamp: string;
}

interface ApiResponseSuccess<T = unknown> extends BaseApiResponse {
  success: true;
  data: T;
}

interface ApiError {
  title: string;
  message: string;
}

interface ApiResponseError extends BaseApiResponse {
  success: false;
  error: ApiError;
}

type ApiResponse<T = unknown> = ApiResponseSuccess<T> | ApiResponseError;

function isApiResponse(body: unknown): body is ApiResponse {
  return body !== null && typeof body === 'object' && 'success' in body && 'timestamp' in body;
}
function isApiErrorResponse(error: unknown): error is ApiError {
  return true;
}

export function httpInterceptor(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const notyf = inject(UiNotyfService);

  return next(request).pipe(
    map((response) => {
      if (response instanceof HttpResponse && isApiResponse(response.body) && response.body.success)
        return response.clone({ body: response.body.data });
      return response;
    }),
    catchError((response) => {
      if (response instanceof HttpErrorResponse) {
        const error = response.error.error;
        if (isApiErrorResponse(error)) {
          const { title, message } = error;
          notyf.error(message, title);
        }
      }
      return throwError(() => response);
    }),
  );
}
