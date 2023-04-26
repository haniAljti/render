/* eslint-disable eol-last */
module.exports = {
  attributes: {
    name: { type: 'string', required: true },
    isPremium: { type: 'boolean', required: false},
    birthday: {  type: 'ref', columnType: 'datetime' },
    note: { type: 'string', required: false },
    passwordHash: { type: 'string', required: false },
  }};