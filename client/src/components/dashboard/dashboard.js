import React, { Component } from 'react'

export default class Dashboard extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                {this.props.userName}
            </div>
        )
    }
}
