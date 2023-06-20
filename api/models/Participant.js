module.exports = {
    attributes: {
        sessionId: {
            model: 'startedQuiz',
            unique: false,
            required: true
        },
        user: {
            model: 'user',
            unique: true,
            required: true
        },
        score: { type: 'number', defaultsTo: 0 } 
    }
}