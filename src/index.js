// let's go!

// React
import React from 'react';
// React DOM render
import { render } from 'react-dom';
// Router
import { BrowserRouter, Match, Miss } from 'react-router';

// Styles
import './css/style.css';
// App
import App from './components/App';

// Store Picker
import StorePicker from './components/StorePicker';

// Not Found
import NotFound from './components/NotFound';

const Root = () => {
	return (
		<BrowserRouter>
			<div>
				<Match exactly pattern="/" component={StorePicker} />
				<Match pattern="/store/:storeId" component={App} />
				<Miss component={NotFound} />
			</div>
		</BrowserRouter>
	)
}


render(<Root />, document.querySelector('#main'));

