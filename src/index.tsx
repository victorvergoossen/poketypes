import React from 'react';
import * as ReactDOM from 'react-dom';
import PageRouter from './PageRouter';
import './styles.css';

const mountNode = document.getElementById("app");
ReactDOM.render(<PageRouter />, mountNode);
