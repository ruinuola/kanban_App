import React, {Component} from 'react'
import KanbanBoard from './KanbanBoard'
import update from 'react-addons-update'
import {throttle} from './utils'

import 'whatwg-fetch'
import 'babel-polyfill'

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
		// 仅在arguments改变时执行
		this.updateCardStatus = throttle( this.updateCardStatus.bind(this) )
		// 在arguments改变或者每500ms，执行
		this.updateCardPosition = throttle( this.updateCardPosition.bind(this), 500 )
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

	updateCardStatus(cardId, listId){
		let cardIndex = this.state.cards.findIndex((card)=>card.id == cardId)
		let card = this.state.cards[cardIndex]

		if(card.status !== listId){
			this.setState(update(this.state,{
				cards:{
					[cardIndex]: {
						status: {$set: listId}
					}
				}
			
			}))
		}
	}

	updateCardPosition(cardId, afterId){
		if(cardId !== afterId){
			let cardIndex = this.state.cards.findIndex((card)=>card.id == cardId)
			let card = this.state.cards[cardIndex]
			let afterIndex = this.state.cards.findIndex((card)=>card.id == afterId)
			this.setState(update(this.state,{
				cards:{
					$splice: [
						[cardIndex, 1],
						[afterIndex, 0, card]
					]
				}
				
			}))
		}
	}

	// 持久化新卡片位置和状态
	persistCardDrag(cardId, status){
		// 得到当前card
		let cardIndex = this.state.cards.findIndex( (card) => card.id==cardId )
		let card = this.state.cards[cardIndex]

		fetch(`${API_URL}/cards/${cardId}`,{
			method: 'put',
			headers: API_HEADERS,
			body: JSON.stringify({
				status:card.status, 
				row_order_position:cardIndex})
		})
		.then((response)=>{
			if(!response.ok){
				throw new Error('服务器响应不是OK')
			}
		})
		.catch((error)=>{
			console.error("Fetch error:",error)
			this.setState(
				update(this.state, {
					cards: {
						[cardIndex]: {
							status: {$set: status}
						}
					}
				})
			)
		})
	}

	// 添加Card
	addCard(card){
		console.log('执行addCard')
		let prevState = this.state
		if(card.id===null){
			let card = Object.assign({}, card, {id:Date.now()})
		}

		let nextState = update(this.state.cards, {$push:[card]})

		this.setState({cards: nextState}, ()=>{
				console.log(this.state.cards)
			})

		fetch(`${API_URL}/cards`, {
			method: 'post',
			headers: API_HEADERS,
			body: JSON.stringify( card )
		})
		.then((response)=>{
			if(response.ok){
				return response.json()
			}else{
				throw new Error('服务器没有返回“OK”')
			}
		})
		.then((responseData)=>{
			card.id = responseData.id
			this.setState({cards: nextState}, ()=>{
				console.log(responseData)
			})
		})
		.catch((error)=>{
			this.setState(prevState)
		})
	}

	// 更新Card
	updateCard(card){
		let prevState = this.state
		if(card.id===null){
			let card = Object.assign({}, card, {id:Date.now()})
		}

		let cardIndex = this.state.cards.findIndex((c)=>c.id == card.id)

		let nextState = update(this.state.cards, {
			[cardIndex]: {$set: card}
		})

		this.setState({cards: nextState})

		fetch(`${API_URL}/cards/${card.id}`, {
			method: 'put',
			headers: API_HEADERS,
			body: JSON.stringify( card )
		})
		.then((response)=>{
			if(response.ok){
				return response.json()
			}else{
				throw new Error('服务器没有返回“OK”')
			}
		})
		.catch((error)=>{
			this.setState(prevState)
		})
	}

	render(){
		let KanbanBoard = this.props.children && React.cloneElement(
				this.props.children, {
					cards: this.state.cards,
					taskCallbacks: {
						toggle: this.toggleTask.bind(this),
						delete: this.deleteTask.bind(this),
						add:    this.addTask.bind(this),
					},
					cardCallback: {
						addCard: this.addCard.bind(this),
						updateCard: this.updateCard.bind(this),
						updateStatus: this.updateCardStatus.bind(this),
						updatePosition: throttle(this.updateCardPosition.bind(this), 500),
						persistCardDrag: this.persistCardDrag.bind(this)
					}
				}
			)

		return KanbanBoard
	}
}

export default KanbanBoradContainer