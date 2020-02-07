import React, { useState, useEffect } from 'react';
import Question from './question';
import API from '../../libs/api';
import {
    HashRouter as Router,
    Link
} from 'react-router-dom';
import { Button, Icon } from 'antd';

export default function Poll(props) {
    const id = props.match.params.id;
    const title = props.match.params.title;

    const [questions, setQestions] = useState([]);
    const [saveButton, setSaveButton] = useState((<Button type="primary" onClick={() => savePollAnswers()}>Zapisz odpowiedzi</Button>));

    let answers = {};

    const saveAnswer = (id, answer) => {
        answers[id] = answer;
    }

    const savePollAnswers = () => {
        fetch(API.URL + '/user_answers', {
            method: "POST",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
               answers,
               pollID: id
            })
        }).then(data => data.json())
            .then(data => {
                console.log("Clicked");
                setSaveButton((<div className="saved"><Icon type="check-circle"/> Zapisano ankietę</div>));
            })
    }

    useEffect(() => {
        fetch(API.URL + `/questions/${id}`, {
            method: "GET",
        })
            .then(data => data.json())
            .then(data => {
                setQestions(data.questions);
            });  
    }, []);

    return (
        <Router>
            <div className="poll-container">
                <div className="body">
                    <Link to="/">
                        <Button icon="previous" type="ghost" icon="left">Wróć do listy ankiet</Button>
                    </Link>
                    <h1>{title}</h1>
                    {questions.map((question, key) => (
                        <div key={key} className="question">
                            <Question data={question} saveAnswer={(id, answer) => saveAnswer(id, answer)} />
                        </div>
                    ))}
                    {saveButton}
                </div>
            </div>
        </Router>
    )
}
