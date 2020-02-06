import React, { Component } from 'react';
import { PageHeader, Button, Avatar } from 'antd';
import {
    HashRouter as Router,
    Route,
    Link,
    Redirect
} from 'react-router-dom';

export default class Dashboard extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Router>
                <PageHeader
                    ghost="false"
                    onBack={() => window.location = '/'}
                    title={<div><Avatar size={32} icon="user"/><span>{this.props.user.name} - {this.props.user.id}</span></div>}
                    extra={[
                        <Link key={1} to="/admin">
                            <Button type="primary">Panel administratora</Button>
                        </Link>
                    ]}>
                </PageHeader>
            </Router>
        )
    }
}
