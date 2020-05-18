import { Dispatch, ChangeEvent, SetStateAction, useState } from 'react'

type Change = ChangeEvent<{ name: string; type: string; value: any; checked: boolean }>

export function useInputValues<S>(
  initialState: S | (() => S),
): [(e: Change) => void, S, Dispatch<SetStateAction<S>>] {
  const [values, setValues] = useState(initialState)
  return [
    function (event: Change): void {
      const key = event.target.name
      // TODO: Handle <select><option>
      const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
      setValues((values: any) => ({
        ...values,
        [key]: value,
      }))
    },
    values,
    setValues,
  ]
}
