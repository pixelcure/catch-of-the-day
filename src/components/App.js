// React
import React from 'react';

import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import Fish from './Fish';
import sampleFishes from '../sample-fishes';
import base from '../base';


class App extends React.Component {

	constructor() {
		super();

		// Add Fish
		this.addFish = this.addFish.bind(this);

		// Load Samples
		this.loadSamples = this.loadSamples.bind(this);

		// Add To Order
		this.addToOrder = this.addToOrder.bind(this);

		// Remove From Order
		this.removeFromOrder = this.removeFromOrder.bind(this);

		// Update Fish
		this.updateFish = this.updateFish.bind(this);

		// Delete Fish
		this.deleteFish = this.deleteFish.bind(this);

		// Get Initial State
		this.state = {
			fishes : {},
			order : {}
		}

	};

	componentWillMount() {
		// this will run right before <App> is rendered
		this.ref = base.syncState(`${this.props.params.storeId}/fishes/`, {
			context : this,
			state : 'fishes'
		});

		// check if there is an order in local storage
		const localStorageRef = localStorage.getItem(`order-${this.props.params.storeId}`)

		if(localStorageRef){
			// set new state
			this.setState({
				// parse order, opposite of stringify
				order : JSON.parse(localStorageRef)
			});
		}
	}

	componentWillUnmount(){
		base.removeBind(this.ref);
	}

	// consider using shouldComponentUpdate() instead of component will update, it's double rendering

	componentWillUpdate(nextProps, nextState){

		// Takes new state, stringifies it and saves it as value in local storage, saves it in relation to store name for key
		localStorage.setItem(`order-${this.props.params.storeId}`, JSON.stringify(nextState.order));

	}

	addFish(fish) {
		// update state
		// ... some new es6 thing i need to learn
		// takes everything from initial state and merges it all into fishes
		const fishes = { ...this.state.fishes }
		// date now
		const timestamp = Date.now();
		// add in our new fish
		fishes[`fish-${timestamp}`] = fish;
		// set state
		this.setState({
			fishes
		});

	};

	addToOrder (key) {
		// state
		const order = {...this.state.order};
		// update or add new fish added
		order[key] = order[key] + 1 || 1;
		// update our state
		this.setState({ order });

	}

	removeFromOrder (key) {
		const order = {...this.state.order};
		delete order[key];
		this.setState({ order });
	}

	loadSamples () {
		this.setState({
			fishes : sampleFishes
		})
	}

	updateFish (key, updatedFish) {
		
		// current fish state
		const fishes = {...this.state.fishes};
		
		// updated fish
		fishes[key] = updatedFish;
		
		// update state
		this.setState({ fishes });
		// above is a shorthand of this.setState({fishes : fishes})
	}

	deleteFish (key) {
		// C.R.U.D - Create, Remove, Update, Delete
		const fishes = {...this.state.fishes};
		// because of firebase, you need to set as null.
		// otherwise:
		// delete fishes[key];
		fishes[key] = null;
		// order[key] = null;
		this.setState({ fishes })
	}

	render () {
		return (
			<div className="catch-of-the-day">
				<div className="menu">
					<Header tagline="Come See the Sea"/>
					<ul className="list-of-fishes">
						{
							Object
							.keys(this.state.fishes)
							.map(
								key => <Fish key={key} index={key} addToOrder={this.addToOrder} details={this.state.fishes[key]} />
							)	
						}
					</ul>
				</div>
				<Order
					fishes={this.state.fishes} 
					order={this.state.order}
					removeFromOrder={this.removeFromOrder}
					params={this.props.params}
				/>
				<Inventory 
					deleteFish={this.deleteFish} 
					updateFish={this.updateFish} 
					fishes={this.state.fishes} 
					addFish={this.addFish} 
					storeId={this.props.params.storeId}
					loadSamples={this.loadSamples} />
			</div>
		)
	}

}

App.propTypes = {
	params : React.PropTypes.object.isRequired
}

export default App;