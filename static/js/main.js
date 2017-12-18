$(function () {

      var timeout;
      var socket = io();
      var partner_id,partner_username,partner_avatar;
      var my_id;
      var msg2;
      var audio = new Audio('/sounds/notif.mp3');

    
    function timeoutFunction() {
          socket.emit('typing', false);
      }

      $(//write name of message box here
          ).keyup(function() {
          socket.emit('typing',true);
          clearTimeout(timeout);
          timeout = setTimeout(timeoutFunction, 2000);
      });

      socket.on('typing', function(data) {
          if (data) {
              // call function to show typing
          } else {
              // call function to stop typing
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
            console.log(my_id);
        $('#myname').html(socket.username);
        $('#myimg').attr("src",socket.avatar);
        });


        socket.on('chat message mine',function(msg){
            console.log("Got back my own msg");
            $('#messages').append('<div id="me">'+msg+'</div>');
            $("#messages").scrollTop($("#messages")[0].scrollHeight);
        });

        socket.on('chat message partner', function (msg) {
            audio.play();
            $('#messages').append('<div id="partner">'+msg+"</div>");
            $("#messages").scrollTop($("#messages")[0].scrollHeight);
        });


        socket.on('disconnecting now', function (msg) {
            $('#messages').append('<div id="partner">'+msg+"</div>");
            $("#messages").scrollTop($("#messages")[0].scrollHeight);
            $('#partnername').html(" ");
            $('#partnerimg').attr("src"," ");
            $('#m').css("pointer-events","none");
            $('#m').css("background","#e0e2e5");
            $('form button').css("pointer-events","none");
            $('form button').css("background","#e0e2e5");
        });


        socket.on('partner', function (partner_data) {
            if(partner_id==null){
                $('#messages').append("<div>"+'Connected to '+partner_data.username+"</div>");
                $('#partnername').html(partner_data.username);
                $('#partnerimg').attr("src",partner_data.avatar);
                $('#m').css("pointer-events","auto");
                $('#m').css("background","#e3fce0");
                $('form button').css("pointer-events","auto");
                $('form button').css("background","#bffcb8");
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
