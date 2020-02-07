import React from 'react';

export default function Result({ data, answers }) {
    return (
        <div>
            <h2 style={{ marginBottom: "15px" }}>{data.Title}</h2>
            {answers[data.ID] && answers[data.ID].map((value, key) => (
                <div key={key}>
                    <span>{value.answer} ({value.amount})</span>
                </div>
            ))}
        </div>
    )
}
