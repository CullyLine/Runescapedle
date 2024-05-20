let currentItem : string = "";
let currentItemData = {};
let items : string[] = [];

async function grabItemInfo(item : string) {
    let itemDataQuery = "https://oldschool.runescape.wiki/w/Special:Browse?article=" + item + "&dir=both&group=show&offset=0&format=json";
    let headersList = {
        "Accept": "*/*"
    }
    let response = await fetch(itemDataQuery, { 
        method: "GET",
        headers: headersList
    });
    let data = await response.text();

    // Parse it and grab the info that we want.
    // This is a bit of a mess, but it works.
    // It's not my fault really, it's how the wiki's JSON is given to us.
    let itemDataObj : object = JSON.parse(data);
    let itemDataDictionary = {};
    Object.keys(itemDataObj["data"]).forEach(key => {
        let propertyName = itemDataObj["data"][key]["property"];
        let propertyValue = itemDataObj["data"][key]["dataitem"][0]["item"]

        // This property is an array of categories for this item.
        if (propertyName == "_INST") {
            let categories : string[] = [];
            itemDataObj["data"][key]["dataitem"].forEach(category => {
                let categoryName : string = category["item"];
                categoryName = categoryName.replace(new RegExp("_", 'g'), " ").replace(new RegExp("#14##", 'g'), "");
                categories.push(categoryName);
            });

            itemDataDictionary["Categories"] = categories;
        }
        else 
        {
            // This is a normal property.
            // Convert some values to more useful types.
            // True and False is given as "t" and "f" in the JSON.
            if (propertyValue == "t") {
                propertyValue = true;
            }
            else if (propertyValue == "f") {  
                propertyValue = false;
            }
            // See if the value will parse as a number.
            else if (!isNaN(propertyValue)) {
                propertyValue = parseFloat(propertyValue);
            }

            itemDataDictionary[propertyName] = propertyValue;
        }
    });

    // Fix null values
    if (itemDataDictionary["High_Alchemy_value"] == null) {
        itemDataDictionary["High_Alchemy_value"] = -1;
    }

    if (itemDataDictionary["Is_members_only"] == null) {
        itemDataDictionary["Is_members_only"] = true;
    }

    if (itemDataDictionary["Weight"] == null) {
        itemDataDictionary["Weight"] = -1;
    }

    if (itemDataDictionary["Buy_limit"] == null) {
        itemDataDictionary["Buy_limit"] = -1;
    }

    return itemDataDictionary;
}

async function grabRandomItem() {
    // Select a random item from the list
    var item : string = items[Math.floor(Math.random()*items.length)];

    // Fetch the item's info JSON
    let itemDataDictionary = await grabItemInfo(item);

    return itemDataDictionary;
}

// Fetch JSON list of all OSRS items.
async function fetchItemList() {
    // Fetch JSON of all items
    let itemListQuery = "https://oldschool.runescape.wiki/?title=Module%3AGEIDs%2Fdata.json&action=raw&ctype=application%2Fjson"
    let headersList = {
        "Accept": "*/*"
    }
    let response = await fetch(itemListQuery, { 
        method: "GET",
        headers: headersList
    });
    let data = await response.text();
    
    // Parse the JSON into an object, and then a string array of the items.
    let itemsObj : object = JSON.parse(data);
    items = Object.keys(itemsObj);

    return items;
}

