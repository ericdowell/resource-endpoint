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
    helpers: StateProviderHelpers
    state: S
  }>,
  (
    props: StateProviderProps,
  ) => React.ReactElement<
    React.ProviderProps<{
      dispatch: React.Dispatch<React.ReducerAction<R>>
      helpers: StateProviderHelpers
      state: S
    }>
  >,
] {
  type ProviderProps = {
    dispatch: React.Dispatch<React.ReducerAction<R>>
    helpers: StateProviderHelpers
    state: S
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [state, dispatch] = React.useReducer((prevState: S, action: StateAction): any => {
    if (!Object.values(options.actions).includes(action.type)) {
      throw new Error(`Unknown action: "${action.type}"`)
    }
    if (typeof options?.actionCases?.[action.type] !== 'function') {
      return applyReducerState(prevState, action)
    }
    return options.actionCases[action.type](prevState, action)
  }, options.initialState)

  const providerValue = {
    helpers: typeof options?.providerHelpers === 'function' ? options.providerHelpers(dispatch) : {},
    state,
    dispatch,
  }
  const Context = React.createContext<ProviderProps>(providerValue)

  function StateProvider(props: StateProviderProps): React.ReactElement<React.ProviderProps<ProviderProps>> {
    return <Context.Provider value={providerValue}>{props.children}</Context.Provider>
  }
  StateProvider.propTypes = {
    children: node.isRequired,
  }
  return [Context, StateProvider]
}
