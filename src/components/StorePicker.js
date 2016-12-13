// React
import React from 'react';
// React DOM render
import { render } from 'react-dom';
// Helpers
import { getFunName } from '../helpers';

class StorePicker extends React.Component {

	goToStore(e) {
		e.preventDefault();
		// First grab the text from the box
		const value = this.storeInput.value;
		// Second we're going to transition from / to /store/:storeId
		this.context.router.transitionTo(`/store/${value}`)
	}

	render () {
		return (
			<form className='store-selector' onSubmit={this.goToStore.bind(this)}>
				<h2>Please Enter A Store</h2>
				<input ref={ (input) => { this.storeInput = input; } } type="text" required placeholder="Store Name" defaultValue={getFunName()} />
				<button type="submit">Visit Store -></button>
			</form>
		)
	}

}

StorePicker.contextTypes = {
	router : React.PropTypes.object
}

export default StorePicker