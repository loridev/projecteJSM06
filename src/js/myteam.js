import '../css/style.css';

const bootstrap = require('bootstrap');

const ulColIzq = document.getElementById('colizq');
const ulColDer = document.getElementById('colder');

const modal = new bootstrap.Modal(document.getElementById('modal'));
const modalTitle = document.querySelector('.modal-title');
const modalBody = document.querySelector('.modal-body');
let favoritos;

try {
    favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
} catch (err) {
    console.warn('Ha ocurrido un error al obtener los favoritos');
}

document.addEventListener('DOMContentLoaded', async () => {
    favoritos.forEach((element, i) => {
        ulColIzq.insertAdjacentHTML('beforeend',
            `<li id="listajugador${i}" data-playerid="${element.player.id}" class="list-group-item">
                <div id="jugador${i}">${element.player.name}</div>
            </li>`);
    });
});

ulColIzq.addEventListener('click', (e) => {
    if (e.target.localName === 'div' || e.target.localName === 'li') {
        modal.show();
        let playerId;
        if (Array.from(document.querySelectorAll('#colizq > li.active')).length !== 0) {
            const selected = document.querySelector('#colizq > li.active');
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

        const player = favoritos.find((el) => el.player.id === +playerId);
        modalTitle.innerHTML = player.player.name;
        modalBody.innerHTML = 'hola';

        // TO DO: Mostrar nombre y apellido en teams.js
        // TO DO: Mostrar la info del jugador en myteam.js nombre, apellidos, edad, altura, peso
        // y si está lesionado. En el botón podríamos poner lo de quitar de favs
    }
});