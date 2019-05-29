import React, { Component } from 'react'

import {
  Row,
  List,
} from "antd";

import "antd/dist/antd.css";
import "./components.css"

export default class ListDisplay extends Component {
  render() {
    return (
        <Row type="flex" justify="start" className="List-Container">
            <List
            id="List"
            pagination={{
                onChange: page => {
                console.log(page);
                },
                pageSize: 6,
                position: "bottom"
            }}
            itemLayout="vertical"
            header={
                <div id="List-Header">{this.props.headerRenderingFunc()}</div>
            }
            dataSource={this.props.dataSource}
            renderItem={item => (
                <List.Item
                key={item.key}
                className="Hotel-List-Container"
                >
                {this.props.itemRenderingFunc(item)}
                </List.Item>
            )}
            />
        </Row>
    )
  }
}
