var socket = io();

        function scrollToBottom() {
            // selector
            console.log('trigged');
            var messages = $('#msg');
            var newMessage = messages.children('li:last-child');
            // height

            var clientHeight = messages.prop('clientHeight');
            var scrollTop = messages.prop('scrollTop');
            var scrollHeight = messages.prop('scrollHeight');
            var newMessageHeight = newMessage.innerHeight();
            var lastMessageHeight = newMessage.prev().innerHeight();

            if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
                messages.scrollTop(scrollHeight);
            }
        }

        socket.on('connect', function() {
            console.log('connected to server');

            var param = jQuery.deparam(window.location.search);

            socket.emit('join', param, function(err) {
                if (err) {
                    alert(err)
                    window.location.href = '/';
                } else {
                    console.log('no error');
                }
            });
        });

        

        socket.on('disconnet', function()  {
            console.log('Disconnected from server');
        });


        socket.on('updateUserList', function(users) {
           var ol = jQuery('<ol></ol>');

           users.forEach(function(user) {
               ol.append(jQuery('<li></li>').text(user));
           });

           jQuery('#users').html(ol);
        });


        socket.on('newMessage', function(message) {
            var formattedTime = moment(message.createdAt).format('h:mm a');
            console.log('newMessage', message);
            $('#msg').append(`<li><strong>${message.from}</strong> <span>${formattedTime}</span><br><br> ${message.text}</li>`);
            scrollToBottom();
        });

        socket.on('newLocationMessage', function(message) {
            var formattedTime = moment(message.createdAt).format('h:mm a');
            $('#msg').append(`<li><strong>${message.from}</strong> <span>${formattedTime}</span><br><br> <a target="_blank" href="${message.url}">My current location</a></li>`);
            scrollToBottom();
        });

      
        jQuery('#message-form').on('submit', function(e) {
            e.preventDefault();

            socket.emit('createMessage', {
                text: $('#message').val()
        }, function() {
            $('#message').val('');
        });
    });

    $('#send-location').on('click', function() {
        if(!navigator.geolocation) {
           return alert('Your browser is not supported');
        }

        $('#send-location').attr('disabled','disabled').text('Sending location...')

        navigator.geolocation.getCurrentPosition(function(position) {
            $('#send-location').removeAttr('disabled').text('Send location');
           socket.emit('createLocationMessage', {
               latitude: position.coords.latitude,
               longitude: position.coords.longitude
           });
        }, function() {
            $('#send-location').removeAttr('disabled').text('Send location');
            alert('unable to fetch location');
        });
    });