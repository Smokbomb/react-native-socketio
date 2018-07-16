import React, { Component } from "react";
import { StyleSheet, View  , Video ,Button , Text , Image} from "react-native";

import PlaceInput from "./src/components/PlaceInput/PlaceInput";
import PlaceList from "./src/components/PlaceList/PlaceList";
import { Constants, Audio   } from 'expo';
import socketIOClient from 'socket.io-client'

export default class App extends Component {

  placeAddedHandler = placeName => {
    this.setState(prevState => {
      return {
        places: prevState.places.concat(placeName)
      };
    });
  };
  state = {
    price : 0 ,
    places:[],
    input: '',
    message: [],
    endpoint: "http://192.168.1.28:3000" // เชื่อมต่อไปยัง url ของ realtime server
  }  
  componentDidMount = () => {
    this.response();
        }
         
  response = () => {
    const { endpoint, message } = this.state
    const temp = message
    const socket = socketIOClient(endpoint)
    socket.on('new message',  async (messageNew) => {
      try {
        await Audio.setIsEnabledAsync(true);  
        const sound = new Audio.Sound();
        await sound.loadAsync(require("./sound/button-10.mp3"));
        await sound.playAsync(); 
        console.log(messageNew)  
        this.setState(prevState => {
          return{
            price: messageNew.message
          }
        });
      } catch(error) {
        console.error(error);
      } 

      
  

    })
  }
  send = (message) => {
    const { endpoint, input } = this.state
    const socket = socketIOClient(endpoint)
    socket.emit('new message',5000)
  }  
  placeSubmitHandler  = async () =>{
      try {
        this.send();
      } catch(error) {
        console.error(error);
      }  
    

  }
   numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
render() {
  const { input, price } = this.state
  const placesOutput =this.state.price;
  return (
    <View style={styles.container}>
      <View style={styles.viewImage}>   
        <Image
              style={styles.image}
              resizeMode="stretch"
              source={require('./image/car2.jpg')}
            />
      </View>
    
      <View style={styles.row} >
          
          <View style = {styles.placeButton} onTouchStart={this.placeSubmitHandler} >
              <Text style={{width: '100%',textAlign: 'center'}}> 加算 </Text>
            </View>
          <View>
          <Text style={{width: '100%',textAlign: 'center',fontSize:36}}   >{this.numberWithCommas(placesOutput)} 円</Text>
          </View>
      </View>
    
    </View>  
  
  );
}
}
const styles = StyleSheet.create({
  container: {
    flex:1,
    padding:26,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  viewImage:{
    flex: 1,
  },
  image:{
    maxWidth:460
  },
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  colume:{
    flex:1,
    flexDirection:'column',
    justifyContent:'flex-start',
    alignItems:'flex-start'
  } ,
  row:{  
    flex:1,
    width:'100%',
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
  },
  placeInput:{
    width:"70%"
  },placeButton:{
    backgroundColor:"red",
    alignItems:"center",
    flexDirection:'row',
   width: 80,
   height: 80,
   borderRadius: 80/2

  },
});
