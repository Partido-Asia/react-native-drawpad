# react-native-drawpad

Basic useful feature list:

 * Let users draw anything they want!
 * change color of input easily
 * change thickness of input easily
 * get base64 encoding callback


### Still developing, any PR is welcome!


And here's some code! :+1:

```javascript
import ReactDrawPad from 'react-native-drawpad';
...


render(){
  return (
    <ReactDrawPad
        ref="drawpad"
        width={300}
        height={300}
        background={"#efefef"}
        onSubmitResult={this.catchImageEncode}
    />
   )
 }
 
changePenColor(color){
	this.refs.drawpad.changeColor(color)
}

askForBase64EncodingImage(){
	this.refs.drawpad.submit()
}

changePenColor(thickness){
	this.refs.drawpad.changethickness(thickness)
}

catchImageEncode(base64EncodingImage){
	//do anything with the image here
}

...
```

### Reference:

 * [React NAtive Webviw-Bridge](https://github.com/alinz/react-native-webview-bridge) for webview/native communication

