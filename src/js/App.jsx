import React from 'react';
import {render} from 'react-dom';
import { Router, Route} from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import KanbanBoardContainer from './components/KanbanBoardContainer.jsx';
import KanbanBoard from './components/KanbanBoard';
import EditCard from './components/EditCard';
import NewCard from './components/NewCard';
import '../css/index.css'

render((
	<Router history={createBrowserHistory()}>
		<Route component={KanbanBoardContainer}>
			<Route path='/' component={KanbanBoard}>
				<Route path='new' component={NewCard}/>
				<Route path='edit/:card_id' component={EditCard}/>
			</Route>
		</Route>
	</Router>
	), document.getElementById('root'));