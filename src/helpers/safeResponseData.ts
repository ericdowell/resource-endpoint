import { AxiosResponse } from 'axios'

export function safeResponseData<T = any>(response: AxiosResponse<T> | any, isArray = false): T {
  if (isArray) {
    return (Array.isArray(response?.data) && response.data) || []
  }
  return (response?.data && typeof response.data === 'object' && response.data) || {}
}
