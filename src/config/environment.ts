// Environment configuration
export const environment = {
  production: true,
  mongodb: {
    uri: 'mongodb+srv://dubeyjatin0959:CAM0959@opam.xpq9e3f.mongodb.net/?retryWrites=true&w=majority&appName=Opam',
    dbName: 'shudhyum_production',
    options: {
      retryWrites: true,
      w: 'majority'
    }
  },
  auth: {
    jwtSecret: 'shudhyum_jwt_secret_key_2024',
    tokenExpiry: '7d',
    bcryptRounds: 12
  },
  api: {
    baseUrl: process.env.NODE_ENV === 'production' 
      ? 'https://api.shudhyum.com' 
      : 'http://localhost:3001',
    timeout: 10000
  },
  features: {
    enableRealTimeSync: true,
    enableAnalytics: true,
    enableNotifications: true
  }
};

export const getConfig = () => environment;