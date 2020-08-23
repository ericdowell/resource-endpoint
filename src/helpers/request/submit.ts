import { QueryOptions, Request, RequestPayload } from '../types'
import { DEFAULT_REQUEST_CATCH, makePayload, makeRequest } from './index'

export function submit<Data = any>(
  request: Request<Data>,
  options?: QueryOptions,
): RequestPayload<Data> & { onSubmit: () => Promise<void> } {
  return {
    ...makePayload<Data>({ initialLoading: false, ...options }),
    onSubmit: async function (): Promise<void> {
      this.loading = true
      await makeRequest<Data>(request, this, {
        catchError: options?.catchError ?? DEFAULT_REQUEST_CATCH,
        isArray: options?.isArray ?? false,
      })
    },
  }
}
