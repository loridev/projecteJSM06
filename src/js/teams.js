const ul = document.querySelector('.list-group');

async function getTeams() {
    const result = await fetch('https://v3.football.api-sports.io/teams?league=140&season=2020', {
        headers: ({
            'x-apisports-key': 'bdab5e4483ea71a6b7ab7fa746d5f99d',
        }),
    });
    if (result.status === 200) {
        const jsonResponse = await result.json();
        console.log(jsonResponse);
        return { status: true, msg: jsonResponse };
    }
    return { status: false, msg: '¡Oh no, ha ocurrido un error!' };
}

async function handleResponse(response) {
    if (response.status) {
        const teams = Array.from(response.msg.response);
        teams.forEach((element) => {
            ul.insertAdjacentHTML('beforeend', `
            <li><img src="${element.team.logo}"><br><span>${element.team.name}</span></li>
            `);
        });
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    handleResponse(await getTeams());
});