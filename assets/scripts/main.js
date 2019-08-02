$(document).ready(function () {
    var favArray;
    (localStorage.getItem("userFavorites")) ? renderFavorites(): '';

    function renderFavorites() {
        $("#favorites").empty();

        // console.log(localStorage.getItem("userFavorites"));
        favArray = JSON.parse(localStorage.getItem("userFavorites"));

        // Looping through each saved favorite GIF
        for (var i = 0; i < favArray.length; i++) {


            var queryParentDiv = $("<div class='col s12 m6 l4'>");
            var queryCardDiv = $("<div class='card'>");
            var queryCardImageDiv = $("<div class='card-image'>");

            var queryCardImage = $("<img>");
            queryCardImage.attr("src", favArray[i].url);
            var queryCardTitle = $("<span class='card-title'>");
            queryCardTitle.text(favArray[i].title);
            var unFavButton = $("<a class='unFavButton btn-floating halfway-fab waves-effect waves-light red'>");
            unFavButton.html("<i class ='fas fa-heart fa-lg' ></i>");
            unFavButton.attr("data-imageURL", favArray[i].url);

            var queryCardContent = $("<div class='card-content'>");

            // Creating a paragraph tag with the result item's rating
            var p = $("<p>").html(`This GIF is rated <strong>${favArray[i].rating}</strong>`);

            // Appending the paragraph and image tag to the animalDiv
            queryCardContent.append(queryCardTitle).append(p);
            queryCardImageDiv.append(queryCardImage).append(unFavButton);

            queryCardDiv.append(queryCardImageDiv).append(queryCardContent);
            queryParentDiv.append(queryCardDiv);

            // Prependng the animalDiv to the HTML page in the "#gifs-appear-here" div
            $("#favorites").prepend(queryParentDiv);
        }
    }

    function favAllInstances(url) {
        $("i", `a[data-imageURL= "${url}"]`).removeClass("far");
        $("i", `a[data-imageURL= "${url}"]`).addClass("fas");
        $(`a[data-imageURL= "${url}"]`).removeClass("blue lighten-3 favButton");
        $(`a[data-imageURL= "${url}"]`).addClass("red unFavButton");

    }

    function unFavAllInstances(url) {
        // Remove/Add classes for all GIF results that are identical
        $("i", `a[data-imageURL= "${url}"]`).removeClass("fas");
        $("i", `a[data-imageURL= "${url}"]`).addClass("far");
        $(`a[data-imageURL= "${url}"]`).removeClass("red unFavButton");
        $(`a[data-imageURL= "${url}"]`).addClass("blue lighten-3 favButton");
    }

    $("#clearResults").click(function () {
        $("#searchResults").empty();
    })

    $("#search").keypress(function (e) {
        // If enter key is pressed, search for GIF
        if (e.which == 13) {
            e.preventDefault();

            var queryURL = `https://api.giphy.com/v1/gifs/search?q=${$("#search").val()}&api_key=BkaUZZWcFij6J7AoQj3WtPb1R2p9O6V9&limit=10`;
            // Perfoming an AJAX GET request to our queryURL
            $.ajax({
                    url: queryURL,
                    method: "GET"
                })

                // After the data from the AJAX request comes back
                .then(function (response) {
                    // storing the data from the AJAX request in the results variable
                    var results = response.data;

                    // Looping through each result item
                    for (var i = 0; i < results.length; i++) {


                        var queryParentDiv = $("<div class='col s12 m6 l4'>");
                        var queryCardDiv = $("<div class='card'>");
                        var queryCardImageDiv = $("<div class='card-image'>");

                        var queryCardImage = $("<img>");
                        queryCardImage.attr("src", results[i].images.fixed_height.url);

                        var queryCardTitle = $("<span class='card-title'>");
                        queryCardTitle.text(results[i].title);

                        var objIdx = favArray.findIndex(o => o.url === results[i].images.fixed_height.url);
                        var favButton;

                        if (objIdx === -1) {
                            favButton = $("<a class='favButton btn-floating halfway-fab waves-effect waves-light blue lighten-3'>");
                            favButton.html("<i class ='far fa-heart fa-lg' ></i>");
                        } else {
                            favButton = $("<a class='unFavButton btn-floating halfway-fab waves-effect waves-light red lighten-1'>");
                            favButton.html("<i class ='fas fa-heart fa-lg' ></i>");
                        }

                        favButton.attr("data-imageURL", results[i].images.fixed_height.url);
                        favButton.attr("data-title", results[i].title);
                        favButton.attr("data-rating", results[i].rating);

                        var queryCardContent = $("<div class='card-content'>");

                        // Creating a paragraph tag with the result item's rating
                        var p = $("<p>").html(`This GIF is rated <strong>${results[i].rating}</strong>`);

                        // Appending the paragraph and image tag to the animalDiv
                        queryCardContent.append(queryCardTitle).append(p);
                        queryCardImageDiv.append(queryCardImage).append(favButton);

                        queryCardDiv.append(queryCardImageDiv).append(queryCardContent);
                        queryParentDiv.append(queryCardDiv);

                        // Prependng the animalDiv to the HTML page in the "#gifs-appear-here" div
                        $("#searchResults").prepend(queryParentDiv);
                    }


                });


        }
    })

    $(document).on("click", ".favButton", function () {
        // localStorage.clear();
        var url = $(this).attr("data-imageURL");

        favAllInstances(url)

        var rating = $(this).attr("data-rating");
        var title = $(this).attr("data-title");

        var favObj = {
            url: url,
            rating: rating,
            title: title
        };
        // userFavorites already contains one or more GIFs
        if (favArray) {
            // var favArray = JSON.parse(localStorage.getItem("userFavorites"));
            favArray.push(favObj);
            localStorage.setItem("userFavorites", JSON.stringify(favArray));

        } else {
            var tmpArray = [favObj]
            localStorage.setItem("userFavorites", JSON.stringify(tmpArray));
        }

        renderFavorites();

    })

    $(document).on("click", ".unFavButton", function () {
        // localStorage.clear();

        var url = $(this).attr("data-imageURL");

        unFavAllInstances(url);

        // userFavorites already contains one or more GIFs
        if (localStorage.getItem("userFavorites")) {
            var objIdx = favArray.findIndex(o => o.url === url);
            (objIdx !== -1) ? favArray.splice(objIdx, 1): '';

            localStorage.setItem("userFavorites", JSON.stringify(favArray));

            renderFavorites();
        }

    })
})