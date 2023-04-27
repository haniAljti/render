/* eslint-disable indent */
const Sails = require("sails/lib/app/Sails");

module.exports = {
  create: async function (req, res) {
 
    var feedbackData = {
        stars: req.params.stars,
        description: '',
        quiz: req.params.id
    };

    var createdFeedback = await Feedback.create(feedbackData).fetch();

    
    sails.log.debug("FEEEEEDBACK...." + createdFeedback);
    let quiz = await Quiz.findOne({ id: req.params.id }).populate("category").populate("questions").populate("feedbacks");
    
    sails.log.debug(JSON.stringify(quiz.feedbacks));

    res.view('pages/quiz/quiz', { quiz: quiz });
  },

};