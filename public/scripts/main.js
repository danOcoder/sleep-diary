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

app.createMoment = function (input) {
  var date = $("input[name=\"".concat(input, "Date\"]")).val();
  var time = $("input[name=\"".concat(input, "Time\"]")).val();
  return moment(date + ' ' + time);
};

app.duration = function () {
  if (moment(app.createMoment('start')).isBefore(app.createMoment('end'))) {
    var duration = moment.duration(app.createMoment('end').diff(app.createMoment('start')));
    return duration.asMinutes();
  } else {
    swal("Something doesn't look right", 'Please check your entries & try again', 'warning');
  }
};

app.totalAwake = function () {
  var timeToSleep = parseInt($('input[name="timeToSleep"]').val());
  var awakenings = parseInt($('input[name="awakenings"]').val());
  return timeToSleep + awakenings;
};

app.totalAsleep = function () {
  return app.duration() - app.totalAwake();
};

app.calculateEfficiency = function () {
  return Math.floor(app.totalAsleep() / app.duration() * 100);
};

app.convertMinsToHrsMins = function (mins) {
  var hours = Math.floor(mins / 60);
  var minutes = Math.floor(mins % 60);

  if (minutes === 0) {
    return "".concat(hours, "hrs");
  } else {
    return "".concat(hours, "hrs ").concat(minutes, "mins");
  }
};

app.summaryModal = function (value, value2, value3) {
  $('.timeAsleep').html(app.convertMinsToHrsMins(app.totalAsleep()));
  $('.timeInBed').html(app.convertMinsToHrsMins(app.duration()));
  $('.sleepEfficiency').html("".concat(app.calculateEfficiency(), "%"));
  $('.summary').html(app.summaryText(app.calculateEfficiency(), app.totalAsleep(), app.convertMinsToHrsMins(app.totalAsleep())));
  $('.mask').addClass('active');

  if (value < 85) {
    return "A sleep efficiency of less than 85% is considered to be poor, there are many ways to improve this, a great place to start is to review your sleep hygiene.";
  } else if (value > 98) {
    if (value2 < 420) {
      return "A sleep efficiency of ".concat(value, "% is excellent however your ").concat(value3, " of time asleep is less than the recommended 7-8 hours, it can be very beneficial to adopt a routine window for sleep to maximize your time slept.");
    } else {
      return "A sleep efficiency of ".concat(value, "% & ").concat(value3, " of time asleep is excellent, congratulations & keep up the good work!");
    }
  } else {
    if (value2 < 420) {
      return "A sleep efficiency of ".concat(value, "% is optimal however your ").concat(value3, " of time asleep is less than the recommended 7-8 hours, it can be very beneficial to adopt a routine window for sleep to maximize your time slept.");
    } else {
      return "A sleep efficiency of ".concat(value, "% & ").concat(value3, " of time asleep is optimal keep up the good work!");
    }
  }
};

app.closeModal = function () {
  $('.mask').removeClass('active');
  $('input[name="startDate"]').val('');
  $('input[name="startTime"]').val('');
  $('input[name="timeToSleep"]').val('');
  $('input[name="awakenings"]').val('');
  $('input[name="endDate"]').val('');
  $('input[name="endTime"]').val('');
};

app.init = function () {
  $('form').on('submit', function (event) {
    event.preventDefault();
    app.summaryModal();
  });
  $('.close, .mask').on('click', function () {
    app.closeModal();
  });
};

$(function () {
  app.init();
});