/* eslint-disable indent */
const Sails = require("sails/lib/app/Sails");


module.exports = {
  create: async function (req, res) {
    sails.log.debug("Create new Categpry....")
    let category = await Category.create(req.allParams());
    res.redirect('/category');
  },

  findOne: async function (req, res) {
    sails.log.debug("List single category....")
    let category = await Category.findOne({ id: req.params.id });
    // TODO populate quiz for current category
    let quizes = await Quiz.find({
        category: req.params.id
    })

    res.view('pages/category/category', { category: category, quizes: quizes  });
  },

  find: async function (req, res) {
    sails.log.debug("List all category....")
    let categories;
    if (req.query.q && req.query.q.length > 0) {
      categories = await Category.find({
        name: {
          'contains': req.query.q
        }
      })
    } else {
      categories = await Category.find();
    }
    res.view('pages/category/index', { categories: categories });
  },


  editOne: async function (req, res) {
    sails.log.debug("Edit single category....")
    let category = await Category.findOne({ id: req.params.id })
    res.view('pages/category/edit', { category: category });
  },

  updateOne: async function (req, res) {
    sails.log.debug("Update single category....")
    let category = await Category.updateOne({ id: req.params.id }).set(req.body);
    res.redirect('/category/' + req.params.id);
  },


  destroyOne: async function (req, res) {
    sails.log.debug("Destroy single category....")
    await Category.destroyOne({ id: req.params.id });
    res.redirect('/category');
  },


};