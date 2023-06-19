module.exports = {
    attributes: {
        sessionId: {
            model: 'startedQuiz',
            unique: true
        },
        user: {
            model: 'user',
            unique: true
        },
        score: { type: 'number', defaultsTo: 0 } 
    }
}