// Hint variables
// Members only, true or false
// High alch value, higher lower or equal
// General store value
// Weight, higher lower or equal
// List of item categories
// GE Buy_Limit
// Item ID

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
            //console.log(itemDataObj["data"][key]["dataitem"][0]["item"])
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
    console.log(item);

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
async function incorrectGuess() {
    let itemDataDictionary = await grabItemInfo(currentItem);


}

function playerGuess() {
    // Get the player's guess
    let guessInput : HTMLInputElement = <HTMLInputElement>document.getElementById("itemInput");
    if (guessInput == null) {
        console.log("Guess input not found");
        return;
    }
    let guess = guessInput.value;

    // Is this item in the items list?
    if (!items.includes(guess)) {
        console.log("Invalid item!");
        return;
    }

    // Compare the two
    if (guess == currentItem) {
        console.log("Correct!");
    }
    else {
        console.log("Incorrect!");
        incorrectGuess();
    }

}

async function setup() {
    // Fetch item list from the OSRS Wiki
    items = await fetchItemList()

    // Bind itemInput event to listen for the enter key
    let itemInput = document.getElementById('itemInput');
    if (itemInput != null) {
        itemInput.addEventListener("keyup", function(event) {
            if (event.key === "Enter") {
                // Cancel the default action, if needed
                event.preventDefault();
                console.log("Enter key pressed");
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
    
