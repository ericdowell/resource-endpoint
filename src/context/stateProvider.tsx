import React from 'react'
import { node } from 'prop-types'
// Internal
import { StateAction, StateActionCases, StateProviderHelpers, StateProviderProps } from './types'
import { applyReducerState } from './helpers'

export function createStateProvider<S, R extends React.Reducer<any, any>>(options: {
  initialState: S
  actions: Record<string, string>
  actionCases?: StateActionCases<S>
  providerHelpers?: (dispatch: React.Dispatch<React.ReducerAction<R>>) => StateProviderHelpers
}): [
  React.Context<{
    dispatch: React.Dispatch<React.ReducerAction<R>>
    helpers: any
    state: S
  }>,
  (
    props: StateProviderProps,
  ) => React.ReactElement<
    React.ProviderProps<{
      dispatch: React.Dispatch<React.ReducerAction<R>>
      helpers: any
      state: S
    }>
  >,
] {
  type ProviderProps = {
    dispatch: React.Dispatch<React.ReducerAction<R>>
    helpers: any
    state: S
  }
  const Context = React.createContext<ProviderProps>({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    dispatch: (value: any): void => undefined, // Context.Provider will have correct Reducer dispatch function
    helpers: {}, // Context.Provider will have correct helper functions
    state: options.initialState, // dispatch/state will be maintained by Reducer going forward
  })

  function StateProvider(props: StateProviderProps): React.ReactElement<React.ProviderProps<ProviderProps>> {
    const [state, dispatch] = React.useReducer((prevState: S, action: StateAction): any => {
      if (!Object.values(options.actions).includes(action.type)) {
        throw new Error(`Unknown action: "${action.type}"`)
      }
      if (typeof options?.actionCases?.[action.type] !== 'function') {
        return applyReducerState(prevState, action)
      }
      return options.actionCases[action.type](prevState, action)
    }, options.initialState)
    return (
      <Context.Provider
        value={{
          dispatch,
          helpers: typeof options?.providerHelpers === 'function' ? options.providerHelpers(dispatch) : {},
          state,
        }}
      >
        {props.children}
      </Context.Provider>
    )
  }
  StateProvider.propTypes = {
    children: node.isRequired,
  }
  return [Context, StateProvider]
}
