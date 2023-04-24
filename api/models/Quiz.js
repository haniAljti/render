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
      }
    }};