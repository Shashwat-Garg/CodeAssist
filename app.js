var http=require('http');
var express=require('express');
var bodyParser=require('body-parser');
var mysql=require('mysql');
var socket=require('socket.io');
var fs=require('fs');
var con=mysql.createConnection({
	host:"localhost",
	user:"root",
	password:"shshwt.grg",
	database:"Test"
});
con.connect(function(err){
	if(err) throw err;
	console.log("Server Started!");
});
var app=express();
app.use(express.static('public'));
http.createServer();
var urlencodeParser=bodyParser.urlencoded({extended:false});
var server=app.listen(3000);
app.set('view engine','ejs');
app.get('/signup',function(req,res){
	res.render('signup',{Name:req.query.Name,Password:req.query.Password,RePassword:req.query.RePassword,Email:req.query.Email});
});
app.post('/signup',urlencodeParser,function(req,res){
	if(req.body.Password===req.body.RePassword)
	{
		var sql="INSERT INTO User(Name,Password,Email) VALUES (?,?,?)";
		con.query(sql,[req.body.Name,req.body.Password,req.body.Email],function(err,result){
			if(err) throw err;
			console.log("Inserted New Value into User");
		});
	}
	else
		console.log("reenter");
	// res.render('mainpage',{Name:req.query.Name,Age:req.query.Age});
	res.redirect('/?Name='+req.body.Name);
	res.end("Inserted");
});
app.get('/signin',function(req,res){
	res.render('signin',{Name:req.query.Username,Pass:req.query.Pass});
});
app.post('/signin',urlencodeParser,function(req,res){
	var sql="SELECT * FROM User where Name=?";
		con.query(sql,[req.body.Username],function(err,result){
		if(err) throw err;
		var name=req.body.Username;
		var string = JSON.stringify(result);
		var json=JSON.parse(string);
		if(req.body.Pass==json[0].Password)
		{
			res.redirect('/?Name='+req.body.Username);
		}
	});
});
var io=socket(server);
var NAME='';
app.get('/',function(req,res){
	// if(res.query.Name!='a')
		NAME=req.query.Name;
		if(req.query.Name){
			NAME=req.query.Name;
			console.log('Connection Made by '+NAME);
			res.render('mainpage',{Name:req.query.Name});
		}
		else
			res.render('first');
});
var users={};
var Online_Users='';
io.on('connection',function(socket){
	socket.name=NAME;
	console.log('Connection Made by '+NAME);
	var session='UPDATE User SET SessionID=? where Name=?';
	con.query(session,[socket.id,NAME]);
	if(socket.name!='')
	{
		users[socket.name]=socket;
		var text=fs.readFileSync(__dirname+'\\codes\\'+socket.name+'.txt','utf8');
		socket.emit("takefilename",text);
	}
	var sql='UPDATE User SET Online=1 where SessionID=?';
	var sql2='UPDATE User SET Online=0 where SessionID=?';
	// var online_users="select Name from User where Online=1";
	io.sockets.emit('Online',Object.keys(users));
	console.log(Object.keys(users));
	con.query(sql,[socket.id],function(err){
		if(err) throw err;
	});
	//console.log(users);
	// socket.on('Online',function(){
	// 	socket.broadcast.emit('Online',Object.keys(users));
	// });
	socket.on('chat',function(data){
		// console.log(typeof(data.to));
		var text=data.Message;
		var d = new Date();
		var str='\n['+data.UserName+':-'+d.getDate()+'-'+d.getMonth()+'-'+d.getFullYear()+","+d.getHours()+':'+d.getMinutes()+']'+text+'*--x--*';
		console.log(str);
		if(fs.existsSync(__dirname+'\\chats\\'+data.to+'+'+data.UserName+'.txt')){
			fs.appendFileSync(__dirname+'\\chats\\'+data.to+'+'+data.UserName+'.txt',str);
		}
		else if(fs.existsSync(__dirname+'\\chats\\'+data.UserName+'+'+data.to+'.txt')){
			fs.appendFileSync(__dirname+'\\chats\\'+data.UserName+'+'+data.to+'.txt',str);
		}
		else{
			fs.writeFileSync(__dirname+'\\chats\\'+data.to+'+'+data.UserName+'.txt',str);
		}
		users[data.to].emit('chat',data);
	});
	socket.on('myChatInBox',function(data){
		console.log('Getting mychat...');
		console.log('To:'+data.to+'\nFrom:'+data.UserName);
		try{
			console.log('1st try');
			var text=fs.readFileSync(__dirname+'\\chats\\'+data.to+'+'+data.UserName+'.txt','utf8');
			var chats=text.split("*--x--*");
			chats.forEach(function(item,index){
				var t=item.split(":-");
				var s=t[0];
				s=s.substring(2);
				if(s===data.UserName){
					var x=item.indexOf(']');
					s=item.substring(x+1);
					var dat={
						to:data.to,
						Message:s,
						UserName:data.UserName
					};
					socket.emit('myChatInBox',dat);
				}
				else if(s===data.to){
					var x=item.indexOf(']');
					s=item.substring(x+1);
					var dat={
						to:data.UserName,
						Message:s,
						UserName:data.to
					};
					socket.emit('chat',dat);
				}
			});
		}
		catch(err){
			console.log(err);
			try{
				console.log('2nd try');
				var text=fs.readFileSync(__dirname+'\\chats\\'+data.UserName+'+'+data.to+'.txt','utf8');
				var chats=text.split("*--x--*");
				chats.forEach(function(item,index){
					var t=item.split(":-");
					var s=t[0];
					s=s.substring(2);
					if(s===data.UserName){
						var x=item.indexOf(']');
						s=item.substring(x+1);
						var dat={
							to:data.to,
							Message:s,
							UserName:data.UserName
						};
						socket.emit('myChatInBox',dat);
					}
					else if(s===data.to){
						var x=item.indexOf(']');
						s=item.substring(x+1);
						var dat={
							to:data.UserName,
							Message:s,
							UserName:data.to
						};
						socket.emit('chat',dat);
					}
				});
			}
			catch(err){
				console.log(err);
			}
		}
	});
	socket.on('typing',function(data){
		socket.broadcast.emit('typing',data);
	});
	socket.on('clear_text',function(){
		socket.broadcast.emit('clear_text');
	});
	socket.on('error',function(err){
		console.log('Error!',err);
	});
	socket.on('room',function(room){
		try{
		users[room.to].join(room.Room);
		users[room.from].join(room.Room);
	}
	catch(err)
	{
		console.log("BHK!!");
	}
	});
	socket.on('joinroom',function(data){
		socket.join(data);
	});
	socket.on('disconnect',function(sock){
		con.query(sql2,[socket.id]);
		delete users[socket.name];
		io.sockets.emit('Online',Object.keys(users));
		console.log(socket.id+' disconnected');
	});
	
    socket.on('client_character',function(msg){
   		socket.in(msg.Room).broadcast.emit('server_character',msg);
   });
	socket.on('saveFile',function(data){
		fs.writeFileSync(__dirname+'\\codes\\'+data.fileName+'.txt',data.code);
   });
   socket.on('codeTogether',function(data){
   		console.log(data);
		var origCode=fs.readFileSync(__dirname+'\\codes\\'+data.fileName+'.txt','utf8');
		var dat={
			fileName:data.fileName,
			otherUser:data.otherUser,
			code:origCode
		};
		users[data.otherUser].emit('codeTogether',dat);
   });
   socket.on('takefilename',function(data){
   		console.log(data);
   		var text=fs.readFileSync(__dirname+'\\codes\\'+data.filen+'.txt','utf8');
   		socket.emit("takefilename",text);
   });
});