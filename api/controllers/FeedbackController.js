/* eslint-disable indent */
const Sails = require("sails/lib/app/Sails");
const Feedback = require("../models/Feedback");


module.exports = {
  create: async function (req, res) {
 
    var feedbackData = {
        stars: req.params.stars,
        description: ''
    };

    var createdFeedback = await Feedback.create(feedbackData).fetch()

    
    sails.log.debug("FEEEEEDBACK...." + feedback);
    let quiz = await Quiz.findOne({ id: req.params.id }).populate("category").populate("questions");
    
    res.view('pages/quiz/quiz', { quiz: quiz });
  },

};