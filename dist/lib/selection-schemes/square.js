"use strict";

exports.__esModule = true;
var square = function square(selectionStart, selectionEnd, dateList) {
  var selected = [];
  if (selectionEnd == null) {
    if (selectionStart) selected = [selectionStart];
  } else if (selectionStart) {
    var dateIsReversed = selectionStart.day > selectionEnd.day;
    var timeIsReversed = selectionStart.position > selectionEnd.position;

    selected = dateList.reduce(function (acc, dayOfTimes) {
      return acc.concat(dayOfTimes.filter(function (t) {
        return selectionStart && selectionEnd && t.day >= (dateIsReversed ? selectionEnd.day : selectionStart.day) && t.day <= (dateIsReversed ? selectionStart.day : selectionEnd.day) && t.position >= (timeIsReversed ? selectionEnd.position : selectionStart.position) && t.position <= (timeIsReversed ? selectionStart.position : selectionEnd.position);
      }));
    }, []);
  }

  return selected;
};

exports.default = square;