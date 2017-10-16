'use strict'
import React, { Component } from 'react';
import { ScrollView, Alert, WebView, View, Dimensions, TouchableOpacity, Text } from 'react-native';
import WebViewBridge from 'react-native-webview-bridge';
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
        }else if(type == 'submit'){
          var thecanvas = document.getElementById("main_canvas");
          var dataURL = thecanvas.toDataURL();
          WebViewBridge.send("base64】"+dataURL);
        }else if(type == 'basic_setting'){
        	var defaultSetting = JSON.parse(content);
        	changeHeightAndWidth(defaultSetting.width,defaultSetting.height);
        	fillBackgroundColor(defaultSetting.width,defaultSetting.height,defaultSetting.backgroundColor);
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
<body style="width:300px;margin: 0;border:0;background: #fff;height:300px;overflow: hidden;">
<canvas id="main_canvas" width="600px;" height="600px;" style="background: #eee;display: block;"></canvas>
<script type="text/javascript">

	var disableMagnifier = function(e) { e.returnValue = false };
	var canvas = document.getElementById('main_canvas');
	var context = canvas.getContext("2d");
	var touchLocation = {x: 0, y: 0};

	/* Mouse Capturing Work */
	canvas.addEventListener('touchmove', function(e) {
	touchLocation.x = (e.targetTouches[0].pageX - e.target.offsetLeft)*2;
	touchLocation.y = (e.targetTouches[0].pageY - e.target.offsetTop)*2;
	});

	context.lineJoin = 'round';
	context.lineCap = 'round';
	context.strokeStyle = "#000";
	context.lineWidth = 3;

	canvas.addEventListener('touchstart', function(e) {
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
	});

	function fillBackgroundColor(width,height,backgroundColor){
		context.beginPath();
		context.rect(0,0,width,height);
		context.fillStyle = backgroundColor;
		context.fill();
	}
	function getColor(colour){
		context.strokeStyle = colour;
	}
	function getSize(size){
		context.lineWidth = size;
	}
	function onPaint() {
	  context.lineTo(touchLocation.x, touchLocation.y);
	  context.stroke();
	};
	function changeColor(color){
		context.strokeStyle = color;
	}
	function changeHeightAndWidth(height,width){
		document.getElementById('myCanvas').setAttribute("height", height);
		document.getElementById('myCanvas').setAttribute("width", width);
		document.getElementById('myCanvas').style.height = String(height/2)+"px";
		document.getElementById('myCanvas').style.width = String(width/2)+"px";
	}

</script>
</body>
</html>

`
class Canvas extends Component{
  constructor(props) {
    super(props);
    this.changeThickness = this.changeThickness.bind(this);
    this.changeColor = this.changeColor.bind(this);
    this.submit = this.submit.bind(this);
    this.onLoadEndFunction = this.onLoadEndFunction.bind(this);
    this.state = {
      loadEnd:false
    };
  }
  onBridgeMessage(message){
    const { webviewbridge } = this.refs;
    var type = message.split("】")[0];
    if (type == 'base64') {
      var encodeImg = message.split("】")[1].split(";base64,")[1];
      this.props.onSubmitResult(encodeImg);
    }
  }
  onLoadEndFunction(){
  	const { webviewbridge } = this.refs;
    this.setState({selectedColor:color})
    webviewbridge.sendToBridge("basic_setting】"+ JSON.stringify({
    	width:this.props.width,
    	height:this.props.height,
    	backgroundColor:this.props.backgroundColor
    }));
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
  submit(){
    const { webviewbridge } = this.refs;
    webviewbridge.sendToBridge("submit】ok");
    this.setState({sending:true})
  }
  render() {
    var W = Dimensions.get("window");
    var contextString = JSON.stringify({msg : "it's write by canvas!"});
    return (
          <WebViewBridge
            automaticallyAdjustContentInsets={false}
            source={{html:htmlSource}}
            opaque={false}
            bounces={false}
            underlayColor={'transparent'}
            ref="webviewbridge"
            onBridgeMessage={this.onBridgeMessage.bind(this)}
            injectedJavaScript={injectScript}
            onLoadEnd={this.onLoadEndFunction}
            style={{width:this.props.width,height:this.props.height,backgroundColor:this.props.backgroundColor}}/>
    );
  }
};

module.exports = Canvas;