class YelpData {
    constructor(search, mapCallbacks){
        this.results = null;
        this.inputField = search;
        this.generateMarkerCallback = mapCallbacks.generateMarkerCallback;
        this.removeMarkersCallback = mapCallbacks.removeMarkersCallback;
        this.zoomToLocationCallback = mapCallbacks.zoomToLocationCallback;

        this.handleYelpSuccess = this.handleYelpSuccess.bind(this);
        this.handleBusinessDataSuccess = this.handleBusinessDataSuccess.bind(this);
        this.handleYelpError = this.handleYelpError.bind(this);

        this.getDataFromYelp();
    }

    getDataFromYelp(){
        $.ajax({
            url: 'yelp.php',
            dataType: 'json',
            method: 'get',
            data: {
                'apikey': 'dJbz7ePRpBcLEb3zCwg_1tAT3gLiUJKFoMm6EfhSjQZOrd_TJCBeypMPGz6YX5G9hN6tA3A0QQIqOG5c-Sx59kj5--M5xt5YCswAeIc0S4q5EBIbWAULDSiL90OQXHYx',
                'term': this.inputField,
            },
            success: this.handleYelpSuccess,
            error: (resp) => {
                this.handleYelpError(resp);
            },
        })
    }

    handleYelpSuccess(response){
        this.removeMarkersCallback();
        this.results = response;

        $('.rightContainer').removeClass('hide');

        // yelp automatically returns results in irvine, set it so it only returns when input field is given
        // is this needed?
        $('#yelp').remove();

        var yelpDomElement = $("<div>").attr('id', 'yelp')

        for (var i = 0; i < this.results.businesses.length; i++){
            const resultInfo = {
                image: this.results.businesses[i].image_url,
                phone: this.results.businesses[i].display_phone,
                name: this.results.businesses[i].name,
                rating: this.results.businesses[i].rating,
                price: this.results.businesses[i].price,
                url: this.results.businesses[i].url,
                coordinates: this.results.businesses[i].coordinates,
                id: this.results.businesses[i].id
            }
            
            resultInfo.location = this.results.businesses[i].location.display_address[0] + ' ' + this.results.businesses[i].location.display_address[1] + ', ' 
            this.results.businesses[i].location.display_address[1];

            var newDomElement = $("<div>").addClass('resultDiv');
            var categories = "";

            for (var j=0; j<this.results.businesses[i].categories.length; j++) {
                categories+=this.results.businesses[i].categories[j].title
                if (j<this.results.businesses[i].categories.length - 1) {
                    categories+=', '
                }
            }

            $(newDomElement).append(
                $("<div>").addClass('restaurantInfo').attr('resultID', this.results.businesses[i].id)
                    .append($("<h3>").addClass('restaurantName').text(resultInfo.name))
                    .append($("<h4>").addClass('restaurantLocation').text('Address: ' + resultInfo.location))
                    .append($("<h4>").addClass('restaurantLocation').text('Phone: ' + resultInfo.phone))
                    .append($("<h4>").addClass('restaurantPrice').text('Price: ' + resultInfo.price))
                    .append($("<h4>").addClass('restaurantRating').text('Rating: ' + resultInfo.rating))
                    .append(
                        $("<h4>")
                            .addClass('restaurantCategories')
                            .text('Category: ' + categories))
                    .append($("<a>", {
                        class: 'restaurantLink',
                        text: 'Open in Yelp',
                        href: resultInfo.url,
                        target: "_blank"
                    }))
            ).prepend(
                $("<div>")
                    .addClass('imageContainer')
                    .append('<img class="restaurantImage" src="'+resultInfo.image+'"/>')
            );
            
            $(yelpDomElement).append(newDomElement);

            this.generateMarkerCallback(resultInfo);
        }

        $('.leftContainer').removeClass('row col-xs-12 col-sm-12 col-md-12').addClass('row col-xs-6 col-sm-6 col-md-6');

        $('.tabsContainer').append(yelpDomElement);

        this.clickHandler();
    }

    handleYelpError(response){
        console.log(response);
        alert('you reached an error son');
    }

    toggleResultsWindow() {
        $("#yelp").toggle();

        if ($("#yelp")) {
            $(".leftContainer").removeClass('row col-xs-12 col-sm-12 col-md-12').addClass('row col-xs-6 col-sm-6 col-md-6');
        } else {
            $(".leftContainer").removeClass('row col-xs-6 col-sm-6 col-md-6').addClass('row col-xs-12 col-sm-12 col-md-12');
        }
    }

    getBusinessData() {
        debugger;
        console.log('div clicked');
        // $.ajax({
        //     url: 'yelpid.php',
        //     dataType: 'json',
        //     method: 'get',
        //     data: {
        //         'apikey': 'dJbz7ePRpBcLEb3zCwg_1tAT3gLiUJKFoMm6EfhSjQZOrd_TJCBeypMPGz6YX5G9hN6tA3A0QQIqOG5c-Sx59kj5--M5xt5YCswAeIc0S4q5EBIbWAULDSiL90OQXHYx',
        //         'id': id,
        //     },
        //     success: this.handleBusinessDataSuccess,
        //     error: (resp) => {
        //         this.handleYelpError(resp);
        //     },
        // })
    }

    handleBusinessDataSuccess(response) {
        console.log(response);
    }

    clickHandler() {
        $('.restaurantImage').on('click', this.toggleModal);
        $('.modal-close').on('click', () => {
            $('.modal').css('display', 'none')
        }); 

        $('.restaurantInfo').on('click', () => {
            this.zoomToLocationCallback($(event.currentTarget).attr('resultID'));
        });
    }


    toggleModal(){
        console.log('image was clicked');
        $('.modal').css('display', 'block');
    }

}


// dont have yelp directly calling map
// avoid calling map.map.

// yelp calls coordinates, has callback