import React from 'react'
import { node } from 'prop-types'
// Internal
import {
  StateAction,
  StateActionCases,
  StateProviderComponent,
  StateProviderHelpers,
  StateProviderProps,
} from './types'
import { applyReducerState } from './helpers'

export function generateStateProvider<S, R extends React.Reducer<any, any>>(
  Context: React.Context<S>,
  Reducer: [React.ReducerState<R>, React.Dispatch<React.ReducerAction<R>>],
  providerHelpers?: StateProviderHelpers,
): StateProviderComponent<S> {
  function StateProvider(props: StateProviderProps): any {
    const Provider = Context.Provider as React.Provider<S & any>
    return (
      <Provider
        value={{
          ...providerHelpers,
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
  actions: Record<string, string>,
  actionCases?: StateActionCases<S>,
): [React.Context<S>, [React.ReducerState<R>, React.Dispatch<React.ReducerAction<R>>]] {
  return [
    React.createContext<S>(initialState),
    React.useReducer((prevState: S, action: StateAction): any => {
      if (!Object.values(actions).includes(action.type)) {
        throw new Error(`Unknown action: "${action.type}"`)
      }
      if (typeof actionCases?.[action.type] !== 'function') {
        return applyReducerState(prevState, action)
      }
      return actionCases[action.type](prevState, action)
    }, initialState),
  ]
}

export function useStateProvider<S, R extends React.Reducer<any, any>>(
  initialState: S,
  actions: Record<string, string>,
  options?: {
    actionCases?: StateActionCases<S>
    createProviderHelpers?: (
      update: (type: any, payload: any) => void,
      dispatch: React.Dispatch<React.ReducerAction<R>>,
    ) => StateProviderHelpers
  },
): [React.Context<S>, StateProviderComponent<S>] {
  const [Context, Reducer] = useContextReducer(initialState, actions, options?.actionCases)
  const update = (type: any, payload: any): void => Reducer[1]({ type, [type]: payload })
  return [
    Context,
    generateStateProvider(Context, Reducer, {
      update,
      ...((typeof options?.createProviderHelpers === 'function' &&
        options.createProviderHelpers(update, Reducer[1])) ||
        {}),
    }),
  ]
}
