/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var database;
var arrayListItems=[];
var userName = getNameFromUrl();
var logCounter=0;


function addToDo(){
    var inputValue = document.getElementById("inputArea");
    if(inputValue.value.trim()===""){
        alert("Please Enter a Valid Input");
    }else{
    inputValue.value=inputValue.value.toString().charAt(0).toUpperCase()+inputValue.value.toString().slice(1);
    //console.log(inputValue.value);
    listAdd(inputValue.value);
    }
}

//function expression for adding the list items from user inputs
var listAdd=function(value){
    var toDoList=document.getElementById("toDo");
    createElement(toDoList,value);
    
};

//Counter function closure
var counterFunction=function(){
    var counter=0;
    
    //creating counter  closure function 
    function count(){
        counter++;
        return counter;
    }
    //return the function
    return count;
};

//Getting the counter closure
var counter=counterFunction();
var childCount=0;
//create list item, input tag and label tag for appending to <ul> tag


var createElement=function(listId,value1,value2){
    
    var listItem=document.createElement("li");
    var checkBox=document.createElement("input");
    var label=document.createElement("label");
    var textArea=document.createElement("textArea");
    var button=document.createElement("button");
    //textArea.style.display="block";
    button.innerHTML="Add Desc";
    button.style.marginLeft= "10px";
    //creating label and assigning its value from input text area
    label.innerHTML=value1;
    
    //First time when page loads value2 will be undefined
    if(value2===undefined){
        value2="";
    }
        
    textArea.value= value2;
    //creating checkbox input type
    checkBox.type="checkbox";
    
    //creating unique id for list item
    
    listItem.id=counter();
    childCount=listItem.id;
    console.log(listItem.id);
    //appending checkbox and label to list item
    listItem.appendChild(checkBox);
    listItem.appendChild(label);
    listItem.appendChild(button);
    listItem.appendChild(textArea);
    textArea.style.display="none";

    listItem.class="toDo";
    //appending listitem to <ul> tag
    listId.appendChild(listItem);
    
    
    pushArrayListItem(listItem.id,listId.id,listItem.childNodes[1].innerHTML);
    

//Adding eventListener to Edit/Add Desc button
    button.addEventListener("click", function(){
        
        console.log("Inside Button Listener");
        if(textArea.style.display==="block"){
//            textArea.value=getValueOfTextArea();
            pushArrayListItem(listItem.id,listId.id,listItem.childNodes[1].innerHTML,listItem.childNodes[3].value);
            textArea.style.display="none"; 
            button.innerHTML="Add Desc";
            
           
            
        }else{
            
            textArea.style.display="block";
            textArea.focus();
            //listItem.appendChild(textArea);
            
            button.innerHTML="Done";
            pushArrayListItem(listItem.id,listId.id,listItem.childNodes[1].innerHTML,listItem.childNodes[3].value);
            
            textArea.addEventListener("keyup",function(){
                pushArrayListItem(listItem.id,listId.id,listItem.childNodes[1].innerHTML,listItem.childNodes[3].value);
            });
        }
    });
    
    
    //Creating focus and emtying the value of input text after submission
    document.getElementById("inputArea").value="";
    document.getElementById("inputArea").focus();
};

function pushArrayListItem(liId,ulId,labelName,textAreaValue){
    
    if(arrayListItems.length===0){
    arrayListItems.push({
      listID : liId,
      parentID : ulId,
      itemValue : labelName,
      descValue : textAreaValue
    });
    return;
    }else{
        for(var i=0;i<arrayListItems.length;i++){
            
            
            if(arrayListItems[i].listID===liId){
                
                arrayListItems.splice(i,1);
                
                  
            }
        }
        arrayListItems.push({
        listID : liId,
        parentID : ulId,
        itemValue : labelName,
        descValue : textAreaValue
        });
        return;
            
   }
}
    
function popArrayListItem(listItem){
    for(var i=0;i<arrayListItems.length;i++){
        if(listItem.id===arrayListItems[i].listID){
            arrayListItems.splice(i,1);
        }
        
    }
}


//function to copy the elements and append it dynamically
var copyElement=function(listId,value){
  listId.appendChild(value);
  //console.log("Value Id: "+value.class);
  
  pushArrayListItem(value.id,listId.id,value.childNodes[1].innerHTML,value.childNodes[3].value);
  
  return;
};

//function to delete the child
var deleteElement=function(listId,value){
    listId.removeChild(value);
    popArrayListItem(value);
    return;
};

