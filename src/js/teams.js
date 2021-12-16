import '../css/style.css';
import { getTeams, getInfoFromPlayer, getPlayersFromTeam } from './api';

const ulColIzq = document.getElementById('colizq');
const ulColMed = document.getElementById('colmed');
const columnaDerecha = document.getElementById('colder');

const spinnerIzq = document.getElementById('spinizq');
const spinnerMed = document.getElementById('spinmed');
const spinnerDer = document.getElementById('spinder');

const alerta = document.getElementById('estadoregister');

let favoritos;
let equipo;

try {
    favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    equipo = JSON.parse(localStorage.getItem('equipo')) || [];
} catch (err) {
    // console.warn('Ha ocurrido un error al obtener los favoritos o el equipo');
}

async function handleResponseTeams(response) {
    if (response.status) {
        const teams = Array.from(response.msg.response);
        teams.forEach((element, i) => {
            ulColIzq.insertAdjacentHTML('beforeend', `
            <li id="listaequipo${i}" data-teamid="${element.team.id}" class="list-group-item">
                <img id="imagen${i}" src="${element.team.logo}"><br>
                <div id="equipo${i}">${element.team.name}</div>
            </li>
            `);
        });
    } else {
        alerta.classList.add('alert');
        alerta.classList.add('alert-danger');
        alerta.innerHTML = '¡Oh no, ha ocurrido un error!';
    }
    spinnerIzq.classList.add('hide');
}

async function handleResponsePlayers(response) {
    if (response.status) {
        const players = Array.from(response.msg.response);
        ulColMed.innerHTML = '';
        players.forEach((element, i) => {
            ulColMed.insertAdjacentHTML('beforeend', `
                <li id="listajugador${i}" data-playerid="${element.player.id}" class="list-group-item">
                    <div id="jugador${i}">${element.player.name}</div>
                </li>
            `);
        });
    } else {
        alerta.classList.add('alert');
        alerta.classList.add('alert-danger');
        alerta.innerHTML = '¡Oh no, ha ocurrido un error!';
    }
    spinnerMed.classList.add('hide');
}

async function handleResponseInfo(response) {
    if (response.status) {
        const info = Array.from(response.msg.response)[0];
        let estrella;

        try {
            if (favoritos.find((el) => el.player.id === info.player.id)) {
                estrella = 'star';
            } else {
                estrella = 'star_border';
            }
        } catch (err) {
            // console.warn(err);
        }

        columnaDerecha.innerHTML = `
        <img src="${info.player.photo}">
        <p>Nombre: ${info.player.name}</p>
        <p>Edad: ${info.player.age}</p>
        <i class="material-icons">${estrella}</i>
        `;

        const estrellaIcono = document.querySelector('.material-icons');
        estrellaIcono.addEventListener('click', () => {
            try {
                if (favoritos.find((el) => el.player.id === info.player.id)) {
                    estrellaIcono.innerHTML = 'star_border';
                    favoritos.forEach((fav, i) => {
                        if (fav.player.id === info.player.id) {
                            favoritos.splice(i, 1);
                        }
                    });

                    if (equipo.find((el) => el.player.id === info.player.id)) {
                        equipo.forEach((jugEquipo, i) => {
                            if (jugEquipo.player.id === info.player.id) {
                                equipo.splice(i, 1);
                            }
                        });
                    }
                } else {
                    estrellaIcono.innerHTML = 'star';
                    favoritos.push(info);
                }

                if (favoritos.length !== 0) {
                    localStorage.setItem('favoritos', JSON.stringify(favoritos));
                    localStorage.setItem('equipo', JSON.stringify(equipo));
                } else {
                    localStorage.removeItem('favoritos');
                    localStorage.removeItem('equipo');
                }
            } catch (err) {
                // console.warn(err);
            }
        });
    } else {
        alerta.classList.add('alert');
        alerta.classList.add('alert-danger');
        alerta.innerHTML = '¡Oh no, ha ocurrido un error!';
    }
    spinnerDer.classList.add('hide');
}

document.addEventListener('DOMContentLoaded', async () => {
    spinnerIzq.classList.remove('hide');
    handleResponseTeams(await getTeams());
});

ulColIzq.addEventListener('click', async (e) => {
    spinnerMed.classList.remove('hide');
    if (e.target.localName === 'img' || e.target.localName === 'div' || e.target.localName === 'li') {
        let teamId;
        if (Array.from(document.querySelectorAll('#colizq > li.active')).length !== 0) {
            const selected = document.querySelector('#colizq > li.active');
            selected.classList.remove('active');
        }
        const clickedTeam = document.getElementById(e.target.id);
        if (clickedTeam.localName !== 'li') {
            clickedTeam.parentElement.classList.add('active');
            teamId = clickedTeam.parentElement.dataset.teamid;
        } else {
            clickedTeam.classList.add('active');
            teamId = clickedTeam.dataset.teamid;
        }

        handleResponsePlayers(await getPlayersFromTeam(teamId));
    }
});

ulColMed.addEventListener('click', async (e) => {
    spinnerDer.classList.remove('hide');
    if (e.target.localName === 'div' || e.target.localName === 'li') {
        let playerId;
        if (Array.from(document.querySelectorAll('#colmed > li.active')).length !== 0) {
            const selected = document.querySelector('#colmed > li.active');
            selected.classList.remove('active');
        }
        const clickedPlayer = document.getElementById(e.target.id);
        if (clickedPlayer.localName !== 'li') {
            clickedPlayer.parentElement.classList.add('active');
            playerId = clickedPlayer.parentElement.dataset.playerid;
        } else {
            clickedPlayer.classList.add('active');
            playerId = clickedPlayer.parentElement.dataset.playerid;
        }

        handleResponseInfo(await getInfoFromPlayer(playerId));
    }
});