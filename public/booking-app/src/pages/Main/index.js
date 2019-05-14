import React, { Component} from "react";
import axios from "axios";

import {
  Layout,
  Row,
  Col,
  Button,
  Icon,
  Alert,
  Steps,
} from "antd";
import "antd/dist/antd.css";
import "./styles.css";

import PageHeader from "./components/PageHeader";
import SearchBox from "./components/SearchBox";
import UserForm from "./components/UserForm";
import ListDisplay from "./components/ListDisplay"
import StepsAction from "./components/StepsAction"
import StepsDisplay from "./components/StepsDisplay"
import InfoDisplay from "./components/InfoDisplay"

const {Content} = Layout;
const Step = Steps.Step;
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
    showList: false,
    showSteps: false,
    showUserForm: false,
    showInfo: false,
    bedroomModalVisible: false,
    selectedHotelId: 0,
    selectedHotelName: "",
    selectedBedroomNum: 0
  };


  next() {
    const value = this.state.current + 1;
    this.setState({ current: value });
  }

  selectedPressed = async (item_key, hotel_name) => {
    // If a hotel has been selected
    if (this.state.current === 0) {
      this.setState({ selectedHotelId: item_key });
      this.setState({ selectedHotelName: hotel_name });
      this.requestBedrooms(item_key);
    }

    // If a room has been selected
    else if (this.state.current == 1) {
      this.setState({ selectedBedroomNum: item_key });
      this.requestFlights();
    }
    else if(this.state.current == 2){
      this.setState({ listDataSource: [] });
      this.setState({
        showList: false,
        showSteps:true,
        showInfo: true,
      })
      this.setState({showUserForm: true})
      let book_data = {
       
      };

      this.setState({
        listDataSource: [...this.state.listDataSource, book_data]
      });

    }

    const value = this.state.current + 1;
    this.setState({ current: value });
  };

  prev = () => {
    const value = this.state.current - 1;
    this.setState({ current: value });

    if (value == 0) {
      this.requestHotels(this.state.destination);
    }
    else if(value == 1){
      this.requestBedrooms(this.state.selectedHotelId);
    }
    else if(value == 2){
      this.requestFlights()
    }
  }

  onChange = e => {
    console.log(e);
  };

  handleChangeDestination = value => {
    this.setState({
      destination: value
    });
  };

  showBedrooms = hotel_id => {
    this.setState({
      bedroomModalVisible: true
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      bedroomModalVisible: false
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      bedroomModalVisible: false
    });
  };

  handleChangeOrigin = value => {
    this.setState({
      origin: value
    });

    console.log(this.state.origin);
  };

  requestHotels = async (destination) => {
    this.setState({ listDataSource: [] });
    axios
      .get(`http://localhost:9090/hoteis?location=${destination}`)
      .then(response => {
        let hotel_list = response.data._embedded.hotelList;
        hotel_list.map(hotel => {
          let hotel_data = {
            key: hotel.id,
            name: "Hotel " + hotel.name,
            state: hotel.state,
            stars: hotel.stars
          };

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
          showList: true,
          showSteps:true,
          showInfo: true,
          showUserForm: false,
        });
      });
  };

  requestFlights = async () =>{
    this.setState({ listDataSource: [] });
    axios
      .get(
        `http://localhost:8080/voos?origin=${
          this.state.origin
        }&destination=${this.state.destination}`
      )
      .then(response => {
        let flight_list = response.data._embedded.flightList;
        flight_list.map(flight => {
          let day;
          if(flight.flight_day == "Monday"){
            day = "Segunda-Feira"
          }
          else{
            day = "Sexta-feira"
          }
          let flight_data = {
            key: flight.id,
            code: flight.code,
            depart_time: flight.departure_time,
            flight_day: day,
            seats_left: flight.seats - flight.taken_seats,
            company_name: flight.company.name,
            price: flight.price
          };

          console.log(flight_list)
          this.setState({
            listDataSource: [...this.state.listDataSource, flight_data]
          });

        });
      })
      .catch(error => {})
      .finally(() => {
        this.setState({
          show: true,
          showList: true,
          showSteps:true,
          showUserForm: false,
        });
      });
  }

  requestBedrooms = async (hotel_id) => {
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

          console.log(bedroom_data);
          this.setState({
            listDataSource: [...this.state.listDataSource, bedroom_data]
          });
        });
      })
      .catch(error => {})
      .finally(() => {
        this.setState({
          show: true,
          showList: true,
          showSteps:true,
          showInfo: true,
          showUserForm: false,
        });
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

  renderListTitle = () => {
    switch (this.state.current) {
      case 0:
        return `Hotéis em ${this.state.destination}`;
      case 1:
        return `Quartos disponíveis em ${this.state.selectedHotelName}`;
      case 2:
        return `Vôos de ${this.state.origin} para ${this.state.destination}`;
    }
  };

  renderListItemCol = item => {

    // Display hotel column data
    if(this.state.current == 0){
      return (
        <Row
          className="Hotel-List-Item-Row"
          type="flex"
          justify="start"
          align="middle"
          gutter={8}
        >
          <Col className="Hotel-List-Item-Col-Name" spawn={6}>
            {item.name}
          </Col>
          <Col className="Hotel-List-Item-Col-Location" spawn={6}>
            {item.state}
          </Col>
          <Col className="Hotel-List-Item-Col-Stars" spawn={6}>
            {this.renderStars(item.stars)}
          </Col>
          <Col
            className="Hotel-List-Item-Col-Button"
            type="flex"
            align="end"
            spawn={6}
          >
            <Button
              type="primary"
              onClick={() =>
                this.selectedPressed(item.key, item.name)
              }
            > 
              {this.renderButtonName()}
            </Button>
          </Col>
        </Row>
      );
    }
    // Display bedrooms  column data
    else if(this.state.current == 1){

      return(
        <Row
          className="Hotel-List-Item-Row"
          type="flex"
          justify="start"
          align="middle"
          gutter={8}
        >
          <Col className="Hotel-List-Item-Col-Name" spawn={6}>
            {`Quarto número ${item.key}`}
          </Col>
          <Col className="Hotel-List-Item-Col-Location" spawn={6}>
            {`${item.num_beds} camas no quarto`}
          </Col>
          <Col className="Hotel-List-Item-Col-Stars" spawn={6}>
            {`R$ ${item.price} p/ noite`}
          </Col>
          <Col
            className="Hotel-List-Item-Col-Button"
            type="flex"
            align="end"
            spawn={6}
          >
            <Button
              type="primary"
              onClick={() =>
                this.selectedPressed(item.key, item.name)
              }
            >
              {this.renderButtonName()}
            </Button>
          </Col>
        </Row>
      );
    }
    // Display flight column data
    else if (this.state.current == 2){
      return(
        <Row
          className="Hotel-List-Item-Row"
          type="flex"
          justify="start"
          align="middle"
          gutter={8}
        >
          <Col className="Hotel-List-Item-Col-Code" spawn={6}>
            {`Vôo ${item.code}`}
          </Col>
          <Col className="List-Item-Col-Company" spawn={6}>
            {`${item.company_name}`}
          </Col>
          <Col className="List-Item-Col-Departure" spawn={6}>
            {`${item.flight_day} ${item.depart_time}`}
          </Col>
          <Col className="Hotel-List-Item-Col-Stars" spawn={6}>
            {`R$ ${item.price} p/ pessoa`}
          </Col>
          <Col
            className="Hotel-List-Item-Col-Button"
            type="flex"
            align="end"
            spawn={6}
          >
            <Button
              type="primary"
              onClick={() =>
                this.selectedPressed(item.key, item.name)
              }
            >
              {this.renderButtonName()}
            </Button>
          </Col>
        </Row>
      );
    }
    
  };

  renderButtonName = () => {
    switch (this.state.current) {
      case 0:
        return "Selecionar Hotel";
      case 1:
        return "Selecionar Quarto";
      case 2:
        return "Selecionar Vôo";
    }
  };

  render() {
    return (
      <div id="Page">
        <Layout id="Layout">
          <PageHeader />

          <Content id="Main-Container">
            <div style={{ padding: 0, height: "100%", width: "100%" }}>
              <Col
                id="Content-Container"
                type="flex"
                justify="start"
                align="center"
              >
                <SearchBox
                  searchFunction={this.requestHotels}
                  destination={this.state.destination}
                  origin={this.state.origin}
                  handleChangeDestination={this.handleChangeDestination}
                  handleChangeOrigin={this.handleChangeOrigin}
                />

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

                {this.state.showSteps && (
                  <StepsDisplay
                  currentStep= {this.state.current}/>
                )}
               

                {this.state.showInfo && (
                  <InfoDisplay/>
                )}

               
                {this.state.showUserForm && (
                  <UserForm/>
                )}

                {this.state.showList && (
                  <ListDisplay
                  headerRenderingFunc={this.renderListTitle}
                  itemRenderingFunc={this.renderListItemCol}
                  dataSource={this.state.listDataSource}/>
                )}

                {this.state.showSteps && (
                  <StepsAction
                  prevFunction={this.prev}
                  currentState={this.state.current}
                  stepLength={steps.length}/>
                )}

              </Col>
            </div>
          </Content>
        </Layout>
      </div>
    );
  }
}
