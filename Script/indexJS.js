/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var database;



function loginInfo(userName,password,logCounter){
    this.userName = userName;
    this.password = password;
    this.logCounter = logCounter;
}

//Get the values from the HTML DOM and pass it over to loginAuth()
var getCredentials = function(){
     
    var userName = document.getElementById("userName");
    var password = document.getElementById("password");
    if(userName.value.trim().length===0||password.value.trim().length===0){
        alert("Please enter all the fields before Signing In");
        return;
    }
    loginAuth(userName.value,password.value);
   
    
};

//Create Database or update existing


//Open Database and check the values
var loginAuth = function(userName,password){
//    var userName = document.getElementById("userName");
//    var password = document.getElementById("password");

    
    
    var transaction = database.transaction(["Login"],"readwrite");
    //console.log("I am hereeeeee");
    var objectStore= transaction.objectStore("Login");
    
    var request = objectStore.get(userName);
    
    
    
    request.onerror = function(event){
      alert("UserName given is wrong");  
    };
    
    request.onsuccess = function(event){
      var loginRecord = request.result;
      
      //Check for username
      if(loginRecord===undefined){
          alert("Entered Username is wrong");
          return;
      }
      //Check for password
      if(loginRecord.password===password){
         setLoginCounterData();
         window.location.href = window.location.origin+"/ToDoJS/HTML/ToDoPage.html?name="+encodeURIComponent(userName);
         
         alert("Login successful");
          
          
      }else{
          
          alert("Entered Password is wrong");
          return;
      }
    };
    
    
};

function openDB(){
    var request = window.indexedDB.open("ToDoApp",1);
    
    //onSuccess event of database open
    request.onsuccess = function(event){
      
      database = request.result;  
      
    };
    
    //onError event of database open
    request.onerror = function(event){
        alert("An error occured while opening the database");
    };
    
    //onUpgradeNeeded event fires when the database version requested is not found or when datbase is not present
    //It creates the database if the database is not present
    request.onupgradeneeded = function(event){
        var db = request.result;
        var objectStore = db.createObjectStore("Login",{keyPath : "userName"});
        var objectStore2 = db.createObjectStore("ToDo",{keyPath : "userName"});
        
        
    };
    
    
}

function createDB(){
    var userName = document.getElementById("userName");
    var password = document.getElementById("password");
    
    if(userName.value.trim().length===0||password.value.trim().length===0){
        alert("Please Enter the Fields before Signing UP");
        return;
    }else{
        var loginData = new loginInfo(userName.value, password.value, 0);
        var transaction = database.transaction(["Login"],"readwrite");
        var objectStore= transaction.objectStore("Login");
        var request = objectStore.put(loginData);
        request.onerror = function(event){
            alert("An error occured while Creating Account");
        };
        
        request.onsuccess = function(event){
            alert("Successfully Signed Up!! Please enter your credentials before signing in");
        };
    }
}

function setLoginCounterData(){
    var transaction =database.transaction(["Login"],"readwrite");
    var objectStore = transaction.objectStore("Login");
    var request = objectStore.get(document.getElementById("userName").value);
    
    request.onerror= function(event){
      alert("Error in opening table");  
    };
    
    request.onsuccess = function(event){
      var loginRecord = request.result;
      loginRecord.logCounter=0;
      
      var loginRecordUpdate = objectStore.put(loginRecord);
      
      loginRecordUpdate.onerror= function(event){
        alert("Error in updating logcounter after password check in login page");
      };
      
      loginRecordUpdate.onsuccess = function(event){
        //alert("success updating logcounter after password check in login page");  
      };
      
    };
}