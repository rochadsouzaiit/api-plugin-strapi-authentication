import Logger from "@reactioncommerce/logger";
import expandAuthToken from "./expandAuthToken.js";
const {ObjectId} = require('mongodb');
/**
 * Given an Authorization Bearer token and the current context, returns the user document
 * for that token after performing token checks.
 *
 * If the provided token is not associated with any user or is associated but is
 * expired, this function throws an "access-denied" ReactionError.
 *
 * @name getUserFromAuthToken
 * @method
 * @memberof GraphQL
 * @summary Looks up a user by token
 * @param {String} loginToken Auth token
 * @param {Object} context An object with request-specific state
 * @returns {Object} The user associated with the token
 */
async function getUserFromAuthToken(loginToken, context) {
  const token = loginToken.replace(/bearer\s/gi, "");

  const user = await expandAuthToken(token);
  
  if (!user) {
    Logger.debug("No stapi user found");
    throw new Error("No stapi user found");
  }

  const { confirmed, blocked , _id } = user;

  if (!confirmed) {
    Logger.debug("Stapi user not confirmed yet");
    throw new Error("Stapi user not confirmed yet");
  }

  if (blocked) {
    Logger.error("Stapi user is blocked");
    throw new Error("Stapi user is blocked");
  }

  const currentUser = await context.collections.users.findOne({ _id: ObjectId(_id) });
  if (!currentUser) {
    Logger.error("Bearer token specifies a user ID that does not exist");
    throw new Error("Bearer token specifies a user ID that does not exist");
  }

  return currentUser;
}

export default getUserFromAuthToken;
