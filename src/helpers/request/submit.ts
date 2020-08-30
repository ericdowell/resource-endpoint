import { RequestOptions, Request, SubmitPayload } from './types'
import { makeRequest } from './index'
import { makePayload } from './payload'

export function submit<Data = any>(request: Request<Data>, options?: RequestOptions): SubmitPayload<Data> {
  return {
    ...makePayload<Data>({ initialLoading: false, ...options }),
    onSubmit: async function (event: { preventDefault(): void }): Promise<void> {
      typeof event.preventDefault === 'function' && event.preventDefault()
      this.loading = true
      await makeRequest<Data>(request, this, options)
      if (typeof options?.next === 'function') {
        await options.next()
      }
    },
  }
}
