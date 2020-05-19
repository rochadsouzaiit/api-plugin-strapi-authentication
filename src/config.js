import envalid from "envalid";

const { str } = envalid;

export default envalid.cleanEnv(process.env, {
  STRAPI_OAUTH2_INTROSPECT_URL: str({ devDefault: "http://localhost:1337/e-commerce/users/me" })
}, {
  dotEnvPath: null
});