//Check if the checkbox is checked and copy / delete the elements by  calling copyElement/deleteElement function
function handleButton(event,id){
    
    for(var i=1;i<=childCount;i++){
        if(document.getElementById(i)!==null){
            if(document.getElementById(i).childNodes[0].checked===true){
                //console.log(childCount +" "+i);
                if(event.target.id==="completedButton"||event.target.id==="incompleteButton"){
                    copyElement(document.getElementById(id),document.getElementById(i));
                }
                else{
                    deleteElement(document.getElementById(id),document.getElementById(i));
                }

            }
        }
        else continue;
        
    }
}

//Database functions

function openDB(){
    
    var request = window.indexedDB.open("ToDoApp",1);
    
    //onSuccess event of database open
    request.onsuccess = function(event){
      //alert("Database opened/created successfully");
      document.getElementById("welcome").innerHTML+=" "+ userName.charAt(0).toUpperCase()+userName.slice(1);
      database = request.result;  
        getLoginCounterData();
      
          
      
      getDBData();
      
      
    };
    
    //onError event of database open
    request.onerror = function(event){
        alert("An error occured while opening the database");
    };
    
    //onUpgradeNeeded event fires when the database version requested is not found or when datbase is not present
    //It creates the database if the database is not present
    request.onupgradeneeded = function(event){
              
    };
    
    
}

function saveDBData(){
    
    if(arrayListItems.length===0){
        alert("Please enter some data to save");
        return;
    }
    var toDoAppData = new toDoAppElements(userName,arrayListItems);
    
    var transaction = database.transaction(["ToDo"],"readwrite");
        var objectstore= transaction.objectStore("ToDo");
        var request = objectstore.put(toDoAppData);
        request.onerror = function(event){
            alert("An error occured while Creating Account");
        };
        
        request.onsuccess = function(event){
            console.log("Successfully added data");
            for(var i=0;i<arrayListItems.length;i++)
            console.log(arrayListItems[i]);
        };
 }


function getDBData(){
    
    
    var transcaction = database.transaction(["ToDo"],"readwrite");
    var objectStore = transcaction.objectStore("ToDo");
    var request = objectStore.get(userName);
    
    request.onerror= function(event){
      alert("Table data does not exist");
    };
    
    request.onsuccess = function(event){
        
      var toDoItems = request.result;
      console.log("ToDo items: "+toDoItems);
      if(!toDoItems){
          return;
      }
      var arrayofItems = toDoItems.element;
      for(var i=0;i<arrayofItems.length;i++){
          var obj = arrayofItems[i];
          //console.log(arrayofItems[i]);
          if(obj.descValue===undefined){
          createElement(document.getElementById(obj.parentID),obj.itemValue,"");
          }else{
              createElement(document.getElementById(obj.parentID),obj.itemValue,obj.descValue);
          }
          
          
          
      }
      
    };
    
    

}
function toDoAppElements(userName,li){
    this.userName = userName;
    this.element = li;
}

function getNameFromUrl(){
    var url = document.location.href;
    params=url.split("=");
    return params[1];
}

function handleLogout(){
    setLoginCounterData();
    window.location.href = window.location.origin+"/ToDoApp/index.html";
    alert("You have been logged out successfully");
    logCounter=1;
}

function setLoginCounterData(){
    var transaction =database.transaction(["Login"],"readwrite");
    var objectStore = transaction.objectStore("Login");
    var request = objectStore.get(userName);
    
    request.onerror= function(event){
      alert("Error in opening table");  
    };
    
    request.onsuccess = function(event){
      var loginRecord = request.result;
      
      loginRecord.logCounter=1;
      var loginRecordUpdate = objectStore.put(loginRecord);
      
      loginRecordUpdate.onerror =function(event){
        alert("Error in updating the data");  
      };
      loginRecordUpdate.onsuccess= function(event){
          
      };
      
      //console.log("After logout login record counter: "+loginRecord.logCounter);
      
    };
}

function getLoginCounterData(){
    
    var transaction =database.transaction(["Login"],"readwrite");
    var objectStore = transaction.objectStore("Login");
    var request = objectStore.get(userName);
    
    request.onerror= function(event){
      alert("Error in opening table");  
    };
    
    request.onsuccess = function(event){
      var loginRecord = request.result;
      //console.log("in getLoginCounterRecord() : "+ (loginRecord.logCounter===1));
      if(loginRecord.logCounter===1){
          // console.log("Inside getLogincounterdata....please stop");
          window.location.href = window.location.origin+"/ToDoApp/index.html";
          alert("Please login again to access TODO App");
          return;
            
        }
      else{
            return;
        
    }
    };
    
}
