export const domain = $app.stage === 'production' ? process.env.DOMAIN : null

export const appUrl =
  domain !== null ? `https://${domain}` : 'http://localhost:3002'
