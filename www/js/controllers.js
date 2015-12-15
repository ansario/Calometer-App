angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $cordovaCamera, $cordovaFile, $cordovaFileTransfer, $ionicLoading) {


  $scope.upload = function() {


        var options = {
            fileKey: "avatar",
            fileName: "image.png",
            chunkedMode: false,
            mimeType: "image/png"
        };


        // 1
        $scope.images = [];

        $scope.upload = function() {
            // 2
            var options = {
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.CAMERA, // Camera.PictureSourceType.PHOTOLIBRARY
                allowEdit: false,
                encodingType: Camera.EncodingType.JPEG,
                popoverOptions: CameraPopoverOptions,
            };

            // 3
            $cordovaCamera.getPicture(options).then(function(imageData) {

                // 4
                $ionicLoading.show({
                  template: '<ion-spinner></ion-spinner><br /><br /><p>Syncronising...</p>'
                });
                onImageSuccess(imageData);

                function onImageSuccess(fileURI) {
                    createFileEntry(fileURI);
                }

                function createFileEntry(fileURI) {
                    window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
                }

                // 5
                function copyFile(fileEntry) {
                    var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
                    var newName = makeid() + name;

                    window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fileSystem2) {
                            fileEntry.copyTo(
                                fileSystem2,
                                newName,
                                onCopySuccess,
                                fail
                            );
                        },
                        fail);
                }

                // 6
                function onCopySuccess(entry) {
                    $scope.$apply(function() {
                      $cordovaFileTransfer.upload("http://192.168.0.2:8000/decode/", entry.nativeURL, options).then(function(result) {
                          $ionicLoading.hide();
                      }, function(err) {
                          console.log("ERROR: " + JSON.stringify(err));
                      }, function (progress) {
                          // constant progress updates
                      });
                        // $scope.images.push(entry.nativeURL);
                    });
                }

                function fail(error) {
                    console.log("fail: " + error.code);
                }

                function makeid() {
                    var text = "";
                    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                    for (var i = 0; i < 5; i++) {
                        text += possible.charAt(Math.floor(Math.random() * possible.length));
                    }
                    return text;
                }

            }, function(err) {
                console.log(err);
            });
        }

    }




    $scope.urlForImage = function(imageName) {
        var name = imageName.substr(imageName.lastIndexOf('/') + 1);
        var trueOrigin = cordova.file.dataDirectory + name;
        return trueOrigin;
    }

})

.controller('ChatsCtrl', function($scope, Chats) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.chats = Chats.all();
    $scope.remove = function(chat) {
        Chats.remove(chat);
    };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
    $scope.settings = {
        enableFriends: true
    };
});
