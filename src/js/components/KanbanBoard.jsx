import React, { Component, PropTypes } from 'react';
import {render} from 'react-dom';
import {Link} from 'react-router';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import List from './List';

class KanbanBoard extends Component{
	render(){
//		let cardModal = this.props.children && React.cloneElement(
//				this.props.children, {
//					cards: this.props.cards,
//					cardCallback: this.props.cardCallback
//				}
//			)
		return (
			<div className="app">
				<Link to='/new' className="float-button">+</Link>
				<List id='todo' title="即将做的" 
					cards={this.props.cards.filter((card) => {
						console.log(card)
						return card.status =="todo"
					})}/>
				<List id='in-progress' title="正在做的" 
					cards={this.props.cards.filter((card) =>card.status =="in-progress")}/>
				<List id='done' title="以及做完的" 
					cards={this.props.cards.filter((card) =>card.status =="done")}/>

				{this.props.children}
				{/*{cardModal}*/}
			</div>
		)
	}
}

KanbanBoard.propTypes = {
	cards: PropTypes.arrayOf(PropTypes.object),
//	taskCallbacks: PropTypes.object,
//	cardCallback: PropTypes.object
}

export default DragDropContext(HTML5Backend)(KanbanBoard);