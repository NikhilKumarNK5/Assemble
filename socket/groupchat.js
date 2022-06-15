// server side
module.exports = function(io, Users) {
    // var users = [] // instead we will use Users class
    // here we gonna listen for connection event

    const users = new Users();

    io.on('connection', (socket) => {
        //console.log('User Connected');

        socket.on('join', (params, callback) => {
            socket.join(params.room); // join a particular group

            users.AddUserData(socket.id, params.name, params.room);
            
            io.to(params.room).emit('usersList', users.GetUsersList(params.room)); // if emit then listen
            
            // Instead we will use Users class
            // users.push(params.name);
            // users.push(params.room);
            // users.push(socket.id);

            callback();
        });

        socket.on('createMessage', (message, callback) => {
            console.log(message);
            io.to(message.room).emit('newMessage', {
                text: message.text,
                room: message.room,
                from: message.from,
                image: message.userPic
            });
            callback(); // to clear the msg from the input field
        });

        socket.on('disconnect', () => {
            var user = users.RemoveUser(socket.id);

            if(user) {
                io.to(user.room).emit('usersList', users.GetUsersList(user.room));
            }
        });
    });
}