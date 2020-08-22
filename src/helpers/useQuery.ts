import { CatchError, Query, QueryPayload } from './types'
import { AxiosResponse } from 'axios'
import { safeResponseData } from './safeResponseData'

const DEFAULT_CATCH: CatchError = (error: Error): never => {
  throw error
}

export function makeRequest<R>(payload: QueryPayload<R>, request: Query<R>, catchError: CatchError): void {
  request()
    .then((response: AxiosResponse) => {
      const { errors, message, ...data } = safeResponseData<R | any>(response)
      payload.errors = errors
      payload.message = message
      payload.data = data
      payload.loading = false
    })
    .catch(catchError)
}

export function useQuery<R>(request: Query<R>, catchError: CatchError = DEFAULT_CATCH): QueryPayload<R> {
  const payload: QueryPayload<R> = {
    loading: true,
    message: undefined,
    errors: undefined,
    data: undefined,
  }
  makeRequest(payload, request, catchError)
  return payload
}
