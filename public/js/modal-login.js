import { Modal } from './modal.js'
import { callApi } from './utility.js'
import {Auth} from "./auth.js";

export class ModalLogin extends Modal {
    constructor(options) {
        super(document.getElementById('tsmsLoginModel'), options);

        if (typeof options.onLogin  === "function") {
            this.onLogin = options.onLogin;
        }
    }

    listeners() {
        const loginBtn = this.element.querySelector('.btn-login')

        loginBtn.addEventListener('click', this.login.bind(this))

        super.listeners()
    }

    async login() {
        const inputLoginEmail = document.getElementById('loginEmail')
        const inputLoginPassword = document.getElementById('loginPassword')
        const loginAlert = this.element.querySelector('.alert')

        const me = this;
        await Auth.login(inputLoginEmail.value, inputLoginPassword.value, function(response) {
            if( response.status == 400) {
                loginAlert.classList.remove('d-none');
                return;
            } else {
                loginAlert.classList.add('d-none');
            }

            if (me.onLogin) {
                me.onLogin();
            }
        });
    }
}
