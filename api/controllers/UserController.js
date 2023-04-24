const Sails = require("sails/lib/app/Sails");

module.exports = {
    create: async function (req, res) {
      sails.log.debug("Create new user....")
      let category = await User.create(req.allParams());
      res.redirect('/');
    },
   
  };
  