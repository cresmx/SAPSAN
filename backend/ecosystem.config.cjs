module.exports = {
  apps: [
    {
      name: "agua-backend",
      script: "./server.js",   // ajusta si tu entrypoint es distinto
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: "production",
        DB_HOST: "localhost",
        DB_PORT: 5432,
        DB_NAME: "agua_potable",
        DB_USER: "agua_admin",
        DB_PASSWORD: "aguasegura",
        JWT_SECRET: "chelyta1"
      }
    }
  ]
};
