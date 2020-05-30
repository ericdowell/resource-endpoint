import React from 'react'

// useFormChange
export type FormChangeEvent = React.ChangeEvent<
  HTMLFieldSetElement & HTMLInputElement & HTMLSelectElement & HTMLTextAreaElement
>

// useStateProvider
export type StateActionCases = { [actionType: string]: (action: any) => any }
export type StateProviderHelpers = { [key: string]: (...args: any[]) => any }
export interface StateProviderProps {
  children: any
}
