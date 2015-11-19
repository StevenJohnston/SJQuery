/*
	Make shift JQUERY ($SJ)
*/
var elementCallList = []; //Hold the calls for each element. Allows for queueing
//<script type="text/javascript">
//Name: $SJ ???
//Decsription: Function expression to allow for selection of DOM elements. Some methods can also be
//				run on specified element. (methods listed in return case)
//Param:
//	element: The Dom element to select
//	stackLimiter: If set will not create a second version of its self to save the stack from EXPLODING
//Return:
//	An array with a list of all the methods
var $SJ = function(elementIn) {
	var thisElement ; //Second version of its self allows for easier method calls (on same element)
	var elements = []; //Helps return an array rather then a nodeList

	//element must be of type string
	if(typeof elementIn == "string"){
		//How to select element (by id,name,tag,classname)
		var newElements;
		switch(elementIn.charAt(0)){
			case '#': //by id
				elements.push(document.getElementById(elementIn.substring(1)));
				break;
			case("."): //by className
				newElements = document.getElementsByClassName(elementIn.substring(1));
				for(var i = 0; i < newElements.length;i++)
				{
					elements.push(newElements[i]);
				}
				break;
			case("*"): //by localName
				newElements = document.getElementsByName(elementIn.substring(1));
				for(var i = 0; i < newElements.length;i++)
				{
					elements.push(newElements[i]);
				}
				break;
			default: //by TagName
				if(elementIn == "window"){
					elements.push(window);
				}
				else
				{
					newElements = document.getElementsByTagName(elementIn);
					for(var i = 0; i < newElements.length;i++)
					{
						elements.push(newElements[i]);
					}
				}
				break;
		}
	}
	GiveIDifNotExist(elements);
	allocateElementsInList(elements);
	//Array of methods
    return {
    	//Name: innerHTML
		//Decsription: Sets innerHTML equal to parameter
		//Param:
		//	html: What to be set in the innerHTML of element
		//Return:
		//
        innerHTML: function(val) {
        	if(val != undefined)
        	{
	        	for(var element in elements)
	        	{
					queue(elements[element].id,function(element,val){element.innerHTML = val;},val,0);
	        	}
				return $SJ(elementIn,"defined");
	        }else
	        {
	        	var innerHTMLs = [];
	        	for(var element in elements)
	        	{
	            	innerHTMLs.push(elements[element].innerHTML);
	        	}
	        	if(innerHTMLs.length == 1)
	        	{
	        		return innerHTMLs[0];
	        	}
	        	else
	        		return innerHTMLs;
	        }
        },
        delay: function(val)
        {
        	for(var element in elements)
        	{
				queue(elements[element].id,function(element,val){},val,val);
        	}
			return $SJ(elementIn,"defined");
        },
		//Name: ready
		//Decsription: Set function to be called when element's onload function is called
		//Param:
		//	func: The function to set element's onload to
		//Return:
		//	???
        ready: function(func) {
        	for(var element in elements)
        	{
        		elements[element].onload = func;
	        	queue(elements[element].id,function(element,obj){element.onload = obj;},func,0);
	        }
			return $SJ(elementIn,"defined");
        },
		//Name: focus
		//Decsription: Sets focus to element
		//Param:
		//
		//Return:
		//
        focus: function(index){
        	if(index == undefined) index = 0;
			if(index >= elements.length) index = 0;
			queue(elements[index].id,function(element,val){element.focus();},undefined,0)
			return $SJ(elementIn,"defined");
        },
		//Name: click
		//Decsription: Set function to be called when element's onclick function is called
		//Param:
		//	func: The function to set element's onclick to
		//Return:
		//
        click: function(func){
        	for (var element in elements)
        	{
	        	if(func == undefined){
	        		//Credit to KooiInc
	        		//http://stackoverflow.com/questions/2705583/how-to-simulate-a-click-with-javascript
	        		var evObj = document.createEvent('Events');
					evObj.initEvent("click", true, false);
					elements[element].dispatchEvent(evObj);
	        	}
	        	else{
	        		queue(elements[element].id, function(element,obj){element.onclick = obj;},func,0);
	        	}
	        }
			return $SJ(elementIn,"defined");
        },
		//Name: style
		//Decsription: set specified style attribute to specified value
		//Param:
		//	attr: The style attribute to change
		//Return:
		//	value: Value to set attribute to
        style: function(attr,val) {
        	//Different types of style attributes
        	for (var element in elements)
        	{
	        	switch(attr){
	        		case "display":
	        			if(val == undefined)
	        			{
	        				return elements[element].style.display;
	        			}
	        			else
	        			{
							queue(elements[element].id,function(element,obj){element.style.display=obj;},val,0);
	        			}
	        			break;
	        		case "background-color":
					case "backgroundColor":
					case "backgroundcolor":
	        			if(val == undefined)
	        			{
	        				return elements[element].style.backgroundColor;
	        			}
	        			else
	        			{
							queue(elements[element].id,function(element,obj){element.style.backgroundColor=obj;},val,0);
	        			}
	        			break;
	        		default:
	        			break;
	        	}
	        }
			return $SJ(elementIn,"defined");
        },
		//Name: value
		//Decsription: Get or Set the value of element
		//Param:
		//	val: if set, sets value of element equal to val else return element's current value
		//Return:
		//
        value: function(val){
        	for (var element in elements)
        	{
	        	if(val != undefined){
					queue(elements[element].id,function(element,obj){element.value=obj;},val,0);
	        	}else{
	        	   	return elements[element].value;
	        	}
	        }
			return $SJ(elementIn,"defined");
        },
		//Name: setAttr
		//Decsription: set Attribute of elements to val
		//Param:
		//	name: The name of the attribute to set
		//	val: The value to set the attribute to. If not defined nothing happens
		//Return:
		//
        setAttr: function(name, val){
			if(val != undefined)
			{
				for (var element in elements)
				{
					queue(elements[element].id,function(element,obj){element.setAttribute(obj.name,obj.val);},{"name":name,"val":val},0);
				}
			}
			return $SJ(elementIn,"defined");
        },
		//Name: getAttr
		//Decsription: Get attribute of element(s)
		//Param:
		//	name: The name of the element to get
		//	val: if set get elements with matching attribute name and value else get all element names
		//Return:
		//	Elements that match parameters
		getAttr: function(name,val)
		{
			var valElements =[];
        	for (var element in elements)
        	{
	        	if(val == undefined){
	        		valElements.push(elements[element].getAttribute(name));
	        	}else{
		        	if(elements[element].hasAttribute(name))
					{
						if(elements[element].getAttribute(name) == val)
						{
							valElements.push(elements[element]);
						}
					}
	        	}
	        }
			return valElements;
		},
		//Name: keydown
		//Decsription: Set function to be called when element's onkeydown function is called
		//Param:
		//	func: The function to set element's onkeydown to
		//Return:
		//
        keydown: function(func){
        	for (var element in elements)
        	{
				queue(elements[element].id,function(element,obj){element.onkeydown = obj;},func,0);
        	}
			return $SJ(elementIn,"defined");
        },
		//Name: selectedId
		//Decsription: gets selected id of element
		//Param:
		//
		//Return:
		//	selecteid(s) of element
        selectedId: function()
        {
        	for (var element in elements)
        	{
        		return elements[element].options[elements[element].selectedIndex].value;
        	}
        },
		//Name: checked
		//Decsription: sets checked value of elements to val (true or false)
		//Param:
		//	val: value to set elements to
		//Return:
		//
        checked: function(val)
        {
        	for (var element in elements)
        	{
	        	if(val == undefined)
	        	{
	        		return elements[element].checked;
	        	}
	        	else
	        	{
					queue(elements[element].id,function(element,obj){element.checked = obj;},val,0);
	        	}
	        }
			return $SJ(elementIn,"defined");
        },
		//Name: repeat
		//Desciption: Repeats function(s) mutiple times
		//Param:
		//
		//Return:
		//
		repeat: function(func,times)
		{
			for (var element in elements)
        	{
				for(var i = 0 ; i < times; i++)
				{
					queue(elements[element].id,function(element,obj){obj();},func,0);
				}
			}
		},
    }
};

