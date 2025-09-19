const isProduction = process.env.NODE_ENV === 'production';

// config.ts (or wherever your config is)
export const config = {
   baseUrl: !isProduction
      ? 'http://localhost:5000'
      : 'https://igbo-translator-backend.onrender.com',
   endpoints: {
      translateText: '/api/translate',
      login: '/api/auth/login',
      register: '/api/auth/register',
      getProfile: '/auth/me',
      logout: '/auth/logout',
      refreshToken: '/api/auth/refresh',
   },
};
