import {axiosAuth as axios} from "../axiosInterceptor.js"

const url = '/api/'

class UserService {
    // Get users
    static async getUsers() {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.get(`${url}user`)
                const data = res.data
                resolve(
                    data.map(users => ({
                        ...users,
                        createdAt: new Date(users.createdAt),
                        updatedAt: new Date(users.updatedAt)
                    }))
                )
            } catch(err) {
                reject(err.response)
            }
        })
    }

    // Get User by Id
    static async getUser(id) {
        try {
            return await axios.get(`${url}user/${id}`)
        } catch(err) {
          return err.response
        }
    }

    // Get User by Username
    static async getUserByUsername(username) {
        try {
            return await axios.get(`${url}user/username/${username}`)
        } catch(err) {
            return err.response
        }
    }

    // Register
    static async registerUser(data) {
        try {
            return await axios.post(`${url}register`, data)
        } catch(err) {
            return err.response
        }
    }

    // Login
    static async loginUser(data) {
        try {
             return await axios.post(`${url}login`, data)
        } catch(err) {
            return err.response
        }
    }

    // logout
    static async logoutUser(data) {
        try {
            return await axios.post(`${url}logout`, data)
        } catch(err) {
            return err.response
        }
    }

    // update user
    static async updateUser(id, data) {
        try {
            return await axios.put(`${url}user/${id}`, JSON.stringify(data))
        } catch (err) {
            return err
        }
    }
}

export default UserService
