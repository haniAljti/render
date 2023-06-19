
/* eslint-disable indent */
const Sails = require("sails/lib/app/Sails");


module.exports = {

    new: async function (req, res) {
        sails.log.debug("Create new question....")
        let quiz = await Quiz.findOne({ id: req.params.id })
        res.view('pages/question/new', { quiz: quiz });
    },

    create: async function (req, res) {
        sails.log.debug("Create new question....")

        var questionData = {
            title: req.body.title,
            question: req.body.question,
            quiz: req.params.id
        };

        var createdQuestion = await Question.create(questionData).fetch()

        // Create the Question record

        sails.log.debug("question created with id " + createdQuestion.id)

        // Create the Answer records
        var answersData = req.body.answers.map(function (answer) {
            return {
                text: answer.text,
                isCorrect: answer.isCorrect,
                questId: createdQuestion.id
            };
        });

        await Answer.createEach(answersData);
        return res.ok();
    },

    findOne: async function (req, res) {
        sails.log.debug("List single question....")
        let question = await Question.findOne({ id: req.params.id }).populate("answers");
        res.view('pages/question/question', { question: question });
    },

    editOne: async function (req, res) {
        sails.log.debug("Edit single question....")
        let question = await Question.findOne({ id: req.params.id }).populate("quiz").populate("answers");
        res.view('pages/question/edit', { question: question });
    },

    updateOne: async function (req, res) {
        sails.log.debug("Update single question....")

        var questionData = {
            title: req.body.title,
            question: req.body.question,
            quiz: req.params.id
        };

        var updatedQuestion = await Question.updateOne({ id: req.params.id }).set(questionData)

        // Destroy All Answers
        await Answer.destroy({ questId: updatedQuestion.id })

        // Recreate the Answer records
        var answersData = req.body.answers.map(function (answer) {
            return {
                text: answer.text,
                isCorrect: answer.isCorrect,
                questId: updatedQuestion.id
            };
        });

        await Answer.createEach(answersData)

        res.redirect('/question/' + req.params.id);
    },

    destroyOne: async function (req, res) {
        sails.log.debug("Destroy single question....")
        await Question.destroyOne({ id: req.params.id });
        res.redirect('/question');
    },


};