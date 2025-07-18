import { PORT } from '@env';

describe('Environment Variables', () => {
  it('should load environment variables from .env file', () => {
    expect(PORT).toBeDefined();
  });
});
