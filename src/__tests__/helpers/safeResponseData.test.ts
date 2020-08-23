import { safeResponseData } from '../../helpers'

describe('safeResponseData', (): void => {
  it.each([
    [{ data: { key: 'value' } }, false, { key: 'value' }],
    [{ data: ['value'] }, true, ['value']],
    [undefined, undefined, {}],
    [undefined, true, []],
  ])('static method safeResponseData returns data property', (response, isArray, expected): void => {
    expect.assertions(1)
    expect(safeResponseData(response as any, isArray)).toStrictEqual(expected)
  })
})
