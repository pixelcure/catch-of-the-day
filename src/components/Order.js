// React
import React from 'react';
// Format Price
import { formatPrice } from '../helpers';
// Transition Group, maintaned by react/facebook, no longer a part of react since it's not ALWAYS needed
import CSSTransitionGroup from 'react-addons-css-transition-group';

class Order extends React.Component {
	
	constructor(){
		super();
		this.renderOrder = this.renderOrder.bind(this);
	}

	renderOrder(key) {
		const fish = this.props.fishes[key];
		const count = this.props.order[key];
		const removeButton = <button onClick={ () => this.props.removeFromOrder(key) }>&times;</button>;

		if(!fish || fish.status === 'unavailable'){
			return <li key={key}>Sorry, { fish ? fish.name : 'fish' } is no longer available! { removeButton }</li>
		}

		return (
			<li key={key}>
				<span>{count}lbs {fish.name} {removeButton}</span>
				<span className="price">{formatPrice(count * fish.price)}</span>
			</li>
		)

	}

	render () {
		
		const orderIds = Object.keys(this.props.order);
		
		// reduce must start with a value which is passed in
		const total = orderIds.reduce((prevTotal, key) => {

			const fish = this.props.fishes[key];
			const count = this.props.order[key];
			const isAvailable = fish && fish.status === 'available';

			if(isAvailable){
				return prevTotal + (count * fish.price || 0);
			}

			return prevTotal;
		}, 0);

		return (
			<div className="order-wrap">
				<h2>Your Order</h2>
				<CSSTransitionGroup 
					className="order"
					component="ul"
					transitionName="order"
					transitionEnterTimeout={500}
					transitionLeaveTimeout={500}
				>
					{orderIds.map(this.renderOrder)}
					<li className="total">
						<strong>Total:</strong>
						{formatPrice(total)}
					</li>
				</CSSTransitionGroup>
			</div>
		)
	}

}

Order.propTypes = {
	removeFromOrder : React.PropTypes.func.isRequired,
	fishes : React.PropTypes.object.isRequired,
	order : React.PropTypes.object.isRequired
}

export default Order;