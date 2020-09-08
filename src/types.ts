import { AxiosResponse } from 'axios'

export type RequestResponse<Data = any> = AxiosResponse<Data>
export type Request<Data = any> = () => Promise<RequestResponse<Data>>
