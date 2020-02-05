import React, { useState } from 'react';
import { Input, Button, Icon } from 'antd';
import { useHistory } from "react-router-dom";

export default function Login({saveUserNameToDatabase}) {
    const [userName, setUserName] = useState("");
    const history = useHistory();

    const saveUserName = () => {
        if(userName !== "") {
            saveUserNameToDatabase(userName);
            history.push("/dashboard");
        } else {
            alert("Musisz wpisać nazwę użytkownika");
        }
    }

    return (
        <div className="login">
            <div>
                <h1>Wprowadź nazwę użytkownika</h1>
                <Input value={userName} onChange={event => setUserName(event.target.value)} placeholder="Nazwa użytkownika"
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.5)' }} />} size="large" />
                <Button type="primary" onClick={() => saveUserName()} size="large">Ustaw</Button>
            </div>
        </div>
    )
}