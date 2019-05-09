import React, { Component} from "react";
import axios from "axios";

import {
  Layout,
  Menu,
  Breadcrumb,
  Row,
  Col,
  Input,
  Button,
  Icon,
  Form,
  DatePicker,
  InputNumber,
  Select,
  Alert,
  Table,
  Divider,
  Tag,
  List,
  Card,
  Typography,
  Steps,
  message
} from "antd";
import "antd/dist/antd.css";
import "./styles.css";
import locale from "antd/lib/date-picker/locale/pt_BR";
const { Header, Content, Footer } = Layout;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const Option = Select.Option;
const Step = Steps.Step;
const placesList = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RR",
  "RO",
  "RJ",
  "RN",
  "RS",
  "SC",
  "SP",
  "SE",
  "TO"
];

const steps = [
  {
    title: "Selecionar Quarto",
    content: "First-content"
  },
  {
    title: "Selecionar Vôo",
    content: "Second-content"
  },
  {
    title: "Confirmação dos Dados",
    content: "Last-content"
  }
];

// App's Main Page
export default class Main extends Component {

  next() {
    const value = this.state.current + 1;
    this.setState({ current: value });
  }

  prev() {
    const value = this.state.current - 1;
    this.setState({ current: value });
  }

  state = {
    current: 0,
    hotelDataSource: [],
    hotelColumns: [
      {
        title: "Nome",
        dataIndex: "name",
        key: "name"
      },
      {
        title: "Estado",
        dataIndex: "state",
        key: "state"
      },
      {
        title: "Estrelas",
        dataIndex: "stars",
        key: "stars"
      }
    ],
    destination: "AL",
    origin: "AC",
    error: false,
    show: false,
  };

  generateDestOptions = () => {};

  onChange = e => {
    console.log(e);
  };

  handleChangeDestination = value => {
    this.setState({
      destination: value
    });
  };

  handleChangeOrigin = value => {
    this.setState({
      origin: value
    });

    console.log(this.state.origin);
  };

  makeRequest = async () => {
    this.setState({ hotelDataSource: [] });
    axios
      .get(`http://localhost:9090/hoteis?location=${this.state.destination}`)
      .then(response => {
        let hotel_list = response.data._embedded.hotelList;
        hotel_list.map(hotel => {
          let hotel_data = {
            key: hotel.id,
            name: "Hotel " + hotel.name,
            state: hotel.state,
            stars: hotel.stars
          };

          //console.log(hotel_data)
          this.setState({
            hotelDataSource: [...this.state.hotelDataSource, hotel_data]
          });

          console.log(hotel_data);
        });
      })
      .catch(error => {})
      .finally(() => {
        this.setState({
          show: true,
        })
      });
  };

  handleChange(value) {
    console.log(`selected ${value}`);
  }

  onClose = e => {
    console.log(e, "I was closed.");
  };

