/* eslint-disable no-trailing-spaces */
/* eslint-disable indent */
/* eslint-disable eol-last */
module.exports = {
    attributes: {
        description: { type: 'string', required: false },
        stars: { type: 'number', required: true },
        quiz: {
            model: 'quiz'
        }
    }
}