import { HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';

import { map, Observable } from 'rxjs';
import { ApiResponse } from '../../shared/interfaces/api-response.interface';

function isApiResponse(body: unknown): body is ApiResponse {
  return body !== null && typeof body === 'object' && 'success' in body && 'timestamp' in body;
}

export function httpInterceptor(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  return next(request).pipe(
    map((response) => {
      if (response instanceof HttpResponse && isApiResponse(response.body)) {
        const body = response.body;

        if (body.success) return response.clone({ body: body.data });
        else alert(`${body.error.title}: ${body.error.message}`);
      }

      return response;
    }),
  );
}
