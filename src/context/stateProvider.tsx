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

export function createStateProvider<S, R extends React.Reducer<any, any>>(
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
  const Context = React.createContext<S>(initialState)

  // TODO: Add return type for component other than 'any'.
  function StateProvider(props: StateProviderProps): any {
    const Provider = Context.Provider as React.Provider<S & any>

    const [state, dispatch] = React.useReducer((prevState: S, action: StateAction): any => {
      if (!Object.values(actions).includes(action.type)) {
        throw new Error(`Unknown action: "${action.type}"`)
      }
      if (typeof options?.actionCases?.[action.type] !== 'function') {
        return applyReducerState(prevState, action)
      }
      return options.actionCases[action.type](prevState, action)
    }, initialState)
    const update = (type: any, payload: any): void => dispatch({ type, [type]: payload })
    return (
      <Provider
        value={{
          update,
          ...((typeof options?.createProviderHelpers === 'function' &&
            options.createProviderHelpers(update, dispatch)) ||
            {}),
          state,
          dispatch,
        }}
      >
        {props.children}
      </Provider>
    )
  }
  StateProvider.propTypes = {
    children: node.isRequired,
  }
  return [Context, StateProvider]
}
