export async function getTeams() {
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

export async function getPlayersFromTeam(teamId) {
    const result = await fetch(`https://v3.football.api-sports.io/players?league=140&season=2020&team=${teamId}`, {
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

export async function getInfoFromPlayer(playerId) {
    const result = await fetch(`https://v3.football.api-sports.io/players?league=140&season=2020&id=${playerId}`, {
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