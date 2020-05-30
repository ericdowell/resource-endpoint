import React, { createContext, useReducer } from 'react'
import { node } from 'prop-types'

type Cases = { [actionType: string]: (action: any) => any }
type ProviderHelper = { [helper: string]: (...args: any[]) => any }

export const applyState = (state: any, key: any, action: any): any => ({
  ...state,
  [key]: action[key],
})

export function useStateProvider<S>(
  initialState: S,
  actions: any,
  cases: Cases,
  helpers?: ProviderHelper[],
): any {
  const Context = createContext<S>(initialState)
  const { Provider } = Context

  function StateProvider(props: any): any {
    const [state, dispatch] = useReducer((state: any, action: any) => {
      if (!Object.values(actions).includes(action.type)) {
        throw new Error(`Unknown action: "${action.type}"`)
      }
      if (typeof cases[action.type] !== 'function') {
        return applyState(state, action.type, action)
      }
      return cases[action.type](action)
    }, initialState)
    const update = (type: any, payload: any): void => dispatch({ type, [type]: payload })

    return (
      <Provider
        // TODO: Setup correct return type here.
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        value={{
          update,
          setUser: (user: any): void => update(actions.SET_USER, user),
          ...helpers,
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

  return { Context, StateProvider }
}
