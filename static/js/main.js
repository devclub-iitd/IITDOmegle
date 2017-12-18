$(function () {

    const FORM_INPUT_DISABLED_COLOR='#e0e2e5';
    const FORM_INPUT_MSG_COLOR='#00ff00';
    const FORM_INPUT_SEND_COLOR='#0000ff';
    const MSG_MINE_COLOR='#f72702';
    const MSG_PARTNER_COLOR='#0763db';

    var timeout;
    var socket = io();
    var partner_id,partner_username,partner_avatar,my_id;
    var audio = new Audio('/sounds/notif.mp3');

    
    
    function timeoutFunction() {
            socket.emit('typing', false);
    }

    $("#m").keyup(function() {
        socket.emit('typing',true);
        clearTimeout(timeout);
        timeout = setTimeout(timeoutFunction, 1000);
    });

    socket.on('typing', function(data) {
        if (data) {
            $("#istyping").css("visibility","visible")      // call function to show typing
        } else {
            $("#istyping").css("visibility","hidden")       // call function to stop typing
        }
    });

    $('form').submit(function () {
        var msg = $('#m').val();
        socket.emit('chat message', {msg: msg, target: partner_id, source: my_id});
        $('#m').val('');
        return false;
    });

    socket.on('init',function (data) {
        socket.username=data.username;
        socket.avatar=data.avatar;
        my_id = data.my_id;
        $('#myname').html(socket.username);
        $('#myimg').attr("src",socket.avatar);
        $('#m').attr("placeholder","Type to send a message");
    });

    socket.on('chat message mine',function(msg){
        $('#messages').append('<div class="me">'+msg+'</div>');
        $("#messages").scrollTop($("#messages")[0].scrollHeight);
        $('#messages .me').css('background',MSG_MINE_COLOR);
    
    });

    socket.on('chat message partner', function (msg) {
        audio.play();
        $('#messages').append('<div class="partner">'+msg+"</div>");
        $("#messages").scrollTop($("#messages")[0].scrollHeight);
        $('#messages .partner').css('background',MSG_PARTNER_COLOR);
    
    });

    socket.on('disconnecting now', function (msg) {
        $('#messages').append('<div class="partner">'+msg+"</div>");
        $("#messages").scrollTop($("#messages")[0].scrollHeight);
        $('#partnername').html(" ");
        $('#partnerimg').attr("src"," ");
        $('#m').css("pointer-events","none");
        $('#m').css("background",FORM_INPUT_DISABLED_COLOR);
        $('form button').css("pointer-events","none");
        $('form button').css("background",FORM_INPUT_DISABLED_COLOR);
    });

    socket.on('partner', function (partner_data) {
        if(partner_id==null){
            $('#messages').append("<div>"+'Connected to '+partner_data.username+"</div>");
            $('#partnername').html(partner_data.username);
            $('#partnerimg').attr("src",partner_data.avatar);
            $('#m').css("pointer-events","auto");
            $('#m').css("background",FORM_INPUT_MSG_COLOR);
            $('form button').css("pointer-events","auto");
            $('form button').css("background",FORM_INPUT_SEND_COLOR);
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
