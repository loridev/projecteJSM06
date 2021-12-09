import '../css/style.css';

const ulColIzq = document.getElementById('colizq');
const ulColDer = document.getElementById('colder');
let favoritos;

async function handleResponseFavs(response) {
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

async function getFavs() {
    
}

document.addEventListener('DOMContentLoaded', async () => {
    handleResponseFavs(await getFavs());
});