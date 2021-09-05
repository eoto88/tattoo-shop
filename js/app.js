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
}

docReady(async function () {
  let search = document.getElementById("search");
  const btnAddClient = document.getElementById("create-client");

  btnAddClient.onclick = function () {
    createClientDialog();
  }

  search.onkeyup = async function (event) {
    let query = event.target.value;
    if (query.toUpperCase() === "Jésus".toUpperCase()) {
      // Jésus ? Easter egg time!
      easterEgg();
    }
    if (query.length > 0) {
      tsms.clients = await getClients('?q=' + query);
      updateClientList();
    } else {
      tsms.clients = await getClients();
      updateClientList();
    }
  }

  tsms.clients = await getClients();
  updateClientList();

  initModal();
});

async function getClients(query = '') {
  tsms.lastQuery = query;
  return await callApi('clients' + query);
}

function initModal() {
  const modal = document.getElementById("tsmsModal");
  const close = modal.querySelector(".close");
  const modalBody = modal.querySelector('.modal-body');
  const nameSpan = modalBody.querySelector('.name');
  const btnNameInput = modalBody.querySelector('.btn-name-input');
  const btnNameSave = modalBody.querySelector('.btn-name-save');
  const btnNameCancel = modalBody.querySelector('.btn-name-cancel');
  const clientIdInput = modalBody.querySelector('#clientId')
  const nameInput = modal.querySelector('.name-input');
  const btnAddDepot = modal.querySelector("#create-depot");

  btnAddDepot.onclick = function () {
    const tblDepots = modalBody.querySelector('table.depots tbody');

    tblDepots.innerHTML = "<tr><td></td><td></td><td></td><td></td><td></td></tr>" + tblDepots.innerHTML;
  }

  close.onclick = function () {
    modal.style.display = "none";
  }

  const fnCloseNameEdit = function () {
    btnNameInput.style.display = "block"
    nameSpan.style.display = "block"
    nameInput.style.display = "none"
    btnNameSave.style.display = "none";
    btnNameCancel.style.display = "none";
  };

  btnNameInput.onclick = function () {
    btnNameInput.style.display = "none"
    nameSpan.style.display = "none"
    nameInput.style.display = "block"
    btnNameSave.style.display = "inline-block";
    btnNameCancel.style.display = "inline-block";
  }

  btnNameCancel.onclick = function () {
    fnCloseNameEdit();
  }

  btnNameSave.onclick = async function () {
    // TODO Adjust is new client
    const nextId = await getNextClientId();

    const id = clientIdInput.value;
    const name = nameInput.value;
    const client = { "id": id, "name": name };
    let response = await callApi('clients/' + id, 'PUT', client);
    nameSpan.innerHTML = name;
    const listeClients = document.getElementById('liste-clients');
    const listClientLink = listeClients.querySelector("[data-id='" + id + "']");
    listClientLink.innerHTML = name;
    fnCloseNameEdit();
  }
}

function updateClientList() {
  if (Array.isArray(tsms.clients)) {
    let html = "";
    tsms.clients.forEach(function (client) {
      console.log(client.name);
      html += `<li class="list-group-item"><h5 class="my-1"><a href="javascript:void(0);" data-id="${client.id}">${client.name}</a></h5></li>`;
    });
    const listeClients = document.getElementById('liste-clients');
    listeClients.innerHTML = html;

    let links = listeClients.querySelectorAll('a');

    for (let i = 0; i < links.length; i++) {
      links[i].addEventListener("click", async function () {
        const id = links[i].dataset.id;

        clientDialog(id);
      });
    }
  }
}

function createClientDialog() {
  clientDialog('new');
}

async function getNextClientId() {
  if (tsms.lastQuery != '') {
    tsms.clients = await getClients();
  }
  return tsms.clients.length++;
}

