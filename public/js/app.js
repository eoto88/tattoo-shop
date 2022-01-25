"use strict";

import {ModalLogin} from './modal-login.js';
import {ModalClient} from './modal-client.js';
import {List} from './list.js';
import {easterEgg} from './utility.js';
import {Auth} from "./auth.js";

let tsms = {};
tsms.list = undefined;
tsms.modalClient = undefined;

window.tattooShop = window.tattooShop || {};
window.tattooShop.version = '0.1.3'

function docReady(fn) {
    // see if DOM is already available
    if (document.readyState === "complete" || document.readyState === "interactive") {
        // call on next available tick
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }

    tsms.list = new List({
        'onItemClick': openModal
    });
    tsms.modalClient = new ModalClient({
        'onClose': updateList
    });

    document.getElementById('version').innerHTML = window.tattooShop.version;
}

docReady(async function () {
    let search = document.getElementById("search");
    const listOf = document.getElementById('listOf');
    let filtre = document.getElementById('filtrer');
    const btnAddClient = document.getElementById("create-client");
    const logoutBtn = document.getElementById('logout')
    const modalLogin = new ModalLogin({
        'onLogin': function() {
            modalLogin.close();
            updateList();
        }
    })

    if( ! Auth.isAuthenticated()) {
        modalLogin.open();
    }

    logoutBtn.onclick = function() {
        Auth.logout();
        modalLogin.open();
        tsms.list.emptyList();
    }

    btnAddClient.onclick = function () {
        tsms.modalClient.open('new');
    }

    search.onkeyup = async function (event) {
        let query = event.target.value;
        if (query.toUpperCase() === "Jésus".toUpperCase()) {
            // Jésus ? Easter egg time!
            easterEgg();
        }
        if (query.length > 0) {
            tsms.list.updateList(query);
        } else {
            updateList();
        }
    }

    listOf.onchange = function () {
        updateList();
    };

    filtre.onchange = function () {
        updateList();
    };

    updateList();
});

function updateList() {
    if(Auth.isAuthenticated()) {
        // TODO add query
        tsms.list.updateList();
    }
}

function openModal(id) {
    if (tsms.list.listOf == 'clients') {
        tsms.modalClient.open(id);
    } else {
        tsms.modalClient.open(id);
    }
}
