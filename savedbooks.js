var savedBooks = JSON.parse(localstorage.getItem("savedBooks")); 
console.log("saved books:", savedBooks)

// loop through the saved object to populate cards 
var objectOfBooks = JSON.parse(localStorage.getItem("objectOfBooks")); 
$(".row").attr("id", newRow)
for (var i = O; i < objectOfBooks.length; i++) {
if ((i) === 0) {
    $(#newRow).attr("id", "oldRow"); 
    var newRow = $("<div>"); 
    newRow.addClass("row")
    newRow.attr("id", "newRow"); 
    $("body").append(newRow)
}

renderSaved(objectOfBooks(i)); 
}

// create the card elements 
function renderSaved(event) {
var $savedDiv = $("<div>");
$savedDiv.addClass("cell small-12"); 

var $savedCard = $("<div>");
$savedCard.addClass("card");

var $savedCardImgDiv = $("<div>");
$savedCardImgDiv.addClass("card-image");

var $savedCardImg = $("<img>"); 
$savedCardImg.attr("src", book.image); 

var $savedCardSpan = $("<span>");
$savedCardSpan.addClass("card-title");
$savedCardSpan.text(book.name); 

star = createStar(book.id); 

var $savedCardContent = $("<div>");
$savedCardContent.addClass("card-content"); 

//append saved card elements 
var savedString = localStorage.getItem("savedArray"); 
console.log("savedString", savedString);


var savedArray = JSON.parse(savedString); 

console.log(savedArray);

// if (savedBooks.length > 0) {
    $favDiv.append($favCard);
    $favCard.append($favCardImgDiv);
    $favCardImgDiv.append($favCardImg);
    $favCard.append($favCardSpan);
    $favCard.append($favCardContent);
    $favCardContent.append($favCardAction);
    $favCardContent.append(star);
    $favCardAction.append($favCardLink);
    $("#newRow").append($favDiv);
    // }

}

$(document).on("click", ".starIcon", function () {
    $(this).parents().eq(2).remove();

}); 