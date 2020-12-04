import React, { useEffect, useState } from 'react';
import { Col, Row } from 'antd'
import { Link } from "react-router-dom";
import Category from './categoryCard.js'
import { getCategories } from './propertiesGridFunctions'
import Loader from './loader'

/**
 * Component to render list of category cards
 * Subcomponents: Category
 * @category Categories
 * @component 
 */
function CategoriesGrid() {
    const [categories, setCategories] = useState([]);
    const [statusCode, setStatusCode] = useState()
    /** Fetch all categories and set state with result */
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
    /** Run getListCategories on component mount */
    useEffect(() => {
        getListCategories();
    }, [])

    if (categories.length > 0) {
        /** Map category list */
        var categoryList = categories.map(category => {
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
                <>
                    <div style={{ padding: "20px" }} key={category.id}>
                        <Col span={6}>
                            <Link to={`/properties?category=${category.name}`}>
                                <Category {...category} img={img} />
                            </Link>
                        </Col>
                    </div>

                </>
            )
        });
    }
    return (
        <Row type="flex" justify="space-around">
            {categories.length > 0
                ? categoryList
                : (statusCode === 404)
                    ? 'No categories found'
                    : <Loader />
            }
        </Row>
    );
}

export default CategoriesGrid;