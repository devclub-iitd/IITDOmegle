var express = require("express")
var app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    port = process.env.PORT || 3000,
    waiting_list=[],
    temp_partner;

app.use(express.static(__dirname+"/public"));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){

    socket.partner=null;

    if(waiting_list.length>0){
        temp_partner=waiting_list[0];
        console.log("Has Partner " + temp_partner)
        socket.partner=temp_partner;
        temp_partner.partner=socket.id;
        waiting_list.splice(0,1);

        socket.broadcast.to(temp_partner).emit("partner", socket.id);
    }else{
        console.log("Adding to waiting list")
        waiting_list.push(socket.id);
    }

    socket.on('chat message', function(data){
        msg=data.msg;
        target=data.target;
        socket.broadcast.to(target).emit("chat message", msg);
    });

    socket.on('partner2', function(id){
        socket.broadcast.to(id).emit("partner2", socket.id);
    });

    socket.on('disconnect', function (data) {
        console.log(socket.partner);
        socket.broadcast.to(socket.partner).emit("chat message", 'Your Partner has disconnected . Refresh page to chat again');
    });

});

http.listen(port, function(){
    console.log('listening on *:' + port);
});
