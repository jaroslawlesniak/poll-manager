import React from 'react';
import './App.scss';
import 'antd/dist/antd.css';
import {
    HashRouter as Router,
    Route
} from 'react-router-dom';
import Login from './components/login/login';
import Dashboard from './components/dashboard/dashboard';
import API from './libs/api';
import Admin from './components/admin/admin';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                name: 'default',
                id: 1
            }
        }
    }
    render() {
        return (
            <Router>
                <Route exact path="/">
                    <Login saveUserState={(userName) => this.saveUserStateAndGetUserID(userName)} />
                </Route>
                <Route path="/dashboard">
                    <Dashboard user={this.state.user} />
                </Route>
                <Route path="/poll/:id">
                    <h2>Single poll</h2>
                </Route>
                <Route path="/admin">
                    <Admin user={this.state.user} />
                </Route>
            </Router>
        );
    }

    saveUserStateAndGetUserID(userName) {
        fetch(API.URL + `/user/${userName}`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then((data) => data.json())
            .then(data => {
                this.setState({
                    user: {
                        name: userName,
                        id: data.id
                    }
                });
            });

    }
}
