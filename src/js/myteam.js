import '../css/style.css';

const bootstrap = require('bootstrap');

const noFavs = document.getElementById('noFavs');
const noTeam = document.getElementById('noTeam');
const ulColIzq = document.getElementById('colizq');
const ulColDer = document.getElementById('colder');
const colIzq = document.getElementById('columnaizq');
const colDer = document.getElementById('columnader');

const modal = new bootstrap.Modal(document.getElementById('modal'));
const modalTitle = document.querySelector('.modal-title');
const modalBody = document.querySelector('.modal-body');

let favoritos;
let equipo;

function actualizarLista() {
    ulColIzq.innerHTML = '';
    ulColDer.innerHTML = '';

    if (favoritos.length === 0) {
        noFavs.innerHTML = 'No tienes jugadores añadidos a favoritos!!!';
    } else {
        noFavs.innerHTML = '';
        favoritos.forEach((element, i) => {
            ulColIzq.insertAdjacentHTML('beforeend',
                `<li id="listajugador${i}" data-playerid="${element.player.id}" class="list-group-item" draggable="true">
                    <div id="jugador${i}">${element.player.name}</div>
                </li>`);
        });
    }

    if (equipo.length === 0) {
        noTeam.innerHTML = 'No tienes jugadores en el equipo!!!';
    } else {
        noTeam.innerHTML = '';
        equipo.forEach((element, i) => {
            ulColDer.insertAdjacentHTML('beforeend',
                `<li id="listaequipo${i}" data-playeridequipo="${element.player.id}" class="list-group-item" draggable="true">
                    <div id="jugadorequipo${i}">${element.player.name}</div>
                </li>`);
        });
    }
}

try {
    favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    equipo = JSON.parse(localStorage.getItem('equipo')) || [];
} catch (err) {
    console.warn('Ha ocurrido un error al obtener los favoritos o el equipo');
}

document.addEventListener('DOMContentLoaded', async () => {
    if (favoritos.length === 0) {
        noFavs.innerHTML = 'No tienes jugadores añadidos a favoritos!!!';
    } else {
        noFavs.innerHTML = '';
        favoritos.forEach((element, i) => {
            ulColIzq.insertAdjacentHTML('beforeend',
                `<li id="listajugador${i}" data-playerid="${element.player.id}" class="list-group-item" draggable="true">
                    <div id="jugador${i}">${element.player.name}</div>
                </li>`);
        });
    }

    if (equipo.length === 0) {
        noTeam.innerHTML = 'No tienes jugadores en el equipo!!!';
    } else {
        equipo.forEach((element, i) => {
            ulColDer.insertAdjacentHTML('beforeend',
                `<li id="listaequipo${i}" data-playeridequipo="${element.player.id}" class="list-group-item" draggable="true">
                    <div id="jugadorequipo${i}">${element.player.name}</div>
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

ulColIzq.addEventListener('dragstart', (e) => {
    const elemento = document.getElementById(e.target.id);
    e.dataTransfer.setData('playerid', elemento.dataset.playerid);
});

colDer.addEventListener('dragover', (e) => {
    e.preventDefault();
    colDer.classList.add('dragover');
});

colDer.addEventListener('dragleave', () => {
    colDer.classList.remove('dragover');
});

colDer.addEventListener('drop', (e) => {
    colDer.classList.remove('dragover');
    const jugadorArrastrado = e.dataTransfer.getData('playerid');
    const jugadorAnadir = favoritos.find((favorito) => favorito.player.id
    === Number(jugadorArrastrado)
    && !equipo.find((jugadorEquipo) => jugadorEquipo.player.id === Number(jugadorArrastrado)));
    if (jugadorAnadir) {
        const jugadoresPos = equipo.filter(
            (jugadorEquipo) => jugadorEquipo
                .statistics[0].games.position === jugadorAnadir.statistics[0].games.position,
        );

        let maxPlayers;
        switch (jugadorAnadir.statistics[0].games.position) {
        case 'Attacker':
            maxPlayers = 3;
            break;
        case 'Midfielder':
        case 'Defender':
            maxPlayers = 5;
            break;
        case 'Goalkeeper':
            maxPlayers = 1;
            break;
        default:
            maxPlayers = 0;
        }

        if (jugadoresPos.length < maxPlayers && equipo.length < 11) {
            equipo.push(jugadorAnadir);
        }
        try {
            localStorage.setItem('equipo', JSON.stringify(equipo));
            actualizarLista();
        } catch (err) {
            console.warn('Ha habido un error al guardar el equipo');
        }
    }
});

ulColDer.addEventListener('dragstart', (e) => {
    const elemento = document.getElementById(e.target.id);
    e.dataTransfer.setData('teamplayerid', elemento.dataset.playeridequipo);
});

colIzq.addEventListener('dragover', (e) => {
    e.preventDefault();
    colIzq.classList.add('dragover');
});

colIzq.addEventListener('dragleave', () => {
    colIzq.classList.remove('dragover');
});

colIzq.addEventListener('drop', (e) => {
    colIzq.classList.remove('dragover');
    const jugadorArrastrado = e.dataTransfer.getData('teamplayerid');
    const jugadorQuitar = equipo.find((jugadorEquipo) => jugadorEquipo.player.id
    === Number(jugadorArrastrado));

    if (jugadorQuitar) {
        equipo.forEach((jugadorEquipo, i) => {
            if (jugadorEquipo.player.id === jugadorQuitar.player.id) {
                equipo.splice(i);
            }
        });
        try {
            localStorage.setItem('equipo', JSON.stringify(equipo));
            actualizarLista();
        } catch (err) {
            console.warn('Ha habido un error al guardar el equipo');
        }
    }
});