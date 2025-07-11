// config.ts (or wherever your config is)
export const config = {
   baseUrl: process.env.NEXT_PUBLIC_BACKEND_API,
   endpoints: {
      translateText: '/api/translate',
      login: '/api/login',
      register: '/api/register',
      getUser: '/api/getUser', // Fixed from 'getMet'
   },
};
