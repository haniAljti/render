const Sails = require('sails/lib/app/Sails');
var uuid = require('node-uuid');

/* eslint-disable indent */

module.exports = {

  create: async function (req,res) {
    var socket = req.socket;
    var io = sails.io;

    var id = new Date().getTime();

    var startedQuizData = {
        sessionId: id,
        quiz: req.params.id,
        participants: req.me.id
    };

    let startedQuiz = await StartedQuiz.create(startedQuizData).fetch();

    //socket.join(id);

    res.view('pages/game/view', { game: startedQuiz  });
  },

    show: async function (req,res) {
        let startedQuiz = await StartedQuiz.findOne({ id: req.params.sessionid }).populate("participants");
        
        res.view('pages/game/view', { game: startedQuiz  });
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
