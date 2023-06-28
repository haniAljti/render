const Sails = require('sails/lib/app/Sails');

/* eslint-disable indent */

module.exports = {

  create: async function (req, res) {

    if (!req.isSocket) {
      return res.badRequest();
    }

    if (!req.me) {
      return res.unauthorized();
    }

    var quizid = req.params.id;
    var me = req.me.id;
    var socket = req.socket;
    var sessionid = -1

    var startedQuiz = await StartedQuiz.findOne({ startedBy: me });

    var createQuiz = async function () {

      var generatedSessionid = Math.floor(100000 + Math.random() * 900000);
      sails.log.debug("New session created with id " + generatedSessionid);

      await Participant.create(
        {
          sessionId: generatedSessionid,
          user: me
        }
      );

      await StartedQuiz.create(
        {
          sessionId: generatedSessionid,
          quiz: req.params.id,
          startedBy: me,
          currentQuestion: -1
        }
      );

      await sails.sockets.broadcast(generatedSessionid, 'state', { status: 'created', owner: me });

      return generatedSessionid;
    }

    if (!startedQuiz) {
      await Participant.destroy({ user: me });

      sessionid = await createQuiz();

      sails.log.debug("Game does not exist. Created one with session id: " + sessionid);

    } else {
      sails.log.debug("A game already exists: " + JSON.stringify(startedQuiz));

      if (startedQuiz.quiz != quizid) {
        sails.log.debug("Switching game '" + startedQuiz.sessionId + "' with '" + sessionid + "'");
        // end and replace the last session
        await sails.sockets.broadcast(startedQuiz.sessionId, 'state', { status: 'ended', owner: me });
        await sails.sockets.leave(req.socket, startedQuiz.sessionId);

        await StartedQuiz.destroy({sessionId: startedQuiz.sessionId});
        await Participant.destroy({sessionId: startedQuiz.sessionId});

        sessionid = await createQuiz();
      } else {

        // no need to start again! return old session id
        sessionid = startedQuiz.sessionId;

        sails.log.debug("Game Already exists, no need to create one");

        var participant = await Participant.findOne({ user: me });

        if (!participant) {
          await Participant.create(
            {
              sessionId: sessionid,
              user: me,
              score: 0
            }
          );
        } 
      }
    }

    if (sessionid === -1) {
      sails.log.debug("Failed to create or retrive old session id");
    }

    await sails.sockets.join(socket, sessionid);

    var participants = await Participant.find({ sessionId: sessionid })
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

    return res.json({ sessionid: sessionid });
  },

  start: async function (req, res) {

    var sessionid = req.params.sessionid
    var time = 60000;

    var startedQuiz = await StartedQuiz.findOne({ sessionId: sessionid });
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

    if (!req.isSocket) {
      return res.badRequest();
    }

    if (!req.me) {
      return res.unauthorized();
    }

    var sessionid = req.params.sessionid
    var time = 15000;

    var startedQuiz = await StartedQuiz.findOne({ sessionId: sessionid });
    var questions = await Question.find({ quiz: startedQuiz.quiz }).sort('id ASC').populate('answers');

    var nextQustion = startedQuiz.currentQuestion + 1;

    if (nextQustion > questions.length - 1) {
      return res.badRequest();
    }

    if (nextQustion === 1) {
      await sails.sockets.broadcast(sessionid, 'state', { status: 'created', owner: req.me.id })
    }

    await sails.sockets.broadcast(
      sessionid,
      'nextQuestion',
      { time: time, question: questions[nextQustion] }
    );

    if (nextQustion == questions.length - 1) {
      await sails.sockets.broadcast(sessionid, 'state', { status: 'ended', owner: req.me.id })
    }

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
    );
  },

  join: async function (req, res) {

    if (!req.isSocket) {
      return res.badRequest();
    }

    if (!req.me) {
      return res.unauthorized();
    }

    let userid = req.me.id
    let sessionid = req.params.sessionid
    let participant = await Participant.findOne({ user: userid });

    sails.log.debug("user " + userid + " is joining " + sessionid);

    if (!participant) {
      sails.log.debug("adding user to session " + userid);
      participant = await Participant.create(
        {
          sessionId: sessionid,
          user: userid
        }
      );
    } else {
      sails.log.debug("User is already in a session!");
      sails.log.debug("changing session for user with id " + userid);

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


      await Participant.updateOne({ user: userid })
        .set(
          {
            sessionId: sessionid
          }
        );
    }

    await sails.sockets.join(req.socket, sessionid);

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

  view: async function (req, res) {

    if (!req.isSocket) {
      return res.badRequest();
    }

    if (!req.me) {
      return res.unauthorized();
    }

    let userid = req.me.id
    let sessionid = req.params.sessionid
    let participant = await Participant.findOne({ id: userid });

    if (participant){
      sails.log.debug("User is already in a session!")
      sails.log.debug("changing session for user with id " + userid)

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
    }
    let startedQuiz = await StartedQuiz.findOne({ sessionId: sessionid });

    return res.json({ isOwner: userid === startedQuiz.startedBy });
  },

  leave: async function (req, res) {

    if (!req.isSocket) {
      return res.badRequest();
    }

    if (!req.me) {
      return res.unauthorized();
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

    if (!req.me) {
      return res.unauthorized();
    }

    var me = req.me.id
    var sessionid = req.params.sessionid
    sails.log.debug(req.params);

    var startedQuiz = await StartedQuiz.findOne({ sessionId: sessionid });

    var isOwner = startedQuiz.startedBy == me

    if (!isOwner) {
      return res.forbidden();
    }

    await sails.sockets.broadcast(sessionid, 'state', { status: 'ended', owner: me });
    await sails.sockets.leaveAll(sessionid);

    await StartedQuiz.destroyOne({ sessionId: sessionid });
    await Participant.destroy({ sessionId: sessionid });
  },

  answer: async function (req, res) {

    if (!req.isSocket) {
      return res.badRequest();
    }

    if (!req.me) {
      return res.unauthorized();
    }

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
