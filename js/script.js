function newDefaultDate() {
    taskDateRef = document.getElementById('task-date');
    taskTimeRef = document.getElementById('task-time');

    let dateObject = new Date();
    let dateString = '';
    let timeString = '';
    let dispTmr, dispYear, dispYearString, dispMonth, dispMonthString, dispDate, dispDateString;

    // Time: 6 Hours in the future:
    displayHour = dateObject.getHours() + 7;
    if (displayHour > 23) {
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

// Initialize Page with Default Date/Time Values Whenever New Task Needs to be added.
let newItemButtonRef = document.getElementById('newItemButton');
newItemButtonRef.addEventListener('click', newDefaultDate);

document.getElementById('newListField').onkeypress = function (myEvent) {
    listSectionRef = document.getElementById('listSection');
    if (event.which == 13 || event.keyCode == 13) {
        if (document.getElementById('secondDropDivider') == null) {
            newDivider = document.createElement('div');
            newDivider.classList.add('dropdown-divider');
            newDivider.setAttribute('id', 'secondDropDivider');
            document.getElementById('listSection').appendChild(newDivider);
        }
        let newListName = document.getElementById('newListField').value;
        let newListItem = document.createElement('a');
        newListItem.innerHTML = newListName;
        newListItem.classList.add('dropdown-item')
        newListItem.href = '#';
        listSectionRef.appendChild(newListItem);
        document.getElementById('newListField').value = "";
    }
};