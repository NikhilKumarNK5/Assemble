module.exports = function(async, Club, _, Users, Message, FriendResult) {
    return {
        SetRouting: function(router) {
            router.get('/home', this.homePage);
            router.post('/home', this.postHomePage);

            router.get('/logout', this.logout);
        },

        homePage: function(req, res) {
            async.parallel([
                function(callback) {
                    // find returns an array - mongoose find method
                    Club.find({}, (err, result) => {
                        callback(err, result);
                    });
                },

                function(callback) {
                    Club.aggregate([{
                        // we will use the group method
                        $group: {
                            _id: "$country"
                        }
                    }], (err, newResult) => {
                        callback(err, newResult)
                    });
                },

                function(callback) {
                    Users.findOne({
                        'username': req.user.username
                    })
                    .populate('request.userId')
                    .exec((err, result) => {
                        callback(err, result);
                    });
                },

                function (callback) {
                    const nameRegex = new RegExp(
                      "^" + req.user.username.toLowerCase(),
                      "i"
                    );
                    Message.aggregate(
                      [
                        {
                          $match: {
                            $or: [
                              { 'senderName': nameRegex },
                              { 'receiverName': nameRegex },
                            ]
                          }
                        },
                        { $sort: { 'createdAt': -1 } },
                        {
                          $group: {
                            "_id": {
                              "last_message_between": {
                                $cond: [
                                  {
                                    $gt: [
                                      { $substr: ["$senderName", 0, 1] },
                                      { $substr: ["$receiverName", 0, 1] }
                                    ]
                                  },
                                  {
                                    $concat: ["$senderName", " and ", "$receiverName"],
                                  },
                                  {
                                    $concat: ["$receiverName", " and ", "$senderName"],
                                  }
                                ],
                              }
                            },
                            "body": { $first: "$$ROOT" }
                          }
                        }
                      ],
                      function (err, newResult) {
                        // console.log(newResult);
                        const arr = [
                          {path: 'body.sender', model: 'User'},
                          {path: 'body.receiver', model: 'User'}
                        ];

                        Message.populate(newResult, arr, (err, newResult1) => {
                          callback(err, newResult1);
                        });
                      }
                    )
                  },

            ], (err, result) => {
                const res1 = result[0]; // since we have only one fuction so we are copying the result at index 0
                // console.log(res1);

                const res2 = result[1];
                // console.log(res2);

                const res3 = result[2];
                const res4 = result[3];

                const dataChunk = [];
                const chunkSize = 3;
                for(let i=0; i<res1.length; i+=chunkSize) {
                    dataChunk.push(res1.slice(i, i+chunkSize));
                }
                // console.log(dataChunk); // with the chunk size we determine how the data will be displayed that is how to display the cards - ie 3 in a row

                const countrySort = _.sortBy(res2, '_id'); // lodash sort by method

                res.render('home', {title: 'Assemble - Home', user: req.user, chunks: dataChunk, country: countrySort, data: res3, chat: res4});
            });
            
        },

        postHomePage: function(req, res) {
            async.parallel([
                function(callback) {
                    Club.update({
                        '_id': req.body.id,
                        'fans.username': {$ne: req.user.username}
                    }, {
                        $push: {fans: {
                            username: req.user.username,
                            email: req.user.email
                        }}
                    }, (err, count) => {
                        console.log(count);
                        callback(err, count);
                    });

                    FriendResult.PostRequest(req, res, '/home');
                },

                

            ], (err, results) => {
                res.redirect('/home');
            });
        },
        
        logout: function(req, res) {
            req.logout();
            req.session.destroy((err) => {
                res.redirect('/');
            });
        }
    }
}