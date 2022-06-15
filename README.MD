# Assemble


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