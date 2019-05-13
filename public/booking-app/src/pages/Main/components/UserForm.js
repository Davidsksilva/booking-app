import React, { Component } from 'react'
import {
    Layout,
    Form,
    Input,
    Tooltip,
    Icon,
    Cascader,
    Select,
    Row,
    Col,
    Checkbox,
    InputNumber,
    Button,
    AutoComplete,
  } from "antd";

import "antd/dist/antd.css";

const { Option } = Select;
const AutoCompleteOption = AutoComplete.Option;



class UserForm extends Component {

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values);
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
        wrapperCol: { span: 14 },
      };

    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Form.Item
          label="Nome"
        >
          {getFieldDecorator('nome', {
            rules: [{ required: true, message: 'Por favor, insira o seu nome.', whitespace: true }],
          })(<Input />)}
        </Form.Item>

        <Form.Item label="Idade">
          {getFieldDecorator('input-number', { initialValue: 18 })(<InputNumber min={18} max={100} />)}
          <span className="ant-form-text"> anos </span>
        </Form.Item>
 
        <Form.Item label="Select" hasFeedback>
          {getFieldDecorator('select', {
            rules: [{ required: true, message: 'Please select your country!' }],
          })(
            <Select placeholder="Sexo">
              <Option value="Male">Masculino</Option>
              <Option value="Female">Feminino</Option>
              <Option value="Other">Outro</Option>
            </Select>,
          )}
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          {getFieldDecorator('agreement', {
            valuePropName: 'checked',
          })(
            <Checkbox>
              Eu li e aceito os <a href="">termos</a>
            </Checkbox>,
          )}
        </Form.Item>
        <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
          <Button type="primary" htmlType="submit">
            Confirmar Dados
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

const WrappedUserForm = Form.create({ name: 'user_form' })(UserForm);

export default WrappedUserForm;
