import { RequestOptions, QueryPayload } from './types'

export const makePayload = <Data>(options?: RequestOptions): QueryPayload<Data> => {
  return {
    data: undefined,
    errors: undefined,
    loading: options?.initialLoading ?? true,
    message: undefined,
  }
}
