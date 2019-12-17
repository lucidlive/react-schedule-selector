const square = (selectionStart: ?Date, selectionEnd: ?Date, dateList: Array<Array<Date>>): Array<Date> => {
  let selected: Array<Date> = []
  if (selectionEnd == null) {
    if (selectionStart) selected = [selectionStart]
  } else if (selectionStart) {
    const dateIsReversed = selectionStart.day > selectionEnd.day;
    const timeIsReversed = selectionStart.hour > selectionEnd.hour;

    selected = dateList.reduce(
      (acc, dayOfTimes) =>
        acc.concat(
          dayOfTimes.filter(
            t =>
              selectionStart &&
              selectionEnd &&
              t.day >= (dateIsReversed ? selectionEnd.day : selectionStart.day) &&
              t.day <= (dateIsReversed ? selectionStart.day : selectionEnd.day) &&
              t.hour >= (timeIsReversed ? selectionEnd.hour : selectionStart.hour) &&
              t.hour <= (timeIsReversed ? selectionStart.hour : selectionEnd.hour)
          )
        ),
      []
    )
  }

  return selected
}

export default square
