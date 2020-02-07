import React, { useEffect, useState } from 'react';
import { PageHeader, Button, Tooltip } from 'antd';
import {
    HashRouter as Router,
    Link
} from 'react-router-dom';
import API from '../../libs/api';
import Poll from './poll';

export default function Dashboard() {
    const [polls, setPolls] = useState([]);

    useEffect(() => {
        fetch(API.URL + "/polls", {
            method: "GET",
        })
            .then(data => data.json())
            .then(data => {
                setPolls(data.polls);
            })
    }, []);
    
    return (
        <Router>
            <PageHeader
                ghost="false"
                extra={[
                    <Link key={1} to="/admin">
                        <Button type="primary">Panel administratora</Button>
                    </Link>
                ]}>
            </PageHeader>
            <div className="polls-list">
                <div>
                    <h1>Dostępne ankiety</h1>
                    {polls.map((poll, key) => (
                        <Link key={key} to={`/poll/${poll.ID}/${poll.Title}`}>
                            <Button icon="edit" size="large">{poll.Title}</Button>
                        </Link>
                    ))}
                </div>
            </div>
        </Router>
    )
}
