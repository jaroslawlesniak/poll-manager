import React, { Component } from 'react';
import { Menu, Icon, Layout, Button, PageHeader, Avatar, Input, Tooltip, message } from 'antd';
import {
    HashRouter as Router,
    Link
} from 'react-router-dom';
import API from '../../libs/api';

const { SubMenu } = Menu;
const { Sider, Content } = Layout;

export default class Admin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            polls: [],
            selectedPoll: {},
            selectedID: -1
        }
    }

    render() {
        let pollsList = this.state.polls.map((value, key) => (
            <Menu.Item key={key}>{value.Title}</Menu.Item>
        ));

        let editedPoll = "";
        if (this.state.selectedID !== -1) {
            editedPoll = (
                <div className="poll">
                    <h1>Nazwa ankiety</h1>
                    <Input className="header" value={this.state.selectedPoll.Title} onChange={(event => this.handeTitleChange(event))} />
                    <Tooltip title="Zapisz nazwę">
                        <Button onClick={() => this.savePollTitle()} className="btn" type="primary" icon="edit" />
                    </Tooltip>
                    <Tooltip title="Usuń ankietę">
                        <Button onClick={() => this.deletePoll()} className="btn" type="danger" icon="delete" />
                    </Tooltip>
                </div>
            )
        }

        return (
            <Router>
                <Layout>
                    <Sider width={250} style={{ background: '#001529', height: "100vh" }}>
                        <Button onClick={() => this.addNewPoll()} className="new-poll-btn" icon="plus" type="link">Nowa ankieta</Button>
                        <Menu
                            onClick={(event) => this.selectPoll(event)}
                            style={{ width: 250 }}
                            mode="inline"
                            theme="dark">
                            <SubMenu
                                key="polls"
                                title={
                                    <span>
                                        <Icon type="message" />
                                        <span>Ankiety ({this.state.polls.length})</span>
                                    </span>
                                }>
                                {pollsList}
                            </SubMenu>
                        </Menu>

                    </Sider>
                    <Content>
                        <PageHeader
                            ghost="false"
                            title={<div><Avatar size={32} icon="user" /><span>{this.props.user.name}</span></div>}
                            extra={[
                                <Link key={1} to="/dashboard">
                                    <Button type="primary">Strona główna</Button>
                                </Link>
                            ]}
                            className="admin-header">
                        </PageHeader>
                        <div className="admin">
                            {editedPoll}
                        </div>
                    </Content>
                </Layout>
            </Router>
        )
    }

    selectPoll(event) {
        let id = parseInt(event.key);
        this.setState({
            selectedPoll: this.state.polls[id],
            selectedID: id
        });
        console.log(this.state);
    }

    addNewPoll() {
        const pollName = prompt("Podaj nazwę ankiety");
        if (pollName === "") {
            alert("Musisz podać nazwę");
        } else if (pollName !== null) {
            fetch(API.URL + "/poll", {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: pollName
                })
            })
                .then(data => data.json())
                .then(data => {
                    this.setState(prevState => ({
                        polls: [...prevState.polls, { ID: data.id, Title: data.title }]
                    }))
                });

        }
    }

    componentWillMount() {

        fetch(API.URL + "/polls", {
            method: "GET",
        })
            .then(data => data.json())
            .then(data => {
                this.setState({
                    polls: data.polls
                });
            })
    }

    handeTitleChange(event) {
        let id = this.state.selectedPoll.ID;
        this.setState({
            selectedPoll: {
                ID: id,
                Title: event.target.value
            }
        });
    }

    savePollTitle() {
        fetch(API.URL + `/poll/${this.state.selectedPoll.ID}`, {
            method: "POST",
            mode: "cors",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: this.state.selectedPoll.Title
            })
        })
            .then(data => data.json())
            .then(data => {
                if (data.updated === true) {
                    let polls = [...this.state.polls];
                    let item = { ...polls[this.state.selectedID], Title: data.title }
                    polls[this.state.selectedID] = item;
                    this.setState({ polls });
                    message.success("Zapisano");
                }
            })
    }

    deletePoll() {
        fetch(API.URL + `/poll/${this.state.selectedPoll.ID}`, {
            method: "DELETE",
            mode: "cors"
        })
            .then(data => data.json())
            .then(data => {
                if (data.updated === true) {
                    let polls = [...this.state.polls];
                    polls.splice(this.state.selectedID, 1);
                    this.setState({ 
                        polls, 
                        selectedID: -1
                     });
                    message.success("Usunięto");
                }
            })
    }
}
