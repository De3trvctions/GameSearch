import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import GameCard from "./GameCard";
import {
    Jumbotron,
    Alert,
    Container,
    Row,
    Col,
    Button,
    Form,
    FormGroup,
    Label,
    Input,
    Modal,
    ModalHeader,
    ModalBody
} from 'reactstrap';

class App extends Component {
    constructor() {
        super();
        this.state = {
            alertVisible: false,
            title: '',
            movies: [{ cover: '', name: 'hello', id: 1 }],
            modal: false,
            currentPage: 1,
            todosPerPage: 3
        };

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onFindGame = this.onFindGame.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
        this.toggle = this.toggle.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    }

    //for popup
    onDismiss() {
        this.setState({ alertVisible: false });
    }

    //for form
    onSubmit = e => {
        e.preventDefault();
        this.setState({ alertVisible: false });

        const query = `/create?name=${this.state.title}`;

        axios
            .get(query)
            .then(result => {
                console.log(result.data);
                if (result.data === 'Not found') {
                    this.setState({ alertVisible: true });
                } else if (result.data === 'This game already exist in the database') {
                    alert(result.data);
                }
                this.getAllMovies();
            })
            .catch(error => {
                alert('Error: ', error);
            });

        this.toggle();
    };

    onFindGame = e => {

        e.preventDefault();
        this.setState({ alertVisible: false });

        if (e.target.value == "") {

            this.getAllMovies();
        } else {
            const query = `/findgame?name=${e.target.value}`;

            axios.get(query).
                then(result => {

                    this.setState({ movies: result.data });
                    console.log(result.data);

                }).catch(err => {
                    console.log(err);
                });
        }

    }

    // for form field
    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });

    }

    getAllMovies = () => {
        axios
            .get("/getAllMovies")
            .then(result => {
                this.setState({ movies: result.data });
                console.log(this.state.movies);
            })
            .catch(error => {
                console.log(error);
            });
    };

    componentDidMount() {
        this.getAllMovies();
    }

    deleteRecord = value => {
        console.log("to delete: ", value);
        const query = `/delete?id=${value}`;
        axios
            .get(query)
            .then(result => {
                this.getAllMovies();
            })
            .catch(error => {
                alert("Error: ", error);
            });
    };

    editRecord = (id, value, platform, genres) => {

        const query = `/update?id=${id}&text=${value}&platform=${platform}&genres=${genres}`;
        console.log(query);
        axios
            .get(query)
            .then(result => {
                this.getAllMovies();
                console.log("updated");
            }).catch(error => {

                alert("Error:" + error);
            });

    };

    handleClick(event) {
        this.setState({
            currentPage: Number(event.target.id)
        });
    }

    //https://www.codementor.io/blizzerand/building-forms-using-react-everything-you-need-to-know-iz3eyoq4y
    //todo add buttons to delete rows
    //https://codepen.io/aaronschwartz/pen/awOyQq?editors=0010
    //https://github.com/react-tools/react-table/issues/324
    render() {

        const { movies, currentPage, todosPerPage } = this.state;

        // Logic for displaying todos
        const indexOfLastTodo = currentPage * todosPerPage;
        const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
        const currentTodos = movies.slice(indexOfFirstTodo, indexOfLastTodo);

        const renderTodos = currentTodos.map((movies, index) => {
            return (
                <Col xs="4">
                    <GameCard
                        removeGame={this.deleteRecord.bind(this)}
                        editGame={this.editRecord.bind(this)}
                        games={movies}
                    />
                </Col>

            );
        });

        // Logic for displaying page numbers
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(movies.length / todosPerPage); i++) {
            pageNumbers.push(i);
        }

        const renderPageNumbers = pageNumbers.map(number => {
            return (
                <li
                    key={number}
                    id={number}
                    onClick={this.handleClick}
                >
                    {number}
                </li>
            );
        });

        function HasGame(){
            if(movies.length == 0){
                
                return(
                    
                    <div class="noGameDiv">

                        <img src="http://pm1.narvii.com/6688/d91c5f2917fe35c3862d2b2a8a2fc91c89e16450_00.jpg">
                            
                        </img>
                        <p>No result is found</p>
                    </div>
                
                );
            }

            return(<br></br>);
        }

        return (
            <div className="App">

                <Container>
                    <Jumbotron>
                        <h1 className="display-4">Game Search</h1>
                        <p className="lead">Search for game</p>
                    </Jumbotron>
                    <Row>
                        <Col>
                            <Alert
                                color="danger"
                                isOpen={this.state.alertVisible}
                                toggle={this.onDismiss}
                            >
                                Game not found
                            </Alert>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm="9">
                            <Input
                                type="text"
                                name="title"
                                id="findGame"
                                placeholder="Search a game title..."
                                onChange={this.onFindGame}
                            />
                        </Col>

                        <Col sm="3">
                            <div>
                                <Button color="success" onClick={this.toggle}>Request a game</Button>
                                <Modal isOpen={this.state.modal} toggle={this.toggle} className="modaltest">
                                    <ModalHeader toggle={this.toggle}>Request a game</ModalHeader>
                                    <ModalBody>

                                        <Form onSubmit={this.onSubmit}>
                                            <FormGroup>
                                                <Label for="title">Add a Game</Label>
                                                <Input
                                                    type="text"
                                                    name="title"
                                                    id="title"
                                                    placeholder="enter game title..."
                                                    onChange={this.onChange}
                                                />
                                            </FormGroup>
                                            <Button color="primary">Submit</Button>
                                        </Form>

                                    </ModalBody>
                                </Modal>
                            </div>

                        </Col>
                    </Row>

                    <Row>
                        <HasGame></HasGame>
                        <div class="page-items">
                            <ul>
                                <Row>
                                    {renderTodos}
                                </Row>

                            </ul>
                            <ul id="page-numbers">
                                {renderPageNumbers}
                            </ul>
                        </div>
                    </Row>

                </Container>
            </div>
        );
    }
}

export default App;
