import { AxiosResponse } from 'axios'

export type Query<R = any> = () => Promise<AxiosResponse<R>>
export interface QueryPayload<D> {
  errors?: any
  message?: string
  loading: boolean
  data?: D
}
