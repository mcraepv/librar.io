// https://www.googleapis.com/books/v1/volumes?q=flowers+inauthor:keyes&key=yourAPIKey
$(document).ready(function () {
  var firebaseConfig = {
    apiKey: "AIzaSyCCSPzvoB10U9Wq36T3ZkatJY3CvohgaLY",
    authDomain: "librario-57ec3.firebaseapp.com",
    databaseURL: "https://librario-57ec3.firebaseio.com",
    projectId: "librario-57ec3",
    storageBucket: "librario-57ec3.appspot.com",
    messagingSenderId: "529783172996",
    appId: "1:529783172996:web:a03461d78eaa4f1d97f7d1",
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  var user = firebase.auth.UserInfo;
  var name = "";
  var uid = "";
  //sign in click listener
  $("#sign-in").on("click", function (event) {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function (result) {
        user = result.user;
        name = user.displayName;
        uid = user.uid;
      })
      .catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        var credential = error.credential;
      });
  });
  var uid = "";
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      uid = user.uid;
      if (
        $("#searchContent").find("h3").text() ===
        "Please sign in to see saved searches."
      ) {
        loadSavedBooks();
      }
      db.collection("users").doc(uid).set({
        name: name,
      });
      $("#sign-in").html("<strong>Sign Out</strong>");
      $("#sign-in").attr("id", "sign-out");
      // ...
    } else {
      // User is signed out.
      // ...
    }
  });
  //sign out click listener
  $(document).on("click", "#sign-out", function () {
    firebase
      .auth()
      .signOut()
      .then(function () {
        $("#journalContent").empty();
        $("#sign-out").html("<strong>Sign In</strong>");
        $("#sign-out").attr("id", "sign-in");
      });
  });
  //search click listener
  $(document).on("click", "#searchBtn", searchFn);
  $(document).keydown(function (e) {
    if (e.keyCode === 13) {
      searchFn();
    }
  });
  $(document).data("initialSearch", $("#searchContent").clone(true));
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
    const url = `https://www.googleapis.com/books/v1/volumes?q=${search}&printType=books&key=${apiKey}`;
    $.ajax(url, {
      method: "GET",
    }).then(function (data) {
      $("#searchContent").empty();
      const books = data.items;
      const resultsContainer = $("<div>").addClass("grid-container");
      var resetBtn = $("<a>").addClass(
        "button large text-center rounded boxShadow"
      );
      resetBtn.attr("id", "searchReset");
      resetBtn.text("Reset Search");
      var resetBtnCell = $("<div>").addClass("medium-12 cell text-center");
      var resetBtnRow = $("<div>").addClass(
        "grid-x grid-margin-x align-center"
      );
      resetBtnCell.append(resetBtn);
      resetBtnRow.append(resetBtnCell);
      resultsContainer.append(resetBtnRow);
      $("#searchContent").append(resultsContainer);
      var titleRow = $("<div>").addClass("grid-x grid-margin-x align-center");
      titleRow.attr("id", "titleRow");
      var titleCell = $("<div>").addClass("medium-6 cell");
      var titleCard = $("<div>").addClass("card boxShadow rounded");
      var titleDivider = $("<div>").addClass("card-divider");
      var title = $("<h3>").text("Search Results");
      titleDivider.append(title);
      titleCard.append(titleDivider);
      titleCell.append(titleCard);
      titleRow.append(titleCell);
      resultsContainer.append(titleRow);
      for (var i = 0; i < books.length; i++) {
        var book = books[i];
        var bookInfo = book.volumeInfo;
        var bookRow = $("<div>").addClass("grid-x grid-margin-x align-center");
        var bookCell = $("<div>").addClass("medium-6 cell");
        var bookCard = $("<div>").addClass("card boxShadow rounded");
        var cardDivider = $("<div>").addClass("card-divider");
        var bookTitle = $("<h4>").text(bookInfo.title);
        var saveIcon = $("<i>").addClass("fa fa-star");
        saveIcon.attr("id", "saveIcon");
        var cardSection = $("<div>").addClass("card-section text-center");
        //img grab
        var img = $("<img>").attr("src", bookInfo.imageLinks.smallThumbnail);
        img.attr("alt", `The cover of ${bookInfo.title}`);
        img.attr("data-tooltip", "");
        img.attr("tabindex", "1");
        var imgHyper = $("<a>").attr("href", book.saleInfo.buyLink);
        if (book.saleInfo.saleability === "NOT_FOR_SALE") {
          img.attr(
            "title",
            "This book is not for sale on the Google Play Store"
          );
        } else {
          img.attr("title", "Click to go to Google Play Store");
        }
        img.addClass("right");
        imgHyper.attr("target", "_blank");
        imgHyper.append(img);
        //img grab end
        var snippetText = bookInfo.description;
        if (snippetText.length > 250) {
          snippetText = snippetText.slice(0, 250);
        }
        var snippet = $("<p>").text(`${snippetText}...`);

        var authorsText = "By ";
        var authors = bookInfo.authors;
        if (authors.length === 1) {
          authorsText += authors[0];
        } else {
          len = authors.length - 1;
          for (var i = 0; i < len; i++) {
            authorsText += `${authors[i]}, `;
          }
          authorsText += authors.pop();
        }
        var authorsEl = $("<p>").text(authorsText);
        cardSection.append(imgHyper, snippet, authorsEl, saveIcon);
        cardDivider.append(bookTitle);
        bookCard.append(cardDivider, cardSection);
        bookCell.append(bookCard);
        bookRow.append(bookCell);
        resultsContainer.append(bookRow);
      }
    });
  }
  //search reset click listener
  $(document).on("click", "#searchReset", function () {
    $(document).data("initialSearch").replaceAll("#searchContent");
    $(document).data("initialSearch", $("#searchContent").clone(true));
  });
  //clear btn click listener
  $(document).on("click", "#clearBtn", function () {
    $("#keyword").val("");
    $("#author").val("");
    $("#title").val("");
    $("#genre").val("fiction");
  });
  //save search icon click listener
  $(document).on("click", "#saveIcon", function () {
    $(this).attr("id", "savedIcon");
    var savedBook = $(this).parent().parent().parent().html();
    var bookTitle = $(this).parent().prev().find("h4").text();
    db.collection("users")
      .doc(uid)
      .collection("savedBooks")
      .doc(bookTitle)
      .set({
        html: savedBook,
      });
  });
  function loadSavedBooks() {
    if (user) {
      db.collection(`users/${uid}/savedBooks`)
        .get()
        .then((snapshot) => {
          $("#searchContent").empty();
          const resultsContainer = $("<div>").addClass("grid-container");
          var resetBtn = $("<a>").addClass(
            "button large text-center rounded boxShadow"
          );
          resetBtn.attr("id", "searchReset");
          resetBtn.text("Reset Search");
          var resetBtnCell = $("<div>").addClass("medium-12 cell text-center");
          var resetBtnRow = $("<div>").addClass(
            "grid-x grid-margin-x align-center"
          );
          resetBtnCell.append(resetBtn);
          resetBtnRow.append(resetBtnCell);
          var titleRow = $("<div>").addClass(
            "grid-x grid-margin-x align-center"
          );
          titleRow.attr("id", "titleRow");
          var titleCell = $("<div>").addClass("medium-6 cell");
          var titleCard = $("<div>").addClass("card boxShadow rounded");
          var titleDivider = $("<div>").addClass("card-divider");
          var title = $("<h3>").text("Saved Searches");
          titleDivider.append(title);
          titleCard.append(titleDivider);
          titleCell.append(titleCard);
          titleRow.append(titleCell);
          resultsContainer.append(resetBtnRow, titleRow);
          $("#searchContent").append(resultsContainer);
          snapshot.docs.forEach((doc) => {
            var bookRef = doc.data().html;
            var savedBook = $.parseHTML(bookRef);
            var bookRow = $("<div>").addClass(
              "grid-x grid-margin-x align-center"
            );
            var bookCell = $("<div>").addClass("small-6 cell");
            bookCell.append(savedBook);
            bookRow.append(bookCell);
            resultsContainer.append(bookRow);
          });
        });
    } else {
      $("#searchContent").empty();
      const resultsContainer = $("<div>").addClass("grid-container");
      var resetBtn = $("<a>").addClass(
        "button large text-center rounded boxShadow"
      );
      resetBtn.attr("id", "searchReset");
      resetBtn.text("Reset Search");
      var resetBtnCell = $("<div>").addClass("medium-12 cell text-center");
      var resetBtnRow = $("<div>").addClass(
        "grid-x grid-margin-x align-center"
      );
      resetBtnCell.append(resetBtn);
      resetBtnRow.append(resetBtnCell);
      var row = $("<div>").addClass("grid-x grid-margin-x align-center");
      var cell = $("<div>").addClass("medium-6 cell");
      var card = $("<div>").addClass("card boxShadow rounded");
      var divider = $("<div>").addClass("card-divider");
      var error = $("<h3>").text("Please sign in to see saved searches.");
      divider.append(error);
      card.append(divider);
      cell.append(card);
      row.append(cell);
      resultsContainer.append(resetBtnRow, row);
      $("#searchContent").append(resultsContainer);
    }
  }
  //saved btn click listener
  $(document).on("click", "#savedBtn", function () {
    loadSavedBooks();
  });
  //savedIcon click listener
  $(document).on("click", "#savedIcon", function () {
    var bookTitle = $(this).parent().prev().find("h4").text();
    $(this).attr("id", "saveIcon");
    db.collection("users")
      .doc(uid)
      .collection("savedBooks")
      .doc(bookTitle)
      .delete()
      .then(function () {
        var title = $("#titleRow").find("h3").text();
        if (title === "Saved Searches") {
          loadSavedBooks();
        }
      });
  });
});
