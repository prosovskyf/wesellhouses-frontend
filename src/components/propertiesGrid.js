import React, { useEffect, useState } from 'react';
import { Col, Row, Select, Pagination, Image } from 'antd'
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import PropertyCard from './propertyCard.js'
import { getProperties, getFeatures, getCategories } from './propertiesGridFunctions'
import Loader from './loader'
import placeholder from '../img/placeholder.png'
const { Option } = Select;

/**
 * Component to show all properties using sub-comp PropertyCard and allow filters
 * Sub components: PropertyCard
 * @category Properties
 * @component
 */
function PropertiesGrid() {
    const [statusCode, setStatusCode] = useState()
    const [properties, setProperties] = useState([]);
    /** Filtering */
    const [query, setQuery] = useState('')
    const [features, setFeatures] = useState([]);
    const [categories, setCategories] = useState([])
    const [selectedFeatures, selectFeature] = useState([])
    const [selectedCategory, selectCategory] = useState('')
    /** Pagination */
    const [elements, setElements] = useState([]);
    const [direction, setDirection] = useState('ASC')
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [offset, setOffset] = useState(0)

    const location = useLocation();
    /** Load properties and set them to state */
    async function getPropertiesIn() {
        let result = await getProperties(query)
        if (result.status === 200) {
            setStatusCode(result.status)
            setProperties(result.body)
        }
        else {
            setStatusCode(result.status)
            setProperties([])
        }
    }
    /** Get features and categories */
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
    /** On feature, category or direction change: set properties state to empty array and set new query */
    useEffect(() => {
        setProperties([])
        setQuery(`features=${selectedFeatures.toString()}&category=${selectedCategory}&direction=${direction}`)
    }, [selectedFeatures, selectedCategory, direction])
    /** When query changes call getPropertiesIn */
    useEffect(() => {
        getPropertiesIn();
    }, [query])
    /** Pagination */
    useEffect(() => {
        setElements(properties.slice(offset, offset + limit));
    }, [properties])
    /** If location changes, call getFeatures category and determine selected category */
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
    /** Select feature */
    function onFeature(features) {
        selectFeature(features)
    }
    /** Clear features selection */
    function onFeatureClear() {
        selectFeature([])
    }
    /** Select category */
    function onSelect(selected) {
        selectCategory(selected)
    }
    /** Set direction */
    function onDirection(direction) {
        setDirection(direction)
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
                    <Link to={`/properties/${property.id}`}>
                        <PropertyCard {...property} img={img} />
                    </Link>
                </Col>
            </div>
        )
    });

    if (features.length > 0) {
        /** Feature list */
        var featureBar = features.map(feature => {
            return (
                <Option key={feature.id} value={feature.feature}><b>{feature.feature}</b></Option>
            )
        })
    }
    /** Category selection bar */
    const categoryBar = categories.map(category => {
        return (
            <Option key={category.id} value={category.name}>{category.name}</Option>
        )
    })

    return (
        <>
            <Row type="flex" >
                {/* Features */}
                <Col span={16} style={{ textAlign: "left", paddingLeft: "30px" }}>
                    {<h3>Select features</h3>}
                    <Select
                        mode="tags"
                        size="default"
                        placeholder="Please select features"
                        onChange={onFeature}
                        style={{ width: '45%' }}
                        allowClear={true}
                        onClear={onFeatureClear}>
                        {featureBar}
                    </Select>
                </Col>
                <Col span={4} style={{ textAlign: "left" }}>
                    {<h3>Category</h3>}
                    <Select value={selectedCategory} defaultValue='Choose Category' style={{ width: 160 }} onChange={onSelect}>
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

export default PropertiesGrid;