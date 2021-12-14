import '../css/style.css';

const bootstrap = require('bootstrap');

const noFavs = document.getElementById('noFavs');
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
    if (favoritos.length === 0) {
        noFavs.innerHTML = 'No tienes jugadores añadidos a favoritos!!!';
    } else {
        favoritos.forEach((element, i) => {
            ulColIzq.insertAdjacentHTML('beforeend',
                `<li id="listajugador${i}" data-playerid="${element.player.id}" class="list-group-item">
                    <div id="jugador${i}">${element.player.name}</div>
                </li>`);
        });
    }
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

        const shots = (player.statistics[0].shots.on * 100) / player.statistics[0].shots.total;
        const passes = player.statistics[0].passes.accuracy;
        const keyPasses = (player.statistics[0].passes.key * 100)
        / player.statistics[0].passes.total;
        const wonDuels = (player.statistics[0].duels.won * 100) / player.statistics[0].duels.total;
        const successDribbles = (player.statistics[0].dribbles.success * 100)
        / player.statistics[0].dribbles.attempts;

        const chartData = {
            labels: ['% de on shots', '% de passes', '% de key passes', '% de won duels', '% de success dribbles'],
            datasets: [{
                data: [shots, passes, keyPasses, wonDuels, successDribbles],
                label: 'Estadísticas',
            }],

        };
        const chartConfig = {
            type: 'radar',
            data: chartData,
        };

        modalTitle.innerHTML = player.player.name;
        modalBody.innerHTML = `Nombre: ${player.player.firstname}
        <br>Apellidos: ${player.player.lastname}
        <br>Edad: ${player.player.age} años
        <br>Nacionalidad: ${player.player.nationality}
        <br>Altura: ${player.player.height}
        <br>Peso: ${player.player.weight}
        <br>Lesionado: ${player.player.injured ? 'Sí' : 'No'}
        <br><canvas id="grafico"></canvas>`;

        const chart = new Chart(document.getElementById('grafico'), chartConfig);
        
        // TO DO: Mostrar nombre y apellido en teams.js
        // En el botón podríamos poner lo de quitar de favs
        // Si no hay favoritos mostrar mensaje en myteam sino se ve pantalla en blanco
    }
});