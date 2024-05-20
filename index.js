var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var currentItem = "";
var currentItemData = {};
var items = [];
function grabItemInfo(item) {
    return __awaiter(this, void 0, void 0, function () {
        var itemDataQuery, headersList, response, data, itemDataObj, itemDataDictionary;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    itemDataQuery = "https://oldschool.runescape.wiki/w/Special:Browse?article=" + item + "&dir=both&group=show&offset=0&format=json";
                    headersList = {
                        "Accept": "*/*"
                    };
                    return [4 /*yield*/, fetch(itemDataQuery, {
                            method: "GET",
                            headers: headersList
                        })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.text()];
                case 2:
                    data = _a.sent();
                    itemDataObj = JSON.parse(data);
                    itemDataDictionary = {};
                    Object.keys(itemDataObj["data"]).forEach(function (key) {
                        var propertyName = itemDataObj["data"][key]["property"];
                        var propertyValue = itemDataObj["data"][key]["dataitem"][0]["item"];
                        // This property is an array of categories for this item.
                        if (propertyName == "_INST") {
                            //console.log(itemDataObj["data"][key]["dataitem"][0]["item"])
                            var categories_1 = [];
                            itemDataObj["data"][key]["dataitem"].forEach(function (category) {
                                var categoryName = category["item"];
                                categoryName = categoryName.replace(new RegExp("_", 'g'), " ").replace(new RegExp("#14##", 'g'), "");
                                categories_1.push(categoryName);
                            });
                            itemDataDictionary["Categories"] = categories_1;
                        }
                        else {
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
                    return [2 /*return*/, itemDataDictionary];
            }
        });
    });
}
function grabRandomItem() {
    return __awaiter(this, void 0, void 0, function () {
        var item, itemDataDictionary;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    item = items[Math.floor(Math.random() * items.length)];
                    console.log(item);
                    return [4 /*yield*/, grabItemInfo(item)];
                case 1:
                    itemDataDictionary = _a.sent();
                    return [2 /*return*/, itemDataDictionary];
            }
        });
    });
}
// Fetch JSON list of all OSRS items.
function fetchItemList() {
    return __awaiter(this, void 0, void 0, function () {
        var itemListQuery, headersList, response, data, itemsObj;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    itemListQuery = "https://oldschool.runescape.wiki/?title=Module%3AGEIDs%2Fdata.json&action=raw&ctype=application%2Fjson";
                    headersList = {
                        "Accept": "*/*"
                    };
                    return [4 /*yield*/, fetch(itemListQuery, {
                            method: "GET",
                            headers: headersList
                        })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.text()];
                case 2:
                    data = _a.sent();
                    itemsObj = JSON.parse(data);
                    items = Object.keys(itemsObj);
                    return [2 /*return*/, items];
            }
        });
    });
}
// Player guessed incorrectly.
// Grab the item info for this item, and compare values to the correct item.
// Tell the player what they got right / wrong / partially right.
function incorrectGuess(guessedItem) {
    return __awaiter(this, void 0, void 0, function () {
        var itemDataDictionary, rowHTML, correctCategories, incorrectCategories, table;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, grabItemInfo(guessedItem)];
                case 1:
                    itemDataDictionary = _a.sent();
                    rowHTML = "<div class=\"row\">";
                    // Compare members only
                    rowHTML += "<div class=\"col";
                    // Color
                    if (itemDataDictionary["Is_members_only"] == currentItemData["Is_members_only"]) {
                        console.log("Members only: Correct");
                        rowHTML += " bg-success bg-gradient\">";
                    }
                    else {
                        console.log("Members only: Incorrect");
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
                            console.log("High alch value: Unknown");
                            rowHTML += " bg-success bg-gradient\"> " + currentItemData["High_Alchemy_value"];
                        }
                        else {
                            // If both the player's guess and the correct item can't get the high alch value, mark it as unknown.
                            console.log("High alch value: Unknown");
                            rowHTML += " bg-success bg-gradient\"> ?";
                        }
                    }
                    else if (itemDataDictionary["High_Alchemy_value"] > currentItemData["High_Alchemy_value"]) {
                        console.log("High alch value: Above");
                        rowHTML += " bg-warning bg-gradient\"> v " + itemDataDictionary["High_Alchemy_value"];
                    }
                    else if (itemDataDictionary["High_Alchemy_value"] < currentItemData["High_Alchemy_value"]) {
                        console.log("High alch value: Below");
                        rowHTML += " bg-warning bg-gradient\"> ^ " + itemDataDictionary["High_Alchemy_value"];
                    }
                    else {
                        rowHTML += " bg-success bg-gradient\"> " + itemDataDictionary["High_Alchemy_value"];
                        console.log("High alch value: Correct");
                    }
                    rowHTML += " </div>";
                    // Compare weight, check for above, equal, or below. Also, if weight is -1, state it's unknown.
                    rowHTML += "<div class=\"col";
                    if (itemDataDictionary["Weight"] == -1) {
                        // If the player's guess can't get the weight, but the correct item can, show the correct weight and mark it as correct.
                        if (currentItemData["Weight"] > -1) {
                            console.log("Weight: Unknown");
                            rowHTML += " bg-success bg-gradient\"> " + currentItemData["Weight"];
                        }
                        else {
                            // If both the player's guess and the correct item can't get the weight, mark it as unknown.
                            console.log("Weight: Unknown");
                            rowHTML += " bg-success bg-gradient\"> ?";
                        }
                    }
                    else if (itemDataDictionary["Weight"] > currentItemData["Weight"]) {
                        console.log("Weight: Above");
                        rowHTML += " bg-warning bg-gradient\"> v " + itemDataDictionary["Weight"];
                    }
                    else if (itemDataDictionary["Weight"] < currentItemData["Weight"]) {
                        console.log("Weight: Below");
                        rowHTML += " bg-warning bg-gradient\"> ^ " + itemDataDictionary["Weight"];
                    }
                    else {
                        console.log("Weight: Correct");
                        rowHTML += " bg-success bg-gradient\"> " + itemDataDictionary["Weight"];
                    }
                    rowHTML += " </div>";
                    // Compare buy limit, check for above, equal, or below. Also, if buy limit is -1, state it's unknown.
                    rowHTML += "<div class=\"col";
                    if (itemDataDictionary["Buy_limit"] == -1) {
                        // If the player's guess can't get the buy limit, but the correct item can, show the correct buy limit and mark it as correct.
                        if (currentItemData["Buy_limit"] > -1) {
                            console.log("Buy limit: Unknown");
                            rowHTML += " bg-success bg-gradient\"> " + currentItemData["Buy_limit"];
                        }
                        else {
                            // If both the player's guess and the correct item can't get the buy limit, mark it as unknown.
                            console.log("Buy limit: Unknown");
                            rowHTML += " bg-success bg-gradient\"> ?";
                        }
                        console.log("Buy limit: Unknown");
                    }
                    else if (itemDataDictionary["Buy_limit"] > currentItemData["Buy_limit"]) {
                        rowHTML += " bg-warning bg-gradient\"> v " + itemDataDictionary["Buy_limit"];
                        console.log("Buy limit: Above");
                    }
                    else if (itemDataDictionary["Buy_limit"] < currentItemData["Buy_limit"]) {
                        rowHTML += " bg-warning bg-gradient\"> ^ " + itemDataDictionary["Buy_limit"];
                        console.log("Buy limit: Below");
                    }
                    else {
                        rowHTML += " bg-success bg-gradient\"> " + itemDataDictionary["Buy_limit"];
                        console.log("Buy limit: Correct");
                    }
                    rowHTML += " </div>";
                    // Compare categories, if all are right, say correct, if all are wrong, say incorrect, if some are right, say partially correct.
                    rowHTML += "<div class=\"col bg-warning bg-gradient\">";
                    correctCategories = 0;
                    incorrectCategories = 0;
                    itemDataDictionary["Categories"].forEach(function (category) {
                        if (currentItemData["Categories"].includes(category)) {
                            correctCategories++;
                        }
                        else {
                            incorrectCategories++;
                        }
                    });
                    if (correctCategories == itemDataDictionary["Categories"].length && correctCategories == currentItemData["Categories"].length) {
                        console.log("Categories: Correct");
                    }
                    else if (incorrectCategories == itemDataDictionary["Categories"].length && incorrectCategories == currentItemData["Categories"].length) {
                        console.log("Categories: Incorrect");
                    }
                    else {
                        console.log("Categories: Partially correct");
                    }
                    rowHTML += " </div>";
                    rowHTML += " </div>";
                    table = document.getElementById("infoTable");
                    if (table == null) {
                        return [2 /*return*/];
                    }
                    table.innerHTML += rowHTML;
                    return [2 /*return*/];
            }
        });
    });
}
function playerGuess() {
    // Get the player's guess
    var guessInput = document.getElementById("itemInput");
    if (guessInput == null) {
        console.log("Guess input not found");
        return;
    }
    var guess = guessInput.value;
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
        incorrectGuess(guess);
    }
}
function setup() {
    return __awaiter(this, void 0, void 0, function () {
        var itemInput;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetchItemList()
                    // Bind itemInput event to listen for the enter key
                ];
                case 1:
                    // Fetch item list from the OSRS Wiki
                    items = _a.sent();
                    itemInput = document.getElementById('itemInput');
                    if (itemInput != null) {
                        itemInput.addEventListener("keyup", function (event) {
                            if (event.key === "Enter") {
                                // Cancel the default action, if needed
                                event.preventDefault();
                                console.log("Enter key pressed");
                                playerGuess();
                            }
                        });
                    }
                    return [4 /*yield*/, grabRandomItem()];
                case 2:
                    // Get a random item's data.
                    currentItemData = _a.sent();
                    currentItem = currentItemData["_SKEY"];
                    console.log(currentItem, currentItemData);
                    return [2 /*return*/];
            }
        });
    });
}
window.onload = function () {
    setup();
};
