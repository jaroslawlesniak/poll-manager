import React from 'react';
import './App.scss';
import 'antd/dist/antd.css';
import {
    HashRouter as Router,
    Route
} from 'react-router-dom';
import Dashboard from './components/dashboard/dashboard';
import Admin from './components/admin/admin';
import Poll from './components/dashboard/poll';
import Results from './components/dashboard/results';

export default class App extends React.Component {
    render() {
        return (
            <Router>
                <Route exact path="/">
                    <Dashboard />
                </Route>
                <Route exact path="/poll/:id/" component={Poll}/>
                <Route path="/poll/:id/results" component={Results}/>
                <Route path="/admin">
                    <Admin />
                </Route>
            </Router>
        );
    }
}
