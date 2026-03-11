export async function fetchUser() {
    const res = await fetch('api/user', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    if (res.ok) return data;
    else alert('Authentication failed');
    return {};
}

export async function fetchSkins() {
    const res = await fetch('api/skins', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    if (res.ok) return data;
    else alert('Authentication failed');
    return {};
}

export async function fetchRoom(code) {
    const res = await fetch('api/rooms/' + code, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (res.ok) return data;
    else alert("Room not found");
}

export async function joinRoom(code) {
    const res = await fetch('api/rooms', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code })
    });
    const data = await res.json();
    if (res.ok) return data;
    else if (res.status == 409) alert("Room is full");
    else alert("Room not found");
}

export async function leaveRoom(code) {
    const res = await fetch('api/rooms', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code })
    });
    const data = await res.json();
    if (res.ok) return data;
    else alert("Room not found");
}

export async function sendStats(data) {
    const res = await fetch('api/stats', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    await res.json();
    if (!res.ok) alert('Authentication failed');
}
