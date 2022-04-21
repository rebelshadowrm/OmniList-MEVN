import {axiosAuth as axios} from "./axiosInterceptor.js"

const url = '/api/'

class ThreadService {

    // get Threads
    static async getDiscussions() {
        return await this.getThread('discussions')
    }
    static async getReviews() {
        return await this.getThread('reviews')
    }
    static async getThread(type) {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.get(`${url}${type}`)
                const data = res.data
                resolve(
                    data.map(threads => ({
                        ...threads,
                        createdAt: new Date(threads.createdAt),
                        updatedAt: new Date(threads.updatedAt)
                    }))
                )
            } catch(err) {
                reject(err)
            }
        })
    }

    // get Threads by ID
    static async getDiscussionsById(id) {
        return await this.getThreadById('discussions', id)
    }
    static async getReviewsById(id) {
        return await this.getThreadById('reviews', id)
    }
    static async getThreadById(type, id) {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.get(`${url}${type}/${id}`)
                const data = res.data
                data.createdAt = new Date(data.createdAt)
                data.updatedAt = new Date(data.updatedAt)
                resolve(data)
            } catch(err) {
                reject(err)
            }
        })
    }

    // create Thread
    static async createDiscussion(data) {
        try {
            return await axios.post(`${url}discussions`, JSON.stringify(data))
        }
         catch(err) {
            return err.response
        }
    }
    static async createReview(data) {
        try {
            return await axios.post(`${url}reviews`, JSON.stringify(data))
        }
        catch(err) {
            return err.response
        }
    }

    // create Comment
    static async createDiscussionComment(data) {
        try {
            return await axios.post(`${url}discussions/comment/add`, JSON.stringify(data))
        }
        catch(err) {
            return err.response
        }
    }
    static async createReviewComment(data) {
        try {
            return await axios.post(`${url}reviews/comment/add`, JSON.stringify(data))
        }
        catch(err) {
            return err.response
        }
    }

}

export default ThreadService
