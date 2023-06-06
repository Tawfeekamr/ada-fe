const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function(app) {
  app.use(
    "/api/v1",
    createProxyMiddleware({
      target: "https://adaa.wisys.com.sa:3000",
      changeOrigin: true,
      logLevel: "debug"
    })
  );
};
