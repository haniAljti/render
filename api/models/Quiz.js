/* eslint-disable no-trailing-spaces */
/* eslint-disable indent */
/* eslint-disable eol-last */
module.exports = {
    attributes: {
      userId: { type: 'string', required: true },
      feedback: {
        model: 'feedback'
      },
      category: {
        model: 'category'
      }
    }};