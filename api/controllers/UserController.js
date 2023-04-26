/* eslint-disable eol-last */
/* eslint-disable indent */
const Sails = require('sails/lib/app/Sails');

module.exports = {
    create: async function (req, res) {
      sails.log.debug('Create new user....' + req.body + '...');
      
      let user = await User.create(req.allParams());
      res.redirect('/');
    },
    find: async function (req, res) {
      sails.log.debug('List all user....' + req.query.filter + '...' + req.query.q);
      let users;
      if (req.query.q && req.query.q.length > 0) {
        if(req.query.filter === 'all'){
          users = await User.find({
            or : [{
                name: {
                  'contains': req.query.q
                },
                note: {
                  'contains': req.query.q
                }
            }]
          });
        }
        else if(req.query.filter === 'birthday'){
          users = await User.find({
            birthday: {
              'contains': req.query.q
            }
          });
        }else if(req.query.filter === 'name'){
          users = await User.find({
            name: {
              'contains': req.query.q
            }
          });
        }
      } else {
        users = await User.find();
      }
      res.view ('pages/user/index', { users: users } );
    },
  };