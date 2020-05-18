import React from 'react'

export function useInputValues<S>(
  initialState: S | (() => S),
): [(e: React.ChangeEvent<HTMLInputElement>) => void, S, React.Dispatch<React.SetStateAction<S>>] {
  const [values, setValues] = React.useState<S>(initialState)
  return [
    function (event: React.ChangeEvent<HTMLInputElement>): void {
      setValues((values: any) => ({
        ...values,
        [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value,
      }))
    },
    values,
    setValues,
  ]
}
