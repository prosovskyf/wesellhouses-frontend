import React, { useState, useEffect } from 'react';
import { Select, message, Radio, Row } from 'antd';
import CreateCategory from './createCategory'
import { getCategories } from './propertiesGridFunctions'
const { Option } = Select;

/**
 * Component to select or create category in property creation process
 * Subcomponents: CreateCategory
 * @category Properties
 * @component
 */
function CreateListingCategory(props) {
    const [buttonValue, setButtonValue] = useState('assign')
    const [categories, setCategories] = useState([])
    const [selectedCategory, selectCategory] = useState('Choose category')
    /** Get all categories and set state with result */
    async function getListCategories() {
        let categories = await getCategories()
        if (categories.status === 200) {
            setCategories(categories.body)
        }
        else {
            setCategories([])
        }
    }
    /** Save checked categories to state and return to parent */
    function onSelect(selected) {
        selectCategory(selected);
        message.success('Category selected, click Next', 3)
        props.passToParent({ selected: selected, type: buttonValue });
    }
    /** When clicked save, category is passed to parent */
    function onCreateCategory(returned) {
        message.success('Category will be created, click next')
        props.passToParent({ selected: returned, type: buttonValue });
    }
    /** Run getListCategories on button change state */
    useEffect(() => {
        getListCategories();
    }, [buttonValue])
    /** Change button value and set categories to empty array */
    function onChange(e) {
        const { value } = e.target;
        setButtonValue(value)
        setCategories([])
    };
    /** Map categories to Option bar */
    const categoryBar = categories.map(category => {
        return (
            <Option key={category.id} value={category.id}>{category.name}</Option>
        )
    })

    const options = [
        { label: 'Assign category', value: 'assign' },
        { label: 'Create category', value: 'create' },
    ];
    return (
        <>
            <Row>
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
                : (
                    <>
                        <Row>
                            <h3>Choose category: </h3>
                        </Row>
                        <p>You can view all info about category in Manage categories</p>
                        <Row>
                            <Select value={selectedCategory} style={{ width: 160 }}
                                onChange={onSelect}>
                                {categoryBar}
                            </Select>
                        </Row>
                    </>
                )
            }
        </>
    );
};

export default CreateListingCategory;