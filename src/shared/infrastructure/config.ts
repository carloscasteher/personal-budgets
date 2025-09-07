export const config = {
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number.parseInt(process.env.DB_PORT || '27017', 10),
    username: process.env.DB_USERNAME || 'ccaste',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_DATABASE || 'develop',
  },
  logger: {
    pretty: process.env.NODE_ENV !== 'production',
    level: 'debug',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'ilovedogs',
  },
  listeningPort: Number.parseInt(process.env.APP_PORT || '8080', 10),
}