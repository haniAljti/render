/* eslint-disable eol-last */
/* eslint-disable indent */
const Sails = require('sails/lib/app/Sails');

module.exports = {
  
  find: async function (req, res) {

    let userId = req.session.userId;

    if (!userId)
      return res.forbidden();

    let currentUser = await User.findOne({ id: userId });
    
    if (!currentUser.isSuperAdmin)
      return res.forbidden();

    sails.log.debug('List all user....' + req.query.filter + '...' + req.query.q);
    let users;
    if (req.query.q && req.query.q.length > 0) {
      if (req.query.filter === 'all') {
        // await User.query(
        //   'SELECT * FROM user WHERE fullName LIKE $1 OR emailAddress LIKE $1',
        //   [ req.query.q ],
        //   async function (err, rawResult) {
        //     users = rawResult.rows
        //   }
        // );
        users = await User.find({
          fullName: {
            'contains': req.query.q
          }
        });
      }
      else if (req.query.filter === 'email') {
        users = await User.find({
          emailAddress: {
            'contains': req.query.q
          }
        });
      } 
      else if (req.query.filter === 'name') {
        users = await User.find({
          fullName: {
            'contains': req.query.q
          }
        });
      }
    } else {
      users = await User.find();
    }
    res.view('pages/admin/index', { users: users });
  },


};
