import React, { Component } from "react";
import { Form, Input, Col, Select, InputNumber, Button, Row } from "antd";

import "antd/dist/antd.css";
import "./components.css";

const { Option } = Select;

class UserForm extends Component {
  state = {
    inputData: {
      guests_count: null,
      guests_name: [],
      guests_gender: [],
      guests_age: []
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.handleValues(values);
      }
    });
  };


  renderInputs = () => {
    const { getFieldDecorator } = this.props.form;

    let inputs = [];
    for (let i = 0; i < this.props.numGuests; i++) {
      inputs.push(
        <Row
          className="Form-Row"
          type="flex"
          justify="center"
          align="middle"
          gutter={8}
        >
          <Col className="Form-Col" span={4}>
          <Form.Item label="Pessoa">
            <span className="ant-form-text">{i+1}</span>
          </Form.Item>
          </Col>
          <Col className="Form-Col"span={6}>
            <Form.Item label="Nome">
              {getFieldDecorator(`name${i}`, {
                rules: [
                  {
                    required: true,
                    message: "Por favor, insira o seu nome.",
                    whitespace: true
                  }
                ]
              })(<Input placeholder ={typeof this.props.namePlaceHolder !== 'undefined' ? this.props.namePlaceHolder[i]: ""}/>)}
            </Form.Item>
          </Col>
          <Col className="Form-Col" span={4}>
            <Form.Item label="Idade">
              {getFieldDecorator(`age_input${i}`, {
                 rules: [
                  {
                    required: true,
                    message: "Por favor, selecione a sua idade."
                  }
                ], initialValue: 18 })(
                <InputNumber min={18} max={100} />
              )}
              <span className="ant-form-text"> anos </span>
            </Form.Item>
          </Col>
          <Col className="Form-Col" span={6}>
            <Form.Item label="Sexo" hasFeedback>
              {getFieldDecorator(`gender${i}`, {
                rules: [
                  {
                    required: true,
                    message: "Por favor, selecione o seu sexo."
                  }
                ]
              })(
                <Select size = "default" placeholder="Sexo" style={{ width: 120 }}>
                  <Option value="Male">Masculino</Option>
                  <Option value="Female">Feminino</Option>
                  <Option value="Other">Outro</Option>
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
      );
    }

    return inputs;
  };

  

  handleConfirmBlur = e => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };

    return (
      <Form
        layout="inline"
        className="Form-Container"
        onSubmit={this.handleSubmit}
      >
        <Col className="Form-Main-Col" type="flex">

          {this.renderInputs()}
          <Row  className="Form-Row"
          type="flex"
          justify="center"
          align="middle"
          gutter={8}>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Confirmar Dados
              </Button>
            </Form.Item>
          </Row>
        </Col>
      </Form>
    );
  }
}

const WrappedUserForm = Form.create({ name: "user_form" })(UserForm);

export default WrappedUserForm;
