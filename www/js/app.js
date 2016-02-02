// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
function TodoController ($scope, $location,$http) {
  $scope.check_login = function() {
    $http.get('http://railsa.mybluemix.net/api/v1/check_auth').success(function(response){
      console.log("Token"+response.success);
      if (response.success === true) {
        $location.path("/Meeting");
      } else {
        $location.path("/");
      }
    });
  };
}

function DetailController ($scope, ApiService,$http) {
  $scope.detail = function () {
    var id = ApiService.getID();
    $http.post('http://railsa.mybluemix.net/api/v1/meeting_list/' + id).success(function (response) {
      $scope.proceduce = response.data;
    });
  };
}

function MeetingController ($scope, $http,$location, ApiService) {
  $scope.init = function () {
    $http.post('http://railsa.mybluemix.net/api/v1/meeting_list').success(function(response){
      console.log("Meeting status" + response.status);
      console.log("Here is user"+response.user);
      $scope.current_user = response.user;
      $scope.list = response.data;
    });
  };

  $scope.getDetail = function (meeting_id) {
    ApiService.setID(meeting_id);
    $location.path("/Detail");
  };

  $scope.logOut = function () {
    $http.post('http://railsa.mybluemix.net/api/v1/sign_out').success(function(response){
      console.log(response.info);
      console.log("signout status"+response.success);
      if (response.success === true) {
        $location.path("/");
      }
    });
  }
}

function LoginController ($scope, $http, $location,$cordovaSQLite) {
  $scope.data = {};
  $scope.login = function() {
    var name = $scope.data.name;
    var pass = $scope.data.password;
    $http({
      method: 'POST',
      url: 'http://railsa.mybluemix.net/api/v1/sessions',
      data: {loginId: name,passWord: pass},
      headers: {
        'Content-type': 'application/json'
      }
    }).success(function(response){
      console.log("Login status" + response.data.user);
      console.log("Login status" + response.data.auth_token);
      $location.path("/Meeting");
    });

  };

  $scope.create = function() {
    var a = "tony stark";
    var b = "holla hop";
    var query = "INSERT INTO people (firstname, lastname) VALUES (?,?)";
    $cordovaSQLite.execute(db, query, [a, b]).then(function(res) {
      console.log("INSERT ID -> " + res.insertId);
    }, function (err) {
      console.error(err);
    });
  }

  $scope.check = function() {
    var query = "SELECT *  FROM user";
    $cordovaSQLite.execute(db, query).then(function(res) {
      if(res.rows.length > 0) {
        console.log("ALL we have" + res.rows.item(0).firstname);
      } else {
        console.log("No results found");
      }
    }, function (err) {
      angular.forEach(err, function(value, key) {
        console.log("0112"+ key);
        console.log("1123"+ value);
      });
    });
  }
}

function ApiService() {
  var id;
    this.getID =  function () {
      return id;
    };
    this.setID = function(value) {
      id = value;
    };
}
function route($stateProvider, $urlRouterProvider, $httpProvider) {
  //$httpProvider.defaults.headers.common['X-CSRF-Token'] = "%2FXDcwrhoG1iQ7BOIzZwuUAJW1dwMyuKcHQwV3%2BInhDo%3D";
  $urlRouterProvider.otherwise('/')

  $stateProvider
      .state('meeting', {
        url: '/Meeting',
        templateUrl: 'listmeeting.html',
        controller: 'MeetingCtrl'
      })
      .state('detail', {
        url: '/Detail',
        templateUrl: 'templates/meeting/detail.html',
        controller: 'DetailCtrl'
      })
      .state('home', {
        url: '/',
        templateUrl: 'home.html',
        controller: 'LoginCtrl'
      })

}
//http://railsa.mybluemix.net/api/v1/hanlder
var db = null;
angular.module('starter', ['ionic', 'ngCordova'])
  .service('ApiService', ApiService)
  .controller('TodoCtrl', TodoController)
  .controller('LoginCtrl', LoginController)
  .controller('MeetingCtrl', MeetingController)
  .controller('DetailCtrl',DetailController)
  .run(function($ionicPlatform, $cordovaSQLite) {
    $ionicPlatform.ready(function() {
      if(window.cordova && window.cordova.plugins.Keyboard) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

        // Don't remove this line unless you know what you are doing. It stops the viewport
        // from snapping when text inputs are focused. Ionic handles this internally for
        // a much nicer keyboard experience.
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if(window.StatusBar) {
        StatusBar.styleDefault();
      }
      db = $cordovaSQLite.openDB({ name: "my.db" });
      $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS people (id integer primary key, firstname text, lastname text)");
    });
  }).config(route);
