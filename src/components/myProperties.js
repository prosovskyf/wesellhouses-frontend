import React, { useEffect, useState } from 'react';
import { Col, Row, Select, Pagination, Switch, Image } from 'antd'
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import PropertyCard from './propertyCard.js'
import { getProperties, getHighPriority } from './myPropertiesFunctions'
import { FireTwoTone } from '@ant-design/icons'
import { getFeatures, getCategories } from './propertiesGridFunctions'
import Loader from './loader'
import { useAuth } from "../context/user";
import placeholder from '../img/placeholder.png'
const { Option } = Select;

/**
 * Component to show all agents properties with ability to filter
 * Subcomponents: PropertyCard
 * @category Properties
 * @component
 */
function MyProperties() {
    const { authUser } = useAuth();
    const [statusCode, setStatusCode] = useState()
    /** Filtering */
    const [query, setQuery] = useState('')
    const [properties, setProperties] = useState([]);
    const [features, setFeatures] = useState([]);
    const [categories, setCategories] = useState([])
    const [isHot, setHot] = useState(false)
    const [selectedFeatures, selectFeature] = useState([])
    const [selectedCategory, selectCategory] = useState('')
    /** Pagination */
    const [elements, setElements] = useState([]);
    const [direction, setDirection] = useState('ASC')
    const [isDisabled, setDisabled] = useState(false)
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [offset, setOffset] = useState(0)

    const location = useLocation();
    /** Load all user's properties */
    async function getPropertiesIn() {
        var result;
        if (isHot === true) {
            setDisabled(true)
            result = await getHighPriority(authUser.token);
        }
        else {
            setDisabled(false)
            result = await getProperties(authUser.token, query)
        }
        if (result.status === 200) {
            setStatusCode(result.status)
            setProperties(result.body)
        }
        else {
            setStatusCode(result.status)
            setProperties([])
        }
    }
    /** Load features and categories for filters */
    async function getFeaturesCategories() {
        let categories = await getCategories()
        if (categories.status === 200) {
            setCategories(categories.body)
        }
        else {
            setCategories([])
        }
        let features = await getFeatures()
        if (features.status === 200) {
            setFeatures(features.body)
        }
    }
    /** Set state of properties to empty array and set query based on applied filters */
    useEffect(() => {
        setProperties([])
        setQuery(`features=${selectedFeatures.toString()}&category=${selectedCategory}&direction=${direction}`)
    }, [selectedFeatures, selectedCategory, direction])
    /** Call getPropertiesIn */
    useEffect(() => {
        getPropertiesIn();
    }, [query, isHot])
    /** Set properties to elements for pagination */
    useEffect(() => {
        setElements(properties.slice(offset, offset + limit));
    }, [properties, offset, limit])
    /** Set category based on location, if any */
    useEffect(() => {
        getFeaturesCategories();
        if (location.search.includes('category=')) {
            let filter = location.search.replace(/\?category=/, '');
            selectCategory(filter)
        }
        else {
            selectCategory('')
        }
        setQuery('')
    }, [location])
    /** Move between pages */
    function onPage(page, limit) {
        const offset = (page - 1) * limit;
        setPage(page)
        setOffset(offset)
        setLimit(limit)
        setElements(properties.slice(offset, offset + limit));
    }
    /** Select features */
    function onFeature(features) {
        selectFeature(features)
    }
    /** Clear features filter */
    function onFeatureClear() {
        selectFeature([])
    }
    /** Select category */
    function onSelect(selected) {
        selectCategory(selected)
    }
    /** Select direction */
    function onDirection(direction) {
        setDirection(direction)
    }
    /** Select show only high priority properties */
    function handleHot() {
        setHot(!isHot)
    }
    /** Property list */
    const propertyList = elements.map(property => {
        var escUrl;
        var url = property.image_url;
        if (url != null) {
            escUrl = url.replace(/\./, '');
        }
        var img = <Image width="100%" height={300} alt="property" key={property.id} fallback={placeholder}
            src={`${process.env.REACT_APP_BACKEND}${escUrl}thumbnail.jpeg`} />
        return (
            <div style={{ padding: "20px" }} key={property.id}>
                <Col span={6}>
                    <Link to={`/admin/properties/${property.id}`}>
                        <PropertyCard {...property} img={img} />
                    </Link>
                </Col>
            </div>
        )
    });

    if (features.length > 0) {
        /** Features list */
        var featureBar = features.map(feature => {
            return (
                <Option key={feature.id} value={feature.feature}><b>{feature.feature}</b></Option>
            )
        })
    }
    /** Category select bar */
    const categoryBar = categories.map(category => {
        return (
            <Option key={category.id} value={category.name}>{category.name}</Option>
        )
    })

    return (
        <>
            <Row key={0} type="flex" >
                {/* Features */}
                <Col span={12} style={{ textAlign: "left", paddingLeft: "30px" }}>
                    {<h3>Select features</h3>}
                    <Select
                        mode="tags"
                        size="default"
                        placeholder="Please select features"
                        onChange={onFeature}
                        style={{ width: '45%' }}
                        allowClear={true}
                        disabled={isDisabled}
                        onClear={onFeatureClear}>
                        {featureBar}
                    </Select>
                </Col>
                <Col span={4} style={{ textAlign: "center" }}>
                    {<h3>High priority properties</h3>}
                    <Switch
                        checkedChildren={<FireTwoTone twoToneColor="#FF0000" />}
                        unCheckedChildren={<FireTwoTone />}
                        onClick={handleHot}
                        size="default"
                    />
                </Col>
                <Col span={4} style={{ textAlign: "left" }}>
                    {<h3>Category</h3>}
                    <Select value={selectedCategory} defaultValue='Choose Category' style={{ width: 160 }}
                        disabled={isDisabled} onChange={onSelect}>
                        <Option value=''>All</Option>
                        {categoryBar}
                    </Select>
                </Col>{'  '}
                {/* Direction */}
                <Col span={4} style={{ textAlign: "left" }}>
                    {<h3>Order</h3>}
                    <Select defaultValue='Ascending' style={{ width: 120 }} onChange={onDirection}>
                        <Option value='ASC'>Ascending</Option>
                        <Option value='DESC'>Descending</Option>
                    </Select>
                </Col>
            </Row>
            <Row type="flex" justify="space-around">
                {((properties.length > 0) && (elements.length > 0))
                    ? propertyList
                    : (statusCode === 404)
                        ? 'No properties found using this filter'
                        : <Loader />
                }
            </Row>
            {properties.length > 0
                && <Pagination style={{ textAlign: "center" }} current={page} onChange={onPage}
                    pageSize={limit} defaultCurrent={10} total={properties.length}
                    showSizeChanger onShowSizeChange={onPage} pageSizeOptions={[1, 10, 20, 50, 100]}
                />}
        </>
    );
}

export default MyProperties;