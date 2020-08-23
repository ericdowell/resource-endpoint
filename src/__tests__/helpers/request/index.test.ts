// eslint-disable-next-line @typescript-eslint/no-var-requires
const helper = require('../../../helpers/request')

describe('request.DEFAULT_REQUEST_CATCH', (): void => {
  it('throws the error passed to it', (): void => {
    expect.assertions(1)
    expect((): void => helper.DEFAULT_REQUEST_CATCH(new Error())).toThrow(new Error())
  })
})

describe('request.makeRequest', (): void => {
  it.todo('makeRequest')
})
