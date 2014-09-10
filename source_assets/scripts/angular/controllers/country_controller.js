(function(){
  var app = angular.module('countryApp', [], function($interpolateProvider) {
    $interpolateProvider.startSymbol('//');
    $interpolateProvider.endSymbol('//');
  });

  app.controller('CountryListController', ['$http', function($http) {
    _self = this;
    // Data
    this.countries = [];

    // Sort related.
    this.sortField = 'score';
    this.sortReverse = true;

    // Helper function.
    var getRequestUrl = function(regionId) {
      regionId = regionId || null;

      if (regionId == null) {
        return CS.domain + '/' + CS.lang + '/api/countries.json';
      }
      else {
        return CS.domain + '/' + CS.lang + '/api/regions/' + regionId + '.json';
      }
    };

    // Helper function used in html.
    this.setSort = function(field) {
      _self.sortField = field;
      _self.sortReverse = !_self.sortReverse;
    };
    
    this.checkSortClasses = function(field) {
      if (_self.sortField != field) {
        return 'sort-none';
      }
      if (_self.sortReverse === true) {
        return 'sort-desc';
      }
      else {
        return 'sort-asc';
      }
    };

    this.calcBarSegment = function(param) {
      weight = param.weight != null ? param.weight : 0.25; 
      return ( param.value * weight * (100/5) ) + '%';
    };

    this.getCountryUrl = function(country) {
      if (CS.countryIndex) {
        var iso = country.iso.toLowerCase();
        return CS.countryIndex[iso];
      }
      else {
        return '';
      }
    };

    this.toggleStates = function($event) {
      var tbody = jQuery($event.target).closest('tbody');
      var statesRow = tbody.find('.country-states');
      if (statesRow.is(':hidden')) {
        tbody.addClass('open');
        statesRow.trSlideDown();
      }
      else {
        tbody.removeClass('open');
        statesRow.trSlideUp();
      }
    };

    // ---- Logic ----

    if (CS.regionId) {
      $http.get(getRequestUrl(CS.regionId)).success(function(data) {
        _self.countries = data.countries;
      });
    }
    else {
      $http.get(getRequestUrl()).success(function(data) {
        _self.countries = data;
      });
    }

  }]);
})();
