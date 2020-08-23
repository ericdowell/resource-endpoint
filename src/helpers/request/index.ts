import { AxiosResponse } from 'axios'
import { safeResponseData } from '../safeResponseData'
import { RequestOptions, Request, RequestPayload } from './types'

export const makePayload = <Data>(options?: RequestOptions): RequestPayload<Data> => {
  return {
    data: undefined,
    errors: undefined,
    loading: options?.initialLoading ?? true,
    message: undefined,
  }
}

export function processResponse<Data>(
  response: AxiosResponse<Data>,
  payload: RequestPayload<Data>,
  options?: RequestOptions,
): void {
  const { errors, message, ...data } = safeResponseData<Data | any>(response, options?.isArray ?? false)
  payload.errors = errors
  payload.message = message
  payload.data = data
  payload.loading = false
}

export async function makeRequest<Data>(
  request: Request<Data>,
  payload: RequestPayload<Data>,
  options?: RequestOptions,
): Promise<void> {
  return request()
    .then((response: AxiosResponse<Data>) => processResponse(response, payload, options))
    .catch((error) => {
      if (!options?.catchError) {
        throw error
      }
      options.catchError(error, payload).then(() => {
        payload.loading = false
      })
    })
}
