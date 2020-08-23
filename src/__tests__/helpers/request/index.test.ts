import * as process from '../../../helpers/request/process'
import { RequestPayload } from '../../../helpers'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const payloadHelper = require('../../../helpers/request/payload')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const request = require('../../../helpers/request')

describe('request.makeRequest', (): void => {
  it('makeRequest calls processResponse when successful', async (): Promise<void> => {
    expect.assertions(2)
    const payload = payloadHelper.makePayload()
    const processResponse = jest.spyOn(process, 'processResponse').mockReturnValue(undefined)
    expect(await request.makeRequest(async (): Promise<any> => ({}), payload)).toBeUndefined()
    expect(processResponse).toHaveBeenCalledTimes(1)
    processResponse.mockRestore()
  })

  it('makeRequest throws error when request throws', async (): Promise<void> => {
    expect.assertions(2)
    const payload = payloadHelper.makePayload()
    const processResponse = jest.spyOn(process, 'processResponse').mockReturnValue(undefined)
    await expect(
      request.makeRequest(async (): Promise<any> => {
        throw new Error('Foo bar testing request error')
      }, payload),
    ).rejects.toMatchInlineSnapshot(`[Error: Foo bar testing request error]`)
    expect(processResponse).toHaveBeenCalledTimes(0)
    processResponse.mockRestore()
  })

  it('makeRequest calls options.catchError when defined when request throws', async (): Promise<void> => {
    expect.assertions(5)
    const payload = payloadHelper.makePayload()
    const processResponse = jest.spyOn(process, 'processResponse').mockReturnValue(undefined)
    const catchError = async (error: Error, catchPayload: RequestPayload): Promise<void> => {
      catchPayload.errors = [{ message: error.message }]
    }
    expect(payload.loading).toBe(true)
    expect(
      await request.makeRequest(
        async (): Promise<any> => {
          throw new Error('Foo bar testing request error')
        },
        payload,
        { catchError },
      ),
    ).toBeUndefined()
    expect(payload.loading).toBe(false)
    expect(payload.errors).toMatchInlineSnapshot(`
      Array [
        Object {
          "message": "Foo bar testing request error",
        },
      ]
    `)
    expect(processResponse).toHaveBeenCalledTimes(0)
    processResponse.mockRestore()
  })
})
