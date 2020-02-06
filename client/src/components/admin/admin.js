import React, { Component } from 'react';
import { Menu, Icon, Layout, Button, PageHeader, Avatar } from 'antd';
import {
    HashRouter as Router,
    Link
} from 'react-router-dom';

const { SubMenu } = Menu;
const { Sider, Content } = Layout;

export default class Admin extends Component {
    render() {
        return (
            <Router>
                <Layout>
                    <Sider width={250} style={{ background: '#001529', height: "100vh" }}>
                        <Menu
                            onClick={this.handleClick}
                            style={{ width: 250 }}
                            defaultSelectedKeys={['1']}
                            defaultOpenKeys={['sub1']}
                            mode="inline"
                            theme="dark">
                            <SubMenu
                                key="sub1"
                                title={
                                    <span>
                                        <Icon type="message" />
                                        <span>Ankiety</span>
                                    </span>
                                }>
                                <Menu.Item key="1">Option 1</Menu.Item>
                                <Menu.Item key="2">Option 2</Menu.Item>
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
                    </Content>
                </Layout>
            </Router>
        )
    }
}
