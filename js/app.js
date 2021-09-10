"use strict";

import { ModalClient } from './modal.js';
import { ListClients } from './list.js';
import { easterEgg } from './utility.js'

let tsms = {};
tsms.listClients = undefined;
tsms.modalClient = undefined;

function docReady(fn) {
  // see if DOM is already available
  if (document.readyState === "complete" || document.readyState === "interactive") {
    // call on next available tick
    setTimeout(fn, 1);
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }

  tsms.listClients = new ListClients({
    'onItemClick': openModal
  });
  tsms.modalClient = new ModalClient({
    'onclose': updateList
  });
}

docReady(async function () {
  let search = document.getElementById("search");
  const btnAddClient = document.getElementById("create-client");

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
      tsms.listClients.updateList('?q=' + query + '&_limit=10');
    } else {
      updateList();
    }
  }

  updateList();
});

function updateList() {
  // TODO add query
  tsms.listClients.updateList('?_limit=10');
}

function openModal(id) {
  tsms.modalClient.open(id);
}