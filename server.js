const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();//
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(express.static('uploads'));
app.use(express.static(path.join(__dirname, 'public')));

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

const filePath = 'clients.json';

const readClients = () => {
    if (!fs.existsSync(filePath)) return [];
    return JSON.parse(fs.readFileSync(filePath, 'utf-8') || '[]');
};

const writeClients = (clients) => {
    fs.writeFileSync(filePath, JSON.stringify(clients, null, 2));
};

app.get('/registration', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/registration', upload.single('photo'), (req, res) => {
    const { name, email, password, phone, dob, gender, country, result_test, result_game } = req.body;

    if (!name || !email || !password || !phone || !dob || !gender || !country) {
        return res.status(400).json({ message: "Будь ласка, заповніть всі поля!" });
    }
    if (!req.file) {
        return res.status(400).json({ message: "Фото є обов'язковим!" });
    }

    const clients = readClients();

    if (clients.some(client => client.email === email)) {
        return res.status(400).json({ message: "Цей email уже використовується!" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newClient = {
        id: clients.length + 1,
        name,
        email,
        password: hashedPassword,
        phone,
        dob,
        gender,
        country,
        photo: req.file.filename, 
        agreement: req.body.agreement === 'true',
        result_test: result_test || null,
        result_game: result_game || null
    };

    clients.push(newClient);
    writeClients(clients);

    res.json({ message: 'Реєстрація успішна!', client: newClient });
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/clients', (req, res) => {
    const clients = readClients();
    res.json(clients);
    
});

app.put('/clients/:id', (req, res) => {
    const clients = readClients();
    const clientId = parseInt(req.params.id);
    const clientIndex = clients.findIndex(client => client.id === clientId);

    if (clientIndex !== -1) {
        const updatedClient = { ...clients[clientIndex], ...req.body };
        clients[clientIndex] = updatedClient;
        writeClients(clients);
        res.json({ message: 'Клієнта оновлено!', client: updatedClient });
    } else {
        res.status(404).json({ message: 'Клієнта не знайдено!' });
    }
});

app.delete('/clients/:id', (req, res) => {
    const clients = readClients();
    const clientId = parseInt(req.params.id);
    
    const clientToDelete = clients.find(client => client.id === clientId);
    
    if (!clientToDelete) {
        return res.status(404).json({ message: 'Клієнта не знайдено!' });
    }

    const photoPath = path.join(__dirname, 'uploads', clientToDelete.photo);
    if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
    }

    const updatedClients = clients.filter(client => client.id !== clientId);
    writeClients(updatedClients);

    res.json({ message: 'Клієнта та фото видалено!' });
});


app.listen(PORT, () => {
    console.log(`Сервер працює на http://localhost:${PORT}`);
});
