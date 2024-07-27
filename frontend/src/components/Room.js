import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Grid,Button,Typography } from "@mui/material";
import CreateRoomPage from "./CreateRoomPage";

function Room({leaveRoomCallBack}) {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const initState={

    votesToSkip:0,
    guestCanPause:false,
    isHost:false,
    showSettings:false,
    spotifyAuthenticated:false,
    song:{}
  }

  const [roomData,setRoomData]=useState(initState)
  const  getRoomDetails=()=>{
    fetch(`/api/get-room?code=${roomCode}`)
        .then((response) => 
          {if(!response.ok){
            leaveRoomCallBack();
            navigate("/");
          }
          return response.json()})
        .then((data) => {
          setRoomData({
            ...roomData,
            votesToSkip: data.votes_to_skip,
            guestCanPause: data.guest_can_pause,
            isHost: data.is_host,
            
          });
          
          })
        .catch((error) => console.error("Error fetching room details:", error));
  }

  
  useEffect(() => {
      getRoomDetails();

    }, [roomCode]); 
  useEffect(()=>{
    if (!roomData.isHost){
      authenticateSpotify()
    }
  },[roomData.isHost])

  

  const authenticateSpotify=()=>{
    fetch("/spotify/is-authenticated")
     .then((res)=>res.json())
     .then((data)=>{
        setRoomData({
          ...roomData,
          spotifyAuthenticated:data.status});
          if (!data.status){
            fetch("/spotify/get-auth-url")
             .then((res)=>res.json())
             .then((data)=>{
                window.location.replace(data.url);
             })
          }       
     })
  }

  const getCurrentSong=()=>{
    fetch("/spotify/current-song").then((res)=>{
      if (res.ok){
        return res.json();
      }else{
        console.log("Error fetching current song",res)
        return {}
      }
      
    }).then((data)=>{
      setRoomData({
        ...roomData,
        song:data
      })
      console.log('data')
    })
  }

  
  const LeaveButtonPressed=()=>{
    const requestOptions={
      method:"POST",
      headers:{'Content-Type':'application/json'}
    }
    fetch("/api/leave-room/",requestOptions).then((res)=>
    {
      leaveRoomCallBack();
      navigate("/");
    })
  }

  const updateShowSettings=(value)=>{
    setRoomData({
      ...roomData,
      showSettings:value
    })
  }
  
  const renderSettingsButton=()=>{
    return(
      <Grid item xs={12} align='center'>
        <Button variant="contained" color="primary" 
          onClick={()=>updateShowSettings(true)} 
        >
          Settings
        </Button>
      </Grid>
    )
  }

  const renderSettings=()=>{
    return (<Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <CreateRoomPage 
          update={true} 
          votesToSkip={roomData.votesToSkip} 
          guestCanPause={roomData.guestCanPause} 
          roomCode={roomCode}
          updateCallBack={getRoomDetails}
        />
      </Grid>
      <Grid item xs={12} align="center">
        <Button variant="contained" color="secondary" onClick={()=>updateShowSettings(false)}>
          Close</Button>
      </Grid>
    </Grid>)
  }

  if(roomData.showSettings){
    return renderSettings();
  }
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography variant="h6" component="h6">
          Code: {roomCode}
        </Typography>
      </Grid>
      {roomData.song.title}
      {roomData.isHost ? renderSettingsButton() : null}
      <Grid item xs={12} align="center">
        <Button variant="contained" color="secondary" onClick={LeaveButtonPressed}>
          Leave Room
        </Button>
      </Grid>
    </Grid>

    
  );
}

export default Room;

