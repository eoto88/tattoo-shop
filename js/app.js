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
        client = { "name": ""};
    } else {
        client = await callApi('clients/' + id + '?_embed=depots');
    }
    
    let modal = document.getElementById("tsmsModal");
    let modalBody = modal.querySelector('.modal-body');
    let name = modalBody.querySelector('.name');
    let nameInput = modal.querySelector('.name-input');

    name.innerHTML = client.name;
    if (client.name == "") {
        nameInput.style.display = "block";
    } else {
        nameInput.style.display = "none";
    }

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