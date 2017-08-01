import React, { Component, PropTypes } from 'react';

class CardForm extends Component {
	handleChange(field, e){
		this.props.handleChange(field, e.target.value)
	}
	handleClose(e){
		e.preventDefault()
		this.props.handleClose()
	}
  render() {
    return (
    	<div>
				<div className='card big'>
	        <form onSubmit={this.props.handleSubmit.bind(this)}>
	        	<input type='text' value={this.props.draftCard.title}
								onChange={this.handleChange.bind( this, 'title' )}
								placeholder='Title' required={true} autoFocus={true}/> <br />

						<textarea value={this.props.draftCard.description}
								onChange={this.handleChange.bind( this, 'description' )}
								placeholder='Description' required={true}/><br />

						<label htmlFor="status">状态</label>
						<select id='status' value={this.props.draftCard.status}
								onChange={this.handleChange.bind( this, 'status' )}>
							<option value="todo">即将做的</option>
							<option value="in-progress">正在做的</option>
							<option value="done">已做完的</option>
						</select><br />

						<label htmlFor="status">颜色</label>
						<input id='color' type='color' value={this.props.draftCard.color}
								onChange={this.handleChange.bind( this, 'color' )}/><br />

						<div className='actions'>
							<button type='submit'>{this.props.buttonLabel}</button>
						</div>
	        </form>
	      </div>

	      <div className='overlay' onClick={this.handleClose.bind(this)}></div>
    	</div>
      
    );
  }
}

CardForm.propTypes = {
	buttonLabel: PropTypes.string.isRequired,
	draftCard: PropTypes.shape({
		title: PropTypes.string,
		description: PropTypes.string,
		status: PropTypes.string,
		color: PropTypes.string,
	}).isRequired,
	handleChange: PropTypes.func.isRequired,
	handleSubmit: PropTypes.func.isRequired,
	handleClose: PropTypes.func.isRequired
}

export default CardForm;
