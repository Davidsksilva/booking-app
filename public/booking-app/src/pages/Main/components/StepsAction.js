import React, { Component } from 'react'
import {
    Row,
    Col,
    Button,
    message,
    Icon
  } from "antd";
import "antd/dist/antd.css";


export default class StepsAction extends Component {

    renderButtontext = () =>{

        if(this.props.currentState === 1){
            return "Voltar para Hotéis";
        }
        else if(this.props.currentState === 2){
            return "Voltar para Quartos";
        }
        else if(this.props.currentState === 3){
            return "Voltar para Vôos";
        }
        else if (this.props.currentState === 4){
            return "Voltar para Dados"
        }
    }
    render() {
        return (
            <Row style={{marginTop: "10px"}}>
                <Col>
                    <div className="steps-action">
                    {this.props.current === this.props.stepLength - 1 && (
                        <Button
                        type="primary"
                        onClick={() =>
                            message.success("Processing complete!")
                        }
                        >
                        Done
                        </Button>
                    )}
                    {this.props.currentState > 0 && (
                        <Button
                        type="default"
                        style={{ marginLeft: 8 }}
                        onClick={() => this.props.prevFunction()}
                        >
                        <Icon type="left" />
                        {this.renderButtontext()}
                        </Button>
                    )}
                    </div>
                </Col>
            </Row>
        )
    }
}
