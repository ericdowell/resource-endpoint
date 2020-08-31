import { RequestOptions, Request, SubmitPayload } from './types'
import { makeRequest } from './index'
import { makePayload } from './payload'

export function unstableSubmit<Data = any>(
  request: Request<Data>,
  options?: RequestOptions,
): SubmitPayload<Data> {
  const payload = {
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
  payload.onSubmit = payload.onSubmit.bind(payload)
  return payload
}
