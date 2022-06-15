module.exports = function(async, Users, Message) {
    return {
        PostRequest: function(req, res, url) {
            async.parallel([
                function(callback) {
                    if(req.body.receiverName) {
                        Users.updateOne({
                            'username': req.body.receiverName,
                            'request.userId': {$ne: req.user._id}, // id of sender of friend request
                            'friendsList.friendId': {$ne: req.user._id}
                        }, 
                        {
                            // push value into array - mongodb
                            $push: {
                                request: {
                                    userId: req.user._id,
                                    username: req.user.username
                                }
                            },
                            $inc: {
                                totalRequest: 1
                            }
                        }, (err, count) => {
                            callback(err, count);
                        })
                    }
                },
                // for sender 
                function(callback) {
                    if(req.body.receiverName) {
                        Users.updateOne({
                            'username': req.user.username,
                            'sentRequest.username': {$ne: req.body.receiverName}
                        },
                        {
                            $push: {
                                sentRequest: {
                                    username: req.body.receiverName
                                }
                            }
                        }, (err, count) => {
                            callback(err, count);
                        })
                    }
                }
            ], (err, results) => {
                res.redirect(url);
            });

            // function for accepting or rejecting the friend request
            async.parallel([
                // for the receiver of friend request - accepted
                function(callback) {
                    if(req.body.senderId) {
                        Users.updateOne({
                            '_id': req.user._id,
                            'friendsList.friendId': {$ne: req.body.senderId}
                        },
                        {
                            $push: {
                                friendsList: {
                                    friendId: req.body.senderId,
                                    freindName: req.body.senderName
                                }
                            },
                            $pull: {
                                request: {
                                    userId: req.body.senderId,
                                    username: req.body.senderName
                                }
                            },
                            $inc: {
                                totalRequest: -1
                            }   
                        }, (err, count) => {
                            callback(err, count);
                        });
                    }
                },

                // this is updated for the sender of the friend request when it is accepted 
                function(callback) {
                    if(req.body.senderId) {
                        Users.updateOne({
                            '_id': req.body.senderId,
                            'friendsList.friendId': {$ne: req.user._id}
                        },
                        {
                            $push: {
                                friendsList: {
                                    friendId: req.user._id,
                                    freindName: req.user.username
                                }
                            },
                            $pull: {
                                sendRequest: {
                                    username: req.user.username
                                }
                            },
                        }, (err, count) => {
                            callback(err, count);
                        });
                    }
                },

                // receiver
                function(callback) {
                    if(req.body.user_Id) {
                        Users.updateOne({
                            '_id': req.user._id,
                            'request.userId': {$eq: req.body.user_Id}
                        },
                        {
                            $pull: {
                                request: {
                                    userId: req.body.user_Id
                                }
                            },

                            $inc: {totalRequest: -1}

                        }, (err, count) => {
                            callback(err, count);
                        });
                    }
                },

                // sender
                function(callback) {
                    if(req.body.user_Id) {
                        Users.updateOne({
                            '_id': req.body.user_Id,
                            'request.userId': {$eq: req.user.username}
                        },
                        {
                            $pull: {
                                sendRequest: {
                                    username: req.user.username
                                }
                            }

                        }, (err, count) => {
                            callback(err, count);
                        });
                    }
                },

                function(callback) {
                    if(req.body.chatId) {
                      Message.updateOne({
                        '_id': req.body.chatId
                      },
                      {
                        "isRead": true
                      }, (err, done) => {
                        console.log(done);
                        callback(err, done);
                      })
                    }
                },
                
            ], (err, results) => {
                res.redirect(url);
            });
        }
    }
}