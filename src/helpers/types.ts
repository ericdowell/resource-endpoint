import { AxiosResponse } from 'axios'

export type CatchError = (error: Error) => any
export type Query<R = any> = () => Promise<AxiosResponse<R>>
export interface QueryPayload<D> {
  errors: any | undefined
  message: string | undefined
  loading: boolean
  data: D | undefined
}
