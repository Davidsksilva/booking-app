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
                        defaultSelectedKeys={["1"]}
                        style={{ lineHeight: "64px" }}
                    >
                        <Menu.Item key="1">
                            Reservas
                        </Menu.Item>
                    </Menu>
                </Header>
            </div>
        )
    }
}
