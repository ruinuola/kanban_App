import AppDispatcher from '../AppDispatcher'
import constants from '../constants'
import KanbanAPI from '../api/KanbanApi'
import {throttle} from '../utils'
import CardStore from '../stores/CardStore'

let CardActionCreators = {
	fetchCards(){
		AppDispatcher.dispatchAsync(KanbanAPI.fetchCards(), {
			request: constants.FETCH_CARDS,
			success: constants.FETCH_CARDS_SUCCESS,
			failure: constants.FETCH_CARDS_ERROR,
		})
	},
	
	addCard(card){
		AppDispatcher.dispatchAsync(KanbanAPI.addCard( card ), {
			request: constants.CREATE_CARDS,
			success: constants.CREATE_CARDS_SUCCESS,
			failure: constants.CREATE_CARDS_ERROR,
		}, {card})
	},
	
	updateCard(card, draftCard){
		AppDispatcher.dispatchAsync(KanbanAPI.updateCard( card, draftCard ), {
			request: constants.UPDATE_CARDS,
			success: constants.UPDATE_CARDS_SUCCESS,
			failure: constants.UPDATE_CARDS_ERROR,
		}, {card, draftCard})
	},
	
	updateCardStatus: throttle((cardId, listId) => {
		AppDispatcher.dispatch({
			type: constants.UPDATE_CARDS_STATUS,
			payload: {cardId, listId},
		})
	}),
	
	updateCardPosition: throttle((cardId, afterId) => {
		AppDispatcher.dispatch({
			type: constants.UPDATE_CARDS_STATUS,
			payload: {cardId, afterId},
		})
	},500),
		
	persistCardDrag(cardProps){
		let card = CardStore.getCard( cardProps.id )
		let cardIndex = CardStore.getCardIndex( cardProps.id )
		AppDispatcher.dispatchAsync( KanbanAPI.persistCardDrag( card.id, card.status, cardIndex ), {
			request: constants.PERSIST_CARDS_DRAG,
			success: constants.PERSIST_CARDS_DRAG_SUCCESS,
			failure: constants.PERSIST_CARDS_DRAG_ERROR,
		}, {cardProps})
	},
	
	toggleCardDetails( cardId ){
		AppDispatcher.dispatch({
			type: constants.TOGGLE_CARD_DETAILS,
			payload: {cardId}
		})
	},
	
	createDraft(card){
		AppDispatcher.dispatch({
			type: constants.CREATE_DRAFT,
			payload: {card}
		})
	},
	
	createDraft(field, value){
		AppDispatcher.dispatch({
			type: constants.UPDATE_DRAFT,
			payload: {field, value}
		})
	}
}

export default CardActionCreators