const config = {
  // apiGateway: {
  //   REGION: import.meta.env.VITE_REGION,
  //   URL: import.meta.env.VITE_API_URL,
  // },
  zero: {
    server: import.meta.env.VITE_ZERO_SERVER,
  },
  cognito: {
    REGION: import.meta.env.VITE_REGION,
    USER_POOL_ID: import.meta.env.VITE_USER_POOL_ID,
    APP_CLIENT_ID: import.meta.env.VITE_USER_POOL_CLIENT_ID,
    IDENTITY_POOL_ID: import.meta.env.VITE_IDENTITY_POOL_ID,
    DOMAIN: import.meta.env.VITE_COGNITO_DOMAIN,
    REDIRECT_URL: import.meta.env.VITE_REDIRECT_URL,
  },
}

export default config
