  $(function () {
        var socket = io();
        var partner_id,partner_username,partner_avatar;
        var msg2;
        $('form').submit(function () {
            msg2 = $('#m').val();
            $('#messages').append('<li id="me">'+msg2+'</li>');
            $("#messages").scrollTop($("#messages")[0].scrollHeight);
            socket.emit('chat message', {msg: msg2, target: partner_id});
            $('#m').val('');
            return false;
        });
        socket.on('init',function (data) {
            socket.username=data.username;
            socket.avatar=data.avatar;
        });
        socket.on('chat message', function (msg) {
            $('#messages').append('<li id="partner">'+msg+"</li>");
            $("#messages").scrollTop($("#messages")[0].scrollHeight);
        });
        socket.on('partner', function (partner_data) {
            if(partner_id==null){
            $('#messages').append("<li>"+'Now connected to partner. Start Chatting'+"</li>");
            partner_id = partner_data.id;
            partner_username=partner_data.username;
            partner_avatar=partner_data.avatar;
            socket.emit('partner',{target:partner_id,
                data:{id:socket.id,
                    username:socket.username,
                    avatar:socket.avatar}});
            }
        });
    });
