/****************** GLOBAL VARS *********************/
//var pictureSource;   // picture source
//var destinationType; // sets the format of returned value

/****************** DEVICE READY FUNCTIONS *****************/
/** Called on <body> tag **/
    $.toggle3DByDefault();



/* Global vars */
oldIndex = 0;

    mySwiper = $('.swiper-container').swiper({
      mode:'horizontal',
      loop: false,
      resistance: '100%',
      noSwiping: true,
      onSlideChangeStart: function(){
        var index = mySwiper.activeIndex;
        if(index == 1) {
            if(maps.drawnCollection === false) {
                maps.getAllEggs();
            }
        }
        if(index == 0) {
            /* If map slide active, initiate */
            maps.init();
        } else {
            /* Else pause tracking for battery and memory */
            maps.pause();
        }
      }
    });

    menuSwiper = $(".menu-swiper").swiper({
        mode: 'vertical',
        loop: false,
        resistance: '100%',
        noSwiping: true
    });

    eggSwiper = $(".swiper-layegg").swiper({
        mode: 'vertical',
        onlyExternal: true,
        resistance: '100%',
        noSwiping: true,
        onSlideChangeStart: function() {
            var index = eggSwiper.activeIndex;
        }
    });

    collectionSwiper = new Swiper('.swiper-collection',{
        onlyExternal: true,
        noSwiping: true,
        onSlideChangeStart: function(){
            oldIndex = collectionSwiper.previousIndex;
            var index = collectionSwiper.activeIndex;
        }
      });

      $(".tab").on('click',function(e){
          $(".tab").removeClass('active');
          $(this).addClass('active');
          collectionSwiper.swipeTo($(this).index());
        });

    loginSwiper = $('.login-container').swiper({
          mode:'vertical',
          loop: false,
          resistance: '100%'
    });

        profileSwiper = $(".swiper-container-profile").swiper({
            mode: 'vertical',
            loop: false,
            resistance: '100%',
            noSwiping: true,
            onSlideChangeStart: function() {
                var index = profileSwiper.activeIndex;
                if(index == 0) {
                    $(".fixedProfile").stop().animate({top: '-80px'});
                    $(".fixedProfile").addClass("hidden");
                }
                if(index == 1 && $(".fixedProfile").hasClass("hidden")) {
                    $(".fixedProfile").stop().animate({top: '0px'});
                    $(".fixedProfile").removeClass("hidden");
                }
            }
        });

      $(".profileNav ul li").on("click", function() {
          $(".profileNav ul li").removeClass("active");
          $(this).addClass("active");
      });
//    /* Init Geolocation - first */
//    var options = { timeout: 30000 };
//    navigator.geolocation.getCurrentPosition(geoSuccess, geoError); /* Initiate maps from GEO location */

    /** Catch form ajax requests **/
    $("form.ajax").submit(function(e) {
        e.preventDefault();
    });

    var animSpeed = 500;
    var menuWrapperWidth = $(".menuWrapper").width();

    $('input[type="range"]').rangeslider({
    });

    $("input[type='range']").on("change", function() {
        $("#radiusValue").html($(this).val()+"m");
        maps.setRadius($(this).val());
    });

    $("input[type='range']").on("click", function() {
        maps.radiusAfter();
    });

    $(".swiper-container .swiper-slide").on("click", function() {
        if($(".menuWrapper").hasClass("visible")) {
            $(".menuWrapper").animate({left: '-'+menuWrapperWidth+'px'}, animSpeed);
            $(".menuWrapper").removeClass("visible");
            maps.init();
        }
    });

    $(".gotoUserInformation").on("click", function() {
        menuSwiper.swipeTo(1);
    });

    $(".gotoFriendInvites").on("click", function() {
        menuSwiper.swipeTo(2);
    });

    $(".gotoProfilePicture").on("click", function() {
        menuSwiper.swipeTo(3);
    });

    $(".gotoSettings").on("click", function() {
        menuSwiper.swipeTo(4);
    });

    $(".gotoAddFriend").on("click", function() {
        menuSwiper.swipeTo(5);
    });

    $(".logout").on("click", function() {
        user.logout();
    });

    $(".menuBack").on("click", function() {
        menuSwiper.swipeTo(0);
    });

    $("#menuIcon").on("click", function() {
        if($(".menuWrapper").hasClass("visible")) {
            $(".menuWrapper").animate({left: '-'+menuWrapperWidth+'px'}, animSpeed);
            $(".menuWrapper").removeClass("visible");
            maps.init()
        } else {
            $(".menuWrapper").animate({left: '0'}, animSpeed);
            $(".menuWrapper").addClass("visible");
            maps.pause();
        }
    });

    $("#close").on("click", function() {
        $(".menuWrapper").animate({left: '-'+menuWrapperWidth+'px'}, animSpeed);
        $(".menuWrapper").removeClass("visible");
        maps.init();
    });

    $(".friends").on("click", function() {
        user.getFriendList();
    });

    $("#savePicture").on("click", function() {
        user.newProfileImage(camera.profileImage);
        $(this).hide();
    });

    $("#capturePicture").on("click", function() {
        camera.captureProfile();
    });

    $("#fromGallery").on("click", function() {
        camera.galleryProfile();
    });
