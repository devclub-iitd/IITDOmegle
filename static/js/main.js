  $(function () {

      var timeout;
      var socket = io();
      var partner_id,partner_username,partner_avatar;
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
        $('#myname').html(socket.username);
        $('#myimg').attr("src",socket.avatar);
        });
        socket.on('chat message', function (msg) {
            audio.play();
            $('#messages').append('<li id="partner">'+msg+"</li>");
            $("#messages").scrollTop($("#messages")[0].scrollHeight);
        });
        socket.on('partner', function (partner_data) {
            if(partner_id==null){
            $('#messages').append("<li>"+'Connected to '+partner_data.username+"</li>");
            $('#partnername').html(partner_data.username);
            $('#partnerimg').attr("src",partner_data.avatar);
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
