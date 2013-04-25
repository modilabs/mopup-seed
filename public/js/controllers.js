'use strict';

/* Controllers */

function AppCtrl($scope, $http) {
  $http({method: 'GET', url: '/api/name'}).
  success(function(data, status, headers, config) {
    $scope.name = data.name;
  }).
  error(function(data, status, headers, config) {
    $scope.name = 'Error!';
  });
}

function MyCtrl1() {}
MyCtrl1.$inject = [];


function MyCtrl2() {
}
MyCtrl2.$inject = [];


var RootCtrl = function($rootScope, $routeParams) {
  $rootScope.current_lga = $routeParams.lgaid;
  $rootScope.$on('currentFacility', function(evt, fac){
    $rootScope.currentFacility = fac;
  });
  $rootScope.$on('matching_request', function(evt, fac){
    if ($rootScope.currentFacility !== undefined &&
      fac !== undefined) {
        $rootScope.$broadcast('pair_confirmed', 
          [$rootScope.currentFacility, fac]);
      }
  });
  $rootScope.$on('rejecting_request', function(evt, fac){
    if (true) {
        $rootScope.$broadcast('reject_confirmed', fac);
      }
  });
};

var LGAHealthCtrl = function($scope, $http, $rootScope) {
  //var file = "../docs/Aba_North_Health_Facility_List.csv";
  var lga_id = $rootScope.current_lga;
  
  $http.get('/api/facilities/lga/'+lga_id+'/health')
    .success(function(data, status, headers, config){
      //$scope.facilities = csv(data).toObjects();
      $scope.facilities = data;
//_.each($scope.facilities, function(item, i){item.index=i});
      $scope.index = 0;
      $scope.facility = $scope.facilities[$scope.index];
      
      //looping selector
      $scope._changeI = function(delta){
        var newI = $scope.index + delta;
        if(newI >= $scope.facilities.length) {
          newI = 0;
        } else if(newI <= 0) {
          newI = $scope.facilities.length - 1;
        }
        $scope.index = newI;
        $scope.facility = $scope.facilities[newI];
        $scope.$emit("currentFacility", $scope.facility);
      };
      $scope.$emit("currentFacility", $scope.facility);
      $scope.next = function(){
        $scope._changeI(1);
      };
      $scope.previous = function(){
        $scope._changeI(-1);
      };
    })
    .error(function(data, status, headers, config){
      alert("data  is not valid please check!");
    });

};
  

var LGAEduCtrl = function($scope, $http, $rootScope) {
  //var file = "../docs/Aba_North_Health_Facility_List.csv";
  var lga_id = $rootScope.current_lga;
  
  $http.get('/api/facilities/lga/'+lga_id+'/edu')
    .success(function(data, status, headers, config){
      //$scope.facilities = csv(data).toObjects();
      $scope.facilities = data;
//_.each($scope.facilities, function(item, i){item.index=i});
      $scope.index = 0;
      $scope.facility = $scope.facilities[$scope.index];
      
      //looping selector
      $scope._changeI = function(delta){
        var newI = $scope.index + delta;
        if(newI >= $scope.facilities.length) {
          newI = 0;
        } else if(newI <= 0) {
          newI = $scope.facilities.length - 1;
        }
        $scope.index = newI;
        $scope.facility = $scope.facilities[newI];
        $scope.$emit("currentFacility", $scope.facility);
      };
      $scope.$emit("currentFacility", $scope.facility);
      $scope.next = function(){
        $scope._changeI(1);
      };
      $scope.previous = function(){
        $scope._changeI(-1);
      };
    })
    .error(function(data, status, headers, config){
      alert("data  is not valid please check!");
    });

};
var NMISHealthCtrl = function($scope, $http, $rootScope) {
  //var file = "../docs/Aba_North_NMIS_List.csv";
  //$http.get(file)
  var lga_id = $rootScope.current_lga;
  
  $http.get('/api/facilities/nmis/'+lga_id+'/health')
    .success(function(data, status, headers, config){
      //$scope.facilities = csv(data).toObjects();
      $scope.facilities = data;
      var facilities_len = $scope.facilities.length;
      $scope.predicate = 'facility_name';
      $scope.radioModel = 'Name';
      $scope.sortby = function(key) {
        $scope.facilities = _.sortBy($scope.facilities, 
                function(fac){ return fac[key].toLowerCase();});
      };
      $scope.match = function(fac){
        $scope.$emit('matching_request', fac);
      };
      $scope.fail = function(fac){
        $scope.$emit('rejecting_request', fac);
      };
    })
    .error(function(data, status, headers, config){
      alert("data  is not valid please check!");
    });
};

var NMISEduCtrl = function($scope, $http, $rootScope) {
  //var file = "../docs/Aba_North_NMIS_List.csv";
  //$http.get(file)
  var lga_id = $rootScope.current_lga;
  $http.get('/api/facilities/nmis/'+ lga_id +'/edu')
    .success(function(data, status, headers, config){
      //$scope.facilities = csv(data).toObjects();
      $scope.facilities = data;
      var facilities_len = $scope.facilities.length;
      $scope.predicate = 'facility_name';
      $scope.radioModel = 'Name';
      $scope.sortby = function(key) {
        $scope.facilities = _.sortBy($scope.facilities, 
                function(fac){ return fac[key].toLowerCase();});
      };
      $scope.match = function(fac){
        $scope.$emit('matching_request', fac);
      };
      $scope.fail = function(fac){
        $scope.$emit('rejecting_request', fac);
      };
    })
    .error(function(data, status, headers, config){
      alert("data  is not valid please check!");
    });
};
var PairedListCtrl = function($scope, $rootScope, $http) {
	var file = '../docs/paired_list.json';
  $http.get(file)
    .success(function(data, status, headers, config){
      if (data.length === 0){
        $scope.pairs = [];
      }else{
        $scope.pairs = JSON.parse(data);
      }
      $scope.$on('pair_confirmed', function(evt, fac){
        //pushing to the front using unshift
        $scope.pairs.unshift(fac);
      });
    })
    .error(function(data, status, headers, config){
      alert(file + ' is not valid file format, please check!');
    });
};

var RejectedListCtrl = function($scope, $rootScope, $http) {
  var file = "../docs/rejected_list.json";
  $scope.oneAtATime = true;
  $http.get(file)
    .success(function(data, status, headers, config){
      if (data.length === 0){
        $scope.rejects = [];
      }else{
        $scope.rejects = JSON.parse(data);
      }
      $scope.$on("reject_confirmed", function(evt, fac){
        //pushing to the front using unshift
        $scope.rejects.unshift(fac);
      });
    })
    .error(function(data, status, headers, config){
      alert(file + " is not valid file format, please check!");
    });
};
