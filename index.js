var express = require("express"),
    faker = require("faker"),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    port = process.env.PORT || 3000,
    waiting_list=[],
    temp_partner;

app.use(express.static(__dirname+"/static"));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){

    socket.partner=null;
    socket.username='anonymous-'+faker.name.firstName();
    socket.avatar=faker.internet.avatar();
    socket.emit("init",{username:socket.username,avatar:socket.avatar});

    if(waiting_list.length>0){
        temp_partner=waiting_list[0];
        console.log("Has Partner " + temp_partner);
        socket.partner=temp_partner;
        // temp_partner=socket.id;
        waiting_list.splice(0,1);
        socket.broadcast.to(temp_partner).emit("partner", {id:socket.id,username:socket.username,avatar:socket.avatar});
        // socket.emit("partner", temp_partner);
    }else{
        console.log("Adding to waiting list");
        waiting_list.push(socket.id);
    }

    socket.on('chat message', function(data){
        var msg=data.msg,
            target=data.target;
        socket.broadcast.to(target).emit("chat message", msg);
    });

    socket.on('partner', function(packet){
        socket.partner=packet.target;
        socket.broadcast.to(socket.partner).emit("partner", packet.data);
    });

    socket.on('disconnect', function () {
        if(socket.partner!=null){
            console.log(socket.partner);
            socket.broadcast.to(socket.partner).emit("chat message", 'Your Partner has disconnected . Refresh page to chat again');
        }
        else{
            waiting_list.splice(0,1);
        }
    });

});

http.listen(port, function(){
    console.log('listening on *:' + port);
});
