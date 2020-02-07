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

    const [title, setTitle] = useState("");
    const [questions, setQestions] = useState([]);
    const [saveButton, setSaveButton] = useState((<Button type="primary" onClick={() => savePollAnswers()}>Zapisz odpowiedzi</Button>));
    const [answers, setAnswers] = useState({});

    const saveAnswer = (id, answer) => {
        answers[id] = answer;
        setAnswers(answers);
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
                setSaveButton((
                    <div className="saved">
                        <Icon type="check-circle" /> Zapisano ankietę.
                        <Link key={1} to={`/poll/${id}/results`}>
                            <Button style={{ marginLeft: "15px" }} type="primary">Zobacz wyniki</Button>
                        </Link>
                    </div>));
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
        fetch(API.URL + `/poll/${id}`, {
            method: "GET",
        })
            .then(data => data.json())
            .then(data => {
                setTitle(data.title);
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
