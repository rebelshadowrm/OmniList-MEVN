import {axiosAuth as axios} from "../axiosInterceptor.js"

const url = '/api/anime/'

class AnimeService {

    // get anime list by user id
    static async getUserAnimeList(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.get(`${url}${id}`)
                const data = res.data
                resolve(
                    data.map(animeList => ({
                        ...animeList,
                        createdAt: new Date(animeList.createdAt),
                        updatedAt: new Date(animeList.updatedAt)
                    }))
                )
            } catch(err) {
                reject(err)
            }
        })
    }

    // get specific list item by anime id
    static async getUserAnimeListItem(userId, animeId) {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.get(`${url}${userId}/${animeId}`)
                const data = res.data
                resolve(data)
            } catch(err) {
                reject(err)
            }
        })
    }

    // create anime list item
    static async createAnimeListItem(data) {
        try {
            return await axios.post(`${url}`, JSON.stringify(data))
        }
        catch(err) {
            return err.response
        }
    }


    // update anime list item
    static async updateAnimeListItem(userId, animeId, data) {
        try {
            return await axios.put(`${url}${userId}/${animeId}`, JSON.stringify(data))
        }
        catch(err) {
            return err.response
        }
    }


    // delete anime list item
    static async deleteAnimeListItem(id) {
        try {
            return await axios.delete(`${url}${id}`)
        }
        catch(err) {
            return err.response
        }
    }


}

export default AnimeService
