import { slugParamSchema } from './slug-param-schema'

describe('slug param schema', () => {
  it('should only allow valid slug and transform invalid into valid', () => {
    expect(slugParamSchema.parse('question-2')).toBe('question-2')
    expect(slugParamSchema.parse('Question 2')).toBe('question-2')
  })
})
