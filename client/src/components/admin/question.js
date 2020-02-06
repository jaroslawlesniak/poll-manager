import React, { useState, useEffect } from 'react';
import { Input, Button, message } from 'antd';
import API from '../../libs/api';
import Answer from './answer';


export default function Question({ question, deleteQuestion }) {
    const [title, setTitle] = useState(question.Title);
    const [additionalInfo, setAdditionalInfo] = useState(question.AdditionalInfo);
    const [answers, setAnswers] = useState([]);

    const saveQuestion = () => {
        fetch(API.URL + `/question/${question.ID}`, {
            method: "POST",
            mode: "cors",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                additionalInfo
            })
        })
            .then(data => data.json())
            .then(data => {
                if (data.updated === true) {
                    message.success("Zapisano");
                }
            })
    }

    useEffect(() => {
        fetch(API.URL + `/answers/${question.ID}`, {
            method: "GET",
        })
            .then(data => data.json())
            .then(data => {
                setAnswers(data.answers);
            })
    }, []);

    const addAnswer = () => {
        fetch(API.URL + '/answer', {
            method: "PUT",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                questionID: question.ID
            })
        }).then(data => data.json())
            .then(data => {
                setAnswers(prevState => [...prevState, {
                    ID: data.id,
                    Title: data.title,
                    QuestionID: data.questionID
                }]);
            })
    }

    const deleteAnswer = (key, id) => {
        fetch(API.URL + `/answer/${id}`, {
            method: "DELETE"
        }).then(data => data.json())
            .then(data => {
                setAnswers([]);
                let newAnswers = [...answers];
                newAnswers.splice(key, 1);
                setAnswers(newAnswers);
                message.success("Usunięto odpowiedź");
            })
    }

    const updateAnswer = (key, title) => {
        setAnswers([]);
        let newAnswers = [...answers];
        newAnswers[key].Title = title;
        setAnswers(newAnswers);
    }

    let infomation = "Pytanie otwarte";
    if (question.Type === 1) infomation = "Pole Tak/Nie";
    if (question.Type === 2) infomation = "Pole jednokrotnego wyboru";
    if (question.Type === 3) infomation = "Pole wielokrotnego wyboru";

    let options = "";
    if (question.Type === 2 || question.Type === 3) {
        options = (
            <div className="options">
                <h3>Odpowiedzi</h3>
                <div className="list">
                    {answers.map((value, key) => (
                        <Answer key={key} data={value} deleteAnswer={(id) => deleteAnswer(key, id)} updateAnswer={(title) => updateAnswer(key, title)}/>
                    ))}
                </div>
                <Button onClick={() => addAnswer()} icon="plus">Dodaj Odpowiedź</Button>
            </div >
        );
    }

    return (
        <div className="answer">
            {infomation} <Button onClick={() => deleteQuestion(question.ID)} type="danger">Usuń pytanie</Button>
            <h3 style={{ marginTop: "25px" }}>Treść pytania</h3>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} onBlur={() => saveQuestion()} />
            <h3 style={{ marginTop: "25px" }}>Dodatkowa informacja</h3>
            <Input value={additionalInfo} onChange={(e) => setAdditionalInfo(e.target.value)} onBlur={() => saveQuestion()} />
            {options}
        </div>
    )
}
