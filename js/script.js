// Don't forget type='module' in the corresponding script tag to html!
import listItem from './class.js';

window.onload = function () {
    // Initialize list section:
    if (!localStorage.getItem('nameLists') == false) {
        // @precondition: Local Storage Exists, there is a list in the local storage.
        if (localStorage.getItem('nameLists') != JSON.stringify([])) {
            // @precondition: Local Storage Exists, List With Names Exist in the local storage.
            addListDivider();
            let nameList = JSON.parse(localStorage.getItem('nameLists'));
            // -XXX- CHANGE
            for (let i = 0; i < nameList.length; i++) {
                let currentName = nameList[i]._name;
                // CHANGED #1.
                addListDOM(currentName);
            }
        }
    }
    initializeIcon();

    const dropDownRef = document.getElementById('navbarDropdown');
    dropDownRef.addEventListener('click', function clickDropDownMenu() {
        let dropDownMenuRef = document.querySelector('.dropdown-menu');
        if ((dropDownMenuRef.classList.value).includes('show')) {
            dropDownMenuRef.classList.remove('show');
        }
        else {
            dropDownMenuRef.classList.add('show');
        }
    });
    const allTasksRef = document.getElementById('list-name-all');


    allTasksRef.addEventListener('click', function () {
        // Get All Possible Elements that can be highlighted. [NOTE: This event listener is for the all list selector, hence allTaskRef is not included in list checks.]
        let nameListRef = document.querySelectorAll('.nameListItem');
        // Remove all potentially selected list elements [An if statement check makes this shit more annoying to read so its been omitted.]
        for (let i = 0; i < nameListRef.length; i++) {
            nameListRef[i].classList.remove('selected-item');
        }
        // Add selected class
        allTasksRef.classList.add('selected-item')
    })
    // Add Selection Icon-Class to All-task by default:
    allTasksRef.classList.add('selected-item')
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
    let newDivider = document.createElement('div');
    newDivider.classList.add('dropdown-divider');
    newDivider.setAttribute('id', 'secondDropDivider');
    document.getElementById('listSection').appendChild(newDivider);
}
function removeListDivider() {
    let listSectionRef = document.getElementById('listSection');
    listSectionRef.removeChild(listSectionRef.childNodes[1]);
}
function addListDOM(listName) {
    let listSectionRef = document.getElementById('listSection');
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
        if ((event.which == 13 || event.keyCode == 13) && (newListName.value == newListItem.textContent)) {
            newListItem.classList.add('bg-danger');
            newListItem.classList.add('text-light');
        }
    })
    newListName.addEventListener('keyup', function () {
        newListItem.classList.remove('bg-danger');
        newListItem.classList.remove('text-light');
    })

    // Add Selected Item's Event Listener:
    newListItem.addEventListener('click', function () {
        // Get All Tasks Ref
        let allTasksRef = document.getElementById('list-name-all');
        let nameListRef = document.querySelectorAll('.nameListItem');
        for (let i = 0; i < nameListRef.length; i++) {
            nameListRef[i].classList.remove('selected-item');
        }
        // Remove selected-item class from allTask list selector.
        allTasksRef.classList.remove('selected-item');
        // Highlight Newly Selected Element
        newListItem.classList.add('selected-item');
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
    // Check For Whether Mode Is In Edit or Display/Cancelled:
    if (window.getComputedStyle(initiateEditRef).display == 'none') {
        newIcon.classList.add('show');
    }
    else {
        newIcon.classList.remove('show');
    }

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

    // Add Event Listener for the Trash Bin So that the Item can be deleted.
    newIcon.addEventListener('click', function () {
        // Remove Item Off of Local Storage.
        let removeIndex;
        let namesList = JSON.parse(localStorage.getItem('nameLists'));
        // -XXX- Change [] might need to actually use a loop this time for objects.
        for (let i = 0; i < namesList.length; i++) {
            if (listName == namesList[i].name) {
                removeIndex = i;
            }
        }
        namesList.splice(removeIndex, 1);
        // ORIGINAL:
        // namesList.splice(namesList.indexOf(listName), 1);

        // Check if namesList is empty & remove second dropdown div if after the DOM updates the list item section will be empty.
        if (namesList.length == 0) {
            removeListDivider();
        }
        // -XXX- Change
        localStorage.setItem('nameLists', JSON.stringify(namesList));
        // Finally Remove Item Off of DOM.
        listSectionRef.removeChild(newListItem);
    })

    // Dropdown Item Highlights Blue When Selected:
    newListItem.addEventListener('click', function () {
        newListItem.classList.add('selected-item')
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
    let listSectionRef = document.getElementById('listSection');
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
            let newNameList = JSON.stringify([new listItem(newListName.value)]);
            // -XXX- Change :(
            localStorage.setItem('nameLists', newNameList);
            addListDOM(newListName.value);
            document.getElementById('newListField').value = "";
        }
        else {
            // -XXX- Change
            let allowAdd = true;
            let nameList = JSON.parse(localStorage.getItem('nameLists'))
            for (let i = 0; i < nameList.length; i++) {
                if (nameList[i].name == newListName.value) {
                    allowAdd = false;
                }
            }
            if (allowAdd) {
                // @precondition list name does not already exist.
                nameList.push(new listItem(newListName.value));
                localStorage.setItem('nameLists', JSON.stringify(nameList));

                // Add List Item onto DOM & Reset New Item Field.
                addListDOM(newListName.value);
                document.getElementById('newListField').value = "";
            }
        }
    }
};


// ----------------------------------------------------------------------------------------------------------------------------------------

// Add Task Function:
function addTask(name, date, time, locationObj, description) {
    if (!localStorage.getItem('nameLists') == false) {
        // Get the current selected list:
        let listNames = localStorage.getItem('nameLists')
        let selectedListItemName = document.querySelector('.selected-item').textContent;
        for (let i = 0; i < selectedListItemName.length; i++) {
            if (selectedListItemName == listNames[i]._name) {
                listNames[i]._items.push({
                    name: name,
                    date: date,
                    time: time,
                    locationInfo: locationObj,
                    notes: description,
                })
            }
        }

    }
    else {

    }
}

// Add Task Via New Task Menu:
let addTaskButtonRef = document.getElementById('addTaskButton');
addTaskButtonRef.addEventListener('click', function () {
    // Add New Task:
    const taskNameRef = document.getElementById('task-name').value;
    const taskDateRef = document.getElementById('task-date').value;
    const taskTimeRef = document.getElementById('task-time').value;
    const taskLocationInfo = localStorage.getItem('currentSearchLocation');
    const taskNotes = document.getElementById('task-notes').value;


})

// IMPROVEMENTS: FUNCTIONALITY
// Allow users to sort tasks by day,week,month,year. --- Tue 

// IMPROVEMENTS: UI
// SIDEBAR INSTEAD OF YOUR PIECE OF SHIT BOOTSTRAP LOOKING ASS SHIT. --- Wed
// RESPONSIVE WEB FACTORS. --- Wed

// IMRPOVEMENTS: SOUNDCLOUD API {OPTIONAL} [Never because its a fucking todo app edward u high functioning autism retard]