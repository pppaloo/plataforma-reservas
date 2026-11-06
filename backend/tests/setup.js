process.env.NODE_ENV = 'test';
process.env.JWT_ACCESS_SECRET = 'test_access_secret_with_at_least_32_characters_ok';
process.env.JWT_REFRESH_SECRET = 'test_refresh_secret_with_at_least_32_characters_ok';
process.env.JWT_ACCESS_TTL = '15m';
process.env.CLIENT_ORIGIN = 'http://localhost:5173';
