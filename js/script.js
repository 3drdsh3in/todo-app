// Don't forget type='module' in the corresponding script tag to html!
import listItem from './class.js';

// Note to self: Don't use spotaneously retarded data structures in the future like you did for this one :)
// Made managing Storage & API calls a literal fucking nightmare. {Should have just Nested list names into allTasks section of the storage.}

window.onload = function () {

    // Initialize Page with Default Date/Time Values Whenever New Task Needs to be added.
    let newItemButtonRef = document.getElementById('newItemButton');
    newItemButtonRef.addEventListener('click', newDefaultDate);

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

    // Hide Card-Flex if Screen is mobile device.
    const flexdispRef = document.querySelector('.card-order-settings');
    const widthChangeVal = window.matchMedia("(max-width: 768px)");
    if (!widthChangeVal.matches) {
        flexdispRef.style.display = 'flex';
    }
    else {
        flexdispRef.style.display = 'none';
    }
    widthChangeVal.addListener(function widthChange(width) {
        if (!width.matches) {
            flexdispRef.style.display = 'flex';
        }
        else {
            flexdispRef.style.display = 'none';
        }
    }
    )
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
        // ReInitialize DOM Upon switching lists.
        clearCardBody();
        initializeTaskDOM();
        updateListName();
    })
    // Add Selection Icon-Class to All-task by default:
    allTasksRef.classList.add('selected-item')

    // Add Task Via New Task Menu:
    let addTaskButtonRef = document.getElementById('addTaskButton');
    addTaskButtonRef.addEventListener('click', function () {
        // Remove Any Pre-existing classes that might confuse the user.
        let taskNameInput = document.getElementById('task-name')
        taskNameInput.classList.remove('is-invalid')

        // Add New Task:
        let taskNameRef = document.getElementById('task-name').value;
        let taskDateRef = document.getElementById('task-date').value;
        let taskTimeRef = document.getElementById('task-time').value;
        let taskLocationInfo = localStorage.getItem('currentSearchLocation');
        let taskNotes = document.getElementById('task-notes').value;

        // Run Check:
        try {
            checkRepeatingTaskNames(taskNameRef);
            addTask(taskNameRef, taskDateRef, taskTimeRef, taskLocationInfo, taskNotes);

            // Clear The Inputs For A Refreshed Future Use:
            document.getElementById('task-name').value = '';
            document.getElementById('task-location').value = '';
            document.getElementById('task-notes').value = '';
        }
        catch (err) {
            taskNameInput.classList.add('is-invalid')
            event.stopPropagation();
        }
    })

    // Quick Task Add:
    for (let i = 0; i < document.getElementsByClassName('quickTaskField').length; i++) {

        // Busted:
        document.getElementsByClassName('quickTaskField')[i].onkeypress = function () {
            let quickTaskName = document.getElementsByClassName('quickTaskField');
            for (let j = 0; j < quickTaskName.length; j++) {
                if (quickTaskName[j].value != '') {
                    if (event.which == 13 || event.keyCode == 13) {
                        // Prevent the default input form from submitting which will subsequently
                        // cause the page to reload unintentionally.
                        event.preventDefault();
                        addQuickTask(quickTaskName[j].value, j);
                        document.getElementsByClassName('quickTaskField')[j].value = '';
                    }
                }
            }
        }
        // Working:
        document.getElementsByClassName('arrow-wrap')[i].addEventListener('click', function () {
            let quickTaskName = document.getElementsByClassName('quickTaskField');
            for (let j = 0; j < quickTaskName.length; j++) {
                if (quickTaskName[j].value != '') {
                    addQuickTask(quickTaskName[j].value, j);
                    document.getElementsByClassName('quickTaskField')[j].value = '';
                }
            }
        });
    }

    // Initiates callback function whenever the a key is pressed with the new list field is selected.
    document.getElementById('newListField').onkeypress = function (myEvent) {
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
            if (newListName.value == "" || newListName.value.replace(/ /g, '') == "" || newListName.value == "All Tasks") {
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

    toggleListDisplay();
    initializeIcon();
    toggleListDir();
    initializeTaskDOM();

    // ---------------------------------------------------------------------------------------------------------------------------- //

    function newDefaultDate() {
        const taskDateRef = document.getElementById('task-date');
        const taskTimeRef = document.getElementById('task-time');

        let dateObject = new Date();
        let dateString = '';
        let timeString = '';
        let dispTmr, dispYear, dispYearString, dispMonth, dispMonthString, dispDate, dispDateString;

        // Time: 6 Hours in the future:
        let displayHour = dateObject.getHours() + 7;
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
                return "0";
            }
            else {
                return "";
            }
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

            // CALLS initializeTaskDOM to refresh the page's items.
            initializeTaskDOM();
            updateListName();
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
            // Check if namesList is empty & remove second dropdown div if after the DOM updates the list item section will be empty.
            if (namesList.length == 0) {
                removeListDivider();
            }
            // -XXX- Change
            localStorage.setItem('nameLists', JSON.stringify(namesList));
            // Finally Remove Item Off of DOM.
            listSectionRef.removeChild(newListItem);

            if (!document.querySelector('.selected-item')) {
                document.getElementById('list-name-all').classList.add('selected-item')
            }
            event.stopPropagation();
            initializeTaskDOM();
            updateListName();
        })

        // Dropdown Item Highlights Black When Selected:
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

    // Add Task Function:
    function addTask(name, date, time, locationObj, description) {
        // @precondition one of the lists should always be selected in the list menu.
        let listNames = JSON.parse(localStorage.getItem('nameLists'));
        // Check if there is any tasks within list in the first place.
        if (listNames != null && listNames.length != 0) {
            // Get the current selected list & push it onto the new list. [If there are list items in first place]
            let selectedListItemName = document.querySelector('.selected-item').textContent;
            if (selectedListItemName != 'All Tasks') {
                for (let i = 0; i < listNames.length; i++) {
                    // Loop through list names
                    if (selectedListItemName == listNames[i]._name) {
                        // Push New Item Onto The Corresponding List.
                        listNames[i]._items.push({
                            name: name,
                            date: date,
                            time: time,
                            locationInfo: locationObj,
                            notes: description,
                        })
                    }
                }
                // Push new local storage.
                localStorage.setItem('nameLists', JSON.stringify(listNames));
            }
        }
        // In the situation of no list items: PUSH item with new list straight onto All tasks
        if (!localStorage.getItem('allTasks')) {
            // All tasks list does not exist.
            let tmpList = [{
                name: name,
                date: date,
                time: time,
                locationInfo: locationObj,
                notes: description,
            }];
            localStorage.setItem('allTasks', JSON.stringify(tmpList));
        }
        // In the situation of a existant list item: Get list & push the new object on.
        else {
            // Get & Parse -> Push -> Stringify & Set.
            let allTasksList = JSON.parse(localStorage.getItem('allTasks'));
            allTasksList.push({
                name: name,
                date: date,
                time: time,
                locationInfo: locationObj,
                notes: description,
            });
            localStorage.setItem('allTasks', JSON.stringify(allTasksList));
        }
        // Update the DOM /w new task in its corresponding list. [Should happen for all times a new task is added.]
        pushTaskDOM();
    }

    function viewTaskGoogleAPI(locationObject) {
        locationObject = JSON.parse(locationObject);
        // const viewLocationRef = document.getElementById('view-location');
        var panLocation = { lat: locationObject.geometry.location.lat, lng: locationObject.geometry.location.lng };
        var currentMap = new google.maps.Map(document.getElementById('view-location'), { zoom: 12, center: panLocation, gestureHandling: 'cooperative', mapTypeId: google.maps.MapTypeId.ROADMAP });
        let marker = new google.maps.Marker({
            position: panLocation,
            map: currentMap,
        });
        // Set an info window description to the inputted description value.
        var infowindow = new google.maps.InfoWindow({
            content: locationObject.formatted_address
        });
        // Whenever the location is clicked it will open the infowindow.
        marker.addListener('click', function () {
            infowindow.open(currentMap, marker);
        })
    }

    function deleteTaskItem(deleteTag) {
        event.stopPropagation();
        let taskItemsList = document.querySelectorAll('.task-item');
        for (let i = 0; i < taskItemsList.length; i++) {
            if (taskItemsList[i] == deleteTag) {
                taskItemsList[i].remove()
            }
        }
        if (document.querySelector('.selected-item').textContent != 'All Tasks') {
            // Item Is A List Item.
            let listTasksRef = JSON.parse(localStorage.getItem('nameLists'));
            for (let i = 0; i < listTasksRef.length; i++) {
                if (document.querySelector('.selected-item').textContent == listTasksRef[i]._name) {
                    for (let j = 0; i < listTasksRef[i]._items.length; j++) {
                        if (deleteTag.children[0].children[1].children[0].textContent == listTasksRef[i]._items[j].name) {
                            listTasksRef[i]._items.splice(j, 1)
                            break;
                        }
                    }
                }
            }
            localStorage.setItem('nameLists', JSON.stringify(listTasksRef));
        }
        // Remove Items from allTasks localstorage.
        let allTasksRef = JSON.parse(localStorage.getItem('allTasks'));
        for (let i = 0; i < allTasksRef.length; i++) {
            if (allTasksRef[i].name == deleteTag.children[0].children[1].children[0].textContent) {
                allTasksRef.splice(i, 1);
            }
        }
        localStorage.setItem('allTasks', JSON.stringify(allTasksRef));
    }

    function createNewTask(taskItemRef) {

        function initializeTaskName(taskDiv, taskName) {
            // 
            taskDiv.classList.add('task-item');

            // Create the
            let styleDiv = document.createElement('div');
            styleDiv.classList.add('styleDiv');

            // Add Style Div /w the tick
            let tickIcon = document.createElement('i');
            tickIcon.classList.add('far');
            tickIcon.classList.add('fa-check-circle');
            tickIcon.classList.add('fa-2x');

            tickIcon.addEventListener("click", function () {
                // Prevent Parent's Link From Firing When Child Is Selected.
                event.stopPropagation();
                tickIcon.classList.add('checked-task');
                nestStyleDiv.classList.add('checked-task')
                deleteIcon.classList.remove('hide')
            })

            styleDiv.appendChild(tickIcon);

            let nestStyleDiv = document.createElement('div');
            nestStyleDiv.classList.add('nestStyleDiv')
            nestStyleDiv.appendChild(taskName);
            styleDiv.appendChild(nestStyleDiv);

            taskDiv.appendChild(styleDiv);

            // Add 
            // taskDiv.appendChild(taskName);
            taskDiv.setAttribute('data-toggle', 'modal')
            taskDiv.setAttribute('data-target', '#viewTaskModal')
        }

        function createDeleteIcon(taskDiv, iconTag) {
            iconTag.classList.add('fas')
            iconTag.classList.add('fa-times-circle')
            iconTag.classList.add('fa-2x')
            iconTag.classList.add('hide')
            taskDiv.appendChild(iconTag);

            iconTag.addEventListener("click", function () {
                // Prompt callback on delete item or delete it right here.
                deleteTaskItem(taskDiv);
            })
        }

        // Function Script:
        let taskDiv = document.createElement('div');
        // Task Name Tag:
        let taskName = document.createElement('h6');
        taskName.textContent = taskItemRef.name;
        initializeTaskName(taskDiv, taskName);

        let deleteIcon = document.createElement('i');
        createDeleteIcon(taskDiv, deleteIcon)

        // Proper Interaction:
        taskDiv.addEventListener("click", function () {
            const viewNameRef = document.getElementById('view-name');
            const viewDateRef = document.getElementById('view-date');
            const viewTimeRef = document.getElementById('view-time');
            const viewDescriptionRef = document.getElementById('view-description');

            viewNameRef.textContent = taskItemRef.name;
            viewDateRef.textContent = taskItemRef.date;
            viewTimeRef.textContent = taskItemRef.time;
            viewDescriptionRef.value = taskItemRef.notes;

            viewTaskGoogleAPI(taskItemRef.locationInfo);

            const viewDeleteBtn = document.getElementById('view-delete-btn');
            viewDeleteBtn.addEventListener('click', function () {
                deleteTaskItem(taskDiv);
                $('#viewTaskModal').modal('hide');
            })
        })

        let dateParseString = taskItemRef.date + ' ' + taskItemRef.time;
        appendDOMBody(dateParseString, taskDiv);
    }

    function pushTaskDOM() {
        const taskInfo = JSON.parse(localStorage.getItem('allTasks'));
        const nameListRef = JSON.parse(localStorage.getItem('nameLists'));
        const selectedItemRef = document.querySelector('.selected-item');
        if (selectedItemRef.textContent == 'All Tasks') {
            createNewTask(taskInfo[taskInfo.length - 1])
        }
        else {
            // IMPLEMENT THE BELOW IN THE CASE MORE APPEAR LIST METHODS
            // let dispTypeList = document.querySelector('.disp-type-dropdown').children
            let dispTypeList = document.getElementById('listSection').children;
            let indexAccess;
            for (let i = 0; i < dispTypeList.length; i++) {
                if (selectedItemRef == dispTypeList[i + 1]) {
                    console.log(i);
                    indexAccess = i;
                    break;
                }
            }
            createNewTask(nameListRef[indexAccess]._items[nameListRef[indexAccess]._items.length - 1]);
        }
    }
    // THIS FUNCTION'S PERFORMANCE IS SEVERELY HINDERED DUE TO A FUCKING TERRIBLE LOCAL STORAGE DATA STRUCTURE CHOICE.
    // O(n^2) complexity worst case :(
    function initializeTaskDOM() {
        // BEGINS BY CHECKING THE SELECTED LIST ITEM.
        const taskInfo = JSON.parse(localStorage.getItem('allTasks'));
        // Name List Selectors
        const selectedItemRef = document.querySelector('.selected-item');
        if (!taskInfo) {
            // No Pre-existing storage items.
            console.log('No Item')
        }
        else if (selectedItemRef.textContent == 'All Tasks') {
            // In the case All Tasks is currently selected.
            // Loop Through Every Single Task Item:
            for (let i = 0; i < taskInfo.length; i++) {
                createNewTask(taskInfo[i]);
            }
        }
        else {
            // In the case a list other than All Tasks is currently selected.
            clearCardBody();
            let nameItemsRef = JSON.parse(localStorage.getItem('nameLists'));
            for (let i = 0; i < nameItemsRef.length; i++) {
                if (nameItemsRef[i]._name == selectedItemRef.textContent) {
                    for (let j = 0; j < nameItemsRef[i]._items.length; j++) {
                        createNewTask(nameItemsRef[i]._items[j]);
                    }
                }
            }
        }
    }

    function clearCardBody() {
        const cardsBodyRef = document.querySelectorAll('.card-item-section');
        for (let i = 0; i < cardsBodyRef.length; i++) {
            cardsBodyRef[i].textContent = '';
        }
    }

    function appendDOMBody(dateParseString, taskDiv) {
        const cardItemRef = document.querySelectorAll('.card-item-section');
        if ((Date.parse(dateParseString) / 1000) - (Date.parse(getCurrentDate()) / 1000) < 86400) {
            // Item Should be in 'Today' body
            cardItemRef[0].appendChild(taskDiv);
        }
        else if ((Date.parse(dateParseString) / 1000) - (Date.parse(getCurrentDate()) / 1000) < 172800) {
            cardItemRef[1].appendChild(taskDiv);
        }
        else if ((Date.parse(dateParseString) / 1000) - (Date.parse(getCurrentDate()) / 1000) < 604800) {
            cardItemRef[2].appendChild(taskDiv);
        }
        else {
            cardItemRef[3].appendChild(taskDiv);
        }
    }

    function getCurrentDate() {
        let currentYr, currentMnth, currentDate;
        let tmpDate = new Date();
        currentYr = tmpDate.getFullYear();
        currentMnth = tmpDate.getMonth();
        currentDate = tmpDate.getDate();
        if (currentMnth >= 9) {
            return currentYr.toString() + '-' + (currentMnth + 1).toString() + '-' + currentDate.toString();
        }
        else {
            return currentYr.toString() + '-0' + (currentMnth + 1).toString() + '-' + currentDate.toString();
        }
    }

    function getCurrentHour() {
        let tmpDate = new Date();
        let currentHr = tmpDate.getHours();

        if (currentHr > 9) {
            return (currentHr).toString() + ':00';
        }
        else {
            return '0' + (currentHr).toString() + ':00';
        }
    }

    function updateListName() {
        const listNameHeaderRef = document.getElementById('list-name-header');
        const currentSelectedItemRef = document.querySelector('.selected-item');
        listNameHeaderRef.textContent = currentSelectedItemRef.textContent;
    }

    function checkRepeatingTaskNames(taskName) {
        if (!localStorage.getItem('allTasks') == false) {
            let allTasksRef = JSON.parse(localStorage.getItem('allTasks'));
            for (let i = 0; i < allTasksRef.length; i++)
                if (taskName == allTasksRef[i].name) {
                    throw new Error('Repeating Task Name');
                }
        }
    }
    function toggleListDisplay() {
        let itemTimeRef = document.querySelector('.item_time');
        let itemListRef = document.querySelector('.item_list');

        itemListRef.classList.add('hide');

        itemListRef.addEventListener('click', function () {
            itemListRef.classList.add('hide');
            itemTimeRef.classList.remove('hide');
        })
        itemTimeRef.addEventListener('click', function () {
            itemTimeRef.classList.add('hide');
            itemListRef.classList.remove('hide');
        })
    }
    function toggleListDir() {
        let disp_col = document.getElementById('card-col');
        let disp_row = document.getElementById('card-row');
        let card_disp = document.querySelector('.card-deck');

        disp_col.addEventListener('click', function () {
            if (!window.matchMedia("(max-width: 768px)").matches) {
                card_disp.classList.add('toggle-col');
                card_disp.classList.remove('toggle-row');
            }
        })
        disp_row.addEventListener('click', function () {
            card_disp.classList.add('toggle-row');
            card_disp.classList.remove('toggle-col');
        })
    }

    function addQuickTask(taskNameValue, i) {

        function initializeTaskName(taskDiv, taskName) {
            taskDiv.classList.add('task-item');

            let styleDiv = document.createElement('div');
            styleDiv.classList.add('styleDiv');

            // Add Style Div /w the tick
            let tickIcon = document.createElement('i');
            tickIcon.classList.add('far');
            tickIcon.classList.add('fa-check-circle');
            tickIcon.classList.add('fa-2x');

            tickIcon.addEventListener("click", function () {
                // Prevent Parent's Link From Firing When Child Is Selected.
                event.stopPropagation();
                tickIcon.classList.add('checked-task');
                nestStyleDiv.classList.add('checked-task')
                deleteIcon.classList.remove('hide')
            })

            styleDiv.appendChild(tickIcon);

            let nestStyleDiv = document.createElement('div');
            nestStyleDiv.classList.add('nestStyleDiv')
            nestStyleDiv.appendChild(taskName);
            styleDiv.appendChild(nestStyleDiv);

            taskDiv.appendChild(styleDiv);
        }

        function createDeleteIcon(taskDiv, iconTag) {
            iconTag.classList.add('fas')
            iconTag.classList.add('fa-times-circle')
            iconTag.classList.add('fa-2x')
            iconTag.classList.add('hide')
            taskDiv.appendChild(iconTag);

            iconTag.addEventListener("click", function () {
                // Prompt callback on delete item or delete it right here.
                deleteTaskItem(taskDiv);
            })
        }

        // Function Script:
        let taskDiv = document.createElement('div');
        // Task Name Tag:
        let taskName = document.createElement('h6');
        // 'Quick Task - '
        taskName.textContent = taskNameValue;
        initializeTaskName(taskDiv, taskName);

        let deleteIcon = document.createElement('i');
        createDeleteIcon(taskDiv, deleteIcon)

        let cardItemRef = document.querySelectorAll('.card-body');
        cardItemRef[i].appendChild(taskDiv);
    }

    document.getElementById('searchField').onkeyup = function () {
        console.log(event.which);
        let searchField = document.getElementById('searchField').value;
        let allTaskItems = document.querySelectorAll('.task-item');
        for (let i = 0; i < allTaskItems.length; i++) {
            if (!allTaskItems[i].children[0].children[1].children[0].textContent.includes(searchField)) {
                allTaskItems[i].classList.add('hide');
            }
            else {
                allTaskItems[i].classList.remove('hide');
            }
        }
    }
    // IMPROVEMENTS:
    // SEARCH BAR FOR TASK NAMES. [1]
    // MORE RESPONSIVE WEB FACTORS [2]
    // BETTER SAVE DATA STRUCTURE. [Doesn't work ATM /w repeating task names]
    // Make it so that at every location search, camera zooms to a co - ordinate in between the search location and the user's current location.

    // IMRPOVEMENTS: SOUNDCLOUD API {OPTIONAL} [Never because its a fucking todo app edward u high functioning autism retard]

}