import '../css/style.css';

const form = document.querySelector('form');

const button = document.getElementById('btnregister');
const alerta = document.getElementById('estadoregister');

const spinner = document.querySelector('.spinner');

const regexName = /^[A-Za-z ]+$/;
const regexMail = /^\w+([.+-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,4})+$/;
const regexPassword = /^[A-Za-z0-9]{5,}$/;

async function register() {
    spinner.classList.remove('hide');
    const result = await fetch('https://jsonplaceholder.typicode.com/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: form.elements.nombre.value,
            email: form.elements.email.value,
        }),
    });
    alerta.classList.add('alert');
    if (result.status === 201) {
        alerta.classList.add('alert-success');
        alerta.innerHTML = '¡Se ha registrado con éxito!';
        const resultJson = await result.json();
        sessionStorage.setItem('id', resultJson.id);
        window.location.href = 'http://localhost:8080/teams.html';
    } else {
        alerta.classList.add('alert-danger');
        alerta.innerHTML = '¡Oh no, ha ocurrido un error!';
    }
    spinner.classList.add('hide');
}

form.addEventListener('keyup', () => {
    button.disabled = !(regexName.test(form.elements.nombre.value)
    && regexMail.test(form.elements.email.value)
    && regexPassword.test(form.elements.password.value));
});
button.addEventListener('click', async () => {
    await register();
});