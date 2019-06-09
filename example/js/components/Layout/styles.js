import styled, { createGlobalStyle } from 'styled-components';

export const Global = createGlobalStyle`
    body {
        height: 100vh;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: Lato, Arial, Helvetica, sans-serif;
    }
`;

export const Container = styled.div`
    min-width: 600px;
`;

export const Items = styled.main`
    display: grid;
    grid-gap: 20px;
`;

export const Message = styled.div`
    color: black;
    background-color: #aaf0d1;
    padding: 20px;
`;

export const Label = styled.label`
    font-size: 11px;
    padding: 5px 0;
    text-transform: uppercase;
    color: rgba(0, 0, 0, 0.35);
`;

export const Input = styled.input`
    font-size: 15px;
    padding: 15px;
    outline: none;
    border: 0;
    background-color: #f1ece9;
`;

export const Button = styled.button`
    border: 0;
    background-color: #010203;
    color: white;
    outline: none;
    font-size: 16px;
    padding: 25px;
    cursor: pointer;
    font-family: inherit;
    font-weight: bold;
`;

export const Item = styled.div`
    display: grid;

    ul.vform-messages {
        padding: 0;
        margin: 0;
        list-style-type: square;
        background-color: #dc5349;
        color: darkred;
        font-size: 12px;
        color: white;
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
