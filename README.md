# react-native-drawpad

Basic useful feature list:

 * Let user draw anything they want!
 * change color easily
 * change thickness easily
 * get base64 encode callback


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

This is [on GitHub](https://github.com/jbt/markdown-editor) so let me know if I've b0rked it somewhere.


Props to Mr. Doob and his [code editor](http://mrdoob.com/projects/code-editor/), from which
the inspiration to this, and some handy implementation hints, came.

### Reference:

 * [React NAtive Webviw-Bridge](https://github.com/alinz/react-native-webview-bridge) for webview/native communication

