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

      let user = await User.findOne({ id: me });

      await sails.sockets.broadcast(sessionid, 'state', { status: 'created', owner: me })
      if (!user) {
        await sails.sockets.broadcast(
          sessionid,
          'participants',
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
        await sails.sockets.broadcast(startedQuiz.sessionId, 'state', { status: 'ended', owner: me });
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

  start: async function (req, res) {

    var sessionid = req.params.sessionid
    var time = 60000;

    var startedQuiz = await StartedQuiz.findOne({ sessionId: sessionid })
    await sails.sockets.broadcast(sessionid, 'state', { status: 'started', owner: req.me.id });
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

  next: async function (req, res) {

    var sessionid = req.params.sessionid
    var time = 10000;

    var startedQuiz = await StartedQuiz.findOne({ sessionId: sessionid });
    var questions = await Question.find({ quiz: startedQuiz.quiz }).sort('id ASC').populate('answers');

    var nextQustion = startedQuiz.currentQuestion;

    if (nextQustion + 1 > questions.length) {
      nextQustion = 0
      await sails.sockets.broadcast(sessionid, 'state', { status: 'ended', owner: req.me.id })
      await Participant.update({ sessionId: sessionid })
        .set(
          { score: 0 }
        )
    } else {
      nextQustion++
    }

    if (nextQustion === 1) {
      await sails.sockets.broadcast(sessionid, 'state', { status: 'created', owner: req.me.id })
    }

    await sails.sockets.broadcast(
      sessionid,
      'nextQuestion',
      { time: time, question: questions[nextQustion] }
    );

    await StartedQuiz.updateOne({ sessionId: sessionid })
      .set({ currentQuestion: nextQustion })

    setTimeout(
      async function () {
        var participants = await Participant
          .find({ sessionId: sessionid })
          .populate('user');

        sails.sockets.broadcast(
          sessionid,
          'participants',
          participants.map(participant => {
            return {
              participant: participant.user.fullName,
              score: participant.score
            }
          })
        );
      },
      time
    )
  },

  join: async function (req, res) {

    if (!req.isSocket) {
      return res.badRequest();
    }

    let userid = req.me.id
    let sessionid = req.params.sessionid
    let participant = await Participant.findOne({ id: userid });

    if (!participant) {
      sails.log.debug("adding user to session " + userid)
      participant = await Participant.create(
        {
          sessionId: sessionid,
          user: userid
        }
      );
    } else {
      sails.log.debug("User is already in a session!")
      sails.log.debug("changing session for user with id " + userid)

      // leaving old session since a user can only join one session at a time
      let participants = await Participant.find({ sessionId: participant.sessionId }).populate("user");

      await sails.sockets.broadcast(
        sessionid,
        'participants',
        participants.map(participant => {
          return {
            participant: participant.user.fullName,
            score: participant.score
          }
        }));

      await sails.sockets.leave(req.socket, participant.sessionId);
      await sails.sockets.join(req.socket, sessionid);

      await Participant.updateOne({ user: userid })
        .set(
          {
            sessionId: sessionid
          }
        );
    }

    let participants = await Participant.find({ sessionId: sessionid }).populate("user");

    await sails.sockets.broadcast(
      sessionid,
      'participants',
      participants.map(participant => {
        return {
          participant: participant.user.fullName,
          score: participant.score
        }
      }));

    let startedQuiz = await StartedQuiz.findOne({ sessionId: sessionid });

    return res.json({ isOwner: userid === startedQuiz.startedBy });
  },

  leave: async function (req, res) {

    if (!req.isSocket) {
      return res.badRequest();
    }

    await sails.sockets.leave(req.socket, participant.sessionId);
    await Participant.destroy({ user: req.me.id });

    let participants = Participant.find({ sessionId: sessionid }).populate("user");

    await sails.sockets.broadcast(
      sessionid,
      'participants',
      participants.map(participant => {
        return {
          participant: participant.user.fullName,
          score: participant.score
        }
      }));
  },

  finish: async function (req, res) {
    if (!req.isSocket) {
      return res.badRequest();
    }

    var me = req.me.id
    var sessionid = req.params.sessionid

    var startedQuiz = await StartedQuiz.findOne({ sessionId: sessionid });
    var isOwner = startedQuiz.startedBy === me

    if (!isOwner) {
      return res.unauthorized();
    }

    await sails.sockets.broadcast(sessionid, 'state', { status: 'ended', owner: me })
    await sails.sockets.leaveAll(sessionid);

    await StartedQuiz.destroyOne({ sessionid: sessionid });
    await Participant.destroy({ sessionid: sessionid })
  },

  answer: async function (req, res) {

    var answerId = req.params.answerid
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
