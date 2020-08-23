import { RequestOptions, Request, RequestPayload } from './types'
import { makeRequest } from './index'
import { makePayload } from './payload'

export function query<Data = any>(request: Request<Data>, options?: RequestOptions): RequestPayload<Data> {
  const payload = makePayload<Data>(options)
  makeRequest<Data>(request, payload, options)
  return payload
}
