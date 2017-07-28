import React, { Component, PropTypes } from 'react';
import {render} from 'react-dom';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import List from './List';

class KanbanBoard extends Component{
	render(){
		return (
			<div className="app">
				<List id='todo' title="即将做的" 
					taskCallbacks={this.props.taskCallbacks} 
					cardCallback={this.props.cardCallback}
					cards={this.props.cards.filter((card) =>card.status =="todo")}/>
				<List id='in-progress' title="正在做的" 
					taskCallbacks={this.props.taskCallbacks} 
					cardCallback={this.props.cardCallback} 
					cards={this.props.cards.filter((card) =>card.status =="in-progress")}/>
				<List id='done' title="以及做完的" 
					taskCallbacks={this.props.taskCallbacks} 
					cardCallback={this.props.cardCallback} 
					cards={this.props.cards.filter((card) =>card.status =="done")}/>
			</div>
		)
	}
}

KanbanBoard.propTypes = {
	cards: PropTypes.arrayOf(PropTypes.object),
	taskCallbacks: PropTypes.object,
	cardCallback: PropTypes.object
}

export default DragDropContext(HTML5Backend)(KanbanBoard);