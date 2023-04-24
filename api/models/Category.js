/* eslint-disable no-trailing-spaces */
/* eslint-disable indent */
/* eslint-disable eol-last */
module.exports = {
    attributes: {
        name: { type: 'string', required: true },
        description: { type: 'string', required: true },
        parentCategory: {
            model: 'category'
        },
        subCategory: {
            collection: 'category',
            via: 'parentCategory'
        }
    }};