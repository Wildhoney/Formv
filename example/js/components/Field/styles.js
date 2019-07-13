import styled from 'styled-components';

export const Container = styled.div`
    display: grid;
    grid-auto-flow: row;

    ul {
        margin: 0;
        padding: 10px 10px 10px 30px;
        list-style-type: square;
        border: 1px solid lightgray;
        border-top: 0;
        margin-top: -1px;
        background-color: white;
        font-size: 0.75em;
        color: #ff4c4c;
    }
`;
