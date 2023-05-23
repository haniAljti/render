module.exports = {
    attributes: {
        sessionId: {
            model: 'startedQuiz'
        },
        user: {
            model: 'user'
        },
        score: { type: 'number', defaultsTo: 0 } 
    }
}