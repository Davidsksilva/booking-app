import React, { Component } from "react";
import { Row, Col, Card, Button} from "antd";

import "antd/dist/antd.css";
import "./components.css";

export default class PackageDisplay extends Component {
  render() {
    return (
      <Col id="Package-Data-Container">
        <Row
          className="Package-Container-Row-Text"
          type="flex"
          justify="center"
          align="middle"
          gutter={8}
        >
          Informações do Pacote
        </Row>

        <Row
          className="Package-Container-Row-Cards"
          type="flex"
          justify="center"
          align="middle"
          gutter={8}
        >
          <Col>
            <Card
              title="Viajantes"
              bordered={true}
              headStyle={{
                backgroundColor: "#1890ff",
                color: "white",
                fontWeight: "600"
              }}
              className="Card-Container"
            >
              {this.props.guestsName.map((name, index) => {
                return (
                  <p>
                    {name}, {this.props.guestsAge[index]}
                  </p>
                );
              })}
            </Card>
          </Col>
          <Col>
            <Card
              title="Hotel"
              bordered={true}
              headStyle={{
                backgroundColor: "#1890ff",
                color: "white",
                fontWeight: "600"
              }}
              className="Card-Container"
            >
              <p>
                {this.props.hotelName}, {this.props.hotelLocation}
              </p>
              <p>Quarto número {this.props.bedroomNumber}</p>
              <p>Preço: R${this.props.bedroomPrice},00</p>
            </Card>
          </Col>
          <Col>
            <Card
              title="Vôo"
              bordered={true}
              headStyle={{
                backgroundColor: "#1890ff",
                color: "white",
                fontWeight: "600"
              }}
              className="Card-Container"
            >
              <p>
                {this.props.flightCode}, {this.props.flightCompany}
              </p>
              <p>
                Partida: {this.props.departureLocation}, {this.props.flightDay}{" "}
                às {this.props.flightTime}
              </p>
              <p>Preço: R${this.props.flightPrice},00</p>
            </Card>
          </Col>
        </Row>
        <Row
          className="Package-Container-Row-Text"
          type="flex"
          justify="center"
          align="middle"
          gutter={8}
        >
          Preço Total: R${this.props.bedroomPrice + this.props.flightPrice},00
        </Row>
        <Row
          className="Package-Container-Row-Text"
          type="flex"
          justify="center"
          align="middle"
          gutter={8}
        >
          <Button
            type="primary"
            onClick={this.props.handlePackageConfirmation}
          >
            Confirmar Pacote
          </Button>
        </Row>
      </Col>
    );
  }
}
