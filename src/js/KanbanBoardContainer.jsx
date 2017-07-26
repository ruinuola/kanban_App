import React, {Component} from 'react'
import KanbanBoard from './KanbanBoard'
import 'whatwg-fetch'
import 'babel-polyfill'
import update from 'react-addons-update'

const API_URL = 'http://kanbanapi.pro-react.com'
const API_HEADERS = {
	'Content-Type': 'application/json',
	Authorization: 'any-string-you-like'
}

class KanbanBoradContainer extends Component {
	constructor(){
		super(...arguments);
		this.state = {
			cards: [],
		}
	}
	
	componentDidMount(){
		fetch(API_URL+'/cards', {headers: API_HEADERS})
			.then((response) => response.json())
			.then((responseData) => {
				this.setState({
					cards:responseData
				})
			})
			.catch((error) => {
				console.log('Error fetching and parsing data', error)
			})
	}

	addTask(cardId, taskName){
		// 保存state
		let prevState = this.state
		// 找到card的index
		let cardIndex = this.state.cards.findIndex((card)=>card.id===cardId)
		// 创建新task，给一个名字和id
		let newTask = {id:Date.now(), name:taskName, done:false}
		let nextState = update(this.state.cards, {
			[cardIndex]:{
				tasks: {$push: [newTask]}
			}
		})
		// 设置state
		this.setState({cards:nextState})
		// 服务器数据添加
		fetch(`${API_URL}/cards/${cardId}/tasks`,{
			method: 'post',
			headers: API_HEADERS,
			body: JSON.stringify(newTask)
		})
		.then((response)=>{
			if(!response.ok){
				throw new Error('服务器相应的不是‘OK’')
			}
			return response.json()
		})
		.then((responseData)=>{
			newTask.id=responseData.id
			this.setState({cards:nextState})
		})
		.catch((error)=>{
			console.error("Fetch error：", error)
			// 设置state
			this.setState({cards:prevState})
		})

	}

	deleteTask(cardId, taskId, taskIndex){
		// 保存state
		let prevState = this.state
		// 找到card的index
		let cardIndex = this.state.cards.findIndex((card)=>{
			return card.id == cardId
		})
		// 创建一个没有目标值的新对象
		let nextState = update(this.state.cards, {
			[cardIndex]: {tasks:{$splice:[[taskIndex, 1]]}}
		})
		// 设置state
		this.setState({cards:nextState})
		// 服务器数据修改
		fetch(`${API_URL}/cards/${cardId}/tasks/${taskId}`,{
			method: 'delete',
			headers: API_HEADERS
		})
		.then((response)=>{
			if(!response.ok){
				throw new Error('服务器相应的不是‘OK’')
			}
		})
		.catch((error)=>{
			console.error("Fetch error：", error)
			// 设置state
			this.setState({cards:prevState})
		})
	}

	toggleTask(cardId, taskId, taskIndex){
		// 保存state
		let prevState = this.state
		// 找到card的index
		let cardIndex = this.state.cards.findIndex((card)=>card.id===cardId)
		// 保存task里的done的值
		let newDoneValue;
		// 修改值
		let nextState = update(this.state.cards, {
			[cardIndex]: {
				tasks: {
					[taskIndex]: {
						done: {$apply: (done)=>{
							newDoneValue = !done
							return newDoneValue
						}}
					}
				}
			}
		})
		// 设置state
		this.setState({cards:nextState})
		// 服务器数据修改
		fetch(`${API_URL}/cards/${cardId}/tasks/${taskId}`,{
			method: 'put',
			headers: API_HEADERS,
			body: JSON.stringify({done:newDoneValue})
		})
		.then((response)=>{
			if(!response.ok){
				throw new Error('服务器相应的不是‘OK’')
			}
		})
		.catch((error)=>{
			console.error("Fetch error：", error)
			// 设置state
			this.setState({cards:prevState})
		})
	}

	render(){
		return <KanbanBoard cards={this.state.cards}
							taskCallbacks={{
								toggle: this.toggleTask.bind(this),
								delete: this.deleteTask.bind(this),
								add:    this.addTask.bind(this),
							}}/>
	}
}

export default KanbanBoradContainer