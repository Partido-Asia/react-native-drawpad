# react-native-drawpad

![image](https://i.imgur.com/MdYbGO1.gif)

Basic useful feature list:

 * Let users draw anything they want!
 * change color of input easily
 * change thickness of input easily
 * default penal to change color, thickness and undo
 * get base64 encoding callback


### Still developing, any PR is welcome!

##How to install 

```
npm install react-native-drawpad --save
rnpm link react-native-webview-bridge
```

And here's some code! :+1:

```javascript
import ReactNativeDrawPad from 'react-native-drawpad';
...


render(){
  return (
    <ReactNativeDrawPad
        ref="drawpad"
        padWidth={300}
        padHeight={300}
        padColor={"#efefef"}
        onPadUpdated={this.catchImageEncode}
    />
   )
 }
 
changePenColor(color){
	this.refs.drawpad.changeColor(color)
}

undo(){
  this.refs.drawpad.undo(coor)
}

changePenColor(thickness){
	this.refs.drawpad.changethickness(thickness)
}

catchImageEncode(base64EncodingImage){
	//do anything with the image here
}

...
```

### Props

| Prop | Description | Default |
|---|---|---|
|**`showColorSelectors`**|Boolean, if true, show the color selector |`true`|
|**`showErasor`**|Boolean, if true, show the erasor button |`true`|
|**`showUndoButton`**|Boolean, if true, show the undo button |`true`|
|**`showThicknessSlider`**|Boolean, if true, show the thickness slider |`true`|
|**`selectedColor`**|Sring, color for text in button when selected |`#dd7777`|
|**`padColor`**|Sring, color of the drawpad |`#eee`|
|**`padWidth`**|Number, width of the drawpad |`300`|
|**`padHeight`**|Number, height of the drawpad |`300`|
|**`initColor`**|Sring, color of the pen initially |`#dd7777`|
|**`colors`**|Array, a set of color used in color selector |`['#dd7777','#222','#FE5722', '#FEEA3B', '#4CAE50', '#2196F2','purple']`|
|**`onPadUpdated`**|Function, the function to listen to the change of the drawpad |`a function log the base64 encoding image data`|

### Reference:

 * [React Native Webviw-Bridge](https://github.com/alinz/react-native-webview-bridge) for webview/native communication


![image](https://i.imgur.com/SwqV8dc.gif)
