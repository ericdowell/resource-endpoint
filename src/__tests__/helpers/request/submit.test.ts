import { submit } from '../../../helpers'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const request = require('../../../helpers/request')

const DEFAULT_REQUEST = async (): Promise<any> => ({})
const next = jest.fn().mockResolvedValue(undefined)

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

  it.each([[undefined], [{ next }]])(
    'calling onSubmit from payload calls makeRequest',
    async (options): Promise<void> => {
      expect.assertions(5)
      const makeRequest = jest.spyOn(request, 'makeRequest').mockImplementation((): void => undefined)
      const payload = submit(DEFAULT_REQUEST, options)
      expect(payload.loading).toBe(false)
      const preventDefault = jest.fn()
      await payload.onSubmit({ preventDefault })
      expect(payload.loading).toBe(true)
      expect(next).toHaveBeenCalledTimes(options ? 1 : 0)
      expect(preventDefault).toHaveBeenCalledTimes(1)
      expect(makeRequest).toHaveBeenCalledTimes(1)
      makeRequest.mockRestore()
    },
  )
})
