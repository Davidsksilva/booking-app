import React, { Component } from "react";
import { Layout, Menu, Icon, Row, Col, Tooltip } from "antd";
import axios from "axios";
import  "./styles.css"

import InfoCard from "./components/InfoCard"
import ReactEcharts from 'echarts-for-react'; 

const { Header, Content, Footer, Sider } = Layout;

export default class Dashboard extends Component {
  state = {
    collapsed: true,
    loadingChart1: true,
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };



  getOption = async(){

    axios
      .get(`http://localhost:8080/companhias/estatistica`)
      .then(response => {
        let company_statistic_list = response.data;
        hotel_list.map(hotel => {
          let hotel_data = {
            
          return hotel_data;
        });
      })
      .catch(error => {})
      .finally(() => {
        this.setState({
          show: true,
          showList: true,
          showSteps:true,
          showInfo: true,
          showUserForm: false,
          showPackage: false,
        });
      });
    var data = this.genData(5);
    
    return {
      tooltip : {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
      },  
      legend: {
        type: 'scroll',
        orient: 'vertical',
        right: 10,
        top: 20,
        bottom: 20,
        data: data.legendData,

        selected: data.selected
    },
      series : [
          {
              name: 'Vôos',
              type: 'pie',
              radius : '55%',
              center: ['40%', '50%'],
              data: data.seriesData,
              itemStyle: {
                  emphasis: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
              }
          }
      ]
  };
  ;
}


genData(count) {
    var nameList = [
        'David', 'Nadja', 'Léo', 'Glauco', 'Fernando'];
    var legendData = [];
    var seriesData = [];
    var selected = {};
    
    for (var i = 0; i < count; i++) {
        let name = nameList[i]
        legendData.push(name);
        seriesData.push({
            name: name,
            value: Math.round(Math.random() * 100000)
        });
        selected[name] = i < 6;
    }

    return {
        legendData: legendData,
        seriesData: seriesData,
        selected: selected
    };

}

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
              <Icon type="dashboard" />
              <span>Dashboard</span>
            </Menu.Item>
            <Menu.Item key="2" onClick={() =>this.props.history.push("/")}>
              <Icon type="form" />
              <span>Reservas</span>
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
            id = "Home-Content-Container"
          >
              <Row>
                        <Col xs={24} sm={12} md={12} lg={12} xl={8} className="Col-InfoCard">
                        <InfoCard
                        bordered={false}
                        loading={this.state.loadingChart1}
                        title={"Vôos por Companhia aérea"}
                        action={
                            <Tooltip
                                title="Soma de vôos por comanhia aérea."
                            >
                                <Icon type="info-circle-o" />
                            </Tooltip>
                            }
                        contentHeight={350  }
                        >
                          <ReactEcharts option={this.getOption()} theme="light" />
                        </InfoCard>
                        </Col>
                    </Row>
                    
          </Content>
        </Layout>
      </Layout>
    );
  }
}
