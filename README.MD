# Assemble


## Screenshots

![Registration](https://github.com/NikhilKumarNK5/Assemble/blob/main/Screenshots/Registration.jpeg)
![Login](https://github.com/NikhilKumarNK5/Assemble/blob/main/Screenshots/Login.jpeg)
![Home](https://github.com/NikhilKumarNK5/Assemble/blob/main/Screenshots/Home.jpeg)
![Members](https://github.com/NikhilKumarNK5/Assemble/blob/main/Screenshots/Members.jpeg)
![Profile](https://github.com/NikhilKumarNK5/Assemble/blob/main/Screenshots/Profile.jpeg)
![Interests](https://github.com/NikhilKumarNK5/Assemble/blob/main/Screenshots/Interests.jpeg)
![Profile Overview](https://github.com/NikhilKumarNK5/Assemble/blob/main/Screenshots/Profile%20Overview.jpeg)
![Group Chat](https://github.com/NikhilKumarNK5/Assemble/blob/main/Screenshots/Group%20Chat.jpeg)
![Private Chat](https://github.com/NikhilKumarNK5/Assemble/blob/main/Screenshots/Private%20Chat.jpeg)
![Add Friend](https://github.com/NikhilKumarNK5/Assemble/blob/main/Screenshots/Add%20Friend.jpeg)
![Friend Request](https://github.com/NikhilKumarNK5/Assemble/blob/main/Screenshots/Friend%20Request.jpeg)
![Message Notification](https://github.com/NikhilKumarNK5/Assemble/blob/main/Screenshots/Message%20Notification.jpeg)

## Built With

- [EJS](https://ejs.co/) - Used for frontend
- [Node](https://nodejs.org/en/) - Used for backend
- [Socket.io](https://socket.io/) - Used for realtime features
- [Mongodb](https://www.mongodb.com/) - Database



## Features

- Join from multiple groups
- Login and register using facebook and google as well
- Add friends
- Add favourite groups
- Search users
- Private and Group Chat 
- Filter groups by country name
- Search groups 

### Realtime

- Get notification when someone sends you a message or a friend request
- Chat send text message
- Seen feature and activity status of user

## Installing

1. Install dependencies

```
npm install
```

2. Create a folder called secret and create a file inside it named secertFile.js and replace the values with yours 
```
module.exports = {
    facebook: {
        clientID: '',
        clientSecret: '',
    },
    
    google: {
        clientID: '',
        clientSecret: ''
    },

    aws: {
        accessKeyId: '',
        secretAccessKey: ''
    }

}
```