import {axiosAuth as axios} from "../axiosInterceptor.js"
import {mediaConfig} from "../config/mediaTypes.js"

const url = '/api/media-list/'

class MediaListService {
    static async getUserMediaList(id, mediaType = 'ANIME') {
        return new Promise(async (resolve, reject) => {
            try {
                const options = mediaType
                    ? {
                        params: {
                            mediaType: mediaConfig(mediaType).type
                        }
                    }
                    : {}
                const res = await axios.get(`${url}${id}`, options)
                const data = res.data
                resolve(
                    data.map(mediaList => ({
                        ...mediaList,
                        createdAt: new Date(mediaList.createdAt),
                        updatedAt: new Date(mediaList.updatedAt)
                    }))
                )
            } catch(err) {
                reject(err)
            }
        })
    }

    static async getUserMediaListItem(userId, mediaType, mediaId) {
        return new Promise(async (resolve, reject) => {
            try {
                const config = mediaConfig(mediaType)
                const res = await axios.get(`${url}${userId}/${config.type}/${mediaId}`)
                const data = res.data
                resolve(data)
            } catch(err) {
                reject(err)
            }
        })
    }

    static async createMediaListItem(data) {
        try {
            return await axios.post(`${url}`, JSON.stringify(data))
        }
        catch(err) {
            return err.response
        }
    }

    static async updateMediaListItem(userId, mediaType, mediaId, data) {
        try {
            const config = mediaConfig(mediaType)

            return await axios.put(`${url}${userId}/${config.type}/${mediaId}`, JSON.stringify(data))
        }
        catch(err) {
            return err.response
        }
    }

    static async deleteMediaListItem(id) {
        try {
            return await axios.delete(`${url}${id}`)
        }
        catch(err) {
            return err.response
        }
    }

}

export default MediaListService
