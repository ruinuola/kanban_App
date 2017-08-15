import React, { Component,PropTypes } from 'react';
import CardForm from './CardForm'
import CardStore from '../stores/CardStore'
import DraftStore from '../stores/DraftStore'
import {Container} from 'flux/utils'
import CardActionCreators from '../actions/CardActionCreators'

class EditCard extends Component {
//	componentWillMount(){
////		let card =  this.props.cards.find((card)=>card.id ==this.props.params.card_id)
////		this.setState({card:card})
//		let card = CardStore.getCard( parseInt( this.props.params.card_id ) )
//		this.setState( Object.assign( {}, card ) )
//	}
	componentDidMount(){
		setTimeout( ()=>{
			CardActionCreators.createDraft( CardStore.getCard( this.props.params.card_id ) )
		},0 )
	}
	handleChange(field, value){
//		this.setState({[field]: value})
		CardActionCreators.updaetDraft( field, value )
	}
	handleSubmit(e){
		e.preventDefault()
//		this.props.cardCallback.updateCard(this.state)
		CardActionCreators.updateCard( 
			CardStore.getCard( parseInt(this.props.params.card_id) ), this.state.draft )
		this.props.history.pushState(null, '/')
	}
	handleClose(e){
		this.props.history.pushState(null, '/')
	}
  render() {
    return (
      <CardForm draftCard={this.state.card} buttonLabel="Create Card"
      		handleChange={this.handleChange.bind(this)}
      		handleSubmit={this.handleSubmit.bind(this)}
      		handleClose={this.handleClose.bind(this)} />
    );
  }
}

EditCard.getStores = ()=>([DraftCard])
EditCard.calculateState = (prevState) => ({
	draft: DraftStore.getState()
})

export default Container.create( EditCard )