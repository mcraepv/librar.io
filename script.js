// Your web app's Firebase configuration
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
  var user;
  var name;
  $("#sign-in").on("click", function (event) {
    console.log("Click");
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        user = result.user;
        console.log(user);
        name = user.displayName;
        console.log(name);
        firebase.auth().onAuthStateChanged(function (user) {
          if (user) {
            // User is signed in.
            console.log(user);
            db.collection("users").doc(name).set({
              name: name,
            });
            bookCreateReset();
            buildJournals();
          } else {
            // No user is signed in.
          }
        });
      })
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
  });
  bookCreateReset();
  buildJournals();
  $(document).on("click", "#journalBtn", newBook);
  //need to add function that loads saved books and entries
  function newBook(event) {
    $(".grid-container").empty();
    var newBookRow = $("<div>").addClass("grid-x grid-margin-x align-center");
    var newBookCell = $("<div>").addClass("medium-6 cell");
    var newBookCard = $("<div>").addClass("card boxShadow rounded");
    var cardDivider = $("<div>").addClass("card-divider");
    var bookTitleInput = $("<input>").attr("type", "text");
    bookTitleInput.addClass("rounded");
    bookTitleInput.attr("placeholder", "Book Title");
    cardDivider.append(bookTitleInput);
    var cardSection = $("<div>").addClass("card-section");
    var newBookBtn = $("<button>").addClass("button large text-center rounded");
    newBookBtn.text("Create New Book!");
    newBookBtn.on("click", function (event) {
      var bookTitle = bookTitleInput.val();
      if (bookTitle === null) {
        return;
      }
      db.collection("users")
        .doc(name)
        .collection("journals")
        .doc(bookTitle)
        .set({
          title: bookTitle,
        });

      db.collection(`users/${name}/journals`)
        .get()
        .then((snapshot) => {
          snapshot.docs.forEach((doc) => {
            console.log(doc.data());
          });
        });
      bookCreateReset();
      buildJournals();
    });
    cardSection.append(newBookBtn);
    newBookCard.append(cardDivider, cardSection);
    newBookCell.append(newBookCard);
    newBookRow.append(newBookCell);
    $("#journalContent").append(newBookRow);
  }

  function buildJournals() {
    db.collection(`users/${name}/journals`)
      .get()
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          var bookRow = $("<div>").addClass(
            "grid-x grid-margin-x align-center"
          );
          var bookCell = $("<div>").addClass("medium-6 cell");
          var bookCard = $("<div>").addClass("card boxShadow rounded");
          bookCard.attr("id", "journalCard");
          var cardDivider = $("<div>").addClass("card-divider");
          var title = $("<p>").text(doc.data().title);
          cardDivider.append(title);
          bookCard.append(cardDivider);
          bookCell.append(bookCard);
          bookRow.append(bookCell);
          $("#journalContent").prepend(bookRow);
        });
      });
  }

  $(document).on("click", "#journalCard", function (event) {
    var title = $(this).find("p").text();
    var entriesRef = db.collection(`users/${name}/journals/${title}/entries`);
    $("#journalContent").empty();
    var bookRow = $("<div>").addClass("grid-x grid-margin-x align-center");
    var bookCell = $("<div>").addClass("medium-6 cell");
    var bookCard = $("<div>").addClass("card boxShadow rounded");
    bookCard.attr("id", "journalCard");
    var cardDivider = $("<div>").addClass("card-divider");
    var title = $("<p>").text(title);
    cardDivider.append(title);
    bookCard.append(cardDivider);
    bookCell.append(bookCard);
    bookRow.append(bookCell);
    $("#journalContent").prepend(bookRow);
    var newEntryBtnRow = $("<div>").addClass(
      "grid-x grid-margin-x align-center"
    );
    var newEntryBtnCell = $("<div>").addClass("cell small-4");
    var newEntryBtn = $("<a>").text("New Entry");
    newEntryBtn.addClass("button large text-center rounded boxShadow");
    newEntryBtn.attr("id", "entryBtn");
    newEntryBtnCell.append(newEntryBtn);
    newEntryBtnRow.append(newEntryBtnCell);
    $("#journalContent").append(newEntryBtnRow);
    //new entry click listener
    $(document).on("click", "#entryBtn", function () {
      newEntryBtnRow.remove();
      var entryRow = $("<div>").addClass("grid-x grid-margin-x align-center");
      var entryCell = $("<div>").addClass("medium-6 cell");
      var entryCard = $("<div>").addClass("card rounded");
      var cardDivider = $("<div>").addClass("card-divider");
      var titleInput = $("<input>").attr("type", "text");
      titleInput.addClass("rounded");
      titleInput.attr("placeholder", "Entry Title");
      cardDivider.append(titleInput);
      var cardSection = $("<div>").addClass("card-section");
      var textArea = $("<textarea>").attr("placeholder", "New Entry!");
      textArea.css({ resize: "none", height: "250px" });
      textArea.addClass("rounded");
      var saveBtn = $("<button>").addClass("button large text-center rounded");
      saveBtn.attr("id", "saveEntry");
      saveBtn.text("Save");
      cardSection.append(textArea, saveBtn);
      entryCard.append(cardDivider, cardSection);
      entryCard.addClass("boxShadow");
      entryCell.append(entryCard);
      entryRow.append(entryCell);
      $("#journalContent").append(entryRow);
      //save entry click listener
      $(document).on("click", "#saveEntry", function () {
        if (textArea.val() !== "") {
          entriesRef.doc(titleInput.val()).set({
            entryTitle: titleInput.val(),
            entryText: textArea.val(),
          });
          entryRow.remove();
          $("#journalContent").append(newEntryBtnRow);
        }
      });
    });

    entriesRef.get().then((snapshot) => {
      snapshot.docs.forEach((doc) => {
        console.log(doc.data().entryText);
        var entryRow = $("<div>").addClass("grid-x grid-margin-x align-center");
        var entryCell = $("<div>").addClass("medium-6 cell");
        var entryCard = $("<div>").addClass("card boxShadow rounded");
        var cardDivider = $("<div>").addClass("card-divider");
        var entryTitle = $("<p>").text(doc.data().entryTitle);
        var cardSection = $("<div>").addClass("card-section");
        var entryText = $("<p>").text(doc.data().entryText);
        cardDivider.append(entryTitle);
        cardSection.append(entryText);
        entryCard.append(cardDivider, cardSection);
        entryCell.append(entryCard);
        entryRow.append(entryCell);
        $("#journalContent").append(entryRow);
      });
    });
  });

  function bookCreateReset() {
    $("#journalContent").empty();
    var newJournalBtnRow = $("<div>").addClass(
      "grid-x grid-margin-x align-center"
    );
    var newJournalBtnCell = $("<div>").addClass("cell small-4 align-center");
    var newJournalBtn = $("<a>").text("New Book Journal");
    newJournalBtn.addClass("button large text-center rounded boxShadow");
    newJournalBtn.attr("id", "journalBtn");
    newJournalBtnCell.append(newJournalBtn);
    newJournalBtnRow.append(newJournalBtnCell);
    $("#journalContent").append(newJournalBtnRow);
  }
});
