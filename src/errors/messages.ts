import { AxiosResponse } from 'axios'

export const getFallbackMessage = (response: AxiosResponse | any, defaultMessage?: string): string => {
  return typeof response?.data?.message === 'string'
    ? response?.data.message
    : defaultMessage ?? 'An unexpected error has occurred. Please try again.'
}

export const getErrors = (response: AxiosResponse | any): any => {
  return response?.data?.errors
}

export const getStatus = (response: AxiosResponse | any): number => {
  return response?.status ? response.status : 500
}

export const hasMessage = (key: string, response: AxiosResponse | any): boolean => {
  const errors = getErrors(response)
  return !!errors && typeof errors[key] !== 'undefined'
}

export const getMessage = (key: string, response: AxiosResponse | any, defaultMessage?: string): string => {
  const errors = getErrors(response)
  return errors?.[key] ?? getFallbackMessage(response, defaultMessage)
}
