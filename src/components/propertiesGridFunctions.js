export async function getProperties(query) {
    const options = {
        method: 'GET',
    };
    return await fetch(`${process.env.REACT_APP_API_URL}/properties/?${query}`, options)
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

export async function getFeatures() {
    const options = {
        method: 'GET',
    };
    return await fetch(`${process.env.REACT_APP_API_URL}/features`, options)
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

export async function getCategories() {
    const options = {
        method: 'GET',
    };
    return await fetch(`${process.env.REACT_APP_API_URL}/category`, options)
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