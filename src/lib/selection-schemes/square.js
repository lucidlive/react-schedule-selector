const square = (selectionStart: ?Date, selectionEnd: ?Date, dateList: Array<Array<Date>>): Array<Date> => {
  let selected: Array<Date> = []
  if (selectionEnd == null) {
    if (selectionStart) selected = [selectionStart]
  } else if (selectionStart) {
    const dateIsReversed = selectionStart.day > selectionEnd.day;
    const timeIsReversed = selectionStart.position > selectionEnd.position;

    selected = dateList.reduce(
      (acc, dayOfTimes) =>
        acc.concat(
          dayOfTimes.filter(
            t =>
              selectionStart &&
              selectionEnd &&
              t.day >= (dateIsReversed ? selectionEnd.day : selectionStart.day) &&
              t.day <= (dateIsReversed ? selectionStart.day : selectionEnd.day) &&
              t.position >= (timeIsReversed ? selectionEnd.position : selectionStart.position) &&
              t.position <= (timeIsReversed ? selectionStart.position : selectionEnd.position)
          )
        ),
      []
    )
  }

  return selected
}

export default square
