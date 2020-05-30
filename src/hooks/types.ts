import React from 'react'

/** useFormChange */
export type FormChangeEvent = React.ChangeEvent<
  HTMLFieldSetElement & HTMLInputElement & HTMLSelectElement & HTMLTextAreaElement
>

/** useStateProvider */
export type StateAction = { type: string } & Record<string, any>
export type StateActionCases<S> = { [actionType: string]: React.Reducer<S, any> }
export type StateProviderComponent<S> = (props: StateProviderProps) => React.Provider<S & any>
export type StateProviderHelpers = { [key: string]: (...args: any[]) => any }
export interface StateProviderProps {
  children: React.ReactNode | React.ReactNode[]
}
