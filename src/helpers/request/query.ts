import { RequestOptions, Request, QueryPayload } from './types'
import { makeRequest } from './index'
import { makePayload } from './payload'

export function unstableQuery<Data = any>(
  request: Request<Data>,
  options?: RequestOptions,
): QueryPayload<Data> {
  const payload = makePayload<Data>(options)
  makeRequest<Data>(request, payload, options)
  return payload
}
