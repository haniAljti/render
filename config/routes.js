/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

const GameController = require("../api/controllers/GameController");

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': { view: 'pages/homepage' },

  //login
  'GET /signup': { action: 'entrance/view-signup' },
  'POST /signup': { action: 'entrance/signup' },
  'GET /login': { action: 'entrance/view-login' },
  'GET /logout': { action: 'account/logout' },
  'POST /login': { action: 'entrance/login' },

  //User
  '/user/new': { view: 'pages/user/new' },
  'GET /user/index': { controller: 'UserController', action: 'find' },
  'GET /user/show': { controller: 'UserController', action: 'findOne' },
  'GET /user/:id/edit': { controller: 'UserController', action: 'editOne' },
  'GET /user/:id/delete': { controller: 'UserController', action: 'destroyOne' },
  'POST /user': { controller: 'UserController', action:'create' },
  'POST /user/:id/update': { controller: 'UserController', action: 'updateOne' },

  //Quiz
  'GET /quiz/new': { controller: 'QuizController', action:'new' },
  'GET /quiz/index': { controller: 'QuizController', action:'find' },
  'POST /quiz': { controller: 'QuizController', action: 'create' },
  'GET /quiz/:id': { controller: 'QuizController', action: 'findOne' },
  'GET /quiz/:id/edit': { controller: 'QuizController', action: 'editOne' },
  'POST /quiz/:id/update': { controller: 'QuizController', action: 'updateOne' },
  'GET /quiz/:id/delete': { controller: 'QuizController', action: 'destroyOne' },

  //Question
  'GET /quiz/:id/question/new': { controller: 'QuestionController', action: 'new' },
  'POST /quiz/:id/question': { controller: 'QuestionController', action: 'create' },
  'GET /question/:id/delete': { controller: 'QuestionController', action: 'destroyOne' },
  'GET /question/:id': { controller: 'QuestionController', action: 'findOne' },
  'GET /question/:id/edit': { controller: 'QuestionController', action: 'editOne' },
  'POST /question/:id/update': { controller: 'QuestionController', action: 'updateOne' },

  //Category
  '/category/new': { view: 'pages/category/new' },
  'GET /category/category': { controller: 'CategoryController', action: 'findOne' },
  'GET /category/index': { controller: 'CategoryController', action: 'find' },
  'POST /category': { controller: 'CategoryController', action:'create' },
  'GET /category/:id/edit': { controller: 'CategoryController', action: 'editOne' },
  'POST /category/:id/update': { controller: 'CategoryController', action: 'updateOne' },
  'GET /category/:id/delete': { controller: 'CategoryController', action: 'destroyOne' },

  //Feedback
  'POST /quiz/:id/feedback/:stars': { controller: 'FeedbackController', action: 'create' },


  //StartedQuiz
  'GET /game/start/:quizid': { view: 'pages/game/start'},
  'GET /game/join/:sessionid': { view: 'pages/game/join'},
  'POST /quiz/:id/create': GameController.create,
  'POST /game/:sessionid/start': GameController.start,
  'POST /game/:sessionid/answer/:answerid': GameController.answer,
  'POST /game/:sessionid/next': GameController.next,
  'POST /game/:sessionid/finish': GameController.finish,
  'POST /game/:sessionid/join': GameController.join,
  'POST /game/:sessionid/leave': GameController.leave

  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/


};
