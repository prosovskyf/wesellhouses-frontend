import React, { useState, useEffect } from 'react';
import { message, Radio, Row, Col } from 'antd';
import { Link } from "react-router-dom";
import CreateCategory from './createCategory'
import Category from './categoryCard.js'
import Loader from './loader'
import { useAuth } from "../context/user";
import { getCategories } from './propertiesGridFunctions'
import { createCategory, uploadCategoryImage } from './createCategoryFunctions'

/**
 * Component to manage categories, choosing from 2 subcomponents (edit or create)
 * Subcomponents: CreateCategory, Category
 * @category Categories
 * @component
 */
function ManageCategories() {
    const { authUser } = useAuth();
    const [buttonValue, setButtonValue] = useState('edit')
    const [categories, setCategories] = useState([])
    const [statusCode, setStatusCode] = useState()
    /** Get list of categories and set state */
    async function getListCategories() {
        let categories = await getCategories()
        setStatusCode(categories.status)
        if (categories.status === 200) {
            setCategories(categories.body)
        }
        else {
            setCategories([])
        }
    }
    /** Create category and show message */
    async function onCreateCategory(category) {
        try {
            let key = 'load'
            message.loading({ content: 'Creating category...', key, duration: 0 });
            if (category) {
                if (category.image.length > 0) {
                    var category_image = category.image
                }
                delete category.image
                let category_id = (await createCategory(authUser.token, category)).body[0].id
                if (category_image) {
                    await uploadCategoryImage(authUser.token, category_id, category_image)
                }
            }
            message.destroy('load');
            message.success('Category created!')
            setButtonValue('edit')
        }
        catch (e) {
            message.destroy('load');
            message.error('Error occured when creating category', 2);
        }
    }
    /** Call getListCategories when button value changes */
    useEffect(() => {
        getListCategories();
    }, [buttonValue])
    /** Change button value and set state of categories to empty array */
    function onChange(e) {
        const { value } = e.target;
        setButtonValue(value)
        setCategories([])
    };
    /** Map category list */
    const categoryList = categories.map(category => {
        var url = category.image_url;
        var img;
        if (url == null) {
            img = <div className="placeholder" style={{ height: 300 }} />
        }
        else {
            let escUrl = url.replace(/\./, '');
            img = <img style={{ height: 300 }} alt="category" key={category.id} src={`${process.env.REACT_APP_BACKEND}${escUrl}`} />
        }
        return (
            <div style={{ padding: "20px" }} key={category.id}>
                <Col span={6}>
                    <Link to={`/admin/category/${category.id}`}>
                        <Category {...category} img={img} />
                    </Link>
                </Col>
            </div>
        )
    });

    const options = [
        { label: 'Edit category', value: 'edit' },
        { label: 'Create category', value: 'create' },
    ];
    return (
        <>
            <br />
            <h1 style={{ textAlign: "center" }}>Category management</h1>
            <Row type="flex" justify="space-around">
                <Radio.Group
                    defaultValue={buttonValue}
                    options={options}
                    onChange={onChange}
                    value={buttonValue}
                    optionType="button"
                    buttonStyle="solid"
                />

            </Row>
            <br />
            {buttonValue === 'create'
                ? <CreateCategory pass={onCreateCategory} />
                : categories.length > 0
                    ? (
                        <Row type="flex" justify="space-around">
                            {categoryList}
                        </Row>
                    )
                    : (statusCode === 404)
                        ? 'No categories found'
                        : <Loader />
            }
        </>
    );
};

export default ManageCategories;