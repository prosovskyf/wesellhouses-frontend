export async function changePass(token, data) {
    const options = {
        method: 'PUT',
        headers: {
            "Authorization": "Bearer " + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    return await fetch(`${process.env.REACT_APP_API_URL}/user/changepass`, options)
        .then(res => res.text().then(data => ({ status: res.status, body: data })))
        .catch(err => err);
}