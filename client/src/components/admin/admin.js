import React, { Component } from 'react';
import { Menu, Icon, Layout, Button, PageHeader, Avatar, Input, Tooltip, message, Radio } from 'antd';
import {
    HashRouter as Router,
    Link
} from 'react-router-dom';
import API from '../../libs/api';
import Question from './question';


const { SubMenu } = Menu;
const { Sider, Content } = Layout;

export default class Admin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            polls: [],
            selectedPoll: {},
            selectedID: -1,
            questions: []
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
                    <Button onClick={() => this.deletePoll()} className="btn" type="danger" icon="delete">Usuń ankietę</Button>
                    <h1>Nazwa ankiety</h1>
                    <Input className="header" value={this.state.selectedPoll.Title} onChange={(event => this.handeTitleChange(event))} />
                    <h2>Pytania</h2>
                    {this.state.questions.map((value, key) => (
                        <Question key={key} question={value} deleteQuestion={(id) => this.deleteQuestion(key, id)} />
                    ))}
                    <div className="list">
                        <Radio.Group onChange={(e) => this.addNewQuestion(e.target.value)}>
                            <Tooltip title="Dodaj pytanie">
                                <Radio.Button><Icon type="plus" /></Radio.Button>
                            </Tooltip>
                            <Radio.Button value="0">Otwarte</Radio.Button>
                            <Radio.Button value="1">Tak/Nie</Radio.Button>
                            <Radio.Button value="2">Jednokrotny wybór</Radio.Button>
                            <Radio.Button value="3">Wielokrotny wybór</Radio.Button>
                        </Radio.Group>
                    </div>
                </div>
            )
        }

        return (
            <Router>
                <Layout>
                    <Sider width={250} style={{ background: '#001529', height: "auto", minHeight: "100vh" }}>
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

    async selectPoll(event) {
        let id = parseInt(event.key);
        await this.setState({
            selectedPoll: this.state.polls[id],
            selectedID: id
        });
        fetch(API.URL + `/questions/${this.state.selectedPoll.ID}`, {
            method: "GET"
        })
            .then(data => data.json())
            .then(data => {
                this.setState({
                    questions: []
                });
                this.setState({
                    questions: data.questions
                });
            })
    }

    addNewPoll() {
        const pollName = `Nowa ankieta #${this.state.polls.length + 1}`;
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
                message.success("Dodano nową ankietę");
            });

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

    async handeTitleChange(event) {
        let id = this.state.selectedPoll.ID;
        await this.setState({
            selectedPoll: {
                ID: id,
                Title: event.target.value
            }
        });
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
                }
            })
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
                    message.success("Usunięto ankietę");
                }
            })
    }

    addNewQuestion(type) {
        if (type !== undefined) {
            fetch(API.URL + `/question`, {
                method: "PUT",
                mode: "cors",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: "",
                    pollID: this.state.selectedPoll.ID,
                    additionalInfo: "",
                    type: type
                })
            }).then(data => data.json()).then(data => {
                this.setState(prevState => ({
                    questions: [...prevState.questions, { ID: data.id, Title: data.title, Type: data.type, PollID: data.pollID, AdditionalInfo: "" }]
                }))
            })
        }
    }

    deleteQuestion(key, id) {
        fetch(API.URL + `/question/${id}`, {
            method: "DELETE",
            mode: "cors"
        })
            .then(data => data.json())
            .then(data => {
                if (data.deleted === true) {
                    let questions = [...this.state.questions];
                    questions.splice(key, 1);
                    this.setState({
                        questions: questions
                    });
                    message.success("Usunięto pytanie");
                }
            })
    }
}
