angular.module('app')
  .controller('AdminEventsCtrl', [
    '$scope',
    '$sce',
    'EventsService',
    'Utils',
    function ($scope, $sce, EventsService, Utils) {
      $scope.selectedEvent = null;
      $scope.formatTime = timeStr => {
        return Utils.formatTime(Date.parse(timeStr), true);
      };

      EventsService
        .getEvents()
        .success((events) => {
        // console.log(events);
          $scope.events = events;
          $scope.loading = false;
        });

      EventsService
        .getTypes()
        .success((types) => {
          $scope.types = types;
        });

      $scope.addEvent = function () {
      // Clean the dates and turn them to ms.
        const name = $scope.create.name;
        const open = $scope.create.open;
        const type = $scope.create.eventType;

        if (!name) {
          return swal('Oops...', 'You need a name for this event, pal', 'error');
        }

        EventsService
          .addEvent(name, open, type)
          .success((event) => {
            $scope.events.push(event);
            swal('Looks good!', 'Added Event', 'success');
          });
      };

      $scope.selectEvent = function (event) {
      // console.log(event);
        $scope.selectedEvent = event;

        EventsService
          .getAttendees(event._id)
          .success((event) => {
          // console.log(event);
            $scope.users = event.attendees;
          });
      };

      $scope.toggleOpen = function ($e, event, index) {
        $e.stopPropagation();

        EventsService
          .toggleOpen(event)
          .success((result) => {
            console.log(result);
            event.open = !event.open;
          });
      };
    }]);
