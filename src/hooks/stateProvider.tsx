import React from 'react'
import { node } from 'prop-types'
// Internal
import { StateActionCases, StateProviderComponent, StateProviderHelpers, StateProviderProps } from './types'
import { applyReducerState } from './helpers'

export function generateStateProvider<S, R extends React.Reducer<any, any>>(
  Context: React.Context<S>,
  Reducer: [React.ReducerState<R>, React.Dispatch<React.ReducerAction<R>>],
  helpers?: StateProviderHelpers,
): StateProviderComponent<S> {
  function StateProvider(props: StateProviderProps): any {
    const Provider = Context.Provider as React.Provider<S & any>
    return (
      <Provider
        value={{
          ...helpers,
          state: Reducer[0],
          dispatch: Reducer[1],
        }}
      >
        {props.children}
      </Provider>
    )
  }
  StateProvider.propTypes = {
    children: node.isRequired,
  }
  return StateProvider
}

export function useContextReducer<S, R extends React.Reducer<any, any>>(
  initialState: S,
  actions: Record<string, any>,
  cases?: StateActionCases<S>,
): [React.Context<S>, [React.ReducerState<R>, React.Dispatch<React.ReducerAction<R>>]] {
  return [
    React.createContext<S>(initialState),
    React.useReducer((prevState: any, action: any): any => {
      if (!Object.values(actions).includes(action.type)) {
        throw new Error(`Unknown action: "${action.type}"`)
      }
      if (typeof cases?.[action.type] !== 'function') {
        return applyReducerState(prevState, action.type, action)
      }
      return cases[action.type](prevState, action)
    }, initialState),
  ]
}

export function useStateProvider<S, R extends React.Reducer<any, any>>(
  initialState: S,
  actions: Record<string, any>,
  cases?: StateActionCases<S>,
  helpers?: StateProviderHelpers,
): [React.Context<S>, StateProviderComponent<S>] {
  const [Context, Reducer] = useContextReducer(initialState, actions, cases)
  return [
    Context,
    generateStateProvider(Context, Reducer, {
      update: (type: any, payload: any): void => {
        // dispatch
        Reducer[1]({ type, [type]: payload })
      },
      ...helpers,
    }),
  ]
}
