<<<<<<< HEAD
var socket=io.connect('http://10.8.6.176:4000');
=======
var socket=io.connect('localhost:3000');
var Message=document.getElementById('Message');
var Send_button=document.getElementById('send');
var output=document.getElementById('Output');
>>>>>>> 752fd75292a058c4dca06a3e3542b858f2b5ca63
var user=document.getElementById('name');
var code=document.getElementById('Code-space');
var sidebar=document.getElementById('sidebar');
var Chatting=document.getElementById('ChattingArea');
//Emit
function function1(data,ID,Apple) {
 	 var li = document.createElement("input");
 	 li.type="text";
	 li.id=ID;
	 li.value=data.Message;
	 li.readOnly=true;
 	 var ele=document.getElementById(Apple+"Box");
 	 ele.appendChild(li);
	}
var receiver='aa';
function fun(data,ID)
{
	var new_div=document.createElement("div");
	new_div.className="btn-group btn-group-justified";
	new_div.id=ID+'K';
	var newbutton = document.createElement("a");
	newbutton.id=ID;
	newbutton.innerHTML="A";
	newbutton.innerHTML = ID;
	newbutton.className='btn btn-info';
	newbutton.onclick=function(){receiver=data;create_chatbox(ID);};
	new_div.appendChild(newbutton);
	var newbutton2 = document.createElement("a");
	newbutton2.id=ID+'c';
	newbutton2.className='btn btn-default';
	newbutton.style.backgroundColor="#26292a";
	newbutton.style.border="#aeb2b4";
	newbutton2.innerHTML = 'Share';
	newbutton2.onclick=function(){
		codeTogetherOverlay(this);
	};
	newbutton2.style.display='none';
	new_div.onmouseover=function(){
		newbutton.innerHTML='Chat';
		newbutton.style.backgroundColor="#26292a";
		newbutton2.style.display='';
	};
	new_div.onmouseout=function(){
		var string=this.id;
		string=string.substr(0,string.length-1);
		newbutton.innerHTML=string;
		newbutton2.style.display='none';
	}
	new_div.appendChild(newbutton2);
	sidebar.appendChild(new_div);
}
function create_chatbox(Name)
{
	var A=document.getElementById(Name+"2");
	if(A==null)
	{
		var New_Chatbox=document.createElement("div");
		var Name_box=Name+"2";
		New_Chatbox.id=Name_box;
		New_Chatbox.style.marginRight='10px';
		New_Chatbox.style.marginLeft='10px';
		var Chat_head=document.createElement("div");
		Chat_head.innerHTML='<a style="text-decoration:none; color:white" onclick=\'OverlayOn("'+Name+'")\'>'+Name+'</a>';
		var cross_button=document.createElement('span');
		cross_button.id=Name+"X";
		cross_button.className="glyphicon glyphicon-remove";
		cross_button.style.position='relative';
		cross_button.style.float='right';
		cross_button.onmouseover=function(){
			this.style.color="grey";
		}
		cross_button.onmouseout=function(){
			this.style.color="white";
		}
		cross_button.onclick=function()
		{
			var string=this.id;
			string=string.substr(0,string.length-1);
			var k=document.getElementById(string+"2");
			Chatting.removeChild(k);
		}
		Chat_head.appendChild(cross_button);
		Chat_head.style.position='fixed';
		Chat_head.style.float="right";
		Chat_head.style.padding='5px';
		Chat_head.style.backgroundColor='#1187c2';
		Chat_head.style.color='white';
		Chat_head.style.width='16vw';
		Chat_head.style.bottom='370.5px';	
		New_Chatbox.appendChild(Chat_head);
		var Chat_bottom=document.createElement("div");
		Chat_bottom.style.width='16vw';
		// Chat_bottom.style.border='1px solid black';
		Chat_bottom.style.color='black';
		var New_Message=document.createElement("input");
		New_Message.type="text";
		New_Message.style.width='190px';
		New_Message.placeholder="Message";
		Chat_bottom.appendChild(New_Message);
		var SEND=document.createElement("button");
		SEND.className="btn btn-default";
			New_Message.id=Name+"3";
		SEND.id=Name+"4";
		SEND.innerHTML="Send";
		var oldChatData={to:Name,UserName:user.innerHTML};
		socket.emit('myChatInBox',oldChatData);
		Chat_bottom.appendChild(SEND);
		Chat_bottom.style.position='fixed';
		Chat_bottom.style.backgroundColor="white";
		Chat_bottom.style.bottom='5px';
		SEND.onclick=function(){
			var string=this.id;
			var name=string.substr(0,string.length-1);
			var to_send=document.getElementById(name+"3").value;
			socket.emit("chat",{to:name,Message:to_send,UserName:user.innerText});
			var data={to:name,Message:to_send,UserName:user.innerText};
			var Apple=name;
			function1(data,"my",Apple);
			New_Message.value="";
		};
		New_Chatbox.appendChild(Chat_bottom);
		var oldChatData={to:Name,UserName:user.innerText};
		socket.emit('myChatInBox',oldChatData);
		New_Message.addEventListener('keypress',function(event){
			if(event.keyCode==13)
				SEND.click();
		});
<<<<<<< HEAD
		var  Chat_area=document.createElement('div');
		Chat_area.style.backgroundColor="white";
		Chat_area.style.position='fixed';
		Chat_area.style.height='330px';
		Chat_area.style.width='16vw';	
		Chat_area.id=Name+'Box';
		Chat_area.style.overflow="auto";
		New_Chatbox.appendChild(Chat_area);
		Chatting.appendChild(New_Chatbox);}
=======
		New_Chatbox.style.float="left";
		Chatting.appendChild(New_Chatbox);
	}
		// New_Message.style.position="relative";
>>>>>>> 752fd75292a058c4dca06a3e3542b858f2b5ca63
}
socket.on('Online',function(data){
	sidebar.innerHTML='';
	data.forEach(function(item){
		if(item.Name!=user.innerText){
			fun(item.Name,item.Name);
		}
	});
});
//Listen
socket.on('chat',function(data){
<<<<<<< HEAD
=======
	console.log(data);
	type.innerHTML="";
>>>>>>> 752fd75292a058c4dca06a3e3542b858f2b5ca63
	var Apple=data.UserName;
	if(document.getElementById(Apple+'2')===null)
		create_chatbox(Apple);
	else
		function1(data,'her',Apple);
});
socket.on('myChatInBox',function(data){
	function1(data,"my",data.to);
});
socket.on('myChatInBox',function(data){
	function1(data,"my",data.to);
});