import React, { useEffect, useState } from 'react';
import {
  useParams,
  useHistory
} from "react-router-dom";
import { Row, Col, Radio, message } from 'antd';
import PropertyPageCarousel from './propertyPageCarousel'
import PropertyPageBody from './propertyPageBody'
import PropertyPageAgent from './propertyPageAgent'

/**
 * Component to show all information about specific property
 * Including agent info, images and video
 * Images and video are greyed out when not available
 * Including button to contact and send message to agent (see PropertyPageAgent)
 * Sub components: PropertyPageAgent, PropertyPageBody, PropertyPageCarousel
 * @category Properties
 * @component
 */
const PropertyPage = () => {
  const { id } = useParams();
  const [statusCode, setStatusCode] = useState()
  const [property, setProperty] = useState([]);
  const [agentInfo, setAgentInfo] = useState([]);
  const [buttonValue, setButtonValue] = useState('images')
  let history = useHistory()
  /** Load property by ID */
  async function getPropertyById() {
    const options = {
      method: 'GET',
    };
    await fetch(`${process.env.REACT_APP_API_URL}/properties/${id}`, options)
      .then(res => {
        setStatusCode(res.status)
        res.json().then(data => {
          setProperty(data.property[0])
          setAgentInfo(data.agent[0])
        })
      })
      .catch(err => message.error('error occured'));
  }
  /** On load and when ID changes, call getPropertyById */
  useEffect(() => {
    getPropertyById();
  }, [id])
  /** Switch between Images/Video */
  function onChange(e) {
    const { value } = e.target;
    setButtonValue(value)
  };
  /** Button values */
  const options = [
    { label: 'Images', value: 'images', disabled: (property.image_url === null) },
    { label: 'Video', value: 'video', disabled: (property.video_url === null) },
  ];
  return (
    <>
      <div style={{ padding: "30px", textAlign: "center", width: "100%", height: "60%", background: "transparent" }}>
        {statusCode === 404
          && history.push('/404')}
        <Row>
          <Col span={10}>
            <Radio.Group
              defaultValue={buttonValue}
              options={options}
              onChange={onChange}
              value={buttonValue}
              optionType="button"
              buttonStyle="solid"
            />
            <br />
            <br />
            {buttonValue === 'images'
              ? <PropertyPageCarousel image_url={property.image_url} value={buttonValue} />
              : <PropertyPageCarousel video_url={property.video_url} value={buttonValue} />
            }
          </Col>
          <Col span={14}>
            <Row>
              <br />
              <PropertyPageBody property={property} agent={agentInfo} />
            </Row>
            <br />
            <Row>
              <PropertyPageAgent agent={agentInfo} property={property} />
            </Row>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default PropertyPage;