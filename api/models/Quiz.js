/* eslint-disable no-trailing-spaces */
/* eslint-disable indent */
/* eslint-disable eol-last */
module.exports = {
  attributes: {
    userId: { type: 'string', required: false },
    name: {
      type: 'string',
      required: true
    },
    description: {
      type: 'string',
      required: false
    },
    category: {
      model: 'category'
    },
    questions: {
      collection: 'question',
      via: 'quiz'
    },
    feedbacks: {
      collection: 'feedback',
      via: 'quiz'
    },
    averageStars: {
      type: 'number',
      required: false
    },
  }
};