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
    let modal = document.getElementById("tsmsModal");
    let close = modal.querySelector(".close");
    let search = document.getElementById("search");
    let createClient = document.getElementById("create-client");
    let clients = await callApi('clients');

    close.onclick = function() {
        modal.style.display = "none";
    }

    createClient.onclick = function() {
        createClientDialog();
    }

    search.onkeyup = async function(event) {
        let query = event.target.value;
        if(query.toUpperCase() === "Jésus".toUpperCase()) {
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
        if (query.length > 0) {
            clients = await callApi('clients?q=' + query)
            updateClientList(clients);
        } else {
            clients = await callApi('clients');
            updateClientList(clients);
        } 
    }

    updateClientList(clients);
});

function updateClientList(clients) {
    if( Array.isArray(clients) ) {
        let html = "";
        clients.forEach(function(client) {
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

async function clientDialog(id) {
    let client
    if(id == 0) {
        client = { "name": "", "depots": [] };
    } else {
        client = await callApi('clients/' + id + '?_embed=depots');
    }
    
    let modal = document.getElementById("tsmsModal");
    let modalBody = modal.querySelector('.modal-body');
    let name = modalBody.querySelector('.name');
    let nameInput = modal.querySelector('.name-input');
    let depots = modal.querySelector('.depots');

    name.innerHTML = client.name;
    if (client.name == "") {
        nameInput.style.display = "block";
    } else {
        nameInput.style.display = "none";
    }

    let depotsHtml = '';
    client.depots.forEach(function(depot) {
        depotsHtml += "<li class=\"list-group-item\">"+ depot.montant +"</li>"
    });
    depots.innerHTML = depotsHtml;

    modal.style.display = "block";
}

async function callApi(path) {
    let response = await fetch("http://api.tsms.tattoo:3000/" + path,{
        mode: 'cors',
        headers: {
            'Access-Control-Allow-Origin':'*'
        }
    });

    if (!response.ok) {
        throw new Error(`Erreur HTTP ! statut : ${response.status}`);
    }

    return response.json();
}