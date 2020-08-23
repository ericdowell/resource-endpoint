import { RequestOptions, Request, RequestPayload } from '../types'
import { makePayload, makeRequest } from './index'

export function query<Data = any>(request: Request<Data>, options?: RequestOptions): RequestPayload<Data> {
  const payload = makePayload<Data>(options)
  makeRequest<Data>(request, payload, options)
  return payload
}
