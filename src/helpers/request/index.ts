import { AxiosResponse } from 'axios'
import { RequestOptions, Request, QueryPayload } from './types'
import { processResponse } from './process'

export async function makeRequest<Data>(
  request: Request<Data>,
  payload: QueryPayload<Data>,
  options?: RequestOptions,
): Promise<void> {
  return request()
    .then((response: AxiosResponse<Data>) => processResponse(response, payload, options))
    .catch(
      async (error: Error): Promise<void> => {
        if (!options?.catchError) {
          throw error
        }
        return options.catchError(error, payload).then(() => {
          payload.loading = false
        })
      },
    )
}
