module.exports = {
  apps: [
    {
      name: "ssdm",
      script: "./app.js",
      cwd: `${__dirname}`,
      watch: true,
      ignore_watch: ["frontend/*"],
      env: {
        NODE_ENV: "development",
        JWT_TOKEN: "SOME_SUPER_SECRET_RANDOM_STRING",
        // mongodb setting
        MONGO_USER: "username",
        MONGO_PASSWORD: "password",
        MONGO_DB: "db_name",
        MONGO_HOST: "121.196.22.22",
        MONGO_PORT: 23333
      },
      env_production: {
        NODE_ENV: "production",
        JWT_TOKEN: "SOME_SUPER_SECRET_RANDOM_STRING",
        // mongodb setting
        MONGO_USER: "username",
        MONGO_PASSWORD: "password",
        MONGO_DB: "db_name",
        MONGO_HOST: "121.196.22.22",
        MONGO_PORT: 23333
      },
      exec_mode: "cluster"
    }
  ]
};
