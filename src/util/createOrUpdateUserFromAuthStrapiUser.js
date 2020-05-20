import Logger from "@reactioncommerce/logger";
import mongodb from "mongodb";
const { ObjectId } = mongodb;
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
async function createOrUpdateUserFromAuthStrapiUser(strapiUser, context) {
  const { id, email, provider, confirmed, username, blocked, trial } = strapiUser;
  if (!id || !email) {
    Logger.error("Missing the strapi user id or email!!");
    throw new Error("Missing the strapi user id or email!!");
  }

  const existsUser = await context.collections.users.findOne({strapi_user: id });
  const values = {
    strapi_user: id,
    confirmed,
    blocked,
    trial,
    username,
    emails: [{
      address: email,
      verified: !!confirmed,
      provides: provider
    }]
  }
  let result = null;
  if (!!existsUser) {
    // Update the e-commerce user
    values._id = existsUser._id;
    result = await context.collections.users.updateOne({_id: existsUser._id}, {$set: values});
  } else {
    // Create a new e-commerce User
    values._id = ObjectId().toString();
    result = await context.collections.users.insertOne(values, {forceServerObjectId: true});
  }
  return !!result && !!result.result && result.result.n === 1 ? values : null;
}

export default createOrUpdateUserFromAuthStrapiUser;
