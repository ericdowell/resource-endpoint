import { AxiosResponse } from 'axios'
import { safeResponseData } from './safeResponseData'
import { CatchError, Query, QueryPayload } from './types'

const DEFAULT_CATCH: CatchError = (error: Error): never => {
  throw error
}

export function makeRequest<R>(
  payload: QueryPayload<R>,
  request: Query<R>,
  options: { isArray: boolean; catchError: CatchError },
): void {
  request()
    .then((response: AxiosResponse) => {
      const { errors, message, ...data } = safeResponseData<R | any>(response, options.isArray)
      payload.errors = errors
      payload.message = message
      payload.data = data
      payload.loading = false
    })
    .catch((error) => {
      options.catchError<R>(error, payload)
      payload.loading = false
    })
}

export function query<R>(
  request: Query<R>,
  options?: { isArray?: boolean; catchError?: CatchError },
): QueryPayload<R> {
  const payload: QueryPayload<R> = {
    loading: true,
    message: undefined,
    errors: undefined,
    data: undefined,
  }
  makeRequest<R>(payload, request, {
    catchError: options?.catchError ?? DEFAULT_CATCH,
    isArray: options?.isArray ?? false,
  })
  return payload
}
