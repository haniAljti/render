/* eslint-disable no-trailing-spaces */
/* eslint-disable indent */
/* eslint-disable eol-last */
module.exports = {
    attributes: {
        question: { type: 'string', required: true },
        title: { type: 'string', required: true },
        answers: {
            collection: 'answer',
            via: 'questId'
        },
        quiz: {
            model: 'quiz'
        }
    }
}