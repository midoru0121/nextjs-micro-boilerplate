module.exports = {
  serverRuntimeConfig: {},
  env: {
    FRONT_HOST_BASE: process.env.FRONT_HOST_BASE,
    FRONT_API_ENDPOINT_CSR: process.env.FRONT_API_ENDPOINT_CLIENT,
    FRONT_API_ENDPOINT_SSR: process.env.FRONT_API_ENDPOINT_SERVER,
  },
};
