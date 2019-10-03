import styled from 'styled-components';

export const Container = styled.div`
    max-width: 700px;
    padding: 20px;
    display: grid;
    grid-gap: 20px;
`;

export const Image = styled.img`
    width: 100px;
`;

export const Text = styled.p`
    font-size: 1em;
    margin: 0;
`;

export const Anchor = styled.a`
    text-decoration: underline;
    cursor: pointer;
`;

export const Information = styled.div`
    background: url('/images/information.svg') no-repeat 10px center;
    background-size: 20px;
    padding-left: 50px;
    font-size: 0.75em;
    color: #666;
`;
