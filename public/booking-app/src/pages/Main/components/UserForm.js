import React, { Component } from "react";
import { Form, Input, Col, Select, InputNumber, Button, Row } from "antd";

import "antd/dist/antd.css";
import "./components.css";

const { Option } = Select;

class UserForm extends Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
      }
    });
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
      <Form layout="inline"className="Form-Container" onSubmit={this.handleSubmit}>
        <Col className="Form-Main-Col" type="flex" justify="">
          <Row className="Form-Row" type="flex" justify="start" align="middle"  gutter={8}>
            <Col className="Form-Col" span={6}>
              Pessoa
            </Col>
            <Col  span={6}>
              <Form.Item label="Nome">
                {getFieldDecorator("nome", {
                  rules: [
                    {
                      required: true,
                      message: "Por favor, insira o seu nome.",
                      whitespace: true
                    }
                  ]
                })(<Input />)}
              </Form.Item>
            </Col>
            <Col  spawn={6}>
            <Form.Item label="Idade">
              {getFieldDecorator("input-number", { initialValue: 18 })(
                <InputNumber min={18} max={100} />
              )}
              <span className="ant-form-text"> anos </span>
            </Form.Item>
            </Col>
            <Col  span={6}>
            <Form.Item label="Sexo" hasFeedback>
              {getFieldDecorator("select", {
                rules: [
                  {
                    required: true,
                    message: "Por favor, selecione o seu sexo."
                  }
                ]
              })(
                <Select placeholder="Sexo">
                  <Option value="Male">Masculino</Option>
                  <Option value="Female">Feminino</Option>
                  <Option value="Other">Outro</Option>
                </Select>
              )}
            </Form.Item>
            </Col>
            

            
          </Row>

          <Row className="Form-Row" type="flex" justify="start">
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
