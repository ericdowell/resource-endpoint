import { submit } from '../../../helpers'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const request = require('../../../helpers/request')

const DEFAULT_REQUEST = async (): Promise<any> => ({})

describe('submit helper', (): void => {
  it('returns default payload', (): void => {
    expect.assertions(1)
    expect(submit(DEFAULT_REQUEST)).toMatchInlineSnapshot(`
      Object {
        "data": undefined,
        "errors": undefined,
        "loading": false,
        "message": undefined,
        "onSubmit": [Function],
      }
    `)
  })

  it('calling onSubmit from payload calls makeRequest', async (): Promise<void> => {
    expect.assertions(3)
    const makeRequest = jest.spyOn(request, 'makeRequest').mockImplementation((): void => undefined)
    const payload = submit(DEFAULT_REQUEST)
    expect(payload.loading).toBe(false)
    await payload.onSubmit()
    expect(payload.loading).toBe(true)
    expect(makeRequest).toHaveBeenCalledTimes(1)
    makeRequest.mockRestore()
  })
})
