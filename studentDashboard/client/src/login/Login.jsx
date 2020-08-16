import React,{Component} from 'react';
import axios from 'axios';
import { Row, Col} from 'react-bootstrap';
import "./css/login.css"
import cisco_logo1 from "./img/cisco-logo.png"
import Button from '@material-ui/core/Button';
import background_image from "./img/background.mp4"
import {BrowserRouter} from 'react-router-dom'
import Dashboard from '../dashboard/dashboard'
import $ from 'jquery';

import Skeleton from '@material-ui/lab/Skeleton';

class Login extends Component{
    componentWillMount(){
        this.setState({
            showLoginPage: true,
            showTable: false,
            showErrorMsg: false,
            tableData: [],
            showSpinner: false,
        });
    }

    callToDatabase = () => {
        return new Promise(async (resolve,reject)=>{
            axios
                .get("http://localhost:5000/api/users")
                .then(response => {
                    console.log("response is:::",response);
                    resolve(response.data);
            }).catch(err => {
                    reject(err)
            });
        });
    }

    login = async () => {
        let userId = document.getElementById("user_id").value;
        let password = document.getElementById("password_txt").value;
        if(userId == "admin" && password == "admin"){
            let response = await this.callToDatabase();
            this.setState({
                ...this.state,
                showLoginPage: false,
                showTable: true,
                tableData: response,
            })
        }else{
            document.getElementById("modal_err_msg").style.display = "block"
        }
    }
    render(){
        return(
            <div>
                {/*
                    this.state.showSpinner && (
                        <Skeleton variant="circle" width={40} height={40} />
                    )
                    */}
                {!this.state.showTable && !this.state.showErrorMsg && this.state.showLoginPage && (<div className="login_side" >
                    <div id="top_bar" className="top_bar">
                        <Row>
                            <Button className="signin_button" variant="text" color="secondary" size="lg">
                                        Signin</Button>
                            <Button className="login_button2" variant="text" color="secondary" size="lg">
                                        Login</Button>
                        </Row>
                    </div>
                    {/*<div id="video-container">
                        <video autoplay loop muted>
                            <source src="./img/background.mp4" type="video/mp4"></source>
                        </video>
                    </div>*/}
                    <div id="main-content">
                        <Row className="empty_row"></Row>
                        <Row>
                            <p className="welcome">Welcome to<br/>Student Marksheet Dashboard</p>
                        </Row>
                        <Row>
                            <p className="login_text">userId</p>
                        </Row>
                        <Row>
                            <input id="user_id" className="login_input"placeholder="Enter Userid"/>
                        </Row>
                        <Row>
                            <p className="login_text">Password</p>
                        </Row>
                        <Row>
                            <input id="password_txt" className="login_input" placeholder="Enter Password"/>
                        </Row>
                        <Row>
                            <p id="modal_err_msg">Enter correct Id and password</p>
                        </Row>
                        <Row>                   
                            <Button onClick={this.login} className="login_button" variant="contained" size="lg">
                                    Login</Button>
                        </Row>
                    </div>
                </div>)
                }
                {this.state.showTable && !this.state.showLoginPage && (
                    <div>
                        <Dashboard tableData={this.state.tableData} getNewData={this.callToDatabase}/>
                    </div>
                )}
            </div>
        );
      }
}

export default Login;
