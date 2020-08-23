import { RequestOptions, RequestPayload } from './types'

export const makePayload = <Data>(options?: RequestOptions): RequestPayload<Data> => {
  return {
    data: undefined,
    errors: undefined,
    loading: options?.initialLoading ?? true,
    message: undefined,
  }
}
