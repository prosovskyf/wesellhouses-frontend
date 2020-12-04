import React from 'react';
import CategoriesGrid from './categoriesGrid';

/**
 * Component to show home page with categoriesGrid
* Subcomponents: CategoriesGrid
 * @category Default pages
 * @component
 */
function Home() {
    return (
        <>
            <div style={{ textAlign: "center" }}>
                <br></br>
                <h1>
                    Welcome to We Sell Houses agency 
            </h1>
                <h3>
                    Please choose from categories
            </h3>
            </div>
            <CategoriesGrid />
        </>
    );
}

export default Home;