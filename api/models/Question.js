module.exports = {
    attributes: {
        text: { type: 'string', required: true },
        answers: {
            collection: 'answer',
            via: 'questId'
        }
    }
}