import React, { Component } from 'react'

import { 
  Layout, Menu, Breadcrumb, Row, Col, Input, Button, Icon, Form, DatePicker, InputNumber, Select,Alert
   } from 'antd';
import "antd/dist/antd.css";
import "./styles.css"
import locale from 'antd/lib/date-picker/locale/pt_BR';
const { Header, Content, Footer } = Layout;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const Option = Select.Option;

// App's Main Page
export default class Main extends Component {


  onChange = (e) => {
    console.log(e);
  };

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
                  size = "medium"
                  allowClear
                  emptyText = "Oi"
                  placeholder="Local"
                  optionFilterProp="children"
                  onChange={this.onChange}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  defaultValue="AC" 
                  style={{ width: 120 }}>
                  <Option value ="AC">AC</Option>
                    <Option value ="AL">AL</Option>
                    <Option value ="AP">AP</Option>
                    <Option value ="AM">AM</Option>
                    <Option value ="BA">BA</Option>
                    <Option value ="CE">CE</Option>
                    <Option value ="DF">DF</Option>
                    <Option value ="ES">ES</Option>
                    <Option value ="GO">GO</Option>
                    <Option value ="MA">MA</Option>
                    <Option value ="MT">MT</Option>
                    <Option value ="MS">MS</Option>
                    <Option value ="MG">MG</Option>
                    <Option value ="PA">PA</Option>
                    <Option value ="PB">PB</Option>
                    <Option value ="PR">PR</Option>
                    <Option value ="PE">PE</Option>
                    <Option value ="PI">PI</Option>
                    <Option value ="RR">RR</Option>
                    <Option value ="RO">RO</Option>
                    <Option value ="RJ">RJ</Option>
                    <Option value ="RN">RN</Option>
                    <Option value ="RS">RS</Option>
                    <Option value ="SC">SC</Option>
                    <Option value ="SP">SP</Option>
                    <Option value ="SE">SE</Option>
                    <Option value ="TO">TO</Option>
                  </Select>
                  </Col>
                  <Col className = "Col-Container" >
                    Destino
                  </Col>
                  <Col className = "Col-Container" >
                  <Select 
                  showSearch
                  size = "medium"
                  allowClear
                  placeholder="Local"
                  optionFilterProp="children"
                  onChange={this.onChange}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  defaultValue="AL" 
                  style={{ width: 120 }}>
                  <Option value ="AC">AC</Option>
                    <Option value ="AL">AL</Option>
                    <Option value ="AP">AP</Option>
                    <Option value ="AM">AM</Option>
                    <Option value ="BA">BA</Option>
                    <Option value ="CE">CE</Option>
                    <Option value ="DF">DF</Option>
                    <Option value ="ES">ES</Option>
                    <Option value ="GO">GO</Option>
                    <Option value ="MA">MA</Option>
                    <Option value ="MT">MT</Option>
                    <Option value ="MS">MS</Option>
                    <Option value ="MG">MG</Option>
                    <Option value ="PA">PA</Option>
                    <Option value ="PB">PB</Option>
                    <Option value ="PR">PR</Option>
                    <Option value ="PE">PE</Option>
                    <Option value ="PI">PI</Option>
                    <Option value ="RR">RR</Option>
                    <Option value ="RO">RO</Option>
                    <Option value ="RJ">RJ</Option>
                    <Option value ="RN">RN</Option>
                    <Option value ="RS">RS</Option>
                    <Option value ="SC">SC</Option>
                    <Option value ="SP">SP</Option>
                    <Option value ="SE">SE</Option>
                    <Option value ="TO">TO</Option>
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
                    <Button type="dashed" icon="search">Buscar</Button>
                  </Col>
                  </Row>
                </Col>

                </Row> 

              <Row id = "Input-Alert">
                <Alert
                 
                  message="Não foi possível encontrar o pacote pesquisado"
                  type="error"
                  closable
                  banner
                  onClose={this.onClose}
                />
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

