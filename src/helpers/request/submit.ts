import { RequestOptions, Request, RequestPayload } from './types'
import { makePayload, makeRequest } from './index'

export function submit<Data = any>(
  request: Request<Data>,
  options?: RequestOptions,
): RequestPayload<Data> & { onSubmit: () => Promise<void> } {
  return {
    ...makePayload<Data>({ initialLoading: false, ...options }),
    onSubmit: async function (): Promise<void> {
      this.loading = true
      await makeRequest<Data>(request, this, options)
    },
  }
}
