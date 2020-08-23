import { AxiosResponse } from 'axios'

export type CatchError = <R>(error: Error, payload: QueryPayload<R>) => never | void
export type Query<R = any> = () => Promise<AxiosResponse<R>>
export interface QueryPayload<D> {
  errors: any | undefined
  message: string | undefined
  loading: boolean
  data: D | undefined
}
