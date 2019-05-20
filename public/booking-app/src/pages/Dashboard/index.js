import React, { Component } from "react";
import { Layout, Menu, Icon, Row, Col, Tooltip } from "antd";
import axios from "axios";
import echarts from "echarts";
import MediaQuery from "react-responsive";
import Responsive from "react-responsive";
import "./styles.css";
import InfoCard from "./components/InfoCard";
import ReactEcharts from "echarts-for-react";

const Desktop = props => <Responsive {...props} minWidth={992} />;
const Tablet = props => <Responsive {...props} minWidth={768} maxWidth={991} />;
const Mobile = props => <Responsive {...props} maxWidth={767} />;
const Default = props => <Responsive {...props} minWidth={768} />;
const { Header, Content, Footer, Sider } = Layout;

export default class Dashboard extends Component {
  state = {
    collapsed: true
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  fetchFlightCompanyData = async () => {
    let response = await axios.get(
      `http://localhost:8080/companhias/estatistica`
    );

    return await response.data;
  };

  fetchFlightData = async filter_value => {
    let response = await axios.get(
      `http://localhost:8080/voos/estatistica?filter=${filter_value}`
    );

    return await response.data;
  };

  genFlightData = filter_value => {
    return this.fetchFlightData(filter_value).then(res_data => {
      let dataAxis = [];

      let yMax = 200;
      let dataShadow = [];
      let data = [];
      let flight_statistic_list = [];

      flight_statistic_list = res_data;
      flight_statistic_list.map((flight_data, index) => {
        dataAxis.push(flight_data.flight_destination);
        data.push(flight_data.flight_count);
      });

      for (let i = 0; i < data.length; i++) {
        dataShadow.push(yMax);
      }

      return {
        dataAxis: dataAxis,
        data: data,
        dataShadow: dataShadow
      };
    });
  };

  getFlightOption = filter_value => {
    return this.genFlightData(filter_value).then(bar_data => {
      let { dataAxis, data, dataShadow } = bar_data;
      console.log(data);
      let option = {
        xAxis: {
          data: dataAxis,
          axisLabel: {
            inside: false,
            textStyle: {
              color: "#000"
            }
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          z: 10
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: "#999"
            }
          }
        },
        dataZoom: [
          {
            type: "inside"
          }
        ],
        series: [
          {
            // For shadow
            type: "bar",
            itemStyle: {
              normal: { color: "rgba(0,0,0,0.05)" }
            },
            barGap: "-100%",
            barCategoryGap: "40%",
            data: dataShadow,
            animation: false
          },
          {
            type: "bar",
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#83bff6" },
                  { offset: 0.5, color: "#188df0" },
                  { offset: 1, color: "#188df0" }
                ])
              },
              emphasis: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#2378f7" },
                  { offset: 0.7, color: "#2378f7" },
                  { offset: 1, color: "#83bff6" }
                ])
              }
            },
            data: data
          }
        ]
      };
      return option;
    });
  };

  getFlightCompanyOption = () => {
    return this.genFlightCompanyData().then(data => {
      let option = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          type: "scroll",
          orient: "vertical",
          right: 10,
          top: 20,
          bottom: 20,
          data: data.legendData,

          selected: data.selected
        },
        series: [
          {
            name: "Vôos",
            type: "pie",
            radius: "55%",
            center: ["40%", "50%"],
            data: data.seriesData,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      };
      return option;
    });
  };

  getFlightCompanyOption1 = () => {
    return this.genFlightCompanyData().then(data => {
      let option = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        series: [
          {
            name: "Vôos",
            type: "pie",
            radius: "55%",
            center: ["40%", "50%"],
            data: data.seriesData,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      };
      return option;
    });
  };

  componentDidMount = () => {

    console.log(echarts.registerMap);
    let option = this.getFlightCompanyOption().then(option => {
      this.setState({
        optionChart1: option
      });
    });

    let option11 = this.getFlightCompanyOption1().then(option => {
      this.setState({
        optionChart11: option
      });
    });
    let option2 = this.getFlightOption("destination").then(option => {
      this.setState({
        optionChart2: option
      });
    });
  };

  genFlightCompanyData = () => {
    let legendData = [];
    let seriesData = [];
    let selected = {};

    let company_statistic_list = [];

    return this.fetchFlightCompanyData().then(data => {
      company_statistic_list = data;
      company_statistic_list.map((company, index) => {
        legendData.push(company.company_name);
        seriesData.push({
          name: company.company_name,
          value: company.flight_count
        });
        selected[company.company_name] = index < 6;
      });

      if (this.state.loadingChart1 === true) {
        this.setState({
          loadingChart1: false
        });
      }

      return {
        legendData: legendData,
        seriesData: seriesData,
        selected: selected
      };
    });
  };

  render() {
    return (
      <Layout id="Layout">
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
              <Icon type="dashboard" />
              <span>Dashboard</span>
            </Menu.Item>
            <Menu.Item key="2" onClick={() => this.props.history.push("/")}>
              <Icon type="form" />
              <span>Reservas</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: "#fff" }}>
            <Icon
              className="trigger"
              style={{ fontSize: "24px", textAlign: "center" }}
              type={this.state.collapsed ? "menu-unfold" : "menu-fold"}
              onClick={this.toggle}
            />
          </Header>
          <Content id="Home-Content-Container">
            <Row gutter={24}>
              <Col
                xs={24}
                sm={24}
                md={24}
                lg={24}
                xl={12}
                className="Col-InfoCard"
              >
                <InfoCard
                  bordered={false}
                  loading={!this.state.optionChart1}
                  title={"Vôos por Companhia aérea"}
                  action={
                    <Tooltip title="Soma de vôos por comanhia aérea.">
                      <Icon type="info-circle-o" />
                    </Tooltip>
                  }
                  contentHeight={350}
                >
                  <Desktop>
                    {" "}
                    {this.state.optionChart1 && (
                      <ReactEcharts
                        option={this.state.optionChart1}
                        theme="light"
                      />
                    )}
                  </Desktop>

                  <Mobile>
                    {" "}
                    {this.state.optionChart11 && (
                      <ReactEcharts
                        option={this.state.optionChart11}
                        theme="light"
                      />
                    )}
                  </Mobile>

                  <Tablet>
                    {" "}
                    {this.state.optionChart11 && (
                      <ReactEcharts
                        option={this.state.optionChart11}
                        theme="light"
                      />
                    )}
                  </Tablet>
                </InfoCard>
              </Col>
              <Col
                xs={24}
                sm={24}
                md={24}
                lg={24}
                xl={12}
                className="Col-InfoCard"
              >
                <InfoCard
                  bordered={false}
                  loading={!this.state.optionChart1}
                  title={"Vôos por destino"}
                  action={
                    <Tooltip title="Soma dos vôos por destino de viagem.">
                      <Icon type="info-circle-o" />
                    </Tooltip>
                  }
                  contentHeight={350}
                >
                  {this.state.optionChart2 && (
                    <ReactEcharts
                      option={this.state.optionChart2}
                      theme="light"
                    />
                  )}
                </InfoCard>
              </Col>
            </Row>
          </Content>
        </Layout>
      </Layout>
    );
  }
}
