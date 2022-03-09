module.exports = function timestamp(schema) {

    schema.add({
        createdAt: {
            type: Date,
            immutable: true,
            default: () => Date.now(),
        },
        updatedAt: Date
    })

    schema.pre('save', function (next) {
        this.updatedAt = Date.now()
        next()
    })
}