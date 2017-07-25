var app = angular.module('myApp', ['ngRoute']);

app.config(['$routeProvider','$locationProvider', function($routeProvider, $locationProvider){
    $routeProvider
        .when('/', {
            templateUrl: './login.html',
            controller: 'loginCntrl'
        })
        .when('/register', {
            templateUrl: './register.html',
            controller: 'regCntrl'
        })
        .when('/home', {
            templateUrl: './home.html',
            controller: 'homeCntrl',
            resolve: {
                message: function(storeService){
                    return storeService.checkValidity();
                }
            }
        })
        .when('/postjob', {
            templateUrl: './postjob.html',
            controller: 'postjobCntrl',
            resolve: {
                message: function(storeService){
                    return storeService.checkValidity();
                }
            }
        })
        .when('/searchjob', {
            templateUrl: './searchjob.html',
            controller: 'searchjobCntrl',
            resolve: {
                message: function(storeService){
                    return storeService.checkValidity();
                }
            }
        });
    //for removing hash
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}]);

app.controller('postjobCntrl',['$scope','$location','$http', function ($scope, $location, $http) {
    var obj = {};
    var temp;
    $scope.reg = function(validity) {
        $scope.submitted = false;
        if (validity) {
            obj.jobtitle = this.jobtitle;
            obj.jobdescription = this.jobdescription;
            obj.keywords = this.keywords;
            obj.location = this.location;
            $http.post('/update', obj);
            $scope.jobtitle = "";
            $scope.jobdescription = "";
            $scope.keywords = "";
            $scope.location = "";
        }
        else
            $scope.submitted = true;
    };

    $scope.back = function () {
        $location.path('/home');
    }
}]);

app.controller('homeCntrl',['$scope','$location','$http', function ($scope, $location, $http) {
    $http.post('/checkUserType').then(function(response){
        $scope.name = response.data.username;
        $scope.name = $scope.name.charAt(0).toUpperCase() + $scope.name.slice(1);
        if(response.data.usertype === "company") {
            $scope.postj = true; $scope.sj = false;
        }
        else{
            $scope.postj = false; $scope.sj = true;
        }
    });

    $scope.prof = function () {
        $location.path('/postjob');
    };

    $scope.searchjob = function () {
        $location.path('/searchjob');
    };

    $scope.logout = function () {
        $http.post('/resetSession');
        $location.path('/');
    };
}]);

app.controller('searchjobCntrl',['$scope','$location','$http', function ($scope, $location, $http) {

    $http.post("/getJobs").then(function (response) {
        $scope.messages = response.data;
    });

    $scope.back = function () {
        $location.path('/home');
    };

    $scope.reset = function () {
        $scope.searchFish.jobtitle = "";
        $scope.searchFish.keywords = "";
        $scope.searchFish.location = "";
    };
}]);

app.controller('loginCntrl',['$scope','$location','$http', function ($scope, $location, $http) {

    $scope.verify = function () {
        var obj = {
            username: $scope.uname,
            password: $scope.password
        };
        $http.post('/login', obj).then(function(response){
            if(response.data.A === "correct") {
                alert('login successfull');
                $location.path('/home');
            } else {
                $scope.alrt = 0;
            }
        });
    };

    $scope.register = function () {
        $location.path('/register');
    };
}]);

app.controller('regCntrl',['$scope','$location','$http', function ($scope, $location, $http) {
    var obj = {};
    var temp;
    $scope.reg = function(validity) {
        $scope.submitted = false;
        if (validity) {
            obj.username = this.username;
            obj.password = this.password;
            obj.email = this.email;
            obj.location = this.location;
            obj.phone = this.phone;
            obj.usertype = this.gender;
            var flag = 0;
            $http.post('/postData', obj).then(function(response){
                if(response.data.A === "no") {
                    alert("user already exists, please change name and email");
                } else {
                    alert("Registration Successful!!! Please login");
                    $location.path('/');
                }
            });
        }
    }}]);

app.factory('storeService',['$q','$http', function($q, $http){
    var store = {
        checkValidity: function(){
            var defer = $q.defer();
            $http.post('/checkLogin').then(function (response) {
                if(response.data.isLogin === "yes")
                    defer.resolve();
                else
                    defer.reject();
            });
            return defer.promise;
        }
    };
    return store;
}]);