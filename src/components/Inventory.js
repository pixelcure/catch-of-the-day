// React
import React from 'react';
import AddFishForm from './AddFishForm';
import base from '../base';

class Inventory extends React.Component {
	constructor(){
		super();

		// Render Inventory
		this.renderInventory = this.renderInventory.bind(this);
		
		// Handle Change
		this.handleChange = this.handleChange.bind(this);

		// Authenticate
		this.authentication = this.authentication.bind(this);

		// Auth Handler
		this.authHandler = this.authHandler.bind(this);

		this.state = {
			uid : null,
			owner : null
		}
	
	}

	componentDidMount() {
		base.onAuth((user) => {
			if(user) {
				this.authHandler(null, { user })
			}
		});
	}

	handleChange(e, key){
		const fish = this.props.fishes[key];
		// take a copy of the fish and update it with the new data
		
		// e.target will target node
		// const updatedFish = Object.assign({}, fish);

		// const updatedFish = Object.assign(fish, {
		// 	[e.target.name] : e.target.value
		// })
		// aka computed property

		const updatedFish = {
			...fish,
			[e.target.name] : e.target.value
		}

		// update fish
		this.props.updateFish(key, updatedFish);
	}
	
	authentication(provider) {

		// base is our database

		// auth with provider, auth handler is a callback
		base.authWithOAuthPopup(provider, this.authHandler)

	};

	authHandler(err, authData) {
		
		if(err){
			console.log(err);
			return;
		}

		// pass a reference to database of store id
		const storeRef = base.database().ref(this.props.storeId);

		// if there is no owner for store, set it
		storeRef.once('value', (snapshot) =>{

			const data = snapshot.val() || {};

			// claim it as our own if there isn't one already
			if(!data.owner){
				storeRef.set({
					owner : authData.uid
				});
			}

			// set local state
			this.setState({
				uid : authData.uid,
				owner : data.owner || authData.user.uid
			})

		});

	}

	renderInventory(key){

		const fish = this.props.fishes[key];

		return (
			<div className="fish-edit" key={key}>
				<input name="name" value={fish.name} type="text" placeholder="Fish Name" onChange={(e) => this.handleChange(e, key) }/>
				<input name="price" value={fish.price} type="text" placeholder="Fish Price" onChange={(e) => this.handleChange(e, key) } />
				<select name="status" value={fish.status} onChange={(e) => this.handleChange(e, key) }>
					<option value="available">Fresh!</option>
					<option value="unavailable">Sold Out!</option>
				</select>
				<textarea name="desc" value={fish.desc} placeholder="Fish Description" onChange={(e) => this.handleChange(e, key) }></textarea>
				<input type="text" name="image" value={fish.image} placeholder="Fish Image" onChange={(e) => this.handleChange(e, key) } />
				<button onClick={() => this.props.deleteFish(key) }>Delete Fish</button>
			</div>
		)
	}

	renderLogin () {
		return (
			<nav className="login">
				<h2>Inventory</h2>
				<p>Sign in to manage your stores inventory.</p>
				<button className="github" onClick={ () => this.authentication('github') }>Login With Github</button>
			</nav>
		)
	}

	render () {
		const logout = <button>Logout</button>;

		// check if they not logged in at all
		if(!this.state.uid){
			return <div>{this.renderLogin()}</div>
		}

		if(this.state.uid !== this.state.owner){
			return (
				<div>
					<p>Sorry, You aren't owner of this store!</p>
					{logout}
				</div>
			)
		}

		return (
			<div className="inventory">
				<h2>Inventory</h2>
				{logout}
				{ Object.keys(this.props.fishes).map(this.renderInventory) }
				<AddFishForm addFish={this.props.addFish} />
				<button onClick={this.props.loadSamples}>Load Sample Fishes</button>
			</div>
		)
	}

}


Inventory.propTypes = {
	updateFish : React.PropTypes.func.isRequired, 
	fishes : React.PropTypes.object.isRequired,
	deleteFish : React.PropTypes.func.isRequired,
	addFish : React.PropTypes.func.isRequired,
	storeId : React.PropTypes.string.isRequired,
	loadSamples : React.PropTypes.func.isRequired
}

export default Inventory;