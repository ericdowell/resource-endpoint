import { AxiosResponse } from 'axios'

export type CatchError = <Data = any>(error: Error, payload: RequestPayload<Data>) => never | void
export interface QueryOptions {
  initialLoading?: boolean
  isArray?: boolean
  catchError?: CatchError
}
export type Request<Data = any> = () => Promise<AxiosResponse<Data>>
export interface RequestPayload<Data = any> {
  data: Data | undefined
  errors: any | undefined
  loading: boolean
  message: string | undefined
}
