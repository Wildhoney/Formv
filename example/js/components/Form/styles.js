import styled from 'styled-components';

export const Container = styled.div`
    display: grid;
    grid-auto-flow: row;
    grid-gap: 20px;
`;

export const Buttons = styled.div`
    display: grid;
    grid-template-columns: 1fr 2fr;
    grid-gap: 20px;
`;

export const Button = styled.button`
    padding: 10px;
    cursor: pointer;
    background-color: lightgray;
    outline: none;
    border: 1px outset #fefefe;

    &:disabled {
        cursor: not-allowed;
    }

    &[type='submit'] {
        font-weight: bold;
    }
`;