//
    $("#doLogin").on("click", function() {
        user.login($("#loginUsername").val(), $("#loginPassword").val());
    });

    $('#firstname, #newDisplayname, #loginUsername, #lastname, #loginPassword').keydown(function(e){
        if (e.which === 32) {
            e.preventDefault();
        }
    }).blur(function() {
        $(this).val(function(i,oldVal){ return oldVal.replace(/\s/g,''); });
    });

    $("#layEgg").on("click", function() {
        maps.pause();
        maps.saveCurrentPosition();
        camera.captureEgg();
    });

    $("#preBack").on("click", function() {
        maps.init();
        eggSwiper.swipeTo(0);
    });

    $("#eggIcon").on("click", function() {
        mySwiper.swipeTo(1);
    });

    var dragging = false;

    $(".eggsByMe, .eggsToMe").on("click", ".singleEgg", function() {
        dragging = false;
    });

    $(".eggsByMe, .eggsToMe").on("click", ".singleEgg", function() {
        if(dragging) {
            return;
        }
        var lat = $(this).data("lat");
        var lng = $(this).data("lng");
        var eggId = $(this).data("eggid");
        if($(this).parent().attr("class") == 'eggsToMe') {
            if($(this).find("div.new").length) {
                $(this).removeClass("orange");
                $(this).find("div.new").removeClass("new").addClass("cracked");
            }
        }
        maps.viewEgg(lat, lng, eggId);
    });

    $(".eggsByMe, .eggsToMe").on("touchmove", function() {
        dragging = true;
    });

    $(".closeButton").on("click", function() {
        $(".tabs").show();
        collectionSwiper.swipeTo(oldIndex);
        maps.removePreLocation();
        $("#eggViewerMap").removeAttr("style");
        $(".eggViewerGift").removeAttr("style");
    });

    $("#eggViewerMap").on("click", function() {
        $(this).hide();
        $(".eggViewerGift").show();
    });

    $(".eggViewerGift").on("click", function() {
        $(this).hide();
        $("#eggViewerMap").show();
    });

    $(".pendingList").on("click", ".accept", function() {
        user.acceptFriend($(this).data("friendid"));
    });

    $(".pendingList").on("click", ".deny", function() {
        user.denyFriend($(this).data("friendid"));
    });

    $("#addFriend").on("click", function() {
        user.addFriend($("#requestFriend").val());
    });

    $("#createUser").on("click", function() {
        user.create($("#newEmail").val(), $("#newDisplayname").val(), $("#newUsername").val(), $("#newPassword").val(), $("#newPasswordCheck").val());
    });

    $("#forgotPassword").on("click", function() {
        user.forgotPassword($("#forgotEmail").val());
    });

    $(document).on("click", ".successViewEggsNow", function() {
        mySwiper.swipeTo(1);
    });
//
//    $("form.signup .loginSubmit").on("click", function() {
//        user.create($('#createEmail').val(), $('#createUsername').val(), $('#createPassword').val(), $('#createPasswordTest').val());
//    });
//
//    $("form.forgotpassword .loginSubmit").on("click", function() {
//        user.forgotPassword($('#forgotusername').val());
//    });
//
//    $(".profileNav #logout").on("click", function() {
//        user.logout();
//    });
//
//    $("#changeName .toggle").on("click", function() {
//        if($("#changeProfileImage .showChanger").is(":visible")) {
//            $($("#changeProfileImage .showChanger")).animate({height: "toggle"}, "slow", function() {
//                $("#changeName .showChanger").animate({height: "toggle"}, "slow");
//            });
//        } else {
//            $("#changeName .showChanger").animate({height: "toggle"}, "slow");
//        }
//    });
//
//    $("#changeProfileImage .toggle").on("click", function() {
//        if($("#changeName .showChanger").is(":visible")) {
//            $("#changeName .showChanger").animate({height: "toggle"}, "slow", function() {
//                $("#changeProfileImage .showChanger").animate({height: "toggle"}, "slow");
//            });
//        } else {
//            $("#changeProfileImage .showChanger").animate({height: "toggle"}, "slow");
//        }
//    });
//
    $("#editName").on("click", function() {
        if($("#firstname").val().length > 0) {
            user.newFullName($("#firstname").val());
        } else {
            alert("No empty fields, please");
        }
    });
//
//    $(".absoluteLayEgg").on("click", function() {
//        maps.pause();
//        maps.saveCurrentPosition();
//        camera.captureEgg();
//    });
//
//    $(".absoluteBottom .backEgg").on("click", function() {
//        eggSwiper.swipeTo(0);
//    });
//
//    $("#start").on("click", function() {
//        maps.init();
//    });
//
//    $("#stop").on("click", function() {
//        maps.pause();
//    });
//
    $(document).on("click", "#preFriendSelect .friendList .singleFriend", function(event) {
        if($(this).hasClass("active")) {
            $(this).attr("style", "");
            $(this).removeClass("active");
            maps.removeReciever($(this).attr("data-id"));
        } else {
            maps.addReciever($(this).attr("data-id"));
            $(this).attr("style","background: #6e7488;").addClass("active");
        }
    });
//
    $("#doLeyEgg").on("click", function() {
        maps.doLayEgg();
    });