"use strict";

var app = {};
$('#startDate').datepicker({
  dateFormat: 'yy-mm-dd'
});
$('#startTime').timepicker({
  timeFormat: 'HH:mm:ss',
  dropdown: false
});
$('#endDate').datepicker({
  dateFormat: 'yy-mm-dd'
});
$('#endTime').timepicker({
  timeFormat: 'HH:mm:ss',
  dropdown: false
});

app.sleepStart = function () {
  var startDate = $('input[name="startDate"]').val();
  var startTime = $('input[name="startTime"]').val();
  return moment(startDate + ' ' + startTime);
};

app.sleepEnd = function () {
  var endDate = $('input[name="endDate"]').val();
  var endTime = $('input[name="endTime"]').val();
  return moment(endDate + ' ' + endTime);
};

app.duration = function () {
  var duration = moment.duration(app.sleepEnd().diff(app.sleepStart()));
  return duration.asMilliseconds();
};

app.init = function () {
  $('form').on('submit', function (event) {
    event.preventDefault();
    console.log(app.duration());
  });
};

$(function () {
  app.init();
});