import React, { Component, PropTypes } from 'react';
import {render} from 'react-dom';
import {DropTarget} from 'react-dnd';

import Card from './Card';
import constants from './constants';

// 创建spec对象
const listTargetSpec = {
	hover(props, monitor){
		const draggedId = monitor.getItem().id
		props.cardCallback.updateStatus(draggedId, props.id)
	}
}

// 创建collect对象
let collect = (connect, monitor)=>{
	return {
		connectDropTarget: connect.dropTarget()
	}
}

class List extends Component{
	render(){
		const {connectDropTarget} = this.props;

		var cards=this.props.cards.map((card) =>{
			return <Card key={card.id} 
				taskCallbacks={this.props.taskCallbacks} 
				cardCallback={this.props.cardCallback} 
				id={card.id} title={card.title} description={card.description} 
				color={card.color} tasks={card.tasks} />
		})
		
		return connectDropTarget(
			<div className="list">
				<h1>{this.props.title}</h1>
				{cards}
			</div>
		)
	}
}

List.propTypes = {
	title: PropTypes.string.isRequired,
	cards: PropTypes.arrayOf(PropTypes.object),
	taskCallbacks: PropTypes.object,
	cardCallback: PropTypes.object,
	connectDropTarget: PropTypes.func.isRequired
}

export default DropTarget(constants.CARD, listTargetSpec, collect)(List); 