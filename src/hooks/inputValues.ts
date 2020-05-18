import { Dispatch, ChangeEvent, SetStateAction, useState } from 'react'

type Change = ChangeEvent<{ name: string; type: string; value: any; checked: boolean }>

export function useInputValues<S>(
  initialState: S | (() => S),
): [(e: Change) => void, S, Dispatch<SetStateAction<S>>] {
  const [values, setValues] = useState<S>(initialState)
  return [
    function (event: Change): void {
      setValues((values: any) => ({
        ...values,
        // TODO: Test handling <select><option></option></select>
        // TODO: Test handling <input type="radio" />
        [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value,
      }))
    },
    values,
    setValues,
  ]
}
