import { AxiosResponse } from 'axios'

export interface QueryPayload<Data = any> {
  data: Data | undefined
  errors: any | undefined
  loading: boolean
  message: string | undefined
}
export type Request<Data = any> = () => Promise<RequestResponse<Data>>
export interface RequestOptions {
  initialLoading?: boolean
  isArray?: boolean
  next?: () => Promise<void>
  catchError?: <Data = any>(error: Error, payload: QueryPayload<Data>) => Promise<void>
}
export type RequestResponse<Data = any> = AxiosResponse<Data>
export interface SubmitPayload<Data = any> extends QueryPayload<Data> {
  onSubmit: (event: { preventDefault(): void }) => Promise<void>
}
