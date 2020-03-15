import { AxiosResponse } from 'axios'

export const getFallbackMessage = (response: AxiosResponse | undefined, defaultMessage?: string): string => {
  return typeof response?.data?.message === 'string'
    ? response?.data.message
    : defaultMessage ?? 'An unexpected error has occurred. Please try again.'
}

export const getErrors = (response: AxiosResponse | undefined): { [key: string]: any } => {
  return response?.data?.errors ? response.data.errors : {}
}

export const getStatus = (response: AxiosResponse | undefined): number => {
  return response?.status ? response.status : 500
}

export const hasMessage = (key: string, response: AxiosResponse | undefined): boolean => {
  const errors = getErrors(response)
  return !!errors && typeof errors[key] !== 'undefined'
}

export const getMessage = (key: string, response: AxiosResponse | undefined, defaultMessage?: string): string => {
  const errors = getErrors(response)
  return errors?.[key] ?? getFallbackMessage(response, defaultMessage)
}
