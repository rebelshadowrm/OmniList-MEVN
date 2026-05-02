const MediaListItemModel = require('../models/mediaListItem')

function ratingKeyForEntity(entityRef) {
    return entityRef?.key ?? null
}

function emptyCommunityRating() {
    return {
        average: null,
        count: 0,
        scale: 10,
        source: 'OMNILIST',
    }
}

async function communityRatingsForEntityRefs(entityRefs = []) {
    const keys = [...new Set(entityRefs.map(ratingKeyForEntity).filter(Boolean))]

    if (!keys.length) {
        return new Map()
    }

    const results = await MediaListItemModel.aggregate([
        {
            $match: {
                'entityRef.key': {$in: keys},
                rating: {$gte: 1},
            },
        },
        {
            $group: {
                _id: '$entityRef.key',
                average: {$avg: '$rating'},
                count: {$sum: 1},
            },
        },
    ])

    return new Map(results.map(result => [
        result._id,
        {
            average: result.average,
            count: result.count,
            scale: 10,
            source: 'OMNILIST',
        },
    ]))
}

async function communityRatingForEntityRef(entityRef) {
    const ratings = await communityRatingsForEntityRefs([entityRef])

    return ratings.get(ratingKeyForEntity(entityRef)) ?? emptyCommunityRating()
}

module.exports = {
    communityRatingForEntityRef,
    communityRatingsForEntityRefs,
    emptyCommunityRating,
    ratingKeyForEntity,
}
