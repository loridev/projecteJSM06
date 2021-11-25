const form = document.querySelector('form');

const button = document.getElementById('btnregister');
const p = document.querySelector('p');

async function register() {
    const result = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: {
            name: form.elements.nombre.value,
            email: form.elements.email.value,
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