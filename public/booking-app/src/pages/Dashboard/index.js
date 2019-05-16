import React, { Component } from 'react'
import {Layout, Col, Row} from "antd"
import PageHeader from "./components/PageHeader"
const { Content} = Layout;




export default class index extends Component {

    navigateDashboard = () =>{
        this.props.history.push("/dashboard");
        document.title = "Dashboard";
    }

    navigateBooking = () =>{
        this.props.history.push("/");
        document.title = "Booking";
    }

    render() {
        return (
            <div id="Page">
                <Layout id="Layout">
                <PageHeader 
                handleDashboard = {this.navigateDashboard}
                handleBooking = {this.navigateBooking}/>

                <Content id="Main-Container">
                <div style={{ padding: 0, height: "100%", width: "100%"}}>
                    <Col
                    id="Content-Container"
                    type="flex"
                    justify="start"
                    align="center"
                    >
                    

                    </Col>
                </div>
                </Content>
            </Layout>
            </div>
        )
    }
}
