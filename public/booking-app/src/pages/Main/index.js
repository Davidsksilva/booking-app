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
  message,
  Modal,
  Radio
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
    title: "Selecionar Hotel",
    content: "First-content"
  },
  {
    title: "Selecionar Quarto",
    content: "Second-content"
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

  listBedrooms = async (hotel_id,hotel_name) =>{
    const value = this.state.current + 1;
    this.setState({ current: value });
    this.setState({selectedHotelId: hotel_id});
    this.setState({selectedHotelName: hotel_name})
    this.setState({ listDataSource: [] });
    axios
      .get(`http://localhost:9090/hoteis/${hotel_id}/quartos?occupation=free`)
      .then(response => {
        let bedroom_list = response.data._embedded.bedroomList;
        bedroom_list.map(bedroom => {
          let bedroom_data = {
            key: bedroom.number,
            num_beds: bedroom.num_beds,
            price: bedroom.price
          };

          console.log(bedroom_data)
          this.setState({
            listDataSource: [...this.state.listDataSource, bedroom_data]
          });

          //console.log(hotel_data);
        });
      })
      .catch(error => {})
      .finally(() => {
        this.setState({
          show: true,
        })
      });


  }

  prev() {
    const value = this.state.current - 1;
    this.setState({ current: value });

    if(value == 0){
      this.makeRequest();
    }
  }

  state = {
    current: 0,
    listDataSource: [],
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
    bedroomModalVisible: false,
    selectedHotelId : 0,
    selectedHotelName: "",
    selectedBedroomNum: 0,
    

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

  showBedrooms = hotel_id =>{
    this.setState({
      bedroomModalVisible: true,
    });

  }

  handleOk = (e) => {
    console.log(e);
    this.setState({
      bedroomModalVisible: false,
    });
  }

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      bedroomModalVisible: false,
    });
  }

  handleChangeOrigin = value => {
    this.setState({
      origin: value
    });

    console.log(this.state.origin);
  };

  makeRequest = async () => {
    this.setState({ listDataSource: [] });
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
            listDataSource: [...this.state.listDataSource, hotel_data]
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

  loadBedrooms = async () => {
    this.setState({ listDataSource: [] });
    axios
      .get(`http://localhost:9090/hoteis?location=${this.state.destination}`)
      .then(response => {
        let hotel_list = response.data._embedded.bedroomList;
        hotel_list.map(hotel => {
          let hotel_data = {
            key: hotel.id,
            name: "Hotel " + hotel.name,
            state: hotel.state,
            stars: hotel.stars
          };

          //console.log(hotel_data)
          this.setState({
            listDataSource: [...this.state.listDataSource, hotel_data]
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

  //<Table dataSource={this.state.listDataSource} columns={this.state.hotelColumns} />
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
                        title="Selecionar Hotel"
                      />
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
                    header={<div id="List-Header">
                    
                    {this.state.current == 0?`Hotéis em ${this.state.destination}`:
                    `Quartos disponíveis em ${this.state.selectedHotelName}`}
                      </div>}
                    bordered
                    dataSource={this.state.listDataSource}
                    renderItem={item => (
                      <List.Item key= {item.key}className="Hotel-List-Container">
                        <Row
                          className="Hotel-List-Item-Row"
                          type="flex"
                          justify="start"
                          align="middle"
                          gutter={8}
                        >
                          <Col className="Hotel-List-Item-Col-Name" spawn={6}>
                            {this.state.current == 0?item.name: `Quarto número ${item.key}`}
                          </Col>
                          <Col
                            className="Hotel-List-Item-Col-Location"
                            spawn={6}
                          >
                            {this.state.current == 0?item.state: `${item.num_beds} camas no quarto`}
                          </Col>
                          <Col className="Hotel-List-Item-Col-Stars" spawn={6}>
                            {this.state.current == 0?this.renderStars(item.stars): `R$ ${item.price} p/ noite`}
                          </Col>
                          <Col className="Hotel-List-Item-Col-Button" type="flex" align="end"spawn={6}>
                          <Button type="primary" onClick={() => this.listBedrooms(item.key,item.name)}>{this.state.current == 0?"Selecionar Hotel":"Selecionar Quarto"}</Button>
                          </Col>
                        </Row>
                      </List.Item>
                    )}
                  />
                </Row>}

                {this.state.show &&<Row>
                  <Col>
                    <div className="steps-action">
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
                        {this.state.current == 1? "Voltar para Hotéis":"Voltar"}
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
