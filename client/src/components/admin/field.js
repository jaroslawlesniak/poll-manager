import React, { useState } from 'react';
import { Input, Button, Icon, message } from 'antd';
import API from '../../libs/api';


export default function Field({ field, deleteField }) {
    const [title, setTitle] = useState(field.Title);
    const [additionalInfo, setAdditionalInfo] = useState(field.AdditionalInfo);

    const saveField = () => {
        fetch(API.URL + `/field/${field.ID}`, {
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

    let infomation = "Pytanie otwarte";
    if (field.Type === 1) infomation = "Pole Tak/Nie";
    if (field.Type === 2) infomation = "Pole jednokrotnego wyboru";
    if (field.Type === 3) infomation = "Pole wielokrotnego wyboru";

    return (
        <div className="answer">
            {infomation} <Button onClick={() => deleteField(field.ID)} type="danger">Usuń pytanie</Button>
            <h3 style={{ marginTop: "25px" }}>Treść pytania</h3>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} onBlur={() => saveField()} />
            <h3 style={{ marginTop: "25px" }}>Dodatkowa informacja</h3>
            <Input value={additionalInfo} onChange={(e) => setAdditionalInfo(e.target.value)} onBlur={() => saveField()} />
        </div>
    )
}
