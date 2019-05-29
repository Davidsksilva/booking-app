import React, { Component } from "react";
import { Layout, Menu, Icon } from "antd";
import {observer, inject} from "mobx-react"

import  "./styles.css"

import SearchBox from "./components/SearchBox"
import MainLayout from "./components/MainLayout/MainLayout"

const { Header, Content, Footer, Sider } = Layout;

//@inject("BookingStore") @observer

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

      <MainLayout>

        <SearchBox />

      </MainLayout>
    );
  }
}
