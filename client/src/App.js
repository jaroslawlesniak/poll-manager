import React from 'react';
import './App.scss';
import 'antd/dist/antd.css';
import {
    HashRouter as Router,
    Route
} from 'react-router-dom';
import Login from './components/login/login';
import Dashboard from './components/dashboard/dashboard';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: "test"
        }
    }
    render() {
        return (
            <Router>
                <Route exact path="/">
                    <Login saveUserNameToDatabase={(e) => this.saveUserNameToDatabase(e)} />
                </Route>
                <Route path="/dashboard">
                    <Dashboard userName={this.state.userName} />
                </Route>
                <Route path="/poll/:id">
                    <h2>Single poll</h2>
                </Route>
                <Route path="/admin">
                    <h2>Admin</h2>
                </Route>
            </Router>
        );
    }

    saveUserNameToDatabase(userName) {
        this.setState({ userName });
    }
}
