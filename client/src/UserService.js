import axios from "axios"

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
                reject(err)
            }
        })
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
}

export default UserService
