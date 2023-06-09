/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions, unless overridden.       *
  * (`true` allows public access)                                            *
  *                                                                          *
  ***************************************************************************/

  // '*': true,
  '*': 'is-logged-in',

  // Bypass the `is-logged-in` policy for:
  'entrance/*': true,
  'account/logout': true,

  CategoryController: {
    '*': true,
  },
  FeedbackController:{
    '*': true,
  },
  QuestionController:{
    '*': true,
  },
  QuizController:{
    '*': true,
  },
  UserController:{
    '*': 'is-super-admin',
    editOne: 'is-logged-in',
    findOne: 'is-logged-in',
    updateOne: 'is-logged-in'
  },
  GameController:{
    '*': 'is-logged-in'
  }
};
