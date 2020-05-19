import React from 'react'

type Change = React.ChangeEvent<HTMLInputElement & HTMLSelectElement>

export function useFormChange<S>(
  initialState: S | (() => S),
): [(e: Change) => void, S, React.Dispatch<React.SetStateAction<S>>] {
  const [values, setValues] = React.useState<S>(initialState)
  return [
    function (event: Change): void {
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
