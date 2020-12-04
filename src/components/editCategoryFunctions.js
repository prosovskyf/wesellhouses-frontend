export async function updateCategoryById(token, data, id) {
    const options = {
        method: 'PUT',
        headers: {
            "Authorization": "Bearer " + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    return await fetch(`${process.env.REACT_APP_API_URL}/category/${id}`, options)
        .then(res => res.text().then(data => ({ status: res.status, body: data })))
        .catch(err => err);
}

export async function getCategory(token, id) {
    const options = {
        method: 'GET',
        headers: {
            "Authorization": "Bearer " + token,
            'Content-Type': 'application/json'
        },
    };
    return await fetch(`${process.env.REACT_APP_API_URL}/category/${id}`, options)
        .then(res => res.json().then(data => ({ status: res.status, body: data })))
        .catch(err => err);
}

export async function deleteCategory(token, id) {
    const options = {
        method: 'DELETE',
        headers: {
            "Authorization": "Bearer " + token,
            'Content-Type': 'application/json'
        },
    };
    return await fetch(`${process.env.REACT_APP_API_URL}/category/${id}`, options)
        .then(res => res.text().then(data => ({ status: res.status, body: data })))
        .catch(err => err);
}

export async function deleteCategoryImage(token, category_id, category_name, url) {
    const options = {
        method: 'DELETE',
        headers: {
            "Authorization": "Bearer " + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: category_id,
            name: category_name,
            path: url
        })
    };
    return await fetch(`${process.env.REACT_APP_API_URL}/files/delete/category/image`, options)
        .then(res => res.text().then(data => ({ status: res.status, body: data })))
        .catch(err => err);
}
