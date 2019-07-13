import styled from 'styled-components';

export const Container = styled.div`
    display: grid;
    grid-auto-flow: row;
    grid-gap: 20px;
`;

export const Button = styled.button`
    padding: 10px;
    cursor: pointer;
    background-color: lightgray;
    outline: none;

    &:disabled {
        cursor: not-allowed;
    }
`;
