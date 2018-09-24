import sum from '../sum'

describe('Test Sum function', () => {
  it('should return 3 (1+2)', () => {
    expect(sum(1, 2)).toEqual(3)
  })
})
