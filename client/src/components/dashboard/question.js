import React, { useEffect, useState } from 'react';
import API from '../../libs/api';
import { Icon, Input, Switch, Radio, Checkbox } from 'antd';

export default function Question({ data, saveAnswer }) {
    const [answers, setAnswers] = useState([]);
    const [openAnswer, setOpenAnswer] = useState("");

    let additionalInfo = "";

    if (data.AdditionalInfo !== "") additionalInfo = (
        <span>
            <Icon type="question-circle" style={{ marginRight: "5px" }} />
            {data.AdditionalInfo}
        </span>
    );

    useEffect(() => {
        fetch(API.URL + `/answers/${data.ID}`, {
            method: "GET",
        })
            .then(data => data.json())
            .then(data => {
                setAnswers(data.answers);
            });
        if (data.Type === 1) {
            saveAnswer(data.ID, false);
        }
    }, []);

    let answersBox = "";
    if (data.Type === 0) answersBox = (
        <Input placeholder="Wpisz wartość"
            value={openAnswer}
            onChange={e => setOpenAnswer(e.target.value)}
            onBlur={() => saveAnswer(data.ID, openAnswer)} />
    )

    if (data.Type === 1) answersBox = (
        <Switch checkedChildren="Tak" unCheckedChildren="Nie" onChange={selected => saveAnswer(data.ID, selected)} />
    )

    if (data.Type === 2) answersBox = (
        <div>
            <Radio.Group onChange={selected => saveAnswer(data.ID, selected.target.value)}>
                {answers.map((answer, key) => (
                    <Radio key={key} value={answer.ID}>
                        {answer.Title}
                    </Radio>
                ))}
            </Radio.Group>
        </div>
    )

    if (data.Type === 3) answersBox = (
        <div>
            <Checkbox.Group onChange={selected => saveAnswer(data.ID, selected)}>
                {answers.map((answer, key) => (
                    <Checkbox key={key} value={answer.ID}>
                        {answer.Title}
                    </Checkbox>
                ))}
            </Checkbox.Group>
        </div>
    )

    return (
        <div>
            <h2>{data.Title}</h2>
            {additionalInfo}
            <div className="answers-box">
                {answersBox}
            </div>
        </div>
    )
}
