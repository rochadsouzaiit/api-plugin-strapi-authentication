import Logger from "@reactioncommerce/logger";
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
    _id: id,
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
  let eCommerceUser = null;
  if (!!existsUser) { 
    // Update the e-commerce user
    eCommerceUser = await context.collections.users.update({_id: existsUser._id}, values);
  } else {
    // Create a new e-commerce User 
    eCommerceUser = await context.collections.users.create(values);
  }
  return eCommerceUser;
}

export default createOrUpdateUserFromAuthStrapiUser;
