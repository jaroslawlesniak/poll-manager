import React, { useState } from 'react';
import { Input, Button, Tooltip, message } from 'antd';
import API from "../../libs/api";

export default function Answer({ data, deleteAnswer, updateAnswer }) {
    const [title, setTitle] = useState(data.Title);

    const saveAnswerTitle = () => {
        fetch(API.URL + `/answer/${data.ID}`, {
            method: "POST",
            mode: "cors",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title
            })
        })
            .then(data => data.json())
            .then(data => {
                if (data.updated === true) {
                    updateAnswer(title);
                    message.success("Zapisano");
                }
            })
    }

    return (
        <div className="item">
            <Tooltip title="Usuń odpowiedź" placement="left">
                <Button className="delete-btn" icon="delete" onClick={() => deleteAnswer(data.ID)} />
            </Tooltip>
            <Input placeholder="Wpisz odpowiedź" value={title} onChange={e => setTitle(e.target.value)} onBlur={() => saveAnswerTitle()} />
        </div>
    )
}
