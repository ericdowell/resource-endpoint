import React from 'react'
import { FormChangeEvent } from './types'

export function useFormChange<S>(
  initialState: S | (() => S),
): [(event: FormChangeEvent) => void, S, React.Dispatch<React.SetStateAction<S>>] {
  const [values, setValues] = React.useState<S>(initialState)
  return [
    function (event: FormChangeEvent): void {
      const name = event.target.name
      const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
      setValues((values: any) => ({
        ...values,
        [name]: value,
      }))
    },
    values,
    setValues,
  ]
}