// Player guessed incorrectly.
// Grab the item info for this item, and compare values to the correct item.
// Tell the player what they got right / wrong / partially right.
async function incorrectGuess(guessedItem) {
    let itemDataDictionary = await grabItemInfo(guessedItem);

    // Template example
    // <div class="row" id="rowTemplate">
    //     <div class="col">
    //         Free to play / Members
    //     </div>
    //     <div class="col">
    //         High Alch Value
    //     </div>
    //     <div class="col">
    //         Weight
    //     </div>
    //     <div class="col">
    //         G.E. Buy Limit
    //     </div>
    //     <div class="col">
    //         Categories
    //     </div>
    // </div>

    // Build the row
    let rowHTML = "<div class=\"row\">";

    // Compare members only
    rowHTML += "<div class=\"col";
    // Color
    if (itemDataDictionary["Is_members_only"] == currentItemData["Is_members_only"]) {
        rowHTML += " bg-success bg-gradient\">";
    }
    else {

        rowHTML += " bg-danger bg-gradient\">";
    }
    // Text
    if (itemDataDictionary["Is_members_only"] == true) {
        rowHTML += " Members";
    }
    else {
        rowHTML += " Free to play";
    }
    rowHTML += " </div>";

    // Compare high alch value, check for above, equal, or below. Also, if high alch value is -1, state it's unknown.
    rowHTML += "<div class=\"col";
    if (itemDataDictionary["High_Alchemy_value"] == -1) {
        // If the player's guess can't get the high alch value, but the correct item can, show the correct high alch value and mark it as correct.
        if (currentItemData["High_Alchemy_value"] > -1) {
            rowHTML += " bg-success bg-gradient\"> " + currentItemData["High_Alchemy_value"];
        } 
        else
        {
            // If both the player's guess and the correct item can't get the high alch value, mark it as unknown.
            rowHTML += " bg-success bg-gradient\"> ?";
        }
    }
    else if (itemDataDictionary["High_Alchemy_value"] > currentItemData["High_Alchemy_value"]) {
        rowHTML += " bg-warning bg-gradient\"> v " + itemDataDictionary["High_Alchemy_value"];
    }
    else if (itemDataDictionary["High_Alchemy_value"] < currentItemData["High_Alchemy_value"]) {
        rowHTML += " bg-warning bg-gradient\"> ^ " + itemDataDictionary["High_Alchemy_value"];
    }
    else {
        rowHTML += " bg-success bg-gradient\"> " + itemDataDictionary["High_Alchemy_value"];
    }
    rowHTML += " </div>";
    
    // Compare weight, check for above, equal, or below. Also, if weight is -1, state it's unknown.
    rowHTML += "<div class=\"col";
    if (itemDataDictionary["Weight"] == -1) {
        // If the player's guess can't get the weight, but the correct item can, show the correct weight and mark it as correct.
        if (currentItemData["Weight"] > -1) {
            rowHTML += " bg-success bg-gradient\"> " + currentItemData["Weight"];
        } 
        else
        {
            // If both the player's guess and the correct item can't get the weight, mark it as unknown.
            rowHTML += " bg-success bg-gradient\"> ?";
        }
    }
    else if (itemDataDictionary["Weight"] > currentItemData["Weight"]) {
        rowHTML += " bg-warning bg-gradient\"> v " + itemDataDictionary["Weight"];
    }
    else if (itemDataDictionary["Weight"] < currentItemData["Weight"]) {
        rowHTML += " bg-warning bg-gradient\"> ^ " + itemDataDictionary["Weight"];
    }
    else {
        rowHTML += " bg-success bg-gradient\"> " + itemDataDictionary["Weight"];
    }
    rowHTML += " </div>";

    // Compare buy limit, check for above, equal, or below. Also, if buy limit is -1, state it's unknown.
    rowHTML += "<div class=\"col";
    if (itemDataDictionary["Buy_limit"] == -1) {
        // If the player's guess can't get the buy limit, but the correct item can, show the correct buy limit and mark it as correct.
        if (currentItemData["Buy_limit"] > -1) {
            rowHTML += " bg-success bg-gradient\"> " + currentItemData["Buy_limit"];
        } 
        else
        {
            // If both the player's guess and the correct item can't get the buy limit, mark it as unknown.
            rowHTML += " bg-success bg-gradient\"> ?";
        }
    }
    else if (itemDataDictionary["Buy_limit"] > currentItemData["Buy_limit"]) {
        rowHTML += " bg-warning bg-gradient\"> v " + itemDataDictionary["Buy_limit"];
    }
    else if (itemDataDictionary["Buy_limit"] < currentItemData["Buy_limit"]) {
        rowHTML += " bg-warning bg-gradient\"> ^ " + itemDataDictionary["Buy_limit"];
    }
    else {
        rowHTML += " bg-success bg-gradient\"> " + itemDataDictionary["Buy_limit"];
    }
    rowHTML += " </div>";

    // Compare categories, if all are right, say correct, if all are wrong, say incorrect, if some are right, say partially correct.
    rowHTML += "<div class=\"col bg-warning bg-gradient\">";
    let correctCategories = 0;
    let incorrectCategories = 0;
    itemDataDictionary["Categories"].forEach(category => {
        if (currentItemData["Categories"].includes(category)) {
            correctCategories++;
        }
        else {
            incorrectCategories++;
        }
    });

    if (correctCategories == itemDataDictionary["Categories"].length && correctCategories == currentItemData["Categories"].length) {
    }
    else if (incorrectCategories == itemDataDictionary["Categories"].length && incorrectCategories == currentItemData["Categories"].length) {
    }
    else {

    }
    rowHTML += " </div>";

    rowHTML += " </div>";

    // Append the row to the table
    let table = document.getElementById("infoTable");
    if (table == null) {
        return;
    }

    table.innerHTML += rowHTML;
}

