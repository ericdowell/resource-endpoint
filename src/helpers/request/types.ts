import { AxiosResponse } from 'axios'

export interface QueryPayload<Data = any> {
  data: Data | undefined
  errors: any | undefined
  loading: boolean
  message: string | undefined
}
export type Request<Data = any> = () => RequestResponse<Data>
export interface RequestOptions {
  initialLoading?: boolean
  isArray?: boolean
  catchError?: <Data = any>(error: Error, payload: QueryPayload<Data>) => Promise<void>
}
export type RequestResponse<Data = any> = Promise<AxiosResponse<Data>>
export interface SubmitPayload<Data = any> extends QueryPayload<Data> {
  onSubmit: () => Promise<void>
}
