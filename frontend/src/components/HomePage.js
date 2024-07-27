import React,{Component} from "react";
import {BrowserRouter as Router,Switch,Route,Link,Navigate, Routes} from "react-router-dom";
import CreateRoomPage from "./CreateRoomPage";
import RoomJoinPage from "./RoomJoin";
import Room from "./Room";
import { Grid,Button,ButtonGroup,Typography } from "@mui/material";



export default class HomePage extends Component{
    constructor(props){
        super(props);
        this.state={
            roomCode:null
        }
    }

    async componentDidMount(){
        fetch("api/user-in-room").then((res)=>res.json())
            .then((data)=>{
                this.setState({
                    roomCode:data.code
                })
            })
    }
    renderHomePage(){
        return(
            <Grid container spacing={3}>
                <Grid item xs={12} align="center">
                    <Typography variant="h3" component="h3">House Party</Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <ButtonGroup disableElevation variant="contained" color="primary">
                        <Button color="primary" to="/join" component={Link}>Join a Room</Button>
                        <Button color="secondary" to="/create" component={Link}>Create a Room</Button>
                    </ButtonGroup>

                </Grid>
            </Grid>
        );
    }

    ClearRoomCode=()=>{
        this.setState({
            roomCode:null
        })
    }

    render(){
        return (
        <Router>
            <Routes>
                <Route path='/' element={this.state.roomCode ? 
                    <Navigate to={`/room/${this.state.roomCode}`}/> : this.renderHomePage()}/>
                <Route path='/create' element={<CreateRoomPage/>}/>
                <Route path='/join' element={<RoomJoinPage/>}/>
                <Route path='/room/:roomCode' element={<Room leaveRoomCallBack={this.ClearRoomCode}/>}
                />
            </Routes> 
        </Router>
        )


    }
}