async function clientDialog(id) {
  let client
  if (id == 'new') {
    client = { "id": id, "name": "", "depots": [] };
  } else {
    client = await callApi('clients/' + id);
    client.depots = await callApi('depots?clientId=' + id + '&_sort=dateDepot&_order=desc');
  }

  setIdField(client.id);
  setNameField(client.name);

  const modal = document.getElementById("tsmsModal");
  const depots = modal.querySelector('.depots tbody');

  let depotsHtml = '';
  client.depots.forEach(function (depot) {
    let etat;
    if (depot.deduit) {
      etat = `<span class="badge bg-primary rounded-pill">Déduit</span>`;
    } else if (depot.perdu) {
      etat = `<span class="badge bg-primary rounded-pill">Perdu</span>`;
    } else {
      etat = `<span class="badge bg-warning text-dark rounded-pill">En attente</span>`;
    }
    const btnEditHtml = `<button class="btn-edit-depot btn btn-outline-primary" title="Modifier"><i class="bi bi-pencil"></i></button>`;
    const btnDeleteHtml = `<button class="btn-delete-depot btn btn-outline-primary" title="Supprimer"><i class="bi bi-trash"></i></button>`;
    const btnSaveHtml = `<button class="d-none btn-save-depot btn btn-outline-primary" title="Sauvegarder"><i class="bi bi-save"></i></button>`;
    const btnCancelHtml = `<button class="d-none btn-cancel-depot btn btn-outline-primary" title="Annuler"><i class="bi bi-x-lg"></i></button>`;
    const btnGroup = `<div class="btn-group" role="group">${btnEditHtml}${btnDeleteHtml}${btnSaveHtml}${btnCancelHtml}</div>`;
    depotsHtml += `<tr><td class="dateDepot">${depot.dateDepot}</td><td class="montant">${depot.montant}</td><td class="etat">${etat}</td><td class="dateEtat">${depot.dateEtat}</td><td class="actions">${btnGroup}</td></tr>`;
  });
  depots.innerHTML = depotsHtml;

  const editDepotBtns = depots.querySelectorAll('.btn-edit-depot');
  for (i = 0; i < editDepotBtns.length; i++) {
    editDepotBtns[i].addEventListener('click', function () {
      editRowDepot(this.closest('tr'));
    });
  }

  modal.style.display = "block";
}

function hide() {
  for (var i = 0; i < arguments.length; i++) {
    arguments[i].classList.add('d-none');
  }
}

function show() {
  for (var i = 0; i < arguments.length; i++) {
    arguments[i].classList.remove('d-none');
  }
}

function saveRowDepot(row) {
  let depot = {};
  const cells = row.querySelectorAll('td');
  for (i = 0; i < cells.length; i++) {
    if (cells[i].classList.contains('dateDepot')) {
      depot.dateDepot = cells[i].querySelector('input').value;
    } else if (cells[i].classList.contains('montant')) {
      depot.montant = cells[i].querySelector('input').value;
    }
  }
}

function editRowDepot(row) {
  const cells = row.querySelectorAll('td');
  for (i = 0; i < cells.length; i++) {
    const value = cells[i].innerHTML;
    if (cells[i].classList.contains('montant')) {
      cells[i].innerHTML = `<input type="number" />`;
    } else if (cells[i].classList.contains('etat')) {
      const etat = cells[i].querySelector('.badge').innerHTML;
      // cells[i].innerHTML = `<select><option>En attente</option><option>Déduit</option><option>Perdu</option></select>`;
      cells[i].innerHTML = getSelectEtat(etat);
    } else if (cells[i].classList.contains('actions')) {
      const editBtn = cells[i].querySelector('.btn-edit-depot');
      const deleteBtn = cells[i].querySelector('.btn-delete-depot');
      const saveBtn = cells[i].querySelector('.btn-save-depot');
      const cancelBtn = cells[i].querySelector('.btn-cancel-depot');
      hide(editBtn, deleteBtn);
      show(saveBtn, cancelBtn);
    } else {
      cells[i].innerHTML = `<input type="text" />`;
    }
    const input = cells[i].querySelector('input');
    if (input) {
      input.value = value;
      input.style.width = '100%';
    }
  }
}

