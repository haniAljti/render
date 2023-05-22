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
    var sessionid = time.slice(-6);

    var startedQuiz = await StartedQuiz.findOne({ startedBy: me })

    if (!startedQuiz) {

      await Participant.create(
        {
          sessionId: sessionid,
          user: req.me.id
        }
      );

      await StartedQuiz.create(
        {
          sessionId: sessionid,
          quiz: req.params.id,
          startedBy: me
        }
      );

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
    await sails.sockets.broadcast(req.params.sessionid, 'state', { status: 'started' });

    let user = await User.findOne({ id: 1 });

    setInterval(
      function () {
        sails.sockets.broadcast(
          req.params.sessionid, 
          'joined',
          {
            name: user.fullName,
            emailAddress: user.emailAddress
          }
          );
      },
      5000
    );

    setTimeout(function () {
      sails.sockets.broadcast(req.params.sessionid, 'state', { status: 'ended' });
    }, 3000);
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

  /*
  

  leave: async function (req,res) {

  },

  finish: async function (req,res) {

  }*/
};
