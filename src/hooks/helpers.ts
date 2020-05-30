import { StateAction } from './types'

export const applyStateByKey = <S>(prevState: S, action: StateAction, key: string): S => ({
  ...prevState,
  [key]: action[key],
})

export const applyReducerState = <S>(prevState: S, action: StateAction): S =>
  applyStateByKey(prevState, action, action.type)
