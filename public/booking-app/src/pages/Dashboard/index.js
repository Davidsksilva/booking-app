import React, { Component } from "react";
import { Layout, Menu, Icon, Row, Col, Tooltip } from "antd";
import axios from "axios";
import echarts from "echarts";
import MediaQuery from "react-responsive";
import Responsive from "react-responsive";
import "./styles.css";
import InfoCard from "./components/InfoCard";
import ReactEcharts from "echarts-for-react";
import { tsImportEqualsDeclaration } from "@babel/types";

const Desktop = props => <Responsive {...props} minWidth={992} />;
const Tablet = props => <Responsive {...props} minWidth={768} maxWidth={991} />;
const Mobile = props => <Responsive {...props} maxWidth={767} />;
const Default = props => <Responsive {...props} minWidth={768} />;
const { Header, Content, Footer, Sider } = Layout;

const Locations = {
  Acre: "AC",
  Alagoas: "AL",
  Amapá: "AP",
  Amazonas: "AM",
  Bahia: "BA",
  Ceará: "CE",
  "Distrito Federal": "DF",
  "Espírito Santo": "ES",
  Goias: "GO",
  Maranhão: "MA",
  "Mato Grosso": "MT",
  "Mato Grosso do Sul": "MS",
  "Minas Gerais": "MG",
  Pará: "PA",
  Paraíba: "PB",
  Paraná: "PR",
  Pernambuco: "PE",
  Piauí: "PI",
  Roraima: "RR",
  Rondônia: "RO",
  "Rio de Janeiro": "RJ",
  "Rio Grande do Norte": "RN",
  "Rio Grande do Sul": "RS",
  "Santa Catarina": "SC",
  "São Paulo": "SP",
  Sergipe: "SE",
  Tocantins: "TO"
};

export default class Dashboard extends Component {
  state = {
    collapsed: true,
    onEvents: {
      click: this.onChartClick,
      legendselectchanged: this.onChartLegendselectchanged,
      mouseover: this.onChartClick
    },
    selectedCompanyId: -1,
    selectedCompanyName: "Todos",
    hotelLocation: "all"
  };

