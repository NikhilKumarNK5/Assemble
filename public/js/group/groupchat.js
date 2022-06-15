// client side
$(document).ready(function() {
    var socket = io();

    var room = $('#groupName').val();
    var sender = $('#sender').val();

    var userPic = $('#name-image').val();

    socket.on('connect', function() {
        // console.log('Yea! User Connected');

        var params = {
            room: room,
            name: sender
        }
        socket.emit('join', params, function() {
            // console.log('User has joined this channel');
        });
    });

    // Add users
    socket.on('usersList', function(users) {
        // console.log(users);
        var ol = $('<ol></ol>');

        for(var i=0; i<users.length; i++) {
            ol.append('<p><a id="val" data-toggle="modal" data-target="#myModal">'+users[i]+'</a></p>');
        }

        // jQuery event delegation - adding name in the modal 
        $(document).on('click', '#val', function(){
            $('#name').text('@'+$(this).text());
            $('#receiverName').val($(this).text());
            $('#nameLink').attr('href', '/profile/'+$(this).text());
        });

        $('#numValue').text('('+users.length+')');
        $('#users').html(ol);
    });

    socket.on('newMessage', function(data) {
        var template = $('#message-template').html();
        var message = Mustache.render(template, {
            text: data.text,
            sender: data.from,
            userImage: data.image
        });

        $('#messages').append(message);
        // console.log(data);
        // console.log(data.room);
    });

    $('#message-form').on('submit', function(e){
        e.preventDefault(); // we do not want form to reload when we start

        var msg = $('#msg').val();

        socket.emit('createMessage', {
            text: msg,
            room: room,
            from: sender,
            userPic: userPic
        }, function() {
            $('#msg').val(''); // to clear the msg from the input field
        });

        $.ajax({
            url: '/group/'+room,
            type: 'POST',
            data: {
                message: msg,
                groupName: room
            },
            success: function(){
                $('#msg').val('');
            }
        })

    });
});