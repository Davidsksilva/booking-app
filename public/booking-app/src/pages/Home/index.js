import React, { Component } from "react";
import { Layout, Menu, Icon } from "antd";
import  "./styles.css"

import SearchBox from "./components/SearchBox"

const { Header, Content, Footer, Sider } = Layout;

export default class index extends Component {
  state = {
    collapsed: true
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  render() {
    return (
      <Layout id = "Layout">
        <Sider
          breakpoint="lg"
          trigger={null}
          collapsible
          id = "Sider"
          collapsed={this.state.collapsed}
          onBreakpoint={broken => {
            this.setState({
                collapsed: !this.state.collapsed
              });
          }}
        >
          <div className="logo" />
          <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]} id="Sider-Menu">
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
        <Layout>
          <Header style={{ background: "#fff",  }}>
            <Icon
              className="trigger"
                style={{fontSize: "24px", textAlign: "center"}}
              type={this.state.collapsed ? "menu-unfold" : "menu-fold"}
              onClick={this.toggle}
            />
          </Header>
          <Content
            id = "Content-Container"
          >
            <SearchBox/>
          </Content>
        </Layout>
      </Layout>
    );
  }
}
