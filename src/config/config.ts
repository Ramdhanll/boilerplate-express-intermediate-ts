const config = {
   mongo: {
      options: {
         useUnifiedTopology: true,
         useNewUrlParser: true,
         socketTimeoutMS: 30000,
         keepAlive: true,
         autoIndex: false,
         retryWrites: false,
      },
      url: 'mongodb://localhost/name-database',
   },
   server: {
      host: `localhost`,
      port: process.env.PORT || 5000,
   },
}

export default config
