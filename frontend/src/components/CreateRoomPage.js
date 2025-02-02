import React, { Component } from "react";
import { Button, Typography, Grid, TextField, FormHelperText, FormControl, Radio, RadioGroup, FormControlLabel, FormLabel, THEME_ID, TableBody } from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import {Collapse} from "@mui/material";
import {Alert} from "@mui/material";
class CreateRoomPageClass extends Component {
    static defaultProps={
        votesToSkip:2,
        guestCanPause:true,
        update:false,
        roomCode:null,
        updateCallBack:()=>{}
    }
    constructor(props) {
        super(props);
        this.state={
            guestCanPause:this.props.guestCanPause,
            votesToSkip:this.props.votesToSkip,
            errorMsg:"",
            successMsg:''
        }
        this.handleRoomButtonPressed=this.handleRoomButtonPressed.bind(this)
    }

    handleVotesChange = (e) => {
        this.setState({
            votesToSkip:e.target.value,
        })
    }

    handleGuestCanPauseChange=(e)=>{
        this.setState({
            guestCanPause:e.target.value==="true"? true:false
        })
    }

    handleRoomButtonPressed=()=>
    {
        const requestOptions={
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({
                votes_to_skip:this.state.votesToSkip,
                guest_can_pause:this.state.guestCanPause
            })
        }
        fetch('/api/create-room/', requestOptions)
        .then((response)=>response.json())
        .then((data)=>this.props.navigate('/room/'+data.code))
    }

    handleUpdateButtonPressed=()=>{
        const requestOptions={
            method:"PATCH",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({
                votes_to_skip:this.state.votesToSkip,
                guest_can_pause:this.state.guestCanPause,
                code:this.props.roomCode
            })
        }
        fetch('/api/update-room/', requestOptions)
        .then((response)=>{
            if(response.ok){
                this.setState({
                    successMsg:"Room updated successfully!"
                })
            }else{
                errorMsg="Error updating room..."

            }
            this.props.updateCallBack();
        })
    }
    renderCreateButtons=()=>{
        return(
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Button color="primary" variant="contained" onClick={this.handleRoomButtonPressed}>
                        Create A Room
                    </Button>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button color="secondary" variant="contained" component={Link} to="/" >Back</Button>
                </Grid>

            </Grid>
        )
        
    }

    renderUpdateButtons=()=>{
        return(
            <Grid item xs={12} align="center">
                <Button color="primary" variant="contained" onClick={this.handleUpdateButtonPressed}>
                    Update A Room
                </Button>
            </Grid>
        )
    }

    render() {
        const title=this.props.update ? "Update Room" : "Create A Room";
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Collapse in={this.state.errorMsg!="" || this.state.successMsg!=""}>
                        {this.state.successMsg!=""? (
                            <Alert severity="success"
                            onClose={()=>{
                                this.setState({successMsg:""})
                            }}
                            >{this.state.successMsg}</Alert>
                        ):(
                            <Alert severity="error" 
                            onClose={()=>{
                                this.setState({errorMsg:""})
                            }}
                            >{this.state.errorMsg}
                            </Alert>)}
                    </Collapse>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography component="h4" variant="h4">
                        {title}
                    </Typography>
                </Grid>

                <Grid item xs={12} align="center">
                    <FormControl component="fieldset">
                        <FormHelperText>
                            <div align="center" > Guest Control Of Playback State</div>
                        </FormHelperText>
                        <RadioGroup row defaultValue={this.props.guestCanPause.toString()} onChange={this.handleGuestCanPauseChange}>
                            <FormControlLabel value={true}
                                control={<Radio color="primary" />}
                                label="Play/Pause"
                                labelPlacement="bottom" />

                            <FormControlLabel value={false}
                                control={<Radio color="secondary" />}
                                label="No Control"
                                labelPlacement="bottom" />
                        </RadioGroup>
                    </FormControl>
                </Grid>
                <Grid item xs={12} align="center">
                    <FormControl>
                        <TextField required type="number"
                            onChange={this.handleVotesChange}
                            defaultValue={this.state.votesToSkip}
                            inputProps={{
                                min: 1,
                                style: { textAlign: "center" }
                            }} />
                        <FormHelperText>
                            <div align="center">Votes required to skip the song</div>
                        </FormHelperText>

                    </FormControl>
                </Grid>
                {this.props.update ? this.renderUpdateButtons() : this.renderCreateButtons()}
            </Grid>
        )
    }
}

export default function CreateRoomPage(props) {
    const navigate=useNavigate();
    return (
        <CreateRoomPageClass navigate={navigate} {...props}/>
    )
}