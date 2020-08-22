import { Query, QueryPayload } from './types'
import { AxiosResponse } from 'axios'
import { safeResponseData } from './safeResponseData'

const DEFAULT_CATCH = (error: Error): never => {
  throw error
}

export function useQuery<R>(request: Query<R>, catchError = DEFAULT_CATCH): QueryPayload<R> {
  const query: QueryPayload<R> = {
    loading: true,
    message: undefined,
    errors: undefined,
    data: undefined,
  }
  request()
    .then((response: AxiosResponse) => {
      const { errors, message, ...data } = safeResponseData<R | any>(response)
      query.errors = errors
      query.message = message
      query.data = data
      query.loading = false
    })
    .catch(catchError)
  return query
}
