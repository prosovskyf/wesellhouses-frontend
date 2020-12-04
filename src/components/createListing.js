import React, { useState } from 'react';
import { Steps, Button, message, Col } from 'antd';
import { useAuth } from "../context/user";
import { useHistory } from "react-router-dom";
/** Functions */
import { createCategory, uploadCategoryImage } from './createCategoryFunctions'
import {
    createProperty,
    uploadPropertyThumbnail,
    uploadPropertyImages,
    uploadPropertyVideo
} from './createListingFunctions'
import { addFeatures } from './myPropertyFunctions'
/** Components */
import CreateListingCategory from './createListingCategory';
import CreateListingProperty from './createListingProperty';
import CreateListingMedia from './createListingMedia';
const { Step } = Steps;

/**
 * Component to create new property listing, consisting of subcomponents.
 * Subcomponents: createListing... | Category | Media | Property
 * @category Properties
 * @component
 */
function CreateListing() {
    const { authUser } = useAuth();
    const [isLoading, setLoading] = useState(false)
    const [disabled, setDisabled] = useState(false)
    const [current, setCurrent] = useState(0);
    const [category, setCategory] = useState();
    const [property, setProperty] = useState();
    const [files, setFiles] = useState([]);
    var history = useHistory()
    /** Submit all values gathered to create property listing */
    async function submit() {
        try {
            let key = 'load'
            message.loading({ content: 'Uploading all data, please wait', key, duration: 0 });
            setDisabled(true)
            setLoading(true)
            /** Category */
            var category_id;
            if ((category) && (category.type === 'create')) {
                if (category.selected.image.length > 0) {
                    var category_image = category.selected.image
                }
                delete category.selected.image
                category_id = (await createCategory(authUser.token, category.selected)).body[0].id
                if (category_image) {
                    await uploadCategoryImage(authUser.token, category_id, category_image)
                }
            }
            else if ((category) && (category.type === 'assign')) {
                category_id = category.selected
            }
            /** Property */
            if (property) {
                let features = [];
                if (property.features) {
                    features = property.features
                    delete property.features
                }
                property.category_id = category_id
                var createdProperty = await createProperty(authUser.token, property)
                if (features.length > 0) {
                    await addFeatures(authUser.token, features, createdProperty.body[0].id)
                }
                /** Media */
                if (files.thumbnail) {
                    await uploadPropertyThumbnail(authUser.token, createdProperty.body[0].id, files.thumbnail)
                }
                if (files.image) {

                    await uploadPropertyImages(authUser.token, createdProperty.body[0].id, files.image)
                }
                if (files.video) {
                    await uploadPropertyVideo(authUser.token, createdProperty.body[0].id, files.video)
                }
            }
            message.destroy('load');
            setLoading(false);
            message.success('Property listing created, you will be redirected to your properties', 5);
            setDisabled(false);
            history.push('/admin/properties');
        }
        catch (e) {
            message.destroy('load');
            setLoading(false)
            setDisabled(false)
            message.error('Error occured', 3)
        }
    }
    /** Steps of property creation */
    const steps = [
        {
            title: 'Add Category',
            content: <CreateListingCategory passToParent={setCategory} />,
        },
        {
            title: 'Fill Property details',
            content: <CreateListingProperty passToParent={setProperty} token={authUser.token} />,
        },
        {
            title: 'Upload files',
            content: <CreateListingMedia passToParentMedia={setFiles} />,
        },
    ];
    /** Next step */
    function next() {
        if ((category) && (current === 0)) {
            setCurrent(current + 1);
        }
        else if ((property) && (current === 1)) {
            setCurrent(current + 1);
        }
        else {
            message.error('Please check all values', 2);
        }
    };
    /** Previous step */
    function prev() {
        if (current === 1) {
            setCategory()
            setCurrent(current - 1);
        }
        else if (current === 2) {
            setProperty();
            setFiles();
            setCurrent(current - 1);
        }
    };

    return (
        <>
            <br />
            <Col span={20} offset={2}>
                <Steps current={current}>
                    {steps.map(item => (
                        <Step key={item.title} title={item.title} />
                    ))}
                </Steps>
                <br />
                <div className="steps-content">{steps[current].content}</div>
                <br />
                <div className="steps-action">
                    {current > 0 && (
                        <Button type="default" style={{ margin: '0px 4px' }} onClick={() => prev()} disabled={disabled}>
                            Previous
                        </Button>
                    )}
                    {current < steps.length - 1 && (
                        <Button type="primary" onClick={() => next()}>
                            Next
                        </Button>
                    )}
                    {current === steps.length - 1 && (
                        <Button type="primary" loading={isLoading} onClick={() => submit()}>
                            Submit
                        </Button>
                    )}
                </div>
            </Col>
        </>
    );
};

export default CreateListing;