# [TP] Travel App

Parte do projeto Travel Package (TP), inclui o front-end para a realização de novas reservas, back-end para registro das reservas e front-end para a dashboard de estatísticas sobre hotéis, vôos e reservas.

**Travel Package (TP):** constitui de um projeto de teste de familiarização com a tecnologia [Spring](https://spring.io/) e [React](https://reactjs.org/). Onde o usuário poderá fazer uma reserva de um pacote de viagem (Vôo + Quarto de Hotel) através de uma página em React, consumindo e alimentando as API's REST de Reserva (armazena o pacote), Vôos (armazena os vôos) e Hotéis (armazena os hotéis) utilizando um banco de dados [MySQL](https://www.mysql.com/). Também é fornecida uma Dashboard  que exibe estatísticas.



![diagram](./diagram.png)

## Getting Started

A seguir serão listadas as informações necessárias para a execução do projeto.

### Prerequisites

Pré-requisitos necessários para a execução do projeto:

- Gradle 4.10.2;
- Java 11;
- Docker 18.X;

Para o funcionamento completo da aplicação é necessário a execução do back-end dos [Vôos](https://github.com/Davidsksilva/Flight-Rest) e [Hotéis](https://github.com/Davidsksilva/Hotel-Rest).

### Executing

Para subir o container contento o banco de dados:

```bash
cd /database/
docker-compose up -d
```

Na primeira execução será necessário criar o banco de dados das aplicações, para isto é preciso acessar o mysql dentro do docker:

```bash
docker exec -it database_db_1 bash
mysql
create database db_hotel;
create database db_flight;
create database db_booking;
```

Para a execução do back-end:

```bash
cd /api/
./gradlew bootRun
```

Para a execução do front-end:

```bash
cd /public/booking-app
yarn start
```

