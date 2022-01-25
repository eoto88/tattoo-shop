import {callApi} from "./utility.js";

export class Auth {

    static async login(email, password, callback) {
        let response = await callApi('login', 'POST', {
            "email": email,
            "password": password
        })
        if( response.status == 400) {
            localStorage.setItem('isAuthenticated', false)
        } else {
            localStorage.setItem('token', response.accessToken)
            localStorage.setItem('user', JSON.stringify(response.user))
            localStorage.setItem('isAuthenticated', true)
        }

        if(callback) {
            callback(response);
        }
    }

    static isAuthenticated() {
        return localStorage.getItem('isAuthenticated') == "true"
    }

    static getUser() {
        return JSON.parse(localStorage.getItem('user'))
    }

    static getToken() {
        return localStorage.getItem('token')
    }

    static logout() {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.setItem('isAuthenticated', false)
    }
}
