function newDefaultDate() {
    taskDateRef = document.getElementById('task-date');
    taskTimeRef = document.getElementById('task-time');

    let dateObject = new Date();
    let dateString = '';
    let timeString = '';
    let dispTmr, dispYear, dispYearString, dispMonth, dispMonthString, dispDate, dispDateString;

    // Time: 6 Hours in the future:
    displayHour = dateObject.getHours() + 7;
    if (displayHour > 24) {
        displayHour = displayHour - 24;
        dispTmr = true;
    }
    timeString = digitCheck(displayHour);
    timeString += displayHour + ':00';
    taskTimeRef.value = timeString;

    // Date
    dispDate = dateObject.getDate();
    if (dispTmr) {
        dispDate += 1;
    }
    dispDateString = digitCheck(dispDate);
    dispMonth = dateObject.getMonth() + 1;
    dispMonthString = digitCheck(dispMonth);
    dispYear = dateObject.getFullYear();
    if (isLastDay(dateObject) && dispTmr) {
        dispMonth += 1;
        if (isLastMonth(dateObject)) {
            dispYear += 1;
        }
    }
    dispYearString = dispYear.toString();
    dateString = dispYearString + '-' + dispMonthString + dispMonth.toString() + '-' + dispDateString + dispDate.toString();
    taskDateRef.value = dateString;

    function digitCheck(checkNumber) {
        if (checkNumber < 10) {
            checkString = "0";
        }
        else {
            checkString = "";
        }
        return checkString;
    }
    // Check if last day month;
    function isLastDay(dt) {
        var test = new Date(dt.getTime()),
            month = test.getMonth();
        test.setDate(test.getDate() + 1);
        return test.getMonth() !== month;
    }
    function isLastMonth(dt) {
        if ((dt.getMonth() + 1) == 12) {
            return true;
        }
        return false;
    }
}

newDefaultDate();
console.log('yeet');