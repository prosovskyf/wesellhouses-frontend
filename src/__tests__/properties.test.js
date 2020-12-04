import React from 'react';
import { unmountComponentAtNode } from "react-dom";
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserContext } from "../context/user";
import { MemoryRouter } from 'react-router-dom'
import PropertiesGrid from '../components/propertiesGrid';
import PropertyCard from '../components/propertyCard';
import PropertyPageBody from '../components/propertyPageBody';
import PropertyPageAgent from '../components/propertyPageAgent';
let container = null;
describe('Check properties page', () => {
    beforeEach(() => {
        // Create DOM element before test
        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach(() => {
        // Clean after test
        unmountComponentAtNode(container);
        container.remove();
        container = null;
    });
    // Properties grid page
    test('Headings', async () => {
        render(
            <MemoryRouter>
                <PropertiesGrid />
            </MemoryRouter>
        )
        expect(screen.getByRole('heading', { name: /order/i })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /category/i })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /select features/i })).toBeInTheDocument();
    })
    // Property Card mock
    test('Property card', async () => {
        const property = {
            title: 'testtitle',
            description: 'testdescription'
        }
        render(
            <MemoryRouter>
                <PropertyCard {...property} />
            </MemoryRouter>
        )
        expect(screen.getByText(property.title)).toBeInTheDocument();
        expect(screen.getByText(property.description)).toBeInTheDocument();
    })
    // Property Page with subcomponent property agent
    test('Property page with agent info and modal click', async () => {
        const property = {
            title: 'testtitle',
            description: 'testdescription',
            features: ['hello']
        }
        const agentInfo = {
            firstname: 'test',
            lastname: 'testlastname',
            email: 'testemail',
            picture_url: '/'
        }
        render(
            <UserContext.Provider value={{
                authUser: {
                    user: {
                        username: 'test',
                        role: 'user'
                    }
                }
            }}>
                <MemoryRouter>
                    <PropertyPageBody property={property} agentInfo={agentInfo} />
                    <PropertyPageAgent agent={agentInfo} property={property} />
                </MemoryRouter>
            </UserContext.Provider>
        )
        //Property Page body
        expect(screen.getByText(property.title)).toBeInTheDocument();
        expect(screen.getByText(property.description)).toBeInTheDocument();
        expect(screen.getByText(property.features)).toBeInTheDocument();
        //Property Page agent
        expect(screen.getByText(agentInfo.firstname + ' ' + agentInfo.lastname)).toBeInTheDocument();
        expect(screen.getByText(agentInfo.email)).toBeInTheDocument();
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        // Click to open modal
        act(() => {
            userEvent.click(screen.getByText(/contact agent/i))
        })
        // Check modal is opened
        expect(screen.queryByRole('dialog')).toBeInTheDocument();
        expect(screen.getByRole('dialog', { name: /message/i })).toBeInTheDocument();
    })
})