function playerGuess() {
    // Get the player's guess
    let guessInput : HTMLInputElement = <HTMLInputElement>document.getElementById("itemInput");
    if (guessInput == null) {
        return;
    }
    let guess = guessInput.value;

    // Is this item in the items list?
    if (!items.includes(guess)) {
        return;
    }

    // Compare the two
    if (guess == currentItem) {
    }
    else {
        incorrectGuess(guess);
    }

}

async function setup() {
    // Fetch item list from the OSRS Wiki
    items = await fetchItemList()

    // Bind itemInput event to listen for the enter key
    let itemInput : HTMLInputElement = <HTMLInputElement>document.getElementById('itemInput');
    if (itemInput != null) {
        itemInput.addEventListener("keyup", function(event) {
            // Clear any old entries in the dropdown list
            let dropdownList : HTMLInputElement  = <HTMLInputElement>document.getElementById("itemDropdownList");
            if (dropdownList != null) {
                dropdownList.innerHTML = "";
            }

            let newValue = itemInput.value;

            if (newValue != "" && newValue != null && newValue.length >= 3) {
                dropdownList.hidden = false

                // Find items that match the new value
                let matchingItems = items.filter(item => item.toLowerCase().includes(newValue.toLowerCase()));

                if (matchingItems.length == 0) { 
                    dropdownList.hidden = true
                }

                // Add the matching items to the dropdown list,
                // each item should be an <li> element with an <a> element inside it.
                // each <a> element should have an onclick event that sets the itemInput's value to the item.
                // each <a> element should have an href of "#".
                // each <a> element should have a class of "dropdown-item".
                matchingItems.forEach(item => {
                    let listItem = document.createElement("li");
                    let itemLink = document.createElement("a");
                    itemLink.href = "#";
                    itemLink.className = "dropdown-item";
                    itemLink.onclick = function() {
                        itemInput.value = item;
                        playerGuess();
                    }
                    itemLink.innerText = item;
                    listItem.appendChild(itemLink);

                    dropdownList.appendChild(listItem);
                });
            }
            else 
            {
                dropdownList.hidden = true
            }

            if (event.key === "Enter") {
                event.preventDefault();
                playerGuess();
            }
        });
    }

    // Get a random item's data.
    currentItemData = await grabRandomItem();
    currentItem = currentItemData["_SKEY"];

    console.log(currentItem, currentItemData);
}

window.onload = function() {
    setup();
}
    
