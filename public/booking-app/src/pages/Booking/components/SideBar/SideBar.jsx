import React, { Component } from "react";
import { Layout, Menu, Icon } from "antd";

import "antd/dist/antd.css";
import "./SideBar.css";

const { Header, Content, Footer, Sider } = Layout;

export default class SideBar extends Component {
  render() {
    return (
      <Sider
        breakpoint="lg"
        trigger={null}
        collapsible
        id="Sider"
        collapsed={this.state.collapsed}
        onBreakpoint={broken => {
          this.setState({
            collapsed: !this.state.collapsed
          });
        }}
      >
        <div className="logo" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          id="Sider-Menu"
        >
          <Menu.Item key="1">
            <Icon type="form" />
            <span>Booking</span>
          </Menu.Item>
          <Menu.Item key="2">
            <Icon type="dashboard" />
            <span>Dashboard</span>
          </Menu.Item>
        </Menu>
      </Sider>
    );
  }
}