  onChartClick = data => {
    console.log(data);
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  fetchFlightCompanyStatistic = async () => {
    let response = await axios.get(
      `http://localhost:8080/companhias/estatistica`
    );

    return response.data;
  };

  fetchHotelStatistic = async location => {
    let response = await axios.get(
      `http://localhost:9090/hoteis/estatistica?location=${location}`
    );

    return response.data;
  };

  fetchFlightStatistic = async filter_value => {
    let response = await axios.get(
      `http://localhost:8080/voos/estatistica?filter=${filter_value}&company_id=${
        this.state.selectedCompanyId
      }`
    );

    return response.data;
  };

  loadHotelStatistic = location => {
    let location_req;
    if (location != "all") {
      location_req = Locations[location];
    } else {
      location_req = location;
    }

    return this.fetchHotelStatistic(location_req).then(res_data => {
      this.setState({
        hotelLocation: location,
        hotelCount: res_data.hotel_count,
        hotelOccupation: res_data.occupation,
        bedroomCount: res_data.bedroom_count,
        occupiedBedroomCount: res_data.occupied_bedroom_count
      });
    });
  };

  getHotelStatisticOption = location => {
    let location_req;
    if (location != "all") {
      location_req = Locations[location];
    } else {
      location_req = location;
    }

    return this.fetchHotelStatistic(location_req).then(res_data => {
      return {
        tooltip: {
          formatter: "{a} <br/>{b} : {c}%"
        },
        series: [
          {
            name: "occupation-gauge",
            type: "gauge",
            detail: { formatter: "{value}%" },
            data: [
              {
                value: res_data.occupation.toFixed(2),
                name: ""
              }
            ]
          }
        ]
      };
    });
  };

  genFlightData = filter_value => {
    return this.fetchFlightStatistic(filter_value).then(res_data => {
      let dataAxis = [];

      let dataShadow = [];
      let data = [];
      let flight_statistic_list = [];

      flight_statistic_list = res_data;
      flight_statistic_list.map((flight_data, index) => {
        dataAxis.push(flight_data.flight_destination);
        data.push(flight_data.flight_count);
      });

      let yMax = Math.max(data) * 1.2;
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
            selectedMode: "single",
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

  getFlightCompanyOptionMobile = () => {
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
    const brazilJson = require("../../brazil_geo.json");
    echarts.registerMap("brazil", brazilJson);
    let optionMap = {
      geo: [
        {
          type: "map",
          map: "brazil",
          selectedMode: "single",
          zoom: 1.2,
          itemStyle: {
            areaColor: "#eee",
            emphasis: {
              areaColor: "#ffdb5b"
            }
          },
          label: {
            normal: {
              show: false,
              formatter: data => {
                return data.name;
              }
            },
            emphasis: {
              show: true
            }
          }
        }
      ]
    };

    this.setState({
      optionMap: optionMap
    });

    this.loadHotelStatistic(this.state.hotelLocation);

    this.getFlightCompanyOption().then(option => {
      this.setState({
        optionChart1: option
      });
    });

    this.getHotelStatisticOption(this.state.hotelLocation).then(option => {
      this.setState({
        occupationGaugeOption: option
      });
    });

    this.getFlightCompanyOptionMobile().then(option => {
      this.setState({
        optionChart11: option
      });
    });

    this.getFlightOption("destination").then(option => {
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

    return this.fetchFlightCompanyStatistic().then(data => {
      company_statistic_list = data;
      company_statistic_list.map((company, index) => {
        legendData.push(company.company_name);
        seriesData.push({
          name: company.company_name,
          value: company.flight_count,
          id: company.company_id
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

  geoClick = params =>{

    console.log(params);
    console.log(this.state.lastclickedRegion === params.name);
    let location_name;
    if(this.state.lastclickedRegion === params.name){
      location_name = "all";
    }
    else{
      location_name = params.name;
    }

    this.getHotelStatisticOption(location_name).then(option => {
      this.setState({
        occupationGaugeOption: option
      });
    });

    this.loadHotelStatistic(location_name);

    this.setState({
      lastclickedRegion: params.name,
    })

  }

  geoUnselected = params =>{
    this.getHotelStatisticOption("all").then(option => {
      this.setState({
        occupationGaugeOption: option
      });
    });

    this.loadHotelStatistic("all");
  }

  clickCompanyPie = params => {
    // Selecting a new company
    if (this.state.selectedCompanyId != params.data.id) {
      this.setState({
        selectedCompanyId: params.data.id,
        selectedCompanyName: params.data.name
      });
    }
    // Deselect current company
    else {
      this.setState({
        selectedCompanyId: -1,
        selectedCompanyName: "Todos"
      });
    }

    this.getFlightOption("destination").then(option => {
      this.setState({
        optionChart2: option
      });
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
                        onEvents={{
                          click: this.clickCompanyPie
                        }}
                      />
                    )}
                  </Desktop>

                  <Mobile>
                    {" "}
                    {this.state.optionChart11 && (
                      <ReactEcharts
                        option={this.state.optionChart11}
                        theme="light"
                        onEvents={{
                          click: this.clickCompanyPie
                        }}
                      />
                    )}
                  </Mobile>

                  <Tablet>
                    {" "}
                    {this.state.optionChart11 && (
                      <ReactEcharts
                        option={this.state.optionChart11}
                        theme="light"
                        onEvents={{
                          click: this.clickCompanyPie
                        }}
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
                  loading={!this.state.optionChart2}
                  title={"Vôos por destino - " + this.state.selectedCompanyName}
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
            <Row gutter={24}>
              <Col
                xs={24}
                sm={24}
                md={24}
                lg={12}
                xl={6}
                className="Col-InfoCard"
              >
                <InfoCard
                  bordered={false}
                  loading={!this.state.optionChart1}
                  title={"Mapa"}
                  action={
                    <Tooltip title="Mapa do brasil.">
                      <Icon type="info-circle-o" />
                    </Tooltip>
                  }
                  contentHeight={350}
                >
                  {this.state.optionMap && (
                    <ReactEcharts
                      style={{ height: "350px" }}
                      option={this.state.optionMap}
                      theme="light"
                      onEvents={{
                        click: this.geoClick,
                      }}
                    />
                  )}
                </InfoCard>
              </Col>
              <Col
                xs={24}
                sm={24}
                md={24}
                lg={12}
                xl={6}
                className="Col-InfoCard"
              >
                <InfoCard
                  bordered={false}
                  loading={!this.state.hotelCount}
                  title={
                    "Hotéis Disponíveis - " +
                    (this.state.hotelLocation == "all"
                      ? "Brasil"
                      : this.state.hotelLocation)
                  }
                  action={
                    <Tooltip title="Quantidade de Hotéis Disponíveis">
                      <Icon type="info-circle-o" />
                    </Tooltip>
                  }
                  footer={"Quartos Disponíveis"}
                  footerTotal={this.state.bedroomCount}
                  total={this.state.hotelCount}
                  contentHeight={350}
                />{" "}
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
                  loading={!this.state.hotelCount}
                  title={
                    "Taxa de Ocupação - " +
                    (this.state.hotelLocation == "all"
                      ? "Brasil"
                      : this.state.hotelLocation)
                  }
                  action={
                    <Tooltip title="Taxa de ocupação dos quartos.">
                      <Icon type="info-circle-o" />
                    </Tooltip>
                  }
                  contentHeight={350}
                >
                  {this.state.occupationGaugeOption && (
                    <ReactEcharts
                      style={{ height: "350px", width: "100%" }}
                      option={this.state.occupationGaugeOption}
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
