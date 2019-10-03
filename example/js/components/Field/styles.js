import styled from 'styled-components';

export const Container = styled.div`
    display: grid;
    grid-auto-flow: row;
    border: 1px solid lightgray;

    ul.formv-messages-error-validation {
        margin: 0;
        padding: 10px 10px 10px 30px;
        list-style-type: square;
        border-top: 0;
        background-color: white;
        font-size: 0.75em;
        color: #ff4c4c;
    }
`;
