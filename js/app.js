let tsms = {};
tsms.clients = [];
tsms.lastQuery;

function docReady(fn) {
    // see if DOM is already available
    if (document.readyState === "complete" || document.readyState === "interactive") {
        // call on next available tick
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

docReady(async function() {
    let search = document.getElementById("search");
    let createClient = document.getElementById("create-client");

    createClient.onclick = function() {
        createClientDialog();
    }

    search.onkeyup = async function(event) {
        let query = event.target.value;
        if(query.toUpperCase() === "Jésus".toUpperCase()) {
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
  const nameInput = modal.querySelector('.name-input');

  close.onclick = function() {
      modal.style.display = "none";
  }

  const fnCloseNameEdit = function() {
    btnNameInput.style.display = "block"
    nameSpan.style.display = "block"
    nameInput.style.display = "none"
    btnNameSave.style.display = "none";
    btnNameCancel.style.display = "none";
  };

  btnNameInput.onclick = function() {
    btnNameInput.style.display = "none"
    nameSpan.style.display = "none"
    nameInput.style.display = "block"
    btnNameSave.style.display = "inline-block";
    btnNameCancel.style.display = "inline-block";
  }

  btnNameCancel.onclick = function() {
    fnCloseNameEdit();
  }

  btnNameSave.onclick = function() {
    // TODO get id
    // client = await callApi('clients/' + id + '?_embed=depots', 'POST');
    fnCloseNameEdit();
  }
}

function updateClientList() {
    if( Array.isArray(tsms.clients) ) {
        let html = "";
        tsms.clients.forEach(function(client) {
            console.log(client.name);
            html += "<li class=\"list-group-item\"><a href=\"javascript:void(0);\" data-id=\"" + client.id + "\">" + client.name + "</a></li>";
        });
        let listeClients = document.getElementById('liste-clients');
        listeClients.innerHTML = html;

        let links = listeClients.querySelectorAll('a');

        for (let i = 0; i < links.length; i++) {
            links[i].addEventListener("click", async function() {
                const id = links[i].dataset.id;

                clientDialog(id);
            });
        }
    }
}

function createClientDialog() {
    clientDialog(0);
}

async function getNextClientId() {
  if(tsms.lastQuery != '') {
    tsms.clients = await getClients();
  }
  return tsms.clients.length++;
}

async function clientDialog(id) {
    let client
    if(id == 0) {
      const nextId = await getNextClientId();
      client = { "id": nextId, "name": "", "depots": [] };
    } else {
      client = await callApi('clients/' + id + '?_embed=depots');
    }

    setIdField(client.id);
    setNameField(client.name);

    const modal = document.getElementById("tsmsModal");
    const depots = modal.querySelector('.depots');

    let depotsHtml = '';
    client.depots.forEach(function(depot) {
        let etat;
        if( depot.deduit ){
            etat =`<span class="badge bg-primary rounded-pill">Déduit</span>`;
        } else if( depot.perdu ) {
            etat =`<span class="badge bg-primary rounded-pill">Perdu</span>`;
        }
        depotsHtml += `<li class="list-group-item d-flex justify-content-between align-items-start"><div class="ms-2 me-auto"><div>${depot.date}</div>${depot.montant}$</div>${etat}</li>`;
    });
    depots.innerHTML = depotsHtml;

    modal.style.display = "block";
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
  if (clientName == "") {
      nameInput.style.display = "block";
      btnNameInput.style.display = "none"
      btnNameSave.style.display = "inline-block";
      nameSpan.style.display = "block"
  } else {
      nameInput.style.display = "none";
      btnNameInput.style.display = "block"
      nameInput.value = clientName;
      btnNameSave.style.display = "none";
      btnNameCancel.style.display = "none";
  }
}

async function callApi(path, method = 'GET') {
  let response = await fetch("http://api.tsms.tattoo:3000/" + path, {
    method: method,
    mode: 'cors',
    headers: {
        'Access-Control-Allow-Origin':'*'
    }
  });

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