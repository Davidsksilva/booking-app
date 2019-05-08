import React, { Component } from 'react'
import axios from 'axios'

import { 
  Layout, Menu, Breadcrumb, Row, Col, Input, Button, Icon, Form, DatePicker, InputNumber, Select,Alert,
  Table, Divider, Tag
   } from 'antd';
import "antd/dist/antd.css";
import "./styles.css"
import locale from 'antd/lib/date-picker/locale/pt_BR';
const { Header, Content, Footer } = Layout;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const Option = Select.Option;

const placesList = ["AC", "AL", "AP","AM","BA","CE",
"DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RR","RO",
"RJ","RN","RS","SC","SP","SE","TO"]

// App's Main Page
export default class Main extends Component {

  state = {
    hotelDataSource: [],
    hotelColumns: [{
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: 'Estado',
      dataIndex: 'state',
      key: 'state',
    }, {
      title: 'Estrelas',
      dataIndex: 'stars',
      key: 'stars',
    }],
    destination: "AP",
    origin: "AC",
    error: false,
  }

  generateDestOptions = ()=>{



  }

  onChange = (e) => {
    console.log(e);
  };

  handleChangeDestination = (value)=>{

    this.setState({
      destination: value,
    })
  }

  handleChangeOrigin = (value)=>{

    this.setState({
      origin: value
    })

    console.log(this.state.origin)
  }


  makeRequest = async () =>{

    this.setState({hotelDataSource: []});

    axios.get(`http://localhost:9090/hoteis?location=${this.state.destination}`)
    .then((response) =>{

  
      let hotel_list = response.data._embedded.hotelList

      hotel_list.map(hotel =>{
        let hotel_data = {
          key: hotel.id,
          name: "Hotel " + hotel.name,
          state: hotel.state,
          stars: hotel.stars
        }

        //console.log(hotel_data)
        //console.log(this.state.hotelsDataSource)
        this.setState({ hotelDataSource: [...this.state.hotelDataSource, hotel_data] })

        console.log(hotel_data);
      })
      

    })
    .catch((error)=>{

    }).finally(() =>{

    }
      
    );

  }

  handleChange(value) {
    console.log(`selected ${value}`);
  }

  onClose = (e) => {
    console.log(e, 'I was closed.');
  };

  render() {

    return (
      <Layout className="layout">
        <Header id="Header">
          <div className="logo" />
          <Menu
            id = "Menu"
            theme="light"
            mode="horizontal"
            defaultSelectedKeys={['2']}
            style={{ lineHeight: '64px'}}
          >
            <Menu.Item className="Menu-Item" key="1">Reservas</Menu.Item>
          </Menu>
        </Header>
        <Content id = "Main-Container">
          <div style={{ background: '#F0F2F5', padding: 0, minHeight: 815 }} >
         
            <Col id= "Content-Container" type="flex" justify="start" align="center">

              <Row className = "Search-Outter-Container" type="flex" justify="start" gutter={8}>

                  <Col className = "Col-Container" id="Package-Container" >
                    Pesquise o Pacote
                  </Col>
                  <Col >
                  <Row type="flex" justify="center" gutter={8}>
                  <Col className = "Col-Container" >
                    Partida
                  </Col>
                  <Col className = "Col-Container" >
                  <Select 
                  showSearch
                  size = "default"
                  allowClear
                  placeholder="Local"
                  optionFilterProp="children"
                  onChange={this.handleChangeOrigin}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  defaultValue="AC" 
                  style={{ width: 120 }}>
                    {placesList.map(p => {
                      if(this.state.destination === p)
                        return (<Option key={p} disabled>{p}</Option>)
                      else 
                      return (<Option key={p}>{p}</Option>)
                    })}
                  </Select>
                  </Col>
                  <Col className = "Col-Container" >
                    Destino
                  </Col>
                  <Col className = "Col-Container" >
                  <Select 
                  showSearch
                  size = "default"
                  allowClear
                  placeholder="Local"
                  optionFilterProp="children"
                  onChange={this.handleChangeDestination}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  defaultValue="AL" 
                  style={{ width: 120 }}>
                    {placesList.map(p => {
                      if(this.state.origin === p)
                        return (<Option key={p} disabled>{p}</Option>)
                      else 
                      return (<Option key={p}>{p}</Option>)
                    })}
                  </Select>
                  </Col>
                  <Col className = "Col-Container">
                    Período
                  </Col>
                  <Col className= "Col-Container" >
                    <RangePicker  locale={locale} onChange={this.onChange} />
                  </Col>
                  <Col className= "Col-Container" >
                  Qtde. Hóspedes
                  </Col>
                  <Col className= "Col-Container" >
                  <InputNumber min={1} max={10} defaultValue={1} onChange={this.onChange} />
                  </Col>
                  <Col className = "Col-Container" id="End" >
                    <Button type="dashed" icon="search" onClick={this.makeRequest}>Buscar</Button>
                  </Col>
                  </Row>
                </Col>

                </Row> 

                {this.state.error?<Row id = "Input-Alert">
               <Alert
                 
                  message="Não foi possível encontrar o pacote pesquisado"
                  type="error"
                  closable
                  banner
                  onClose={this.onClose}
                />
              </Row> : ''}

              <Row id= "Hotel-Table">

              <Table dataSource={this.state.hotelDataSource} columns={this.state.hotelColumns} />
              </Row>
            </Col>

            
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Booking App ©2019 Created by David
        </Footer>
      </Layout>
    )
  }
}

