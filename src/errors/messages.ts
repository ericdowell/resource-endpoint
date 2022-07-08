import { AxiosResponse } from 'axios'

const serverErrorMessage = 'Server Error'

export const defaultErrorMessage = 'An unexpected error has occurred. Please try again.'

export const errorsBlock = (message: string): { message: string } => ({ message })

export const isErrorMessageServerError = (message: unknown): boolean => message === serverErrorMessage

type MessageErrorResponse = { message: string }

const isMessageErrorResponse = (data: unknown): data is MessageErrorResponse =>
  !!data && typeof data === 'object' && 'message' in data

export const getFallbackMessage = (
  response: AxiosResponse<unknown> | undefined,
  defaultMessage?: string,
): string => {
  if (
    !isMessageErrorResponse(response?.data) ||
    typeof response?.data.message !== 'string' ||
    !isErrorMessageServerError(response.data.message)
  ) {
    return defaultMessage ?? defaultErrorMessage
  }
  return response.data.message
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
