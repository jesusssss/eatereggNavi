var userOb = function() {
    this.id;
    this.username;
    this.password;
    this.profileImage;
    this.firstname;
    this.lastname;
    this.eggCount;
    this.isset = false;
    this.friendsListed = false;
    this.friendIds = [];
    var that = this;

    /* Initiation function for user */
    this.init = function(id, username, password, profileImage, firstname, eggCount) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.profileImage = profileImage;
        this.firstname = firstname;
        this.eggCount = eggCount;
        this.isset = true;
    }

    /* When logging in, this function will check user info in DB */
    this.login = function(user, pass) {
         $.ajax({ url: ajaxLocation+"login.php",
                 data: {
                    username: user,
                    password: pass
                    },
                 type: 'post',
                 success:
                 function(result) {
                      var result = $.parseJSON(result);
                      if(result.success === true) {
                        that.loginSuccess(result);
                      } else {
                        that.loginError();
                      }
                  }
            });
    }

    /* Load settings from localstorage into variables through init function */
    this.load = function() {
        var userSettings = JSON.parse(localStorage.getItem("user"));
        this.init(userSettings.id, userSettings.username, userSettings.password, userSettings.profileImage, userSettings.firstname, userSettings.eggCount);
    }

    /* If user is not found in DB, this will run */
    this.loginError = function() {
        alert("Error at login - try again");
    }

    /* Create user */
    this.create = function(email, displayname, username, password, passwordTest) {
        if(email == "" || displayname == "" || username == "" || password == "" || passwordTest == "") {
            alert("Please fill out every field and try again");
        }
        if(password == passwordTest) {
            $.ajax({ url: ajaxLocation+"createUser.php",
                 data: {
                    email: email,
                    displayname: displayname,
                    username: username,
                    password: password
                    },
                 type: 'post',
                 success:
                 function(result) {
                      var result = $.parseJSON(result);
                      if(result.success === true) {
                        alert("User has been created, please login");
                        loginSwiper.swipeTo(0);
                      } else {
                        alert("Username or Email already in use");
                      }
                  }
            });
        } else {
            alert("Passwords not matching");
        }
    }

    /* On loggin success, render user */
    this.loginSuccess = function(result) {
    /** FETCH USER INFO **/
        $.ajax({ url: ajaxLocation+"getUserInfo.php",
             data: {
                id: result.id,
                hidden: 'xmp3f89e'
                },
             type: 'post',
             success:
             function(userData) {
                  userData = $.parseJSON(userData);
                  var userSettings = {"id": result.id,
                                      "username": result.username,
                                      "password": result.password,
                                      "profileImage": userData.profileImage,
                                      "firstname": userData.firstname,
                                      "eggCount": userData.eggCount
                                    };
                  localStorage.setItem("user", JSON.stringify(userSettings));
                  alert("Login success");
                  $("#loginForm").hide();
                  user.load();
                  user.refreshUser();
                  maps.init();
              }
        });
    }

    /* Adding new profile image */
    this.newProfileImage = function(imageData) {
        $.ajax({ url: ajaxLocation+"updateProfileImage.php",
             data: {
                id: that.id,
                image: imageData
                },
             type: 'post',
             success:
             function(userData) {

              }
        });

        var newSettings = {
            "id": that.id,
            "username": that.username,
            "password": that.password,
            "profileImage": imageData,
            "firstname": that.firstname,
            "eggCount": that.eggCount
        };
        localStorage.setItem("user", JSON.stringify(newSettings));
        that.load();
        that.refreshUser();
        alert("Profile image has been saved");
    }

    /* New full name */
    this.newFullName = function(firstname) {
        $.ajax({ url: ajaxLocation+"updateFullName.php",
             data: {
                id: that.id,
                firstname: firstname,
                },
             type: 'post',
             success:
             function(userData) {
                alert("Your display name has been saved");
              }
        });
        var newSettings = {
            "id": that.id,
            "username": that.username,
            "password": that.password,
            "profileImage": that.profileImage,
            "firstname": firstname,
            "eggCount": that.eggCount
        };
        localStorage.setItem("user", JSON.stringify(newSettings));
        that.load();
        that.refreshUser();
    }

    /* Refreshes user info into DOM */
    this.refreshUser = function() {
        that.friendsListed = false;
        $(".profileImage").attr("style", "background-image: url('data:image/jpeg;base64,"+user.profileImage+"'); background-repeat: no-repeat; background-position: center center; background-size: cover;");
        $(".fullname").html(user.firstname);
        $("div.displayname").html(user.firstname);
        $("input.displayname").html(user.firstname);
        $("div.username").html(user.username);
        $("div.firstname").html(user.firstname);
        $("input.firstname").val(user.firstname);
        $("input.username").val(user.username);
        user.getFriendList();
        user.getFriendPending();
    }

    /* Logout user */
    this.logout = function() {
        if (confirm("Do you want to exit?")) {
            that.confirmLogout();
        }
    }


    /* Confirm logout (true,false) */
    this.confirmLogout = function() {
        localStorage.clear();
        location.reload();
    }

    /* Will get pending friend requests */
    this.getFriendPending = function() {
        $(".pending .pendingList ul").html("");
        $.ajax({
            url: ajaxLocation+"getFriendsPending.php",
            data: {
                id: that.id
            },
            type: "post",
            success: function(friendsId) {
                var friendsId = $.parseJSON(friendsId);
                if(friendsId.length == 0) {
                    $(".pending .pendingList ul").html("<li><h2>No invites</h2></li>")
                }
                $(".countInvites").html(friendsId.length);
                that.friendsPending = friendsId;
                that.drawPending(that.friendsPending);
            }
        });
    }

    this.drawPending = function(pendings) {
        $(".pending .pendingList ul").html("");
        $.each(pendings, function(index, id) {
                    $.ajax({ url: ajaxLocation+"getUserInfo.php",
                         data: {
                            id: id,
                            hidden: 'xmp3f89e'
                            },
                         type: 'post',
                         success:
                         function(friendData) {
                              var friendData = $.parseJSON(friendData);
                              $(".pendingList ul").append(
                                "<li class='singleFriend'>"
                                +"<div class='friendImage' style='background-image: url(data:image/jpeg;base64,"+friendData.profileImage+");'>"
                                +"</div>"
                                +"<div class='friendName'>"
                                +friendData.firstname
                                +"</div>"
                                +"<div class='decide'>"
                                +"<button class='accept' data-friendid='"+friendData.id+"'>Accept</button>"
                                +"<button class='deny' data-friendid='"+friendData.id+"'>Deny</button>"
                                +"</div>"
                                +"</li>"
                              );
                         }
                    });
                });
    }

    /* Will accept friend request */
    this.acceptFriend = function(id) {
        $.ajax({
            url: ajaxLocation+"acceptFriend.php",
            data: {
                userId: user.id,
                friendId: id
            },
            type: "post",
            success: function() {
                alert("You got a new friend!");
                setTimeout(function() {
                    that.refreshUser();
                }, 1500);
            }
        });
    }

    /* Will deny friend request */
    this.denyFriend = function(id) {
        $.ajax({
            url: ajaxLocation+"denyFriend.php",
            data: {
                userId: user.id,
                friendId: id
            },
            type: "post",
            success: function() {
                alert("Denied friend request");
                setTimeout(function() {
                    that.refreshUser();
                }, 1500);
            }
        });
    }

    this.addFriend = function(username) {
        if(this.username == username) {
            alert("Why would you wanna be friends with yourself?");
            return;
        }
        if(username.length != 0) {
            $.ajax({
                url: ajaxLocation+"addFriend.php",
                data: {
                    userId: user.id,
                    username: username
                },
                type: "post",
                success: function(result) {
                    if(result == "true") {
                        alert("Friend has been requested");
                    }
                    if(result == 'false') {
                        alert("Error: Friend already requested");
                    }
                    if(result == 'null') {
                        alert("User does not exist. Try again.");
                    }
                }
            });
        } else {
            alert("Please fill out username first");
        }
    }

    /* Will get users friends */
    this.getFriendList = function() {
        if(this.friendsListed === false) {
            $.ajax({ url: ajaxLocation+"getFriendsList.php",
                 data: {
                    id: that.id
                    },
                 type: 'post',
                 success:
                 function(friendsId) {
                    var friendsId = $.parseJSON(friendsId);
                    that.friendIds = friendsId;
                    that.drawFriends(that.friendIds);
                    that.friendsListed = true;
                 }
            });
        }
    }

    /* Get users friends into DOM */
    this.drawFriends = function(friends) {
        $(".friendList ul").html("");
        if(friends.length == 0) {
            $(".friendList ul").html("<li><h3>No friends</h3></li>");
        }
        $.each(friends, function(index, id) {
            $.ajax({ url: ajaxLocation+"getUserInfo.php",
                 data: {
                    id: id,
                    hidden: 'xmp3f89e'
                    },
                 type: 'post',
                 success:
                 function(friendData) {
                      var friendData = $.parseJSON(friendData);
                      $(".friendList ul").append(
                        "<li class='singleFriend' data-id='"+friendData.id+"'>"
                        +"<div class='friendImage' style='background-image: url(data:image/jpeg;base64,"+friendData.profileImage+");'>"
                        +"</div>"
                        +"<div class='friendName'>"
                        +friendData.firstname
                        +"</div>"
                        +"</li>"
                      );
                 }
            });
        });
    }

    /* Forgot password function */
    this.forgotPassword = function(email) {
        ajax("forgotPassword", {email: email}, this.forgotPasswordSuccess);
    }

    this.forgotPasswordSuccess = function() {
        alert("We sent you an email with your information");
    }


}