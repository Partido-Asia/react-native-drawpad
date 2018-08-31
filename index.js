'use strict'
import React, { Component } from 'react';
import { ScrollView, Alert, WebView, View, Dimensions, TouchableOpacity, Text, Image } from 'react-native';
import WebViewBridge from 'react-native-webview-bridge';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import PropTypes from 'prop-types';

const injectScript = `
  (function () {
    if (WebViewBridge) {
      WebViewBridge.onMessage = function (message) {
        var type = message.split("】")[0];
        var content = message.split("】")[1];
        if (type == 'color') {
          getColor(content);
        }else if(type == 'size'){
          getSize(Number(content));
        }else if(type == 'lastStep'){
          lastStep();
        }else if(type == 'init'){
          var cts = content.split("/");
          init(cts);
        }
      };
    }
  }());
`;

const htmlSource = `
<!DOCTYPE html>
<html>
<head>
  <title></title>
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
</head>
<body style="margin: 0px;border:0px;overflow: hidden;padding:0px">
<canvas id="main_canvas" style="display: block;margin:0px;border:0px;padding:0px;"></canvas>
<script type="text/javascript">

  var disableMagnifier = function(e) { e.returnValue = false };
  var canvas = document.getElementById('main_canvas');
  var context = canvas.getContext("2d");
  var touchLocation = {x: 0, y: 0};
  var lastStepRecord = false;
  var lastStepUrl = [];
  
  function getColor(colour){
    context.strokeStyle = colour;
  }
  function getSize(size){
    context.lineWidth = size;
  }
  function autofill(base64){
    var image = new Image();
    image.onload = function() {
        context.drawImage(image, 0, 0);
    };
    image.src = base64;
  }

  function init(cts){

    document.getElementById('main_canvas').style.width = cts[0] + "px";
    document.getElementById('main_canvas').style.height = cts[1] + "px";
    document.getElementById('main_canvas').setAttribute("width", String(Number(cts[0])*2)+"px");
    document.getElementById('main_canvas').setAttribute("height", String(Number(cts[1])*2)+"px");

    disableMagnifier = function(e) { e.returnValue = false };
    canvas = document.getElementById('main_canvas');
    context = canvas.getContext("2d");
    touchLocation = {x: 0, y: 0};
    lastStepRecord = false;
    lastStepUrl = [];
    
    context.beginPath();
    context.rect(0,0,Number(cts[0])*2,Number(cts[1])*2);
    context.fillStyle = cts[2];
    context.fill();

    context.lineJoin = 'round';
    context.lineCap = 'round';
    context.strokeStyle = "#dd7777";
    context.lineWidth = 2;

    WebViewBridge.send("loadEnd】123" );
    /* Mouse Capturing Work */

    canvas.addEventListener('touchmove', function(e) {
      touchLocation.x = (e.targetTouches[0].pageX - e.target.offsetLeft)*2;
      touchLocation.y = (e.targetTouches[0].pageY - e.target.offsetTop)*2;
    });

    canvas.addEventListener('touchstart', function(e) {
        if (!lastStepRecord) {
          var thecanvas = document.getElementById("main_canvas");
          WebViewBridge.send("base64】" + thecanvas.toDataURL());
          lastStepUrl.push(thecanvas.toDataURL());
          if (lastStepUrl.length > 10) {
            lastStepUrl.splice(0,1);
          }
          lastStepRecord = true;
        }
        document.getElementsByTagName("body")[0].addEventListener("touchstart",disableMagnifier);
        touchLocation.x = (e.targetTouches[0].pageX - e.target.offsetLeft)*2;
        touchLocation.y = (e.targetTouches[0].pageY - e.target.offsetTop)*2;
        context.beginPath();
        context.moveTo(touchLocation.x, touchLocation.y);
        canvas.addEventListener('touchmove', onPaint);
    });

    canvas.addEventListener('touchend', function() {
        document.getElementsByTagName("body")[0].removeEventListener("touchstart",disableMagnifier);
        canvas.removeEventListener('touchmove', onPaint);
        lastStepRecord = false;
    });
  }

  function lastStep(){
    var image = new Image();
    if (lastStepUrl.length > 0){
      var url = lastStepUrl.pop();
      image.src = url;
      image.onload = function() {
        context.drawImage(image, 0, 0);
      };
    }
  }


  function onPaint() {
      context.lineTo(touchLocation.x, touchLocation.y);
      context.stroke();
  };

  function changeColor(color){
    context.strokeStyle = color;
  }


</script>
</body>
</html>
`
class Canvas extends Component{
  constructor(props) {
    super(props);
    this.changeThickness = this.changeThickness.bind(this);
    this.onBridgeMessage = this.onBridgeMessage.bind(this);
    this.undo = this.undo.bind(this);
    this.state = {
      base64:"",
      selectedColor:"#dd7777",
      thickness:[0],
      loadEnd:false,
      sending:false
    };
  }
  onBridgeMessage(message){
    const { webviewbridge } = this.refs;
    var type = message.split("】")[0];
    if (type == 'base64') {
      var encodeImg = message.split("】")[1].split(";base64,")[1];
      this.props.onPadUpdated(encodeImg);
    }else if(type == 'loadEnd'){
      this.setState({loadEnd:true});
    }
  }
  changeColor(color){
    const { webviewbridge } = this.refs;
    this.setState({selectedColor:color})
    webviewbridge.sendToBridge("color】"+color);
  }
  changeThickness(values){
    const { webviewbridge } = this.refs;
    this.setState({thickness:values})
    webviewbridge.sendToBridge("size】"+String(values[0]*2 + 2) );
  }
  undo(){
    const { webviewbridge } = this.refs;
    webviewbridge.sendToBridge("lastStep】ok");
  }
  render() {
    var W = Dimensions.get("window");
    return (
      <View style={{flex:1,justifyContent:"center",alignItems:"center",backgroundColor:"transparent"}}>
        {this.state.loadEnd?null:<Text style={{color:"#777",fontSize:15}}>Loading...</Text>}
        <View style={{justifyContent:"center",alignItems:"center",height:this.props.padHeight}}>
          <WebViewBridge
            automaticallyAdjustContentInsets={false}
            source={{html:htmlSource}}
            opaque={false}
            bounces={false}
            underlayColor={'transparent'}
            ref="webviewbridge"
            onBridgeMessage={this.onBridgeMessage.bind(this)}
            injectedJavaScript={injectScript}
            onLoadEnd={()=>{
              const { webviewbridge } = this.refs;
              webviewbridge.sendToBridge("init】" + String(this.props.padWidth) + "/" + String(this.props.padHeight) + "/" + this.props.padColor + "/" + this.props.initColor)
            }}
            style={{width:this.props.padWidth, height:this.props.padHeight, backgroundColor:this.props.padColor}}
          />
        </View>
          <View style={{justifyContent:"center",alignItems:"center",flexDirection:'row'}}>
            {this.props.showUndoButton?<TouchableOpacity onPress={this.undo} style={{justifyContent:"center",alignItems:"center"}}>
              <View style={{justifyContent:"center",alignItems:"center",margin:10,height:40,width:40,borderRadius:20,backgroundColor:"#eee"}}>
                <Text style={{color:"#777"}}>＜</Text>
              </View>
              <Text style={{color:"#777"}}>Undo</Text>
            </TouchableOpacity>:null}
            {this.props.showErasor?<TouchableOpacity onPress={()=>this.changeColor(this.props.padColor)}>
              <View style={{justifyContent:"center",alignItems:"center",margin:10,height:40,width:40,borderRadius:20,backgroundColor:"transparent"}}>
                <Image source={require("./images/icon_eraser.png")} style={{width:40,height:40}}/>
              </View>
              {this.props.selectedColor == this.props.padColor?<Text style={{color:this.state.selectedColor}}>Erasor</Text>:<Text style={{color:"#777"}}>Erasor</Text>}
            </TouchableOpacity>:null}
            {this.props.showColorSelectors?<ScrollView
              horizontal={true}>
              <View style={{flexDirection:"row",height:70,justifyContent:"center",alignItems:"center",flex:1}}>
                {this.props.colors.map(function(color,index){
                  return(
                    <TouchableOpacity onPress={()=>this.changeColor(color)} key={"color_selector_"+color}>
                      <View style={{justifyContent:"center",alignItems:"center",margin:10,height:46,width:46,borderRadius:23,backgroundColor:color}}>
                        {this.state.selectedColor == color?<Text style={{color:"#fff"}}>√</Text>:null}
                      </View>
                    </TouchableOpacity>
                  )
                }.bind(this))}
              </View>
            </ScrollView>:null}
          </View>
        {this.props.showThicknessSlider?<View style={{justifyContent:"center",alignItems:"center"}}>
          <Text style={{margin:5,color:"#777",fontSize:15,marginBottom:15}}>Thickness</Text>
          <MultiSlider 
            selectedStyle={{
              backgroundColor: '#dd7777',
            }}
            values={this.state.thickness} 
            sliderLength={W.width*0.8} 
            onValuesChange={this.changeThickness} />
        </View>:null}
      </View>
    );
  }
};

Canvas.propTypes = {
  showColorSelectors: PropTypes.bool,
  showErasor: PropTypes.bool,
  showUndoButton: PropTypes.bool,
  showThicknessSlider: PropTypes.bool,
  selectedColor: PropTypes.string,
  padColor: PropTypes.string,
  padWidth: PropTypes.number,
  padHeight: PropTypes.number,
  colors: PropTypes.array,
  initColor:PropTypes.string,
  onPadUpdated: PropTypes.func
}

Canvas.defaultProps = {
  showColorSelectors: true,
  showErasor: true,
  showUndoButton: true,
  showThicknessSlider: true,
  selectedColor: "#dd7777", 
  padColor: "#eee",
  padWidth: 300,
  padHeight: 300,
  initColor: "#dd7777",
  colors: ['#dd7777','#222','#FE5722', '#FEEA3B', '#4CAE50', '#2196F2','purple'],
  onPadUpdated: (base64)=>{ console.log("onPadUpdated: This Component do not bind any function to recieve the data of the image", base64)}
}


module.exports = Canvas;