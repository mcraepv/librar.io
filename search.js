// https://www.googleapis.com/books/v1/volumes?q=flowers+inauthor:keyes&key=yourAPIKey
$(document).ready(function () {
  $(document).on("click", "#searchBtn", searchFn);
  function searchFn() {
    const apiKey = "AIzaSyDDr4fmK6B3-3yS-S2X2d6X29EXQ6p8Sq0";

    var search = "";

    var keywordVal = $("#keyword").val().trim();
    var authorVal = $("#author").val().trim();
    var titleVal = $("#title").val().trim();
    var genreVal = $("#genre").val();
    const keyword = keywordVal;
    const author = `+inauthor:${authorVal}`;
    const title = `+intitle:${titleVal}`;
    const genre = `+subject:${genreVal}`;
    if (keywordVal !== "") {
      search += keyword;
    }
    if (authorVal !== "") {
      search += author;
    }
    if (titleVal !== "") {
      search += title;
    }
    if (genreVal !== undefined) {
      search += genre;
    }
    console.log(search);
    const url = `https://www.googleapis.com/books/v1/volumes?q=${search}&printType=books&key=${apiKey}`;
    console.log(url);
    $.ajax(url, {
      method: "GET",
    }).then(function (data) {
      console.log(data);
      $("#searchContent").empty();
      const books = data.items;
      const resultsContainer = $("<div>").addClass("grid-container");
      $("#searchContent").append(resultsContainer);
      for (var i = 0; i < books.length; i++) {
        var book = books[i];
        var bookInfo = book.volumeInfo;
        var bookRow = $("<div>").addClass("grid-x grid-margin-x align-center");
        var bookCell = $("<div>").addClass("medium-6 cell");
        var bookCard = $("<div>").addClass("card boxShadow rounded");
        var cardDivider = $("<div>").addClass("card-divider");
        var bookTitle = $("<h4>").text(bookInfo.title);
        var cardSection = $("<div>").addClass("card-section text-center");
        cardDivider.append(bookTitle);
        bookCard.append(cardDivider);
        bookCell.append(bookCard);
        bookRow.append(bookCell);
        resultsContainer.append(bookRow);
      }
    });
  }
});

$(document).on("click", "#clearBtn", function () {
  $("#keyword").val("");
  $("#author").val("");
  $("#title").val("");
  $("#genre").val("fiction");
});

// function clear () {
// $("#book-results").empty(); }

// $("#clear").on("click",clear);
