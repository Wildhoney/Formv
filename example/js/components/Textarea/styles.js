import styled from 'styled-components';

export const Textarea = styled.textarea`
    padding: 10px;
    outline: none;
    min-height: 150px;
    border: none;
    resize: none;
    border-radius: 0;
    font-size: 1rem;

    &:read-only {
        color: darkgray;
    }
`;
