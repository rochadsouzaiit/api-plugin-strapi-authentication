import fetch from "node-fetch";
import config from "../config.js";

const { STRAPI_OAUTH2_INTROSPECT_URL } = config;

/**
 * Given an Authorization Bearer token it returns a JSON object with user
 * properties and claims found
 *
 * @name expandAuthToken
 * @method
 * @summary Expands an Auth token
 * @param {String} token Auth token
 * @returns {Object} JSON object
 */
export default async function expandAuthToken(token) {
  const response = await fetch(STRAPI_OAUTH2_INTROSPECT_URL, {
    headers: { "Authorization": `Bearer ${encodeURIComponent(token)}` },
    method: "GET"
  });
  
  if (!response.ok) throw new Error("Error introspecting token");
  
  return response.json();
}
