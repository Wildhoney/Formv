import styled from 'styled-components';

export const Success = styled.p.attrs({ className: 'formv-message' })`
    background-color: #e5f9e5;
    padding: 20px;
    color: #002800;
    margin: 0;
`;

export const GenericError = styled.p.attrs({ className: 'formv-message' })`
    background-color: #ffeded;
    padding: 20px;
    color: #4c1616;
    margin: 0;
`;

export const ValidationError = styled.ul.attrs({ className: 'formv-messages' })`
    margin: 0;
    padding: 10px 10px 10px 30px;
    list-style-type: square;
    border-top: 0;
    background-color: white;
    font-size: 0.75em;
    color: #ff4c4c;
`;
