import { RequestOptions, Request, SubmitPayload } from './types'
import { makeRequest } from './index'
import { makePayload } from './payload'

export function submit<Data = any>(request: Request<Data>, options?: RequestOptions): SubmitPayload<Data> {
  return {
    ...makePayload<Data>({ initialLoading: false, ...options }),
    onSubmit: async function (): Promise<void> {
      this.loading = true
      await makeRequest<Data>(request, this, options)
    },
  }
}
