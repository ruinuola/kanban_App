import React, { Component, PropTypes } from 'react';
import {render} from 'react-dom';
import TaskActionCreators from '../actions/TaskActionCreators';

class CheckList extends Component{
	checkInputKeyPress(evt){
		if (evt.key === 'Enter') {
//			this.props.taskCallbacks.add(this.props.cardId, evt.target.value)
			let newTask = {id: Date.now(), name:evt.target.value, done: false}
			TaskActionCreators.addTask(this.props.cardId, newTask)
			evt.target.value = ''
		}
	}
	render(){
		let tasks=this.props.tasks.map((value,index) =>(
			<li className="checklist_task" key={index}>
				<input type="checkbox" checked={value.done} 
					onChange={
							TaskActionCreators.toggleTask.bind( null, this.props.cardId, value, index )
					}/>
				{value.name}{' '}
				<a href="javascript:;" className="checklist_task--remove"
					onClick={
							TaskActionCreators.deleteTask.bind(null, this.props.cardId, value, index)
					}/>
			</li>
		))

		return(
			<div className="checklist">
				<ul>{tasks}</ul>
				<input className="checklist--add-task"
						placeholder="试着添加一个任务吧"
						onKeyPress={this.checkInputKeyPress.bind(this)}/>
			</div>
		)
	}
}

CheckList.propTypes = {
	cardId: PropTypes.number,
	tasks: PropTypes.arrayOf(PropTypes.object),
	taskCallbacks: PropTypes.object,
}

export default CheckList; 