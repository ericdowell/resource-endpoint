// TODO: Add correct types to parameters
export const applyReducerState = (state: any, key: any, action: any): any => ({
  ...state,
  [key]: action[key],
})
