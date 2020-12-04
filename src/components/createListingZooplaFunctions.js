export async function getPriceInfo(token, zip) {
    const options = {
        method: 'POST',
        headers: {
            "Authorization": "Bearer " + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(zip)
    };
    return await fetch(`${process.env.REACT_APP_API_URL}/admin/properties/data`, options)
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