import { getErrorMessage } from '../errors';

describe('getErrorMessage', () => {
  it('reads RTK Query error payloads', () => {
    expect(
      getErrorMessage({ data: { message: 'Invalid credentials' } }, 'fallback')
    ).toBe('Invalid credentials');
  });

  it('falls back for unknown errors', () => {
    expect(getErrorMessage(null, 'fallback')).toBe('fallback');
    expect(getErrorMessage({}, 'fallback')).toBe('fallback');
  });
});