//Name: $ajax
//Desciption: Creates a ajax request to location
//Param:
//	obj: Can contain 
//		data: data to send to server,
//		url: Location to send data,
//		method: GET or POST,
//		async: True of False,
//		dataType: type of data to send to server. Ex JSON
//Return:
//	object: allows for .done on $AJAX call
var $ajax = function(obj){
	//Set defaults if not exist
	if(obj.url == undefined) return false;
	if(obj.method == undefined) obj.method = "GET";
	if(obj.async == undefined) obj.async = false;
	if(obj.dataType == undefined) obj.dataType = text;
	var queryString = "";
	//check if datatype is JSON
	if(obj.data != undefined && obj.dataType == "JSON")
	{
		//Loop each data element. Creates query string
		for(var key in obj.data)
		{
			//Add key and value to queryString
			queryString += key + "=" + obj.data[key] + "&";
		}
		//remove last & from queryString
		queryString = queryString.slice(0,-1);
	}
	var doneFunc;//The function to be called on .done
	var xhttp = new XMLHttpRequest();//HttpRequest
	//function when onreadystatechange is called
  	xhttp.onreadystatechange = function() {
	    if (xhttp.readyState == 4 && xhttp.status == 200) {
	    	//get data from request
	    	var data = xhttp.responseText;
	    	//Send data to success function
	    	if(obj.success != undefined) obj.success(data);
	    	//send data to .done function
	    	if(doneFunc != undefined) doneFunc(data);
    	}
  	}
  	//If method is get add queryString to url
 	if(obj.method == "GET")
 	{
 		if(queryString != "")
 		{
 			obj.url += "?" + queryString;
 		}
 	}
 	//open request 
  	xhttp.open(obj.method, obj.url, obj.async);
  	//If method is post send the queryString not with the url
  	if(obj.method == "GET")
  	{
  		xhttp.send();
  	}
  	else
  	{
  		xhttp.send(queryString);
  	}
  	//Returns a object. allows for .done on $AJAX call
  	return{
  		//Name: done
		//Desciption: Function to call when $AJAX function is complete
		//Param:
		//	func: The function to be called
		//Return:
		//	
  		done: function(func){
  			//Sets the function to be called
  			doneFunc = func;
  		},
  	};
};
//Get next free id and return it
var nextID =0;
//Name: getNextID
//Desciption: Sets nextID equal to the next free id that is not being used by any other elements
//Param:
//	
//Return:
//	First free id.
function getNextID()
{
	//Loops till getElementById returns undefied
	for(;document.getElementById(nextID) != undefined; nextID++){}
	return nextID++;
}

