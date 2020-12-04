export async function getMediaNames(url) {
    const options = {
        method: 'GET',
    };
    return await fetch(`${process.env.REACT_APP_API_URL}/files?path=` + url, options)
        .then(res => {
            if (res.status === 200) {
                return res.json().then(data => ({ status: res.status, body: data }))
            }
            else {
                return ({ status: res.status })
            }
        })
        .catch(err => ("Error fetching images" + err));
}

export async function sendFirstMessage(token, property_id, message) {
    const options = {
        method: 'POST',
        headers: {
            "Authorization": "Bearer " + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            property_id: property_id,
            message: message
        })
    };
    return await fetch(`${process.env.REACT_APP_API_URL}/messages`, options)
        .then(res => res.text().then(data => ({ status: res.status, body: data })))
        .catch(err => ("Error:" + err));
}