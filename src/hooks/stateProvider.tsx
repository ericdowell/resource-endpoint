import React from 'react'
import { node } from 'prop-types'
// Internal
import { StateActionCases, StateProviderHelpers, StateProviderProps } from './types'
import { applyReducerState } from './helpers'

export function generateStateProvider<S, R extends React.Reducer<any, any>>(
  Context: React.Context<S>,
  Reducer: [React.ReducerState<R>, React.Dispatch<React.ReducerAction<R>>],
  helpers?: StateProviderHelpers,
): any {
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

export function useStateProvider<S>(
  initialState: S,
  actions: Record<string, any>,
  cases?: StateActionCases,
  helpers?: StateProviderHelpers,
): any {
  const Context = React.createContext<S>(initialState)

  const Reducer = React.useReducer((state: any, action: any): any => {
    if (!Object.values(actions).includes(action.type)) {
      throw new Error(`Unknown action: "${action.type}"`)
    }
    if (typeof cases?.[action.type] !== 'function') {
      return applyReducerState(state, action.type, action)
    }
    return cases[action.type](action)
  }, initialState)

  const StateProvider = generateStateProvider<S, any>(Context, Reducer, {
    ...helpers,
    update: (type: any, payload: any): void => {
      // dispatch
      Reducer[1]({ type, [type]: payload })
    },
  })

  return { Context, Reducer, StateProvider }
}
