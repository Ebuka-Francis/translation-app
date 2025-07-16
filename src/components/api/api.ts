// config.ts (or wherever your config is)
export const config = {
   baseUrl: process.env.NEXT_PUBLIC_BACKEND_API,
   endpoints: {
      translateText: '/api/translate',
      login: '/api/login',
      register: '/api/register',
      getProfile: '/auth/me',
      logout: '/auth/logout', // Fixed from 'getMet'
   },
};
