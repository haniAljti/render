/* eslint-disable no-trailing-spaces */
/* eslint-disable indent */
/* eslint-disable eol-last */
module.exports = {
    attributes: {
        sessionId: { type: 'number', required: true },
        quiz: {
            model: 'quiz'
        },
        participants: {
            collection: 'user',
            via: 'startedQuizId',
        }
    }
}