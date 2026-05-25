module.exports = {
  apps: [
    {
      name: "notepackz-editor",
      script: ".next/standalone/server.js",
      env: {
        NODE_ENV: "production",
        PORT: 3003,
        HOSTNAME: "127.0.0.1",
      },
    },
  ],
};
