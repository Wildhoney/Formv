import React from "react";
import { render } from "react-dom"
import Layout from './components/Layout';

document.addEventListener("DOMContentLoaded", () => {
    const node = document.querySelector("*[data-app]");
    render(<Layout />,node);
})
