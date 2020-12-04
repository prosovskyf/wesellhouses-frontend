import React from 'react';
import { unmountComponentAtNode } from "react-dom";
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserContext } from "../context/user";
import { MemoryRouter } from 'react-router-dom'
import CreateListing from '../components/createListing';
import CreateListingProperty from '../components/createListingProperty';
let container = null;
describe('Listing creation', () => {
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
    // Create listing - CATEGORY
    test('Property listing creation -category', async () => {
        render(
            <UserContext.Provider value={{
                authUser: {
                    user: {
                        username: 'test',
                        role: 'agent'
                    }
                }
            }}>
                <MemoryRouter>
                    <CreateListing />
                </MemoryRouter>
            </UserContext.Provider>
        )
        // Check radio button
        expect(screen.getByText(/create category/i)).toBeInTheDocument();
        expect(screen.getByText(/assign category/i)).toBeInTheDocument();
        // Click to create
        act(() => {
            userEvent.click(screen.getByText(/create category/i))
        })
        expect(screen.getByLabelText('Name')).toBeInTheDocument();
        userEvent.type(screen.getByLabelText('Name'), 'testcategory')
        expect(screen.getByLabelText('Name')).toHaveValue('testcategory')
        // Test not saved error
        act(() => {
            userEvent.click(screen.getByRole('button', { name: /next/i }))
        })
        // Error message
        expect(screen.queryByText(/please check all values/i)).toBeInTheDocument()
        expect(screen.queryByText('Location')).not.toBeInTheDocument()
    })
    // Create listing - PROPERTY
    test('Property listing creation -property', async () => {
        // get submitted values, expect to have entered value
        const setProperty = (data) => {
                expect(screen.getByRole('textbox', { name: /title/i })).toHaveValue(data.title)
        }
        const authUser = {
            user: {
                username: 'test',
                role: 'agent',
                token: '12345'
            }
        }
        render(
                <MemoryRouter>
                    <CreateListingProperty token={authUser.user.token} passToParent={setProperty} />
                </MemoryRouter>
        )
        // Check we are in step 2
        expect(screen.queryByText('Location')).toBeInTheDocument()
        // Fill property form
        userEvent.type(screen.getByRole('textbox', { name: /title/i }), 'testtitle')
        userEvent.type(screen.getByRole('textbox', { name: /description/i }), 'testdescription')
        userEvent.type(screen.getByRole('textbox', { name: /price/i }), '233')
        // Check value
        expect(screen.getByRole('textbox', { name: /title/i })).toHaveValue('testtitle')
        // Click save
        act(() => {
            userEvent.click(screen.getByRole('button', { name: /save/i }))
        })
    })
})
