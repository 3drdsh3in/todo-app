window.onload = function () {
    // Initialize list section:
    if (!localStorage.getItem('nameLists') == false) {
        // @precondition: Local Storage Exists, there are list names stored in local storage:
        addListDivider();
        nameList = JSON.parse(localStorage.getItem('nameLists'));
        for (i = 0; i < nameList.length; i++) {
            let currentName = nameList[i];
            addListDOM(currentName);
        }
    }
    initializeIcon();

    let dropDownRef = document.getElementById('navbarDropdown');
    dropDownRef.addEventListener('click', function clickDropDownMenu() {
        let dropDownMenuRef = document.querySelector('.dropdown-menu');
        if ((dropDownMenuRef.classList.value).includes('show')) {
            dropDownMenuRef.classList.remove('show');
        }
        else {
            dropDownMenuRef.classList.add('show');
        }
    });
}

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
    // Check if last day month.
    function isLastDay(dt) {
        var test = new Date(dt.getTime()),
            month = test.getMonth();
        test.setDate(test.getDate() + 1);
        return test.getMonth() !== month;
    }
    // Only used to check if last day of year.
    function isLastMonth(dt) {
        if ((dt.getMonth() + 1) == 12) {
            return true;
        }
        return false;
    }
}

function addListDivider() {
    newDivider = document.createElement('div');
    newDivider.classList.add('dropdown-divider');
    newDivider.setAttribute('id', 'secondDropDivider');
    document.getElementById('listSection').appendChild(newDivider);
}
function addListDOM(listName) {
    listSectionRef = document.getElementById('listSection');
    let newListItem = document.createElement('a');
    newListItem.innerHTML = listName;
    newListItem.classList.add('dropdown-item');
    newListItem.classList.add('nameListItem');
    newListItem.href = '#';

    // HighLight Event Listeners.
    // Get the currently entered field name and add it to the list & append new item to the HTML DOM.
    let newListName = document.getElementById('newListField');
    newListName.addEventListener('keydown', function () {
        // Enter pressed and the value of the input is equivalent to the new list item's innerHTML property.
        if ((event.which == 13 || event.keyCode == 13) && (newListName.value == newListItem.innerHTML)) {
            newListItem.classList.add('bg-danger');
            newListItem.classList.add('text-light');
        }
    })
    newListName.addEventListener('keyup', function () {
        newListItem.classList.remove('bg-danger');
        newListItem.classList.remove('text-light');
    })

    // Add TRASH ICON: <i class="far fa-trash-alt"></i>
    let newIcon = document.createElement('i');
    newIcon.classList.add('far')
    newIcon.classList.add('fa-trash-alt')
    newListItem.appendChild(newIcon);

    // Add Show/Hide Trash Icon Event Listener:

    // Pen Icon and Cancel Icon Respectively declared.
    let initiateEditRef = document.getElementById('edit-names');
    let cancelEditRef = document.getElementById('edit-names-cancel');
    initiateEditRef.addEventListener('click', function () {
        newIcon.classList.add('show');
    })
    cancelEditRef.addEventListener('click', function () {
        newIcon.classList.remove('show');
    })

    // Add Red Hover Event In the case edit mode is ON:
    newListItem.addEventListener('mouseenter', function () {
        if (window.getComputedStyle(initiateEditRef).display == "none") {
            // @precondition: Cancel is shown & pen is set to display="none";
            newListItem.classList.add('set-text-red');
            newIcon.classList.add('parent-hover');
        }
    })
    newListItem.addEventListener('mouseleave', function () {
        newListItem.classList.remove('set-text-red');
        newIcon.classList.add('parent-hover');
    })


    // Append List Name Onto List Section DOM.
    listSectionRef.appendChild(newListItem);
}

function initializeIcon() {
    // Pen & Cancel Icons respectively declared.
    let initiateEditRef = document.getElementById('edit-names');
    let cancelEditRef = document.getElementById('edit-names-cancel');

    cancelEditRef.classList.add('hide');

    initiateEditRef.addEventListener('click', function () {
        // Clicked Pen Icon
        cancelEditRef.classList.remove('hide');
        initiateEditRef.classList.add('hide');
    })
    cancelEditRef.addEventListener('click', function () {
        // Clicked Cancel Icon
        cancelEditRef.classList.add('hide');
        initiateEditRef.classList.remove('hide');
    })
}

// Initialize Page with Default Date/Time Values Whenever New Task Needs to be added.
let newItemButtonRef = document.getElementById('newItemButton');
newItemButtonRef.addEventListener('click', newDefaultDate);

// Initiates callback function whenever the a key is pressed with the new list field is selected.
document.getElementById('newListField').onkeypress = function (myEvent) {
    listSectionRef = document.getElementById('listSection');
    // Confirm that the user pushed the enter button.
    // @precondition: A new list name will be added every single time the enter key is fired.
    if (event.which == 13 || event.keyCode == 13) {
        // Confirm whether the second Drop Divider has been inputted. {Going to need to do the reverse of this once delete function is included.}
        if (document.getElementById('secondDropDivider') == null) {
            addListDivider();
        }
        // Get the currently entered field name and add it to the list & append new item to the HTML DOM.
        let newListName = document.getElementById('newListField');

        // Update Local Storage With New List Item. [Web Browser specifies you must stringify all data before storing it.]
        if (newListName.value == "" || newListName.value.replace(/ /g, '') == "") {
            // alert('Stupid List Name');
        }
        else if (!localStorage.getItem('nameLists')) {
            // @precondition: nameLists do not currently exist:
            let newNameList = JSON.stringify([newListName.value]);
            localStorage.setItem('nameLists', newNameList);
            addListDOM(newListName.value);
            document.getElementById('newListField').value = "";
        }
        else {
            if (JSON.parse(localStorage.getItem('nameLists')).indexOf(newListName.value) == -1) {
                let nameList = JSON.parse(localStorage.getItem('nameLists'));
                nameList.push(newListName.value);
                localStorage.setItem('nameLists', JSON.stringify(nameList));

                // Add List Item onto DOM & Reset New Item Field.
                addListDOM(newListName.value);
                document.getElementById('newListField').value = "";
            }
        }
    }
};

// IMPROVEMENTS: FUNCTIONALITY
// ADD A TASK SECTION ADDS IN NEW TASKS ELEMENTS. [Remember to showcase in day by day format by default] --- Tue
// Allow users to sort tasks by day,week,month,year. --- Tue

// IMPROVEMENTS: UI
// SIDEBAR INSTEAD OF YOUR PIECE OF SHIT BOOTSTRAP LOOKING ASS SHIT. --- Wed
// RESPONSIVE WEB FACTORS. --- Wed

// IMRPOVEMENTS: SOUNDCLOUD API {OPTIONAL} [Never because its a fucking todo app edward u high functioning autism retard]