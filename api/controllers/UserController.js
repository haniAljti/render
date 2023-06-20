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
    res.view('pages/user/index', { users: users });
  },

  findOne: async function (req, res) {
    sails.log.debug("List single user....")
    let userId = req.session.userId
    let currentUser = await User.findOne({ id: userId });

    if (userId != req.params.id && !currentUser.isSuperAdmin)
      return res.forbidden();

    let user = await User.findOne({ id: req.params.id });

    if (!!user.birthday) {
      const offset = user.birthday.getTimezoneOffset()
      let newBirthday = new Date(user.birthday.getTime() - (offset * 60 * 1000))
      user.birthday = newBirthday.toISOString().split('T')[0]
    }

    res.view('pages/user/show', { user: user });
  },

  editOne: async function (req, res) {
    sails.log.debug("Edit single user....")
    let userId = req.session.userId
    let currentUser = await User.findOne({ id: userId });

    if (userId != req.params.id && !currentUser.isSuperAdmin)
      return res.forbidden();

    let user = await User.findOne({ id: req.params.id });

    if (!!user.birthday) {
      const offset = user.birthday.getTimezoneOffset()
      let newBirthday = new Date(user.birthday.getTime() - (offset * 60 * 1000))
      user.birthday = newBirthday.toISOString().split('T')[0]
    }
    res.view('pages/user/edit', { user: user });
  },

  updateOne: async function (req, res) {
    sails.log.debug("Update single user....")

    let userId = req.session.userId
    let user = await User.findOne({ id: userId });

    if (userId != req.params.id && !user.isSuperAdmin)
      return res.forbidden();

    await User.updateOne({ id: req.params.id }).set(req.body);
    res.redirect('/user/' + req.params.id);
  },

  destroyOne: async function (req, res) {
    sails.log.debug("Destroy single category....")
    await User.destroyOne({ id: req.params.id });
    res.redirect('/user');
  },


};
