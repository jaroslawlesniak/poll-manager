import React, { useState, useEffect } from 'react';
import API from '../../libs/api';
import {
    HashRouter as Router,
    Link
} from 'react-router-dom';
import { Button } from 'antd';

export default function Results(props) {
    const id = props.match.params.id;
    const [title, setTitle] = useState("");
    const [answers, setAnswers] = useState({});

    useEffect(() => {
        fetch(API.URL + `/poll/${id}`, {
            method: "GET",
        })
            .then(data => data.json())
            .then(data => {
                setTitle(data.title);
            });
        fetch(API.URL + `/results/${id}`, {
            method: "GET",
        })
            .then(data => data.json())
            .then(data => {
                console.log(data.answers);
                setAnswers(data.answers);
            });
    }, []);

    return (
        <Router>
            <div className="poll-container">
                <div className="body">
                    <Link to="/">
                        <Button icon="previous" type="ghost" icon="left">Wróć do listy ankiet</Button>
                    </Link>
                    <h1>Odpowiedzi - {title}</h1>
                    
                </div>
            </div>
        </Router>
    )
}
