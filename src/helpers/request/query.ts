import { QueryOptions, Request, RequestPayload } from '../types'
import { DEFAULT_REQUEST_CATCH, makePayload, makeRequest } from './index'

export function query<Data = any>(request: Request<Data>, options?: QueryOptions): RequestPayload<Data> {
  const payload = makePayload<Data>(options)
  makeRequest<Data>(request, payload, {
    catchError: options?.catchError ?? DEFAULT_REQUEST_CATCH,
    isArray: options?.isArray ?? false,
  })
  return payload
}
