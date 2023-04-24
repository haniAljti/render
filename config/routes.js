/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

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

  //User
  '/user/new': { view: 'pages/user/new' },
  'GET /user/index': { controller: 'UserController', action: 'find' },
  'POST /user': { controller: 'UserController', action:'create' },


  //Quiz
  'GET /quiz/new': { controller: 'QuizController', action:'new' },
  'POST /quiz': { controller: 'QuizController', action: 'create' },

  //Category
  '/category/new': { view: 'pages/category/new' },
  'GET /category/category': { controller: 'CategoryController', action: 'findOne' },
  'GET /category/index': { controller: 'CategoryController', action: 'find' },
  'POST /category': { controller: 'CategoryController', action:'create' },

  // TODO: GET mit DELETE ersetzten
  'GET /category/:id/edit': { controller: 'CategoryController', action: 'editOne' },
  'POST /category/:id/update': { controller: 'CategoryController', action: 'updateOne' },
  'GET /category/:id/delete': { controller: 'CategoryController', action: 'destroyOne' },
  '/quiz/new': { view: 'pages/quiz/new' },


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
