export async function createCategory(token, data) {
    const options = {
        method: 'POST',
        headers: {
            "Authorization": "Bearer " + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    return await fetch(`${process.env.REACT_APP_API_URL}/category`, options)
        .then(res => res.json().then(data => ({ status: res.status, body: data })))
        .catch(err => err);
}

export async function uploadCategoryImage(token, cat_id, fileList) {
    const formData = new FormData();
    formData.append('image', fileList[0]);
    const options = {
        method: 'PUT',
        headers: {
            "Authorization": "Bearer " + token,
            category_id: cat_id
        },
        body: formData
    };
    return await fetch(`${process.env.REACT_APP_API_URL}/files/upload/category/image`, options)
        .then(res => res.text().then(data => ({ status: res.status, body: data })))
        .catch(err => err);
}