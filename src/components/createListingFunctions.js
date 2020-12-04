export async function createProperty(token, data) {
    const options = {
        method: 'POST',
        headers: {
            "Authorization": "Bearer " + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    return await fetch(`${process.env.REACT_APP_API_URL}/admin/properties`, options)
        .then(res => res.json().then(data => ({ status: res.status, body: data })))
        .catch(err => err);
}

export async function uploadPropertyThumbnail(token, property_id, fileList) {
    const formData = new FormData();
    formData.append('thumbnail', fileList[0]);
    const options = {
        method: 'PUT',
        headers: {
            "Authorization": "Bearer " + token,
            property_id: property_id
        },
        body: formData
    };
    return await fetch(`${process.env.REACT_APP_API_URL}/files/upload/property/images`, options)
        .then(res => res.text().then(data => ({ status: res.status, body: data })))
        .catch(err => err);
}

export async function uploadPropertyImages(token, property_id, fileList) {
    const formData = new FormData();
    for (const name in fileList) {
        formData.append('image', fileList[name]);
    }
    const options = {
        method: 'PUT',
        headers: {
            "Authorization": "Bearer " + token,
            property_id: property_id
        },
        body: formData
    };
    return await fetch(`${process.env.REACT_APP_API_URL}/files/upload/property/images`, options)
        .then(res => res.text().then(data => ({ status: res.status, body: data })))
        .catch(err => err);
}

export async function uploadPropertyVideo(token, property_id, fileList) {
    const formData = new FormData();
    formData.append('video', fileList[0]);
    const options = {
        method: 'PUT',
        headers: {
            "Authorization": "Bearer " + token,
            property_id: property_id
        },
        body: formData
    };
    return await fetch(`${process.env.REACT_APP_API_URL}/files/upload/property/video`, options)
        .then(res => res.text().then(data => ({ status: res.status, body: data })))
        .catch(err => err);
}

