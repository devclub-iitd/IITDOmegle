  $(function () {
        var socket = io();
        var partner_id,partner_username,partner_avatar;
        var msg2;
        $('form').submit(function () {
            console.log('emitting');
            msg2 = $('#m').val();
            // $('#messages').append($('<li>').text('You   :  '+msg2));
            $('#messages').append('<li id="me">'+msg2+'</li>');
            $("#messages").scrollTop($("#messages")[0].scrollHeight);
            // window.scrollTo(0, document.body.scrollHeight);
            socket.emit('chat message', {msg: msg2, target: partner_id});
            console.log('emitted');
            $('#m').val('');
            return false;
        });
        socket.on('init',function (data) {
            socket.username=data.username;
            socket.avatar=data.avatar;
        });
        socket.on('chat message', function (msg) {
            console.log('received');
            $('#messages').append('<li id="partner">'+msg+"</li>");
            $("#messages").scrollTop($("#messages")[0].scrollHeight);
            // window.scrollTo(0, document.body.scrollHeight);
        });
        socket.on('partner', function (partner_data) {
            if(partner_id==null){
            console.log("receive partner "+partner_data.id);
            $('#messages').append("<li>"+'Now connected to partner. Start Chatting'+"</li>");
            partner_id = partner_data.id;
            partner_username=partner_data.username;
            partner_avatar=partner_data.avatar;
            socket.emit('partner',{target:partner_id,
                data:{id:socket.id,
                    username:socket.username,
                    avatar:socket.avatar}});
            console.log(partner_username+ ' yay');
            }

        });
        // socket.on('init',function (data) {
        //     var usernaem=data.username,
        //         avatar=data.avatar;
        // })
        // socket.on('partner2', function (partnerid) {
        //     console.log("receive partner "+partnerid);
        //     $('#messages').append("</li>"+'Now connected to partner. Start Chatting'+"</li>");
        //     partner = partnerid;
        // });
    });
