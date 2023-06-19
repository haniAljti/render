
/* eslint-disable indent */
const Sails = require("sails/lib/app/Sails");


module.exports = {

    new: async function (req, res) {
        let categories = await Category.find();
        res.view('pages/quiz/new', { categories: categories });
    },

    create: async function (req, res) {
        sails.log.debug("Create new quiz....")
        await Quiz.create(req.allParams());
    },

    findOne: async function (req, res) {
        sails.log.debug("List single quiz....")
        let quiz = await Quiz.findOne({ id: req.params.id }).populate("category").populate("questions").populate("feedbacks");
        sails.log.debug(JSON.stringify(quiz.feedbacks));
        res.view('pages/quiz/quiz', { quiz: quiz });
    },

    find: async function (req, res) {
        sails.log.debug("List all quiz....")
        let quizes = await Quiz.find();
        res.view('pages/quiz/index', { quizes: quizes });
    },


    editOne: async function (req, res) {
        sails.log.debug("Edit single quiz....")
        let quiz = await Quiz.findOne({ id: req.params.id })
        let categories = await Category.find();
        res.view('pages/quiz/edit', { quiz: quiz, categories: categories });
    },

    updateOne: async function (req, res) {
        sails.log.debug("Update single quiz....")
        let quiz = await Quiz.updateOne({ id: req.params.id }).set(req.body);
        res.redirect('/quiz/' + req.params.id);
    },


    destroyOne: async function (req, res) {
        sails.log.debug("Destroy single quiz....")
        await Quiz.destroyOne({ id: req.params.id });
        res.redirect('/quiz');
    },


};