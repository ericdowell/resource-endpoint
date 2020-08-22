import React from 'react'
import { safeResponseData } from './safeResponseData'

export interface OnSubmitOptions {
  makeRequest: (inputs: any) => Promise<any>
  useState: [any, React.Dispatch<React.SetStateAction<any>>]
  onError?: (errors: any, onSubmit: (event: React.FormEvent) => Promise<void>) => void
  onSuccess?: (payload: any) => Promise<any>
  initialState?: Record<string, any>
}

export function createOnSubmit(options: OnSubmitOptions): (event: React.FormEvent) => Promise<void> {
  const [values, setValues] = options.useState
  return async function onSubmit(event: React.FormEvent): Promise<void> {
    event.preventDefault()
    setValues({ ...values, isLoading: true })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { errors, isLoading, ...inputs } = values
    const data = safeResponseData(await options.makeRequest(inputs))
    if (data.errors) {
      setValues({
        ...values,
        errors: data.errors,
        isLoading: false,
      })
      if (typeof options.onError !== 'function') {
        return
      }
      return options.onError(data.errors, onSubmit)
    }
    if (typeof options.onSuccess === 'function') {
      await options.onSuccess(data)
    } else {
      setValues({ ...options.initialState, isLoading: false })
    }
  }
}
