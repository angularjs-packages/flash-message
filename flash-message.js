angular.module('flashMessage', [])
  .factory('flashMessage', ['$rootScope', '$timeout', 
    function($rootScope, $timeout) {
      var levels = ['success', 'warning', 'error', 'info'];
      var messages = {};
      var classNames = {};
      var flashMessageData = {
        success: {
          icon: 'ok-circle'
        },
        warning: {
          icon: 'exclamation-sign'
        },
        error: {
          icon: 'remove-circle'
        },
        info: {
          icon: 'info-sign'
        }
      };
      var reset;
      var index = 1;
      var cleanup = function(level) {
        $timeout.cancel(reset);
        reset = $timeout(function() {
          messages[level] = [];
        });
      };      
      var callEmit = function() {
        $rootScope.$emit('flash-message', messages, cleanup);
      };

      $rootScope.$on('$locationChangeSuccess', callEmit);

      flashMessageFunction  = function(message, level, seconds, done) {
        messages[level].push({
          message: message,
          seconds: seconds,
          level: level,
          icon: flashMessageData[level].icon,
          index: index++,
          className: classNames[level],
          callback: done
        })
        callEmit();
      };

      var flashMessage = {};
      angular.forEach(levels, function(level) {
        messages[level] = [];
        classNames[level] = level;
        if(level === 'error') classNames[level] = 'danger';
        flashMessage[level] = function(option) {
          flashMessageFunction(
            option.message || '', 
            level, 
            option.seconds || 2,
            option.callback || undefined
          );
        }
      });

      return flashMessage;
    }
  ])
  .directive('flashMessage', function() {
    return {
      restrict: 'A',
      replace: true,
      templateUrl: 'bower_components/flash-message/flash-message.tpl.html',
      link: function($scope) {
        $scope.messages = [];
      },
      controller: [ '$scope', '$rootScope', '$timeout',
        function($scope, $rootScope, $timeout) {
          var levels = ['success', 'warning', 'error', 'info'];
          $scope.closeFlashMessage = function(index) {
            var done = _.find($scope.messages, {index: index}).callback;
            if(done) {
              done();
            }
            $scope.messages = _.reject($scope.messages, {index: index});
            angular.element('#flashMessage-' + index).fadeOut('normal', function() {
              this.remove();
            });
          }

          $rootScope.$on('flash-message', function(self, messages, done) {
            angular.forEach(levels, function(level) {
              if (messages[level].length) {
                angular.forEach(messages[level], function(message) {
                  $scope.messages.push(message);
                  if (message.seconds === 0) return;
                  $timeout(
                    function() {
                      var cb = _.find($scope.messages, {index: message.index}).callback;
                      if (cb) {
                        cb();
                      }
                      $scope.messages = _.reject($scope.messages, {index: message.index});
                      angular.element('#flashMessage-' + message.index).fadeOut('normal', function() {
                        this.remove();
                      });
                    },
                    message.seconds * 1000
                  );
                });
                done(level);
              };
            });
          })
        }
      ]
    }
  });