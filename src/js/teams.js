const ul = document.querySelector('.list-group');

async function getTeams() {
    const result = await fetch('https://v3.football.api-sports.io/teams?league=140&season=2020', {
        headers: ({
            'x-apisports-key': '6dc9926e303d66857fb46878872562ad',
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
            ul.insertAdjacentHTML('beforeend', `
            <li id="listaequipo${i}" data-teamid="${element.team.id}" class="list-group-item">
                <img id="imagen${i}" src="${element.team.logo}"><br>
                <div id="equipo${i}">${element.team.name}</div>
            </li>
            `);
        });
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    handleResponseTeams(await getTeams());
});

ul.addEventListener('click', (e) => {
    if (e.target.localName === 'img' || e.target.localName === 'div' || e.target.localName === 'li') {
        let teamId;
        if (Array.from(document.querySelectorAll('li.active')).length !== 0) {
            const selected = document.querySelector('li.active');
            selected.classList.remove('active');
        }
        const clickedTeam = document.getElementById(e.target.id);
        if (clickedTeam.localName !== 'li') {
            clickedTeam.parentElement.classList.add('active');
            teamId = clickedTeam.parentElement.dataset.teamid;
        } else {
            clickedTeam.classList.add('active');
            teamId = clickedTeam.parentElement.dataset.teamid;
        }
    }
});