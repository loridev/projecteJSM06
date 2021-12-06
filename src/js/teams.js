import '../css/style.css';

const ulColIzq = document.getElementById('colizq');
const ulColMed = document.getElementById('colmed');
const columnaDerecha = document.getElementById('colder');

async function getTeams() {
    const result = await fetch('https://v3.football.api-sports.io/teams?league=140&season=2020', {
        headers: ({
            'x-apisports-key': 'bdab5e4483ea71a6b7ab7fa746d5f99d',
        }),
    });
    if (result.status === 200) {
        const jsonResponse = await result.json();
        return { status: true, msg: jsonResponse };
    }
    return { status: false, msg: '¡Oh no, ha ocurrido un error!' };
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
    }
}

async function getPlayersFromTeam(teamId) {
    const result = await fetch(`https://v3.football.api-sports.io/players?league=140&season=2020&team=${teamId}`, {
        headers: ({
            'x-apisports-key': 'bdab5e4483ea71a6b7ab7fa746d5f99d',
        }),
    });

    if (result.status === 200) {
        const jsonResponse = await result.json();
        return { status: true, msg: jsonResponse };
    }
    return { status: false, msg: '¡Oh no, ha ocurrido un error!' };
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
    }
}

async function getInfoFromPlayer(playerId) {
    const result = await fetch(`https://v3.football.api-sports.io/players?league=140&season=2020&id=${playerId}`, {
        headers: ({
            'x-apisports-key': 'bdab5e4483ea71a6b7ab7fa746d5f99d',
        }),
    });

    if (result.status === 200) {
        const jsonResponse = await result.json();
        return { status: true, msg: jsonResponse };
    }
    return { status: false, msg: '¡Oh no, ha ocurrido un error!' };
}

async function handleResponseInfo(response) {
    if (response.status) {
        const info = Array.from(response.msg.response)[0];

        columnaDerecha.innerHTML = `
        <img src="${info.player.photo}">
        <p>Nombre: ${info.player.name}</p>
        <p>Edad: ${info.player.age}</p>
        `;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    handleResponseTeams(await getTeams());
});

ulColIzq.addEventListener('click', async (e) => {
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