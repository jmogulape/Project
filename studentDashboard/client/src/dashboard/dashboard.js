import React,{Component} from 'react';
import axios from 'axios';
import { Row, Col} from 'react-bootstrap';
import css from "./dashboard.css"
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Login from '../login/Login'
import MaterialTable from "material-table";
import TextField from '@material-ui/core/TextField';
import Skeleton from '@material-ui/lab/Skeleton';
import { forwardRef } from 'react';

import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import $ from 'jquery';

import SimpleModal from "./requiredModal";

class Dashboard extends Component{
    componentWillMount(){
        this.setState({
            showLoginPage: false,
            showTable: true,
            showAddDataModal: false,
            tableData: this.props.tableData,
            showSpinner: false,
            showErrorMsg: false
        })
    }
    componentDidMount(){
        /*$(document.body).click((e)=> {
            this.setState({
                ...this.state,
                showAddDataModal: false,
            });
       });*/
    }
    componentDidUpdate(){
        /*$(document.body).click( (e)=> {
            this.setState({
                ...this.state,
                showAddDataModal: false,
            });
       });*/
    }
    postToDatabaseApi = (postData) => {
        return new Promise(async (resolve,reject)=>{
            axios
                .post("http://localhost:5000/api/users",postData)
                .then(response => {
                    console.log("response is:::",response);
                    resolve(response);
            }).catch(err => {
                    reject(err)
            });
        });
    }
    backToLogin = () => {
        this.setState({
            showLoginPage: true,
            showTable: false
        })
    }
    showModal = () => {
        return(
            <Modal
                open={this.state.showAddDataModal}
                onClose={this.handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                >
                <form noValidate autoComplete="off">
                    <TextField id="userId-basic" label="UserId" />
                    <TextField id="standard-basic" label="Age" />
                    <TextField id="standard-basic" label="Gender" />
                    <TextField id="standard-basic" label="Physics" />
                    <TextField id="standard-basic" label="Chemistry" />
                    <TextField id="standard-basic" label="Math" />
                    <Button onClick={this.addDataToDB} variant="text" color="primary" size="sm">
                                                Add</Button>
                </form>
            </Modal>
        );
    }
    addData = () => {
        this.setState({
            ...this.state,
            showAddDataModal: true,
        });
    }
    addDataToDB = async () => {
        let temp_obj = {};
        let userid_basic = document.getElementById("userid_basic").value;
        let age_basic = document.getElementById("age_basic").value;
        let gender_basic = document.getElementById("gender_basic").value;
        let physics_basic = document.getElementById("physics_basic").value;
        let chem_basic = document.getElementById("chem_basic").value;
        let math_basic = document.getElementById("math_basic").value;
        let cgpa_basic = document.getElementById("cgpa_basic").value;
        temp_obj.name = userid_basic;
        temp_obj.age = age_basic;
        temp_obj.gender = gender_basic;
        temp_obj.phy = physics_basic;
        temp_obj.chem = chem_basic;
        temp_obj.math = math_basic;
        temp_obj.cgpa = cgpa_basic;
        temp_obj.email = userid_basic + "@gmail.com";
        temp_obj.password = "adminoo"
        console.log("temp_obj is:::",temp_obj);
        if(
            temp_obj.name != "" &&
            temp_obj.age != "" && temp_obj.gender != "" &&
            temp_obj.phy != "" && temp_obj.chem != "" &&
            temp_obj.math != "" && temp_obj.cgpa != ""
        ){
            document.querySelector("#modal_button").innerText = "Adding..."
            document.getElementById("modal_err_msg").style.display = "none"
            const resp = await this.postToDatabaseApi(temp_obj);
            console.log("resp is::",resp);
            let response = await this.props.getNewData()
            this.setState({
                ...this.state,
                tableData: response,
            });
            this.handleClose();
        }else{
            document.getElementById("modal_err_msg").style.display = "block"
        }
    }
    getTableProps=()=>{
        const data = this.state.tableData;
        const tableIcons = {
            Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
            Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
            Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
            Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
            DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
            Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
            Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
            Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
            FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
            LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
            NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
            PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
            ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
            Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
            SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
            ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
            ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
        };
        const actions=[
            {
              icon: tableIcons.Delete,
              tooltip: 'Delete Row',
              onClick: (event, rowData) => {
                // Do save operation
              }
            }
        ]
        const columns = [
            {
              title: "Name",
              field: "name",
            },
            {
              title: "Email",
              field: "email",
            },
            {
              title: "Age",
              field: "age",
            },
            {
              title: "Gender",
              field: "gender",
            },
            {
                title: "Phy",
                field: "phy",
            },
            {
                title: "Chem",
                field: "chem",
            },
            {
                title: "Math",
                field: "math",
            },
            {
                title: "CGPA",
                field: "cgpa",
            }
        ];
        const options = { 
            search: true, 
            paging: true, 
            filtering: true, 
            exportButton: true ,
            headerStyle: {
                backgroundColor: '#01579b',
                color: '#FFF'
            },
            rowStyle: {
                backgroundColor: '#EEE',
            }
        }
        const tableConfig = {
            title:"Student Marksheet Table",
            data,
            columns,
            //actions,
            options,
            //icons: {...tableIcons},
            selection: true
        }
        return tableConfig;
    }
    handleOpen = () => {
        this.setState({
            ...this.state,
            showAddDataModal: true,
        });
    };
    
    handleClose = () => {
        this.setState({
            ...this.state,
            showAddDataModal: false,
        });
    };

    render(){
        const tableProps = this.getTableProps();
        const tableIcons = {
            Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
            Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
            Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
            Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
            DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
            Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
            Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
            Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
            FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
            LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
            NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
            PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
            ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
            Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
            SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
            ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
            ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
        };
        return(
            <div>
                {/*
                    this.state.showSpinner && (
                        <Skeleton variant="circle" width={40} height={40} />
                    )
                    */}
                {!this.state.showTable && this.state.showLoginPage && (
                    <div>
                        <Login/>
                    </div>
                )}
                {this.state.showTable && !this.state.showLoginPage && (
                    <div>
                        <Button onClick={this.backToLogin} className="back_to_login" variant="text" color="primary">
                                                Back to Login</Button>
                        <div className="satya_table">
                            <MaterialTable icons={tableIcons} {...tableProps}/>
                        </div>
                        <Button className="modal_button2" onClick={this.handleOpen} variant="contained" color="primary">
                                                            Add Data</Button>
                        <Modal class="satya_modal"
                            open={this.state.showAddDataModal}
                            onClose={this.handleClose}
                            
                        >
                            <form className="satya_form"noValidate autoComplete="off">
                                <TextField className="textbox_modal" id="userid_basic" label="UserId" />
                                <TextField className="textbox_modal" id="age_basic" label="Age" />
                                <TextField className="textbox_modal" id="gender_basic" label="Gender" />
                                <TextField className="textbox_modal" id="physics_basic" label="Physics" />
                                <TextField className="textbox_modal" id="chem_basic" label="Chemistry" />
                                <TextField className="textbox_modal" id="math_basic" label="Math" />
                                <TextField className="textbox_modal" id="cgpa_basic" label="CGPA" />
                                <p id="modal_err_msg">Enter All Values</p>
                                <Button id="modal_button" className="modal_button" onClick={this.addDataToDB} variant="contained" color="primary">
                                                            Add</Button>
                                <Button id="cancel_button" className="modal_button" onClick={this.handleClose} variant="outlined" color="primary">
                                                            Cancel</Button>
                            </form>
                        </Modal>
                    </div>
                )}
                {/*{this.state.showAddDataModal && this.showModal()}*/}
            </div>
        )
    }
}

export default Dashboard;