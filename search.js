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
    console.log(search);
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
    });
  }
});
