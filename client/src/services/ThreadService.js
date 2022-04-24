import {axiosAuth as axios} from "../axiosInterceptor.js"

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

    // get Threads by Anime ID
    static async getDiscussionsByAnime(id) {
        return this.getThreadByAnime('discussions', id)
    }
    static async getReviewsByAnime(id) {
        return this.getThreadByAnime('reviews', id)
    }
    static async getThreadByAnime(type, id) {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.get(`${url}${type}/anime/${id}`)
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

    // get Threads by User ID
    static async getDiscussionsByUser(id) {
        return this.getThreadByUser('discussions', id)
    }
    static async getReviewsByUser(id) {
        return this.getThreadByUser('reviews', id)
    }
    static async getThreadByUser(type, id) {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.get(`${url}${type}/user/${id}`)
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

    // update Thread
    static async updateDiscussion(id, data) {
        try {
            return await axios.put(`${url}discussions/${id}`, JSON.stringify(data))
        }
        catch(err) {
            return err.response
        }
    }
    static async updateReview(id, data) {
        try {
            return await axios.put(`${url}reviews/${id}`, JSON.stringify(data))
        }
        catch(err) {
            return err.response
        }
    }

    // delete Thread
    static async deleteDiscussionById(id) {
        try {
            return await axios.delete(`${url}discussions/${id}`)
        }
        catch(err) {
            return err.response
        }
    }
    static async deleteReviewById(id) {
        try {
            return await axios.delete(`${url}reviews/${id}`)
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

    // update Comment
    static async updateDiscussionComment(data) {
        try {
            return await axios.put(`${url}discussions/comment/update`, JSON.stringify(data))
        }
        catch(err) {
            return err.response
        }
    }
    static async updateReviewComment(data) {
        try {
            return await axios.put(`${url}reviews/comment/update`, JSON.stringify(data))
        }
        catch(err) {
            return err.response
        }
    }

    // delete Comment
    static async deleteDiscussionComment(data) {
        try {
            return await axios.delete(`${url}discussions/comment/delete`, {
                data: JSON.stringify(data)
            })
        }
        catch(err) {
            return err.response
        }
    }
    static async deleteReviewComment(data) {
        try {
            return await axios.delete(`${url}reviews/comment/delete`, {
                data: JSON.stringify(data)
            })
        }
        catch(err) {
            return err.response
        }
    }

}

export default ThreadService
