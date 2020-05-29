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
  var name = "";
  var uid = "";
  //sign in click listener
  $("#sign-in").on("click", function (event) {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function (result) {
        // The signed-in user info.
        user = result.user;
        name = user.displayName;
        uid = user.uid;
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
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      uid = user.uid;
      db.collection("users").doc(uid).set({
        name: name,
      });
      $("#sign-in").html("<strong>Sign Out</strong>");
      $("#sign-in").attr("id", "sign-out");
      buildJournals();
    } else {
      var row = $("<div>").addClass("grid-x grid-margin-x align-center");
      var cell = $("<div>").addClass("medium-6 cell text-center");
      var card = $("<div>").addClass("card boxShadow rounded");
      var cardDivider = $("<div>").addClass("card-divider");
      var cardSection = $("<div>").addClass("card-section");
      var cardTitle = $("<h3>").text("No book journals found.");
      cardDivider.append(cardTitle);
      var cardText = $("<p>").text(
        "Please sign in with Google to create a new journal!"
      );
      cardSection.append(cardText);
      card.append(cardDivider, cardSection);
      cell.append(card);
      row.append(cell);
      $("#journalContent").append(row);
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
  //new journal btn click listener
  $(document).on("click", "#journalBtn", newBook);
  function newBook(event) {
    newJournalBtnRow.remove();
    var newBookRow = $("<div>").addClass("grid-x grid-margin-x align-center");
    var newBookCell = $("<div>").addClass("medium-6 cell text-center");
    var newBookCard = $("<div>").addClass("card boxShadow rounded");
    var cardDivider = $("<div>").addClass("card-divider");
    var bookTitleInput = $("<input>").attr("type", "text");
    bookTitleInput.addClass("rounded");
    bookTitleInput.attr("placeholder", "Book Title");
    bookTitleInput.attr("id", "bookTitleInput");
    cardDivider.append(bookTitleInput);
    var cardSection = $("<div>").addClass("card-section");
    var newBookBtn = $("<a>").addClass(
      "button large text-center rounded card-btn"
    );
    newBookBtn.text("Create New Journal!");
    newBookBtn.attr("id", "newBookBtn");
    var cancelBtn = $("<a>").text("Cancel");
    cancelBtn.addClass("button large text-center rounded boxShadow card-btn");
    cancelBtn.attr("id", "cancelBookBtn");
    cardSection.append(newBookBtn, cancelBtn);
    newBookCard.append(cardDivider, cardSection);
    newBookCell.append(newBookCard);
    newBookRow.append(newBookCell);
    $("#journalContent").append(newBookRow);
  }
  var newJournalBtnRow;
  function buildJournals() {
    $("#journalContent").empty();
    newJournalBtnRow = $("<div>").addClass("grid-x grid-margin-x align-center");
    var newJournalBtnCell = $("<div>").addClass("cell small-4 text-center");
    var newJournalBtn = $("<a>").text("New Book Journal");
    newJournalBtn.addClass("button large text-center rounded boxShadow");
    newJournalBtn.attr("id", "journalBtn");
    newJournalBtnCell.append(newJournalBtn);
    newJournalBtnRow.append(newJournalBtnCell);
    $("#journalContent").append(newJournalBtnRow);
    db.collection(`users/${uid}/journals`)
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
          var journalTitle = $("<h3>").text(doc.data().title);
          cardDivider.append(journalTitle);
          bookCard.append(cardDivider);
          bookCell.append(bookCard);
          bookRow.append(bookCell);
          $("#journalContent").prepend(bookRow);
        });
      });
  }
  //create new book button click listener
  $(document).on("click", "#newBookBtn", function (event) {
    var bookTitle = $("#bookTitleInput").val();
    if (bookTitle === null) {
      return;
    }
    db.collection("users").doc(uid).collection("journals").doc(bookTitle).set({
      title: bookTitle,
    });

    db.collection(`users/${uid}/journals`)
      .get()
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {});
      });
    buildJournals();
  });
  // cancelBtn click listener
  $(document).on("click", "#cancelBookBtn", function () {
    buildJournals();
  });
  var newEntryBtnRow;
  var entriesRef;
  var title;
  //journals click listener
  $(document).on("click", "#journalCard", function (event) {
    title = $(this).find("h3").text();
    entriesRef = db.collection(`users/${uid}/journals/${title}/entries`);
    buildEntries();
  });
  //back click listener
  $(document).on("click", "#backBtn", function () {
    buildJournals();
  });
  //new entry click listener
  $(document).on("click", "#entryBtn", function () {
    newEntryBtnRow.remove();
    var entryRow = $("<div>").addClass("grid-x grid-margin-x align-center");
    entryRow.attr("id", "entryRow");
    var entryCell = $("<div>").addClass("medium-6 cell");
    var entryCard = $("<div>").addClass("card rounded boxShadow");
    var cardDivider = $("<div>").addClass("card-divider");
    var titleInput = $("<input>").attr("type", "text");
    titleInput.addClass("rounded");
    titleInput.attr("placeholder", "Entry Title");
    titleInput.attr("id", "titleInput");
    cardDivider.append(titleInput);
    var cardSection = $("<div>").addClass("card-section text-center");
    var textArea = $("<textarea>").attr("placeholder", "New Entry!");
    textArea.css({
      resize: "none",
      height: "250px",
    });
    textArea.addClass("rounded");
    textArea.attr("id", "textArea");
    var saveBtn = $("<button>").addClass(
      "button large text-center rounded card-btn"
    );
    saveBtn.attr("id", "saveEntry");
    saveBtn.text("Save");
    var cancelBtn = $("<a>").text("Cancel");
    cancelBtn.addClass("button large text-center rounded card-btn");
    cancelBtn.attr("id", "cancelBtn");
    cardSection.append(textArea, saveBtn, cancelBtn);
    entryCard.append(cardDivider, cardSection);
    entryCell.append(entryCard);
    entryRow.append(entryCell);
    $("#journalContent").append(entryRow);
  });
  //save entry click listener
  $(document).on("click", "#saveEntry", function () {
    var textArea = $("#textArea");
    var titleInput = $("#titleInput");
    if (textArea.val() !== "") {
      entriesRef.doc(titleInput.val()).set({
        entryTitle: titleInput.val(),
        entryText: textArea.val(),
      });
      $("entryRow").remove();
      buildEntries();
      $("#journalContent").append(newEntryBtnRow);
    }
  });
  //cancel click listener
  $(document).on("click", "#cancelBtn", function () {
    $("entryRow").remove();
    $("#journalContent").append(newEntryBtnRow);
  });
  //builds journal entries
  function buildEntries() {
    $("#journalContent").empty();
    newEntryBtnRow = $("<div>").addClass("grid-x grid-padding-x align-center");
    var newEntryBtnCell = $("<div>").addClass("cell small-2 text-right");
    var newEntryBtn = $("<a>").text("Create New Entry");
    newEntryBtn.addClass("button large text-center rounded boxShadow");
    newEntryBtn.attr("id", "entryBtn");
    var backBtnCell = $("<div>").addClass("cell small-2");
    var backBtn = $("<a>").text("Back to Journals");
    backBtn.addClass("button large text-center rounded boxShadow");
    backBtn.attr("id", "backBtn");
    backBtnCell.append(backBtn);
    var deleteCell = $("<div>").addClass("cell small-2 text-left");
    var deleteBtn = $("<a>").text("Delete Journal");
    deleteBtn.addClass("button large text-center rounded boxShadow");
    deleteBtn.attr("id", "deleteBtn");
    deleteCell.append(deleteBtn);
    newEntryBtnCell.append(newEntryBtn);
    newEntryBtnRow.append(newEntryBtnCell, backBtnCell, deleteCell);
    $("#journalContent").append(newEntryBtnRow);
    entriesRef.get().then((snapshot) => {
      var titleRow = $("<div>").addClass("grid-x grid-padding-x align-center");
      var titleCell = $("<div>").addClass("cell small-6 text-right");
      var titleCard = $("<div>").addClass("card boxShadow rounded");
      var titleDivider = $("<div>").addClass("card-divider");
      var titleText = $("<h3>").text(`${title} Journal`);
      titleDivider.append(titleText);
      titleCard.append(titleDivider);
      titleCell.append(titleCard);
      titleRow.append(titleCell);
      snapshot.docs.forEach((doc) => {
        var entryRow = $("<div>").addClass("grid-x grid-margin-x align-center");
        var entryCell = $("<div>").addClass("medium-6 cell");
        var entryCard = $("<div>").addClass("card boxShadow rounded");
        var cardDivider = $("<div>").addClass("card-divider");
        var entryTitle = $("<h4>").text(doc.data().entryTitle);
        var cardSection = $("<div>").addClass("card-section");
        var entryText = $("<p>").text(doc.data().entryText);
        var deleteEntryBtn = $("<a>").text("Delete Entry");
        deleteEntryBtn.addClass("button large text-center rounded");
        deleteEntryBtn.attr("id", "deleteEntryBtn");
        cardDivider.append(entryTitle);
        cardSection.append(entryText, deleteEntryBtn);
        entryCard.append(cardDivider, cardSection);
        entryCell.append(entryCard);
        entryRow.append(entryCell);
        $("#journalContent").prepend(entryRow);
      });
      $("#journalContent").prepend(titleRow);
    });
  }
  //delete journal button click listener
  $(document).on("click", "#deleteBtn", function () {
    db.collection(`users/${uid}/journals`)
      .doc(title)
      .delete()
      .then(buildJournals());
  });
  //delete entry btn click listener
  $(document).on("click", "#deleteEntryBtn", function () {
    var titleRef = $(this).parent().prev().find("h4").text();
    entriesRef.doc(titleRef).delete().then(buildEntries);
  });
});
