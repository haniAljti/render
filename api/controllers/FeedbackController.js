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

    let quiz = await Quiz.findOne({ id: req.params.id }).populate("category").populate("questions").populate("feedbacks");
    
    let averageStars = 0;
    let count = 0;
    quiz.feedbacks.forEach(feedback => {
      averageStars += feedback.stars;
      count++;
      sails.log.debug("averageStars...." + averageStars);  
      sails.log.debug("count...." + count);  
    });

    averageStars = Math.round(averageStars / count);
    
    sails.log.debug("FEEEEEDBACK...." + averageStars);   

    var quizData = {
      averageStars: averageStars
    };

     

  var updatedQuiz = await Quiz.updateOne({ id: quiz.id }).set(quizData);

    res.view('pages/quiz/quiz', { quiz: quiz });
  },

};