export async function getProperties(token, query) {
    const options = {
        method: 'GET',
        headers: {
            "Authorization": "Bearer " + token
        },
    };
    return await fetch(`${process.env.REACT_APP_API_URL}/admin/properties/?${query}`, options)
        .then(res => {
            if (res.status === 200) {
                return res.json().then(data => ({ status: res.status, body: data }))
            }
            else {
                return ({ status: res.status })
            }
        })
        .catch(err => err);
}

export async function getHighPriority(token) {
    const options = {
        method: 'GET',
        headers: {
            "Authorization": "Bearer " + token
        },
    };
    return await fetch(`${process.env.REACT_APP_API_URL}/admin/properties/hot`, options)
        .then(res => {
            if (res.status === 200) {
                return res.json().then(data => ({ status: res.status, body: data }))
            }
            else {
                return ({ status: res.status })
            }
        })
        .catch(err => err);
}

export async function getById(token, id) {
    const options = {
        method: 'GET',
        headers: {
            "Authorization": "Bearer " + token
        },
    };
    return await fetch(`${process.env.REACT_APP_API_URL}/admin/properties/${id}`, options)
        .then(res => {
            if (res.status === 200) {
                return res.json().then(data => ({ status: res.status, body: data }))
            }
            else {
                return ({ status: res.status })
            }
        })
        .catch(err => err);
}
