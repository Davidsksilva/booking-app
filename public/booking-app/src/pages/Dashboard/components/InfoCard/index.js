import React, { Component } from 'react'
import {Card, Row, Col, Skeleton, Divider} from "antd";
import classNames from 'classnames';

import "antd/dist/antd.css"
import "./index.css"
export default class InfoCard extends Component {

    renderCardContent = () =>{
        const { title, action, children, loading, footer, avatar, total, contentHeight } = this.props;

        if(loading){
            return false;
        }

        return (
            <div className={"card-inner"}>
              <div
                className={"topMargin"}
              >
                <div className={"avatar"}>{avatar}</div>
                <div className={""}> 
                  <div className={"meta"}>
                    <span className={"title"}>{title}</span>
                    <span className={"action"}>{action}</span>
                  </div>
                  {total}
                </div>
              </div>
              {children && (
                <div className={"content"} style={{ height: contentHeight || 'auto' }}>
                  <div className={"contentHeight" && "contentFixed"}>{children}</div>
                </div>
              )}
              {footer && (
                <div
                  className={"footerMargin"}
                >
                <Divider/>
                  {footer}
                </div>
              )}
            </div>
          );

    }
    render() {
        const {loading, title} = this.props;
        return (
            <Card loading={loading} className={"card"}>
             <Skeleton loading={loading} active>
              {this.renderCardContent()} 
             </Skeleton>
            </Card>
        )
    }
}
