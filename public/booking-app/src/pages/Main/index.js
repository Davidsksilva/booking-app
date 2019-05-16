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
  message 
} from "antd";
import "antd/dist/antd.css";
import "./styles.css";

import PageHeader from "./components/PageHeader";
import SearchBox from "./components/SearchBox";
import UserForm from "./components/UserForm";
import ListDisplay from "./components/ListDisplay";
import StepsAction from "./components/StepsAction";
import StepsDisplay from "./components/StepsDisplay";
import InfoDisplay from "./components/InfoDisplay";
import PackageDisplay from "./components/PackageDisplay";


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
    title: "Inserir Dadados",
    content: "Third-content"
  }
  ,
  {
    title: "Confirmar Pacote",
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
    num_clients: 1,
    clients_name: [],
    clients_age: [],
    clients_gender: [],
    showList: false,
    showSteps: false,
    showUserForm: false,
    showInfo: false,
    showPackage: false,
    bedroomModalVisible: false,
    selectedHotelId: null,
    selectedHotelName: "",
    selectedBedroomNum: null,
    disableSearch: false,

  };


  next() {
    const value = this.state.current + 1;
    this.setState({ current: value });
  }

  onNumberGuestsChange = (value) =>{
    this.setState({num_clients: value })
  }
  handleReload =  () =>{
    this.setState({
      selectedBedroomNum: null,
      selectedHotelId: null,
      selectedHotelName: "",
      disableSearch: false,
      showInfo: false,
      showUserForm: false,
      showSteps: false,
      showPackage: false,
      showList: false,
      current: 0,
      destination: "AL",
      origin: "AC",
      num_clients: 1,
      clients_age: [],
      clients_name: [],
      clients_gender: []
    });
  }

  postClient = async (client_data, href) =>{

    axios.post(href, {
      name: client_data.name,
      age: client_data.age,
      gender: client_data.gender
    })
    .then(function (response){

    })
    .catch(function (response){

    });
  }

  postBooking = async (thisObject) =>{

    
  }
  handlePackageConfirmation =  () =>{

    message.success("Pacote encomendado com sucesso!");
    
    this.setState({
      disableSearch: false,
      showInfo: false,
      showUserForm: false,
      showSteps: false,
      showPackage: false,
      showList: false,
    });
    let thisObject = this;

    axios.post(`http://localhost:7070/reservas`, {
      hotelId: thisObject.state.selectedHotelId,
      bedroomNum: thisObject.state.selectedBedroomNum,
      flightId: thisObject.state.selectedFlightId
    })
    .then(function (response) {
      let booking_href = response.data._links.self.href;

      for(let i = 0; i < thisObject.state.num_clients;i++){

        let client_data = {
          name: thisObject.state.clients_name[i],
          age: thisObject.state.clients_age[i],
          gender: thisObject.state.clients_gender[i]
        }
        thisObject.postClient(client_data, booking_href);
      }
    })
    .catch(function (error) {
      console.log(error);
    })
    .finally(() =>{
      this.handleReload();
    });


  }

handleSearch =  (destination) =>{

  this.setState({disableSearch: true})
  this.requestHotels(destination);
}

  selectedPressed = (item_key, item) => {
    // If a hotel has been selected
    if (this.state.current === 0) {
      this.setState({ selectedHotelId: item_key });
      this.setState({ selectedHotelName: item.name });
      this.requestBedrooms(item_key);
    }

    // If a room has been selected
    else if (this.state.current == 1) {
      this.setState({ 
        selectedBedroomNum: item_key,
        selectedBedroomPrice: item.price  });
      this.requestFlights();
    }
    // If a flight has been selected
    else if(this.state.current == 2){
      this.setState({ listDataSource: [] });
      // Display Component States
      this.setState({
        showList: false,
        showSteps:true,
        showInfo: true,
        showPackage: false,
        showUserForm: true
      });
      this.setState({
        selectedFlightId: item.key,
        selectedFlightCode: item.code,
        selectedFlightCompany: item.company_name,
        selectedFlightDay: item.flight_day,
        selectedFlightTime: item.depart_time,
        selectedFlightPrice: item.price,
      });
       
      };
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
    // Show package data
    else if (value == 3){
      this.setState({
        show: true,
        showList: false,
        showSteps:true,
        showInfo: true,
        showUserForm: true,
        showPackage: false,
      });
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
          showPackage: false,
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
          showPackage: false,
        });
      });
  }

  requestBedrooms = async (hotel_id) => {
    this.setState({ listDataSource: [] });
    axios
      .get(`http://localhost:9090/hoteis/${hotel_id}/quartos?occupation=free&min_beds=${this.state.num_clients}`)
      .then(response => {
        let bedroom_list = response.data._embedded.bedroomList;
        bedroom_list.map(bedroom => {
          let bedroom_data = {
            key: bedroom.number,
            num_beds: bedroom.num_beds,
            price: bedroom.price
          };

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
          showPackage: false,
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
                this.selectedPressed(item.key, item)
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
            {`${item.num_beds} cama(s) no quarto`}
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
                this.selectedPressed(item.key, item)
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
                this.selectedPressed(item.key, item)
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

  handleValues = (data) => {

    const value = this.state.current + 1;
    this.setState({ current: value });

    let name_list=[];
    let age_list= [];
    let gender_list=[];

    for(let i = 0; i < this.state.num_clients; i++){

      name_list.push(data[`name${i}`]);
      age_list.push(data[`age_input${i}`]);
      gender_list.push(data[`gender${i}`]);
    }

    this.setState({ listDataSource: [] });
    this.setState({
      showList: false,
      showSteps:true,
      showInfo: true,
      showPackage: true,
      showUserForm: false,
      clients_age: age_list,
      clients_name: name_list,
      clients_gender: gender_list,
    });

  };

  render() {
    return (
      <div id="Page">
        <Layout id="Layout">
          <PageHeader />

          <Content id="Main-Container">
            <div style={{ padding: 0, height: "100%", width: "100%"}}>
              <Col
                id="Content-Container"
                type="flex"
                justify="start"
                align="center"
              >
                <SearchBox
                  searchFunction={this.handleSearch}
                  reloadFunction={this.handleReload}
                  onNumberGuestsChange={this.onNumberGuestsChange}
                  disableSearch={this.state.disableSearch}
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
                  <UserForm
                  numGuests = {this.state.num_clients}
                  handleValues = {this.handleValues}
                  genderPlaceHolder = {this.state.clients_gender}
                  namePlaceHolder = {this.state.clients_name}
                  agePlaceHolder = {this.state.clients_age}/>
                )}

                {this.state.showPackage && (
                  <PackageDisplay
                  guestsName= {this.state.clients_name}
                  guestsAge= {this.state.clients_age}
                  guestsGender={this.state.clients_gender}
                  hotelName={this.state.selectedHotelName}
                  hotelLocation={this.state.destination}
                  bedroomNumber={this.state.selectedBedroomNum}
                  bedroomPrice = {this.state.selectedBedroomPrice}
                  flightCode= {this.state.selectedFlightCode}
                  flightCompany={this.state.selectedFlightCompany}
                  flightTime= {this.state.selectedFlightTime}
                  flightDay = {this.state.selectedFlightDay}
                  flightPrice = {this.state.selectedFlightPrice}
                  departureLocation={this.state.origin}
                  handlePackageConfirmation={this.handlePackageConfirmation}/>
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
