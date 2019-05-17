import React, { Component } from 'react'

import { Layout, Menu } from "antd";
import "antd/dist/antd.css";
import "./components.css";

const { Header} = Layout;
export default class PageHeader extends Component {
    render() {
        return (
            <div>
                <Header id="Header">
                    <Menu
                        id="Menu"
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={["2"]}
                        style={{ lineHeight: "64px" }}
                    >
                        <Menu.Item key="1"onClick={this.props.handleBooking}>
                            Booking
                        </Menu.Item>
                        <Menu.Item key="2" onClick={this.props.handleDashboard}>
                            Dashboard
                        </Menu.Item>
                    </Menu>
                </Header>
            </div>
        )
    }
}
