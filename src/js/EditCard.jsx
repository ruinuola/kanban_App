import React, { Component,PropTypes } from 'react';
import CardForm from './CardForm'

class EditCard extends Component {
	componentWillMount(){
		let card =  this.props.cards.find((card)=>card.id ==this.props.params.card_id)
		this.setState({card:card})
	}
	handleChange(filed, value){
		this.setState({[field]: value})
	}
	handleSubmit(e){
		e.preventDefault()
		this.props.cardCallback.updateCard(this.state)
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

EditCard.propTypes = {
	cardCallback: PropTypes.object
}

export default EditCard