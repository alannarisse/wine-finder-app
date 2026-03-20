declare const process: { env: { [key: string]: string } };

export const environment = {
  production: true,
  // Falls back to placeholder if not set - update after Railway deploy
  apiUrl: 'https://your-railway-api-url.railway.app/api',
};
