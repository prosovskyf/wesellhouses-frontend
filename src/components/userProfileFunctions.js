export async function getProfileData(token) {
    const options = {
        method: 'GET',
        headers: {
            "Authorization": "Bearer " + token
        },
    };
    return await fetch(`${process.env.REACT_APP_API_URL}/user/profile`, options)
    .then(res => res.json().then(data => ({ status: res.status, body: data })))
        .catch(err => err);
}

export async function updateProfileData(token, data) {
    const options = {
        method: 'PUT',
        headers: {
            "Authorization": "Bearer " + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    return await fetch(`${process.env.REACT_APP_API_URL}/user/updateinfo`, options)
        .then(res => res.json().then(data => ({ status: res.status, body: data })))
        .catch(err => err);
}

