'use strict'

angular.module '<%= scriptAppName %>'
.controller 'SignupCtrl', ($scope, Auth, $location<% if(filters.oauth) {%>, $window<% } %>) ->
  $scope.user = {}
  $scope.errors = {}
  $scope.register = (form) ->
    $scope.submitted = true

    if form.$valid
      # Account created, redirect to home
      Auth.createUser
        name: $scope.user.name
        email: $scope.user.email
        password: $scope.user.password

      .then ->
        $location.path '/'

      .catch (err) ->
        err = err.data
        $scope.errors = {}

        # Update validity of form fields that match the sql errors
        angular.forEach err.errors, (error, field) ->
          form[field].$setValidity 'sql', false
          $scope.errors[field] = error.message
<% if(filters.oauth) {%>
  $scope.loginOauth = (provider) ->
    $window.location.href = '/auth/' + provider<% } %>
