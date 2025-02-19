async function loadClients() {
    const response = await fetch('http://localhost:3000/clients');
    const clients = await response.json();

    const list = document.getElementById('clientsList');
    list.innerHTML = '';

    clients.forEach(client => {
        const clientDiv = document.createElement('div');
        clientDiv.classList.add('client-card');
        clientDiv.innerHTML = `
            <p><strong>Ім'я:</strong> <span id="name-${client.id}">${client.name}</span></p>
            <p><strong>Email:</strong> ${client.email}</p>
            <p><strong>Телефон:</strong> ${client.phone}</p>
            <p><strong>Дата народження:</strong> ${client.dob}</p>
            <p><strong>Стать:</strong> ${client.gender}</p>
            <p><strong>Країна:</strong> ${client.country}</p>
            <p><strong>Улюблений колір:</strong> ${client.color || "Не вказано"}</p>
            <p><strong>Коментар:</strong> ${client.comment || "Немає коментаря"}</p>
            <img src="http://localhost:3000/${client.photo}" width="100" alt="Фото профілю">
            <br>
            <button onclick="editClient(${client.id})">Редагувати</button>
            <button onclick="deleteClient(${client.id})">Видалити</button>
        `;
        list.appendChild(clientDiv);
    });
}

async function deleteClient(id) {
    if (confirm('Ви впевнені, що хочете видалити цього клієнта?')) {
        await fetch(`http://localhost:3000/clients/${id}`, { method: 'DELETE' });
        loadClients();
    }
}

async function editClient(id) {
    const newName = prompt("Введіть нове ім'я:");
    if (!newName) return;

    const client = {
        name: newName
    };

    await fetch(`http://localhost:3000/clients/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(client)
    });

    loadClients();
}

loadClients();
