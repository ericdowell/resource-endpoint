import { AxiosResponse } from 'axios'
import { RequestOptions, QueryPayload } from './types'
import { safeResponseData } from '../safeResponseData'

export function processResponse<Data>(
  response: AxiosResponse<Data>,
  payload: QueryPayload<Data>,
  options?: RequestOptions,
): void {
  const isArray = options?.isArray ?? false
  const safeResponse = safeResponseData<Data | any>(response, isArray)
  if (isArray) {
    payload.data = safeResponse
  } else {
    const { errors, message, ...data } = safeResponse
    payload.errors = errors
    payload.message = message
    payload.data = data
  }
  payload.loading = false
}
