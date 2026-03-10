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
    else alert('Could not find room');
    return {};
}