function getSelectEtat(etat) {
  let html = '<select>';
  ['En attente', 'Déduit', 'Perdu'].forEach(function (optionValue) {
    let selected = '';
    if (optionValue === etat) {
      selected = ' selected';
    }
    html += `<option${selected}>${optionValue}</option>`;
  });
  html += `</select>`;
  return html;
}

function setIdField(clientId) {
  const idInput = document.getElementById('clientId');
  idInput.value = clientId;
}

function setNameField(clientName) {
  const modal = document.getElementById("tsmsModal");
  const modalBody = modal.querySelector('.modal-body');
  const nameSpan = modalBody.querySelector('.name');
  const btnNameInput = modalBody.querySelector('.btn-name-input');
  const btnNameSave = modalBody.querySelector('.btn-name-save');
  const btnNameCancel = modalBody.querySelector('.btn-name-cancel');
  const nameInput = modal.querySelector('.name-input');

  nameSpan.innerHTML = clientName;
  nameInput.value = clientName;
  if (clientName == "") {
    nameInput.style.display = "block";
    btnNameInput.style.display = "none"
    btnNameSave.style.display = "inline-block";
    nameSpan.style.display = "block"
  } else {
    nameInput.style.display = "none";
    btnNameInput.style.display = "block"
    btnNameSave.style.display = "none";
    btnNameCancel.style.display = "none";
  }
}

async function callApi(path, method = 'GET', payload) {
  let requestOptions = {
    method: method,
    mode: 'cors',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    }
  };
  if (method === 'POST' || method === 'PUT') {
    requestOptions.body = JSON.stringify(payload);
  }
  let response = await fetch("http://api.tsms.tattoo:3000/" + path, requestOptions);

  if (!response.ok) {
    throw new Error(`Erreur HTTP ! statut : ${response.status}`);
  }

  return await response.json();
}

function easterEgg() {
  tsParticles.load("tsparticles", {
    backgroundMask: {
      enable: true,
      cover: {
        value: {
          r: 0,
          g: 0,
          b: 0
        }
      }
    },
    background: {
      image: "url('https://particles.js.org/images/background.jpg')",
      size: "100% 100%",
      repeat: "no-repeat"
    },
    fullScreen: {
      enable: true,
      zIndex: -1
    },
    particles: {
      color: {
        value: ["#1E00FF", "#FF0061", "#E1FF00", "#00FF9E"],
        animation: {
          enable: true,
          speed: 30
        }
      },
      move: {
        direction: "bottom",
        enable: true,
        outModes: {
          default: "out"
        },
        size: true,
        speed: {
          min: 1,
          max: 3
        }
      },
      number: {
        value: 700,
        density: {
          enable: true,
          area: 800
        }
      },
      opacity: {
        value: 1,
        animation: {
          enable: false,
          startValue: "max",
          destroy: "min",
          speed: 0.3,
          sync: true
        }
      },
      rotate: {
        value: {
          min: 0,
          max: 360
        },
        direction: "random",
        move: true,
        animation: {
          enable: true,
          speed: 60
        }
      },
      tilt: {
        direction: "random",
        enable: true,
        move: true,
        value: {
          min: 0,
          max: 360
        },
        animation: {
          enable: true,
          speed: 60
        }
      },
      shape: {
        type: ["circle", "square", "polygon"],
        options: {
          polygon: [
            {
              sides: 5
            },
            {
              sides: 6
            }
          ]
        }
      },
      size: {
        value: {
          min: 3,
          max: 5
        }
      },
      roll: {
        darken: {
          enable: true,
          value: 30
        },
        enlighten: {
          enable: true,
          value: 30
        },
        enable: true,
        speed: {
          min: 15,
          max: 25
        }
      },
      wobble: {
        distance: 30,
        enable: true,
        move: true,
        speed: {
          min: -15,
          max: 15
        }
      }
    }
  });
}