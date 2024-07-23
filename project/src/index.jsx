import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import RoutesDef from "./RoutesDef";


window.React = React

const renderMethod = module.hot ? ReactDOM.render : ReactDOM.hydrate;

renderMethod(
	<BrowserRouter>
		<RoutesDef />
	</BrowserRouter>,
	document.getElementById("root")
);