//Name: GiveIDifNotExist
//Desciption: Gives each element a unique ID if it doesnt have one
//Param:
//	elementArray: An array of elements
//Return:
//	
function GiveIDifNotExist(elementArray)
{
	//Loop each element in elementArray
	for(var element in elementArray)
	{
		//element doesnt have id or the id is undefined
		if(elementArray[element].id == "" || elementArray[element].id == undefined)
		{
			//Give the element the first free id
			elementArray[element].id = getNextID();
		}
	}
}

//Name: allocateElementsInList
//Desciption: Create an index in elementCallList for each element
//Param:
//	elementArray: An array of elements
//Return:
//	
function allocateElementsInList(elementArray)
{
	//Loop each element in elementArray
	for(var element in elementArray)
	{
		//If element doent exist in elementCallList
		if(elementCallList[elementArray[element].id] == undefined)
		{
			//Create new object for element
			elementCallList[elementArray[element].id] = {};
			//Give object a reference to the element
			elementCallList[elementArray[element].id].elementObject = elementArray[element];
			//set the queue running to false
			elementCallList[elementArray[element].id].running = false;
			//Create call list array for element
			elementCallList[elementArray[element].id].callList = [];
		}
	}
}
//Name: startQueue
//Desciption: Starts the queue for an element
//Param:
//	index: The id of the element to start queue
//Return:
//	
function startQueue(index)
{
	//If queue isnt running start it
	if(elementCallList[index].running == false)
	{
		//set queur to running
		elementCallList[index].running = true;
		//Start dequeueing 
		dequeue(index);
	}
}
//Name: queue
//Desciption: Adds function to queue for element
//Param:
//	elementIndex: The index in elementCallList to be used
//	func: function to add to call list of element
//	obj: Data to be sent to function when called
//	delay: Amount of time to wait before launching function 
//Return:
//
function queue(elementIndex,func,obj,delay)
{
	//Add new callList item for element
	elementCallList[elementIndex].callList.push({"func" : func,
													"obj" : obj,
													"delay" : delay});
	//Try and start the queue of the element
	startQueue(elementIndex);
}
//Name: dequeue
//Desciption: Runs the first function in callList Queue. 
//Param:
//	elementIndex: The index in elementCallList to be used
//Return:
//
function dequeue(elementIndex)
{
	var thisEle = elementCallList[elementIndex];//quick reference
	//If the call list has function in it
	if(thisEle.callList.length != 0)
	{
		//Runs first function in queue. Wait delay amount of miliseconds before running
		setTimeout(function(){
			//Call the first function with the first object
			thisEle.callList[0].func(thisEle.elementObject,thisEle.callList[0].obj);
			//Remove the first function in the queue (happenes after function is complete)
			thisEle.callList.shift();
			//Go to next function call in the lastList
			dequeue(elementIndex);
		//Amout of delay before calling function
		},thisEle.callList[0].delay);
	}
	//No calls in call list. Stop queue
	else
	{
		thisEle.running = false;
	}
}