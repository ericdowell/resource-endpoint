import { unstableQuery } from '../../../helpers'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const request = require('../../../helpers/request')

const DEFAULT_REQUEST = async (): Promise<any> => ({})

describe('query helper', (): void => {
  it('returns default payload', (): void => {
    expect.assertions(2)
    const makeRequest = jest.spyOn(request, 'makeRequest').mockImplementation((): void => undefined)
    expect(unstableQuery(DEFAULT_REQUEST)).toMatchInlineSnapshot(`
      Object {
        "data": undefined,
        "errors": undefined,
        "loading": true,
        "message": undefined,
      }
    `)
    expect(makeRequest).toHaveBeenCalledTimes(1)
    makeRequest.mockRestore()
  })
})
