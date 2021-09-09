import { ModalClient } from './modal.js';
import { List } from './list.js';
import { easterEgg } from './utility.js'

let tsms = {};
tsms.clients = [];
tsms.lastQuery = undefined;

function docReady(fn) {
  // see if DOM is already available
  if (document.readyState === "complete" || document.readyState === "interactive") {
    // call on next available tick
    setTimeout(fn, 1);
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }

  new ModalClient();
}

docReady(async function () {
  let search = document.getElementById("search");
  const btnAddClient = document.getElementById("create-client");

  btnAddClient.onclick = function () {
    ModalClient.open('new');
  }

  search.onkeyup = async function (event) {
    let query = event.target.value;
    if (query.toUpperCase() === "Jésus".toUpperCase()) {
      // Jésus ? Easter egg time!
      easterEgg();
    }
    if (query.length > 0) {
      List.updateList('?q=' + query + '&_limit=10');
    } else {
      List.updateList('?_limit=10');
    }
  }

  List.updateList('?_limit=10');

});

async function getNextClientId() {
  if (tsms.lastQuery != '') {
    tsms.clients = await getClients();
  }
  return tsms.clients.length + 1;
}