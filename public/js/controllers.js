'use strict';

/* Controllers */

var RootCtrl = function(sector){
  return function($rootScope, $routeParams, $http) {
    $rootScope.currentSector = sector;
    $rootScope.current_lga = $routeParams.lgaid;
    $rootScope.$on('currentNMIS', function(evt, fac){
      $rootScope.currentNMIS = fac;
    });
    $rootScope.localMatch=[];
    $rootScope.$on('local_pair', function(evt,pair){
      $rootScope.localMatch.push(pair[0]);
      $rootScope.localMatch.push(pair[1]);
    });
    console.log($rootScope.localMatch);
    $rootScope.$on('matching_request', function(evt, fac){
      if ($rootScope.currentNMIS !== undefined &&
        fac !== undefined) {
          var nmis = $rootScope.currentNMIS;
          if(nmis.matched || fac.matched ||
            $rootScope.localMatch.indexOf(nmis['_id']) != -1 ||
            $rootScope.localMatch.indexOf(fac['_id']) != -1){
              alert("either facility exist in a pair already");
          }else{
            var pair = {'lga':fac, 'nmis':nmis};
            var promise = $http.post(
              '/api/matching/' + sector + '/create', pair
            );
            promise.success(function(b){
              var message = b.message;
              if(message == 'affirmative') { 
                $rootScope.localMatch.push(b.data['_id']);
                $rootScope.localMatch.push(b.data['matched']);
                $rootScope.$broadcast('pair_confirmed', b.data);
              }else if(message == 'duplicate') {
                alert('this pairing exists in database, please double check');
              }else{
                alert('database error');
              }
            });
          }
        }
    });
	$rootScope.$on('set_lga_name', function(evt, lgaName){
		$rootScope.current_lga_name = lgaName;
	});
  };
};

var NMISCtrl = function($scope, $http, $rootScope) {
  //var file = "../docs/Aba_North_NMIS_List.csv";
  var lga_id = $rootScope.current_lga;
  var sector = $rootScope.currentSector;
  
  $http.get('/api/facilities/nmis/'+lga_id+'/'+sector)
  //$http.get(file)
    .success(function(data, status, headers, config){
      //$scope.facilities = csv(data).toObjects();
      $scope.facilities = data;
      var facilities_len = $scope.facilities.length;
      $scope.predicate = 'facility_name';
      $scope.radioModel = 'Name';
      $scope.select = function(fac) {
        $scope.$emit('currentNMIS', fac);
        $scope.facilities.forEach(function(f) {
            f.active = (f._id == fac._id) ? 'active' : '';
        });
        $scope.selectedIndex = $scope.facilities.indexOf(fac.id);
      };
      $scope.sortby = function(key) {
        $scope.facilities = _.sortBy($scope.facilities, 
                function(fac){ return fac[key].toLowerCase();});
      };
    })
    .error(function(data, status, headers, config){
      alert("data  is not valid please check!");
    });
};

var LGACtrl = function($scope, $http, $rootScope) {
  //var file = "../docs/Aba_North_Health_Facility_List.csv";
  var lga_id = $rootScope.current_lga;
  var sector = $rootScope.currentSector;
  
  $http.get('/api/facilities/lga/'+lga_id+'/'+sector)
  //$http.get(file)
    .success(function(data, status, headers, config){
      //$scope.facilities = csv(data).toObjects();
      $scope.facilities = data;
      //$scope.facilities.forEach(function(item, i){item.index=i});
      if (data && data.length > 0) $scope.$emit('set_lga_name', data[0].mylga);
      $scope.match = function(fac){
        $scope.$emit('matching_request', fac);
      };

    })
    .error(function(data, status, headers, config){
      alert("data  is not valid please check!");
    });

};
  
var PairedListCtrl = function($scope, $rootScope, $http) {

  var lga_id = $rootScope.current_lga;
  var sector = $rootScope.currentSector;
  
  $http.get('/api/facilities/lga/'+lga_id+'/health')
    .success(function(data, status, headers, config){
      $scope.pairs = [];
      for(var i =0; i<data.length; i++){
        if (data[i]['matched']!=undefined) {
          $scope.$emit('local_pair',[data[i]['_id'],data[i]['matched']]);
          $scope.pairs.push(data[i]);
        }
      }
      $scope.$on('pair_confirmed', function(evt, fac){
        console.log($rootScope.localMatch);
        $scope.pairs.unshift(fac);
      });
    })
    .error(function(data, status, headers, config){
      alert('data is not valid file format, please check!');
    });

  $scope.removePair = function(pair){
    $rootScope.localMatch.remove(pair['_id']);
    $rootScope.localMatch.remove(pair['matched']);
    console.log($rootScope.localMatch);
    var promise = $http.post('/api/matching/' + sector + '/delete', pair);
    promise.success(function(b){
      if (b.message == 'affirmative'){
        $scope.pairs.remove(pair);
      }else{
        alert(b.message);
      }
    });
    promise.error(function(e){
      alert(e);
    });
  };
};

