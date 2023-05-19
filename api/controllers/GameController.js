const Sails = require('sails/lib/app/Sails');

/* eslint-disable indent */

module.exports = {

  create: async function (req, res) {
    var socket = req.socket;
    var io = sails.io;

    var id = new Date().getTime();

    var startedQuizData = {
      sessionId: id,
      quiz: req.params.id,
    };

    await Participant.create(
      {
        sessionId: id,
        user: req.me.id
      }
    )

    let startedQuiz = await StartedQuiz.create(startedQuizData).fetch();

    await sails.sockets.join(socket, id);

    res.redirect('/quiz/game/' + req.params.id);;
  },

  show: async function (req, res) {
    sails.log.debug(req.params.sessionid)
    let startedQuiz = await StartedQuiz.findOne({ sessionId: req.params.sessionid });
    sails.log.debug(startedQuiz)
    let quiz = await Quiz.findOne({ id: startedQuiz.quiz })
    let participants = await Participant.find({ sessionId: req.params.sessionid }).populate("user");
 
    res.view('pages/game/view', { quiz: quiz, participants: participants });
  },

  /*
  join: async function (req,res) {

  },

  leave: async function (req,res) {

  },

  start: async function (req,res) {

  },

  finish: async function (req,res) {

  }*/
};
