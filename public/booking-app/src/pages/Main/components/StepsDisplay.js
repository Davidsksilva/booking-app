import React, { Component } from 'react'
import{Row, Col, Steps, Divider} from "antd"

import "antd/dist/antd.css";
import "./components.css"

const Step = Steps.Step;

export default class StepsDisplay extends Component {
  render() {
    return (
        <Row type="flex" justify="center" id="Steps-Row" align="middle">
        <Col id="Steps-Col" align="start">
          <Steps current={this.props.currentStep}>
            <Step title="Selecionar Hotel" />
            <Step title="Selecionar Quarto" />
            <Step title="Selecionar Vôo" />
            <Step title="Inserir Dados" />
            <Step title="Confirmar Pacote" />
            
          </Steps>
         
        </Col>
      </Row>
    )
  }
}
