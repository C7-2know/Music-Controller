import React,{Component} from "react";
import HomePage from "./HomePage";
// import "../../static/css/index.css";


export default class App extends Component{
    constructor(props){
        super(props);
    }
    render(){
        return (
            <div className="center" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                <HomePage />
            </div>
        );
    }
}

