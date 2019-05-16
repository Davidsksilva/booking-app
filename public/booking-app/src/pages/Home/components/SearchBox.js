import React, { Component } from 'react'

import {
    DatePicker,
    Row,
    Col,
    Button,
    InputNumber,
    Select,
} from "antd";
import "antd/dist/antd.css";
import "./components.css"
import locale from "antd/lib/date-picker/locale/pt_BR";

const {RangePicker} = DatePicker;
const Option = Select.Option;

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

export default class SearchBox extends Component {
    render() {
        return (
                <Row
                    className="Search-Outter-Container"
                    type="flex"
                    justify="start"
                    gutter={8}
                >
                    <Col>
                        <Row type="flex" justify="center" gutter={8}>
                            <Col className="Col-Container">Partida</Col>
                            <Col className="Col-Container">
                                <Select
                                    showSearch
                                    size="default"
                                    allowClear
                                    disabled = {this.props.disableSearch}
                                    placeholder="Local"
                                    optionFilterProp="children"
                                    onChange={this.props.handleChangeOrigin}
                                    filterOption={(input, option) =>
                                        option.props.children
                                            .toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0
                                    }
                                    defaultValue="AC"
                                    style={{ width: 120 }}
                                >
                                    {placesList.map(p => {
                                        if (this.props.destination === p)
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
                                    disabled = {this.props.disableSearch}
                                    placeholder="Local"
                                    optionFilterProp="children"
                                    onChange={this.props.handleChangeDestination}
                                    filterOption={(input, option) =>
                                        option.props.children
                                            .toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0
                                    }
                                    defaultValue="AL"
                                    style={{ width: 120 }}
                                >
                                    {placesList.map(p => {
                                        if (this.props.origin === p)
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
                                <RangePicker locale={locale} onChange={this.onChange} disabled = {this.props.disableSearch} />
                            </Col>
                            <Col className="Col-Container">Qtde. Hóspedes</Col>
                            <Col className="Col-Container">
                                <InputNumber
                                    min={1}
                                    max={10}
                                    defaultValue={1}
                                    disabled = {this.props.disableSearch}
                                    onChange={(value)=> this.props.onNumberGuestsChange(value)}
                                />
                            </Col>
                            <Col className="Col-Container">
                                <Button
                                    type="primary"
                                    icon="search"
                                    disabled = {this.props.disableSearch}
                                    onClick={() => this.props.searchFunction(this.props.destination)}
                                >
                                    Buscar
                                </Button>
                            </Col>

                            <Col className="Col-Container" id="End">
                                <Button
                                    type="dashed"
                                    icon="reload"
                                    onClick={() => this.props.reloadFunction()}
                                >
                                    Resetar
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
        )
    }
}
