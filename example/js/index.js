import React from 'react';
import { render } from 'react-dom';
import { createGlobalStyle } from 'styled-components';
import Layout from './components/Layout';

export const Styles = createGlobalStyle`
    body {
        font-family: Lato, Arial, Helvetica, sans-serif;
        min-height: 100vh;
        padding: 0;
        margin: 0;
        display: flex;
        place-items: center;
        place-content: center;
    }
`;

document.addEventListener('DOMContentLoaded', () => {
    const node = document.querySelector('*[data-app]');
    render(
        <>
            <Styles />
            <Layout />
        </>,
        node,
    );
});
