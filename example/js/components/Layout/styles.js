import styled, { createGlobalStyle } from 'styled-components';

export const Global = createGlobalStyle`
    body {
        height: 100vh;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(0, 0, 0, 0.05);
    font-family: Roboto, Arial, Helvetica, sans-serif;
    }
`;

export const Container = styled.div`
    background-color: white;
    min-width: 600px;
    padding: 30px;
    box-shadow: 0 0 50px rgba(0, 0, 0, 0.15);
`;

export const Items = styled.main`
    display: grid;
    grid-gap: 20px;
`;

export const Message = styled.div`
    color: green;
    background-color: rgba(200, 255, 200, 0.75);
    padding: 20px;
`;

export const Label = styled.label`
    font-size: 11px;
    padding: 5px 0;
    text-transform: uppercase;
`;

export const Input = styled.input`
    font-size: 15px;
    padding: 15px;
    outline: none;
`;

export const Button = styled.button`
    border: 0;
    background-color: rgba(0, 0, 0, 0.05);
    outline: none;
    font-size: 16px;
    padding: 20px;
    cursor: pointer;
    letter-spacing: 1px;
    font-weight: bold;
`;

export const Item = styled.div`
    display: grid;

    ul.vform-messages {
        padding: 0;
        margin: 0;
        list-style-type: square;
        background-color: rgba(255, 0, 0, 0.15);
        color: darkred;
        font-size: 12px;
        padding: 10px;

        &.vform-messages-single {
            list-style-type: none;
        }

        &.vform-messages-multiple {
            list-style-type: square;
            margin-left: 20px;
        }
    }
`;

export const Reference = styled.div`
    display: none;
`;
