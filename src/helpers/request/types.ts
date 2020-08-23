import { AxiosResponse } from 'axios'

export type Request<Data = any> = () => Promise<AxiosResponse<Data>>
export interface RequestOptions {
  initialLoading?: boolean
  isArray?: boolean
  catchError?: <Data = any>(error: Error, payload: RequestPayload<Data>) => Promise<void>
}
export interface RequestPayload<Data = any> {
  data: Data | undefined
  errors: any | undefined
  loading: boolean
  message: string | undefined
}
