const form = document.querySelector('form');
const button = document.querySelector('button');
const p = document.querySelector('p');

async function register() {
    const result = await fetch('https://jsonplaceholder.typicode.com/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: {
            name: form.elements.name.value,
            email: form.elements.email.value,
            password: form.elements.password.value,
        },
    });
    if (result.status === 200) {
        p.innerHTML = '¡Se ha registrado con éxito!';
    } else {
        p.innerHTML = '¡Oh no, ha ocurrido un error!';
    }
}

button.addEventListener('click', async () => {
    await register();
});