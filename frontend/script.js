const API_BASE = 'http://localhost:8000';

const regForm = document.getElementById('registerForm');
const regResult = document.getElementById('registerResult');
regForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
        name: document.getElementById('reg_name').value,
        email: document.getElementById('reg_email').value,
        password: document.getElementById('reg_password').value,
    };
    const res = await fetch(`${API_BASE}/users/register`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
    });
    const data = await res.json();
    regResult.textContent = JSON.stringify(data, null, 2);
});

const missionForm = document.getElementById('missionForm');
const missionResult = document.getElementById('missionResult');
missionForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
        title: document.getElementById('mission_title').value,
        description: document.getElementById('mission_desc').value,
        latitude: parseFloat(document.getElementById('mission_lat').value),
        longitude: parseFloat(document.getElementById('mission_lon').value),
        created_by: document.getElementById('mission_user').value
    };
    const res = await fetch(`${API_BASE}/missions/create`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
    });
    const data = await res.json();
    missionResult.textContent = JSON.stringify(data, null, 2);
});

const nearbyForm = document.getElementById('nearbyForm');
const missionsList = document.getElementById('missionsList');
nearbyForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const lat = parseFloat(document.getElementById('nearby_lat').value);
    const lon = parseFloat(document.getElementById('nearby_lon').value);
    const res = await fetch(`${API_BASE}/missions/nearby?lat=${lat}&lon=${lon}`);
    const data = await res.json();
    missionsList.innerHTML = '';
    data.forEach(mission => {
        const li = document.createElement('li');
        li.textContent = `${mission.title} - ${mission.status}`;
        missionsList.appendChild(li);
    });
});
