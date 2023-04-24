/* eslint-disable eol-last */
/* eslint-disable indent */
const Sails = require("sails/lib/app/Sails");

module.exports = {
    create: async function (req, res) {
      sails.log.debug("Create new user....")
      let category = await User.create(req.allParams());
      res.redirect('/');
    },
    find: async function (req, res) {
      sails.log.debug("List all user....")
      let users;
      if (req.query.q && req.query.q.length > 0) {
        users = await User.find({
          name: {
            'contains': req.query.q
          }
        })
      } else {
        users = await User.find();
      }
      res.view ('pages/user/index', { users: users } );
    },
  };