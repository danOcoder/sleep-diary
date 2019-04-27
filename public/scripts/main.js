"use strict";

var app = {}; // initialize datepicker & timepicker

$('#startDate, #endDate').datepicker({
  dateFormat: 'yy-mm-dd'
}).attr('readonly', 'readonly');
$('#startTime, #endTime').timepicker({
  timeFormat: 'HH:mm:ss',
  dropdown: false
}); // use regex to ensure time entry is formatted correctly then convert values from date & time inputs into a Date object using moment.js method, finally return duration in bed as minutes using moment.js methods isBefore, duration & asMinutes

app.duration = function () {
  var timeFormat = RegExp(/(?:[01]\d|2[0123]):(?:[012345]\d):(?:[012345]\d)/);
  var startDate = $("input[name=\"startDate\"]").val();
  var startTime = $("input[name=\"startTime\"]").val();
  var endDate = $("input[name=\"endDate\"]").val();
  var endTime = $("input[name=\"endTime\"]").val();

  if (timeFormat.test(startTime) && timeFormat.test(endTime)) {
    var sleepStart = moment("".concat(startDate, " ").concat(startTime));
    var sleepEnd = moment("".concat(endDate, " ").concat(endTime));

    if (moment(sleepStart).isBefore(sleepEnd)) {
      var duration = moment.duration(sleepEnd.diff(sleepStart));
      return duration.asMinutes();
    } else {
      app.errorMessage('Sleep start cannot occur before sleep end');
    }
  } else {
    app.errorMessage('Invalid time - time can be entered in any of these formats 10pm, 6.15am, 23:15 etc');
  }
}; // calculate total time asleep


app.totalAsleep = function () {
  var timeToSleep = parseInt($('input[name="timeToSleep"]').val());
  var awakenings = parseInt($('input[name="awakenings"]').val());
  var totalAwake = timeToSleep + awakenings;
  return app.duration() - totalAwake;
}; // calculate sleep efficiency %


app.calculateEfficiency = function () {
  return Math.floor(app.totalAsleep() / app.duration() * 100);
}; // convert minutes into hours & minutes & return as string for use in summary


app.convertMinsToHrsMins = function (mins) {
  var hours = Math.floor(mins / 60);
  var minutes = Math.floor(mins % 60);

  if (minutes === 0) {
    return "".concat(hours, "hrs");
  } else {
    return "".concat(hours, "hrs ").concat(minutes, "mins");
  }
}; // add class of active to modal to open & display values calculated


app.summaryModal = function (value, value2, value3) {
  var summaryText;

  if (value < 85) {
    summaryText = "A sleep efficiency of less than 85% is considered to be poor, there are many ways to improve this, a great place to start is to review your sleep hygiene.";
  } else if (value > 98) {
    if (value2 < 420) {
      summaryText = "A sleep efficiency of ".concat(value, "% is excellent however ").concat(value3, " of sleep is less than the recommended 7-8 hours, it can be very beneficial to adopt a routine window for sleep to maximize your time asleep.");
    } else {
      summaryText = "A sleep efficiency of ".concat(value, "% & ").concat(value3, " of sleep is excellent, congratulations & keep up the good work!");
    }
  } else {
    if (value2 < 420) {
      summaryText = "A sleep efficiency of ".concat(value, "% is optimal however your ").concat(value3, " of sleep is less than the recommended 7-8 hours, it can be very beneficial to adopt a routine window for sleep to maximize your time asleep.");
    } else {
      summaryText = "A sleep efficiency of ".concat(value, "% & ").concat(value3, " of sleep is optimal keep up the good work!");
    }
  }

  $('.timeInBed').html(app.convertMinsToHrsMins(app.duration()));
  $('.timeAsleep').html(app.convertMinsToHrsMins(app.totalAsleep()));
  $('.sleepEfficiency').html("".concat(app.calculateEfficiency(), "%"));
  $('.summary').html(summaryText);
  $('.mask').addClass('active');
}; // closes modal & clears inputs


app.closeModal = function () {
  $('.mask').removeClass('active');
  $('input[name="startDate"]').val('');
  $('input[name="startTime"]').val('');
  $('input[name="timeToSleep"]').val('');
  $('input[name="awakenings"]').val('');
  $('input[name="endDate"]').val('');
  $('input[name="endTime"]').val('');
}; // adds text to warning modal


app.errorMessage = function (text) {
  swal({
    text: text,
    icon: 'warning',
    button: {
      className: 'closeModal'
    }
  });
}; // initializes event listeners for form submission, smooth scroll & modal close


app.init = function () {
  $('.chevron').on('click', function () {
    $('html, body').animate({
      scrollTop: $('form').offset().top
    }, 1000);
  });
  $('form').on('submit', function (event) {
    event.preventDefault();

    if (!isNaN(app.calculateEfficiency())) {
      app.summaryModal(app.calculateEfficiency(), app.totalAsleep(), app.convertMinsToHrsMins(app.totalAsleep()));
    }
  });
  $('.closeModal, .mask').on('click', function () {
    app.closeModal();
  });
}; // blast off!


$(function () {
  app.init();
});