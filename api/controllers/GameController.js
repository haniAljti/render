const Sails = require('sails/lib/app/Sails');

/* eslint-disable indent */

module.exports = {

  create: async function (req, res) {

    if (!req.isSocket) {
      return res.badRequest();
    }

    var quizid = req.params.id;
    var me = req.me.id;

    sails.log.debug("Creating new session for quiz " + quizid);

    var socket = req.socket;

    var time = new Date().getTime() + "";
    var sessionid = Math.floor(100000 + Math.random() * 900000); // generates random 6 digits number

    var startedQuiz = await StartedQuiz.findOne({ startedBy: me })

    if (!startedQuiz) {

      await Participant.create(
        {
          sessionId: sessionid,
          user: me
        }
      );

      await StartedQuiz.create(
        {
          sessionId: sessionid,
          quiz: req.params.id,
          startedBy: me
        }
      );

      let user = User.findOne({ id: me });

      await sails.sockets.broadcast(sessionid, 'state', { status: 'created', isCreator: true })
      if (!user) {
        await sails.sockets.broadcast(
          sessionid,
          'joined',
          {
            name: user.fullName,
            emailAddress: user.emailAddress
          }
        )
      }

    } else {
      if (startedQuiz.quiz === quizid) {
        // no need to start again
      } else {

        // end and replace the last session
        await sails.sockets.broadcast(startedQuiz.sessionId, 'state', { status: 'ended' });
        await sails.sockets.leaveAll(req.socket, startedQuiz.sessionId);

        await Participant.updateOne({ user: me })
          .set({ sessionId: sessionid });

        await StartedQuiz.updateOne({ sessionId: startedQuiz.sessionId })
          .set(
            {
              sessionId: sessionid,
              quiz: quizid
            }
          );
      }
    }

    await sails.sockets.join(socket, sessionid);

    return res.json({ sessionid: sessionid });
  },

  show: async function (req, res) {
    sails.log.debug(req.params.sessionid)
    let startedQuiz = await StartedQuiz.findOne({ sessionId: req.params.sessionid });
    sails.log.debug(startedQuiz)
    let quiz = await Quiz.findOne({ id: startedQuiz.quiz })
    let participants = await Participant.find({ sessionId: req.params.sessionid }).populate("user");
    sails.log.debug(participants)
    res.view('pages/game/view', { quiz: quiz, participants: participants });
  },

  start: async function (req, res) {

    var sessionid = req.params.sessionid
    var time = 60000;

    await sails.sockets.broadcast(sessionid, 'state', { status: 'started' });

    var startedQuiz = await StartedQuiz.findOne({ sessionId: sessionid })
    var questions = await Question.find({ quiz: startedQuiz.quiz }).populate('answers');
    var questionIndex = 0;

    var interval = null

    var broadcastQuestion = async function () {
      if (questionIndex >= questions.length) {
        clearInterval(interval)

        var participants = await Participant
          .find({ sessionId: sessionid })
          .populate('user');

        sails.sockets.broadcast(
          sessionid,
          'scores',
          participants.map(participant => {
            return {
              participant: participant.user.fullName,
              score: participant.score
            }
          })
        );
        questionIndex++

      } else {
        sails.sockets.broadcast(
          sessionid,
          'nextQuestion',
          { time: time, question: questions[questionIndex] }
        );
        questionIndex++
      }
    }

    interval = setInterval(broadcastQuestion, 1000);

  },

  join: async function (req, res) {

    if (!req.isSocket) {
      return res.badRequest();
    }

    let userid = req.me.id
    let sessionid = req.params.sessionid
    let participant = Participant.findOne({ id: userid })
    let user = User.findOne({ id: userid })

    if (!participant) {
      sails.log.debug("adding user to session " + userid)
      await Participant.create(
        {
          sessionId: sessionid,
          user: userid
        }
      );
    } else {
      sails.log.debug("User is already in a session!")
      sails.log.debug("changing session for user with id " + userid)

      // leaving old session since a user can only join one session at a time
      await sails.sockets.broadcast(participant.sessionId, 'left', { user: user });
      await sails.sockets.leave(req.socket, participant.sessionId);
      await sails.sockets.join(req.socket, sessionid);

      await Participant.updateOne({ user: userid })
        .set(
          {
            sessionId: sessionid
          }
        );
    }

    await sails.sockets.broadcast(sessionid, 'joined', { user: user });
  },

  leave: async function (req, res) {

    if (!req.isSocket) {
      return res.badRequest();
    }

    var user = User.findOne({ id: req.me.id })

    await sails.sockets.broadcast(
      sessionid,
      'left',
      {
        name: user.fullName,
        emailAddress: user.emailAddress
      }
    );
    await sails.sockets.leave(req.socket, participant.sessionId);
    await Participant.destroy({ user: req.me.id });

  },

  finish: async function (req, res) {
    if (!req.isSocket) {
      return res.badRequest();
    }

    var me = req.me.id
    var sessionid = req.params.sessionid

    await sails.sockets.broadcast(sessionid, 'state', { status: 'ended', startedBy: me })
    await sails.sockets.leaveAll(sessionid);

    await StartedQuiz.destroyOne({ sessionid: sessionid });
    await Participant.destroy({ sessionid: sessionid })
  },

  answer: async function (req, res) {

    var answerId = req.params.answerId
    var questionId = req.params.questId
    var me = req.me.id

    var answer = await Answer.findOne({ id: answerId });

    if (answer.isCorrect) {

      var participant = await Participant.findOne({ user: me });

      await Participant.updateOne({ user: me })
        .set(
          { score: participant.score + 1 }
        )

    }

  }
};
