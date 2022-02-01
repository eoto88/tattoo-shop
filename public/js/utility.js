import {Auth} from "./auth.js";

export function hide() {
    for (var i = 0; i < arguments.length; i++) {
        arguments[i].classList.add('d-none');
    }
}

export function show() {
    for (var i = 0; i < arguments.length; i++) {
        arguments[i].classList.remove('d-none');
    }
}

export function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

export function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

/**
 *
 * @param {*} path
 * @param {*} method
 * @param {*} payload
 * @returns
 */
export async function callApi(path, method = 'GET', payload = {}) {
    let requestOptions = {
        method: method,
        // mode: 'cors',
        headers: {
            // 'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        }
    };
    if (method === 'POST' || method === 'PUT') {
        requestOptions.body = JSON.stringify(payload);
    }
    let token = Auth.getToken()
    if(token) {
        requestOptions.headers["x-access-token"] = token;

    }
    let response = await fetch("/api/" + path, requestOptions);

    if (!response.ok) {
        // throw new Error(`Erreur HTTP ! statut : ${response.status}`);
        return {
            'status': response.status
        }
    }

    if(method === 'DELETE') {
        return {
            'status': response.status
        }
    }

    const count = response.headers.get('X-Total-Count')
    if(count) {
        return {
            'status': response.status,
            "count": count,
            "json": await response.json()
        }
    }

    return await response.json();
}

export function easterEgg() {
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
