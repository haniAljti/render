/* eslint-disable no-trailing-spaces */
/* eslint-disable indent */
/* eslint-disable eol-last */
module.exports = {
    attributes: {
        text: { type: 'string', required: true },
        answers: {
            collection: 'answer',
            via: 'questId'
        }
    }
}