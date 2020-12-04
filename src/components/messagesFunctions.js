export async function getThreads(token) {
    const options = {
        method: 'GET',
        headers: {
            "Authorization": "Bearer " + token,
        },
    };
    return await fetch(`${process.env.REACT_APP_API_URL}/messages`, options)
        .then(res => {
            if (res.status === 200) {
                return res.json().then(data => ({ status: res.status, body: data }))
            }
            else {
                return {status: res.status}
            }
        })
        .catch(err => err);
}

export async function getArchivedThreads(token) {
    const options = {
        method: 'GET',
        headers: {
            "Authorization": "Bearer " + token,
        },
    };
    return await fetch(`${process.env.REACT_APP_API_URL}/messages/archive`, options)
        .then(res => {
            if (res.status === 200) {
                return res.json().then(data => ({ status: res.status, body: data }))
            }
            else {
                return {status: res.status}
            }
        })
        .catch(err => err);
}

export async function getMessages(token, id) {
    const options = {
        method: 'GET',
        headers: {
            "Authorization": "Bearer " + token,
        },
    };
    return await fetch(`${process.env.REACT_APP_API_URL}/messages/${id}`, options)
        .then(res => {
            if (res.status === 200) {
                return res.json().then(data => ({ status: res.status, body: data }))
            }
            else {
                return {status: res.status}
            }
        })
        .catch(err => err);
}

export async function getArchivedMessages(token, id) {
    const options = {
        method: 'GET',
        headers: {
            "Authorization": "Bearer " + token,
        },
    };
    return await fetch(`${process.env.REACT_APP_API_URL}/messages/archive/${id}`, options)
        .then(res => {
            if (res.status === 200) {
                return res.json().then(data => ({ status: res.status, body: data }))
            }
            else {
                return {status: res.status}
            }
        })
        .catch(err => err);
}

export async function sendMessage(token, msg, id) {
    const options = {
        method: 'POST',
        headers: {
            "Authorization": "Bearer " + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: msg
        })
    };
    return await fetch(`${process.env.REACT_APP_API_URL}/messages/${id}`, options)
        .then(res => res.text().then(data => ({ status: res.status, body: data })))
        .catch(err => err);
}

export async function archiveThread(token, id) {
    const options = {
        method: 'PUT',
        headers: {
            "Authorization": "Bearer " + token,
            'Content-Type': 'application/json'
        },
    };
    return await fetch(`${process.env.REACT_APP_API_URL}/messages/${id}/archive`, options)
        .then(res => res.text().then(data => ({ status: res.status, body: data })))
        .catch(err => err);
}

export async function unarchiveThread(token, id) {
    const options = {
        method: 'PUT',
        headers: {
            "Authorization": "Bearer " + token,
            'Content-Type': 'application/json'
        },
    };
    return await fetch(`${process.env.REACT_APP_API_URL}/messages/archive/${id}`, options)
        .then(res => res.text().then(data => ({ status: res.status, body: data })))
        .catch(err => err);
}

export async function deleteThread(token, id) {
    const options = {
        method: 'DELETE',
        headers: {
            "Authorization": "Bearer " + token,
            'Content-Type': 'application/json'
        },
    };
    return await fetch(`${process.env.REACT_APP_API_URL}/messages/${id}`, options)
        .then(res => res.text().then(data => ({ status: res.status, body: data })))
        .catch(err => err);
}