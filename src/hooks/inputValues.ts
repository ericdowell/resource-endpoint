import { Dispatch, ChangeEvent, SetStateAction, useState } from 'react'

export function useInputValues<S>(
  initialState: S | (() => S),
): [(e: any) => void, S, Dispatch<SetStateAction<S>>] {
  const [values, setValues] = useState(initialState)
  return [
    function (e: ChangeEvent<{ name: string; type: string; value: any; checked: boolean }>): void {
      const key = e.target.name
      // TODO: Handle <select><option>
      const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
      setValues((values: any) => ({
        ...values,
        [key]: value,
      }))
    },
    values,
    setValues,
  ]
}
