import React from 'react'

export type StateAction = { type: string } & Record<string, any>
export type StateActionCases<S> = { [actionType: string]: React.Reducer<S, any> }
export type StateProviderHelpers = { [key: string]: (...args: any[]) => any }
export interface StateProviderProps {
  children: React.ReactNode | React.ReactNode[]
}