  renderStars = stars_num => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= stars_num)
        stars.push(
          <Icon type="star" theme="filled" style={{ color: "#FAAD14" }} />
        );
      else stars.push(<Icon type="star" />);
    }
    return stars;
  };

  //<Table dataSource={this.state.hotelDataSource} columns={this.state.hotelColumns} />
  render() {
    return (
      <div id="Page">
        <Layout className="layout">
          <Header id="Header">
            <div className="logo" />
            <Menu
              id="Menu"
              theme="light"
              mode="horizontal"
              defaultSelectedKeys={["2"]}
              style={{ lineHeight: "64px" }}
            >
              <Menu.Item className="Menu-Item" key="1">
                Reservas
              </Menu.Item>
            </Menu>
          </Header>
          <Content id="Main-Container">
            <div style={{ padding: 0, height: "100%" }}>
            
              <Col
                id="Content-Container"
                type="flex"
                justify="start"
                align="center"
              >
                <Row
                  className="Search-Outter-Container"
                  type="flex"
                  justify="start"
                  gutter={8}
                >
                  <Col className="Col-Container" id="Package-Container">
                    Pesquisar um Pacote
                  </Col>
                  <Col>
                    <Row type="flex" justify="center" gutter={8}>
                      <Col className="Col-Container">Partida</Col>
                      <Col className="Col-Container">
                        <Select
                          showSearch
                          size="default"
                          allowClear
                          placeholder="Local"
                          optionFilterProp="children"
                          onChange={this.handleChangeOrigin}
                          filterOption={(input, option) =>
                            option.props.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                          defaultValue="AC"
                          style={{ width: 120 }}
                        >
                          {placesList.map(p => {
                            if (this.state.destination === p)
                              return (
                                <Option key={p} disabled>
                                  {p}
                                </Option>
                              );
                            else return <Option key={p}>{p}</Option>;
                          })}
                        </Select>
                      </Col>
                      <Col className="Col-Container">Destino</Col>
                      <Col className="Col-Container">
                        <Select
                          showSearch
                          size="default"
                          allowClear
                          placeholder="Local"
                          optionFilterProp="children"
                          onChange={this.handleChangeDestination}
                          filterOption={(input, option) =>
                            option.props.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                          defaultValue="AL"
                          style={{ width: 120 }}
                        >
                          {placesList.map(p => {
                            if (this.state.origin === p)
                              return (
                                <Option key={p} disabled>
                                  {p}
                                </Option>
                              );
                            else return <Option key={p}>{p}</Option>;
                          })}
                        </Select>
                      </Col>
                      <Col className="Col-Container">Período</Col>
                      <Col className="Col-Container">
                        <RangePicker locale={locale} onChange={this.onChange} />
                      </Col>
                      <Col className="Col-Container">Qtde. Hóspedes</Col>
                      <Col className="Col-Container">
                        <InputNumber
                          min={1}
                          max={10}
                          defaultValue={1}
                          onChange={this.onChange}
                        />
                      </Col>
                      <Col className="Col-Container" id="End">
                        <Button
                          type="dashed"
                          icon="search"
                          onClick={this.makeRequest}
                        >
                          Buscar
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>

                {this.state.error ? (
                  <Row id="Input-Alert">
                    <Alert
                      message="Não foi possível encontrar o pacote pesquisado"
                      type="error"
                      closable
                      banner
                      onClose={this.onClose}
                    />
                  </Row>
                ) : (
                  ""
                )}

                {this.state.show && <Row type="flex" justify="center" id="Steps-Row">
                  <Col id = "Steps-Col" align="start" >
                    <Steps current={this.state.current}>
                      <Step
                        title="Selecionar Quarto"
                      />
                      <Step
                        title="Selecionar Vôo"
                      />
                      <Step title="Confirmar Dados" />
                    </Steps>
                  </Col>
                </Row>}
                {this.state.show &&<Row id="Hotel-Table">
                  <List
                  id= "List"
                    pagination={{
                      onChange: page => {
                        console.log(page);
                      },
                      pageSize: 6
                    }}
                    split
                    size="large"
                    itemLayout="vertical"
                    header={<div id="List-Header">Lista de Hotéis</div>}
                    bordered
                    dataSource={this.state.hotelDataSource}
                    renderItem={item => (
                      <List.Item className="Hotel-List-Container">
                        <Row
                          className="Hotel-List-Item-Row"
                          type="flex"
                          justify="start"
                          align="middle"
                          gutter={8}
                        >
                          <Col className="Hotel-List-Item-Col" spawn={4}>
                            {item.name}
                          </Col>
                          <Col
                            className="Hotel-List-Item-Col-Location"
                            spawn={4}
                          >
                            {item.state}
                          </Col>
                          <Col className="Hotel-List-Item-Col-Stars" spawn={4}>
                            {this.renderStars(item.stars)}
                          </Col>
                        </Row>
                      </List.Item>
                    )}
                  />
                </Row>}

                {this.state.show &&<Row>
                  <Col>
                    <div className="steps-action">
                      {this.state.current < steps.length - 1 && (
                        <Button type="primary" onClick={() => this.next()}>
                          Next
                        </Button>
                      )}
                      {this.state.current === steps.length - 1 && (
                        <Button
                          type="primary"
                          onClick={() =>
                            message.success("Processing complete!")
                          }
                        >
                          Done
                        </Button>
                      )}
                      {this.state.current > 0 && (
                        <Button
                          style={{ marginLeft: 8 }}
                          onClick={() => this.prev()}
                        >
                          Previous
                        </Button>
                      )}
                    </div>
                  </Col>
                </Row>}
              </Col>
            </div>
          </Content>
          <Footer style={{ textAlign: "center" }} />
        </Layout>
      </div>
    );
  }
}
