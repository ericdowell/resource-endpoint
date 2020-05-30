import React from 'react'

// useFormChange
export type FormChangeEvent = React.ChangeEvent<
  HTMLFieldSetElement & HTMLInputElement & HTMLSelectElement & HTMLTextAreaElement
>

// useStateProvider
// TODO: Use React.Reducer<S, A> instead of custom type?
export type StateActionCases<S> = { [actionType: string]: (state: S, action: any) => any }
export type StateProviderComponent<S> = (props: StateProviderProps) => React.Provider<S & any>
export type StateProviderHelpers = { [key: string]: (...args: any[]) => any }
export interface StateProviderProps {
  children: React.ReactNode | React.ReactNode[]
}
