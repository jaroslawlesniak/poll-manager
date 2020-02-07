import React, { useState, useEffect } from 'react';
import Question from './question';
import API from '../../libs/api';
import {
    HashRouter as Router,
    Link
} from 'react-router-dom';
import { Button } from 'antd';

export default function Poll(props) {
    const id = props.match.params.id;
    const title = props.match.params.title;

    const [questions, setQestions] = useState([]);

    let answers = {};

    const saveAnswer = (key, id, answer) => {
        answers[id] = answer;
        console.log(answers);
    }

    useEffect(() => {
        fetch(API.URL + `/questions/${id}`, {
            method: "GET",
        })
            .then(data => data.json())
            .then(data => {
                setQestions(data.questions);
            })
    }, []);

    return (
        <div className="poll-container">
            <div className="body">
                <Router>
                    <Link to="/">
                        <Button icon="previous" type="primary">Wróć do listy ankiet</Button>
                    </Link>
                    <h1>{title}</h1>
                </Router>
                {questions.map((question, key) => (
                    <div key={key} className="question">
                        <Question data={question} saveAnswer={(id, answer) => saveAnswer(key, id, answer)}/>
                    </div>
                ))}
            </div>
        </div>
    )
}
