export async function updatePropertyById(token, data, id) {
    const options = {
        method: 'PUT',
        headers: {
            "Authorization": "Bearer " + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    return await fetch(`${process.env.REACT_APP_API_URL}/admin/properties/${id}`, options)
        .then(res => res.text().then(data => ({ status: res.status, body: data })))
        .catch(err => err);
}

export async function deleteProperty(token, id) {
    const options = {
        method: 'DELETE',
        headers: {
            "Authorization": "Bearer " + token,
            'Content-Type': 'application/json'
        },
    };
    return await fetch(`${process.env.REACT_APP_API_URL}/admin/properties/${id}`, options)
        .then(res => res.text().then(data => ({ status: res.status, body: data })))
        .catch(err => err);
}

export async function deleteAllFeatures(token, id) {
    const options = {
        method: 'DELETE',
        headers: {
            "Authorization": "Bearer " + token,
            'Content-Type': 'application/json'
        },
    };
    return await fetch(`${process.env.REACT_APP_API_URL}/features/all/${id}`, options)
        .then(res => res.text().then(data => ({ status: res.status, body: data })))
        .catch(err => err);
}

export async function deleteFeatures(token, features, id) {
    const options = {
        method: 'DELETE',
        headers: {
            "Authorization": "Bearer " + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(features),
    };
    return await fetch(`${process.env.REACT_APP_API_URL}/features/${id}`, options)
        .then(res => res.text().then(data => ({ status: res.status, body: data })))
        .catch(err => err);
}

export async function addFeatures(token, features, id) {
    const options = {
        method: 'POST',
        headers: {
            "Authorization": "Bearer " + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            feature: features
        })
    };
    return await fetch(`${process.env.REACT_APP_API_URL}/features/${id}`, options)
        .then(res => res.text().then(data => ({ status: res.status, body: data })))
        .catch(err => err);
}

export async function deleteImage(token, property_id, img_name) {
    const options = {
        method: 'DELETE',
        headers: {
            "Authorization": "Bearer " + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: property_id,
            imgName: img_name
        })
    };
    return await fetch(`${process.env.REACT_APP_API_URL}/files/delete/property/image`, options)
        .then(res => res.text().then(data => ({ status: res.status, body: data })))
        .catch(err => err);
}

export async function deleteVideo(token, property_id, video_name) {
    const options = {
        method: 'DELETE',
        headers: {
            "Authorization": "Bearer " + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: property_id,
            videoName: video_name
        })
    };
    return await fetch(`${process.env.REACT_APP_API_URL}/files/delete/property/video`, options)
        .then(res => res.text().then(data => ({ status: res.status, body: data })))
        .catch(err => err);
}