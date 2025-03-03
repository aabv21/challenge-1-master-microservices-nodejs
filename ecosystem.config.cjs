module.exports = {
  apps: [
    {
      name: "express-app",
      script: "./index.js",
      env: {
        NODE_ENV: "development",
        PORT: 3000,
      },
      instances: 1,
      watch: true,
    },
  ],
};
