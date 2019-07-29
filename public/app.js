// This Grabs Articles as a JSON, followed by a for loop which runs through the data array and displays the proper information. 
$.getJSON("/articles", function (data) {
    for (var i = 0; i < data.length; i++) {
      $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    }
  });
  // After clicking a p tag, it empties the notes from the note section and saves the id from the p tag.
  $(document).on("click", "p", function () {
    $("#notes").empty();
    var thisId = $(this).attr("data-id");
  
    // After an ajax call is made, then the information is console logged and added to the page. If there is a note in the article, it places the title of note in title input and places body of note in body area.
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      .then(function (data) {
        console.log(data);
        $("#notes").append("<h2>" + data.title + "</h2>");
        $("#notes").append("<input id='titleinput' name='title' >");
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
        $("#notes").append("<button data-id='" + data._id + "' id='deletenote'>Delete Note</button>");

        if (data.note) {
          $("#titleinput").val(data.note.title);
          $("#bodyinput").val(data.note.body);
        }
      });
  });
