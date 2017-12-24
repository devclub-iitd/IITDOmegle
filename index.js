// var emoji = require('emoji-parser');

var express = require("express"),
    faker = require("faker"),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    port = process.env.PORT || 3003,
    waiting_list=[],
    temp_partner,
    num_users=0;

app.use('/static',express.static(__dirname+"/static"));
// app.use('/emoji/images',express.static(__dirname+"/node_modules/emoji-parser/emoji/"));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

// emoji.init().update();


io.on('connection', function(socket){

    num_users++;
    socket.partner=null;
    socket.username='anonymous-'+faker.name.firstName();
    socket.avatar=faker.internet.avatar();
    socket.emit("init",{username:socket.username,avatar:socket.avatar,my_id:socket.id});

    if(waiting_list.length>0){
        temp_partner=waiting_list[0];
        socket.partner=temp_partner;
        waiting_list.splice(0,1);
        socket.broadcast.to(temp_partner).emit("partner", {id:socket.id,username:socket.username,avatar:socket.avatar});
    }else{
        waiting_list.push(socket.id);
    }
    console.log("Active Users = "+num_users+",Waiting list size="+waiting_list.length);

    socket.on('chat message', function(data){
        // var msg = emoji.parse(data.msg, '/emoji/images');
        var msg=data.msg;
        var target=data.target;
        var source=socket.id;
        socket.broadcast.to(target).emit("chat message partner", msg);
        io.to(source).emit("chat message mine", msg);
    });

    socket.on('partner', function(packet){
        socket.partner=packet.target;
        socket.broadcast.to(socket.partner).emit("partner", packet.data);
    });

    socket.on('disconnect', function () {
        if(socket.partner!=null){
            socket.broadcast.to(socket.partner).emit("typing", false);
               socket.broadcast.to(socket.partner).emit("disconnecting now", 'Your Partner has disconnected . Refresh page to chat again');
        }
        else{
            waiting_list.splice(0,1);
        }
        num_users--;
        console.log("Active Users = "+num_users+",Waiting List="+waiting_list.length);
    });

    socket.on('typing',function (data) {
        socket.broadcast.to(socket.partner).emit("typing", data);
    })

});

http.listen(port, function(){
    console.log('listening on *:' + port);
});
