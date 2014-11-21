
/************************ CAMREA ************************/
var cameraOb = function(DestinationType, PictureSourceType, MediaType) {
    this.destinationType = DestinationType;
    this.pictureSourceType = PictureSourceType;
    this.mediaType = MediaType;
    this.profileImage;

    /* Global camera options - will not be used */
    this.cameraOptions = {
        quality: 30,
          targetWidth: 100,
          targetHeight: 100
    }
    this.currentEgg;
    var that = this;

    /* When capturing new profile image this function will run */
    this.captureProfile = function() {
        //navigator.camera.getPicture(that.profileSuccess, that.profileFail, { quality: 50,
        //   destinationType: Camera.DestinationType.DATA_URL,
        //   targetHeight: 400,
        //   targetWidth: 400,
        //   correctOrientation: true
        //   });
    }

    /* When capturing new egg this function will run */
    this.captureEgg = function() {
        //navigator.camera.getPicture(that.eggSuccess, that.eggFail, { quality: 100,
        //      destinationType: Camera.DestinationType.DATA_URL,
        //      targetHeight: 800,
        //      targetWidth: 800,
        //      correctOrientation: true
        //  });
        that.eggSuccess("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");
    }

    /* On success from camera on laying egg */
    this.eggSuccess = function(imageData) {
        eggSwiper.swipeTo(1);
        that.currentEgg = imageData;
        maps.drawPreLocation();
        that.drawPreImage();
    }

    /* Drawing preview of camera image to DOM */
    this.drawPreImage = function() {
        $("#preImage").css("background-image", "url('data:image/jpeg;base64," + that.currentEgg + "')");
    }

    /* Will run if camera is shutdown or cancelled */
    this.eggFail = function() {
        alert("Error - please try again");
        maps.init();
    }

    /* When trying to get picture from gallery */
    this.galleryProfile = function() {
            navigator.camera.getPicture(that.profileSuccess, that.profileFail, {
                quality: 50,
                destinationType: this.destinationType.DATA_URL,
                correctOrientation: true,
                targetHeight: 300,
                targetWidth: 300,
                mediaType: this.mediaType.PICTURE,
                sourceType: this.pictureSourceType.SAVEDPHOTOALBUM
            });
        }

    /* When successfully getting image to profile image */
    this.profileSuccess = function(imageData) {
        that.profileImage = imageData;
        $(".picturePreview").css("background-image", "url('data:image/jpeg;base64,"+ imageData + "')");
        if($("#savePicture").is(":hidden")) {
            $("#savePicture").show();
        }
    }

    /* Whill run if camera is shutdown or cancelled */
    this.profileFail = function(message) {
        alert("Sorry, something went wrong. Please try again");
    }

}