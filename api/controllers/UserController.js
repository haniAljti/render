/* eslint-disable eol-last */
/* eslint-disable indent */
const Sails = require('sails/lib/app/Sails');

module.exports = {
  create: async function (req, res) {
    sails.log.debug('Create new user....' + req.body + '...');

    let user = await User.create(req.allParams());
    res.redirect('/');
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
    sails.log.debug("Destroy single user....")
    await User.destroyOne({ id: req.params.id });
    res.redirect('/user');
  },


};
