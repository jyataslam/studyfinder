class YelpData {
    constructor(locationInput, mapCallbacks){
        this.results = null;
        this.scrollDiv = null;
        this.locationInput = locationInput;
        this.generateMarkerCallback = mapCallbacks.generateMarkerCallback;
        this.removeMarkersCallback = mapCallbacks.removeMarkersCallback;
        this.zoomToLocationCallback = mapCallbacks.zoomToLocationCallback;
        this.setCenterCallback = mapCallbacks.setCenterCallback;

        this.handleYelpSuccess = this.handleYelpSuccess.bind(this);
        this.handleYelpError = this.handleYelpError.bind(this);
        this.handleBusinessModal = this.handleBusinessModal.bind(this);
        this.handleBusinessModal = this.handleBusinessModal.bind(this);
        this.toggleModal = this.toggleModal.bind(this);

        this.getDataFromYelp(this.locationInput);
    }

    getDataFromYelp (location) {
        $.ajax({
            url: 'yelp.php',
            dataType: 'json',
            method: 'GET',
            data: {
                'apikey': '_OTDIm5KUtFhOupgc4hIxc-3pHB_Ksl5BQvHSkkZoLUN_OlZZ8Yz1bX0FojgG7N76q8JtoyKS8y7eFtsSgYVD4eGCgfSr5Qz4C00lsHg2TvqiQWHwG8VXgi5A3bgXHYx',
                'term': 'study',
                'location': location
            },
            success: resp => {
                this.handleYelpSuccess(resp);
            },
            error: this.handleYelpError
        })
    }

    handleYelpSuccess (response) {
        this.removeMarkersCallback();
        this.results = response;

        $('.rightContainer').removeClass('hide');
        
        $('#yelp').remove();

        var yelpDomElement = $("<div>").attr('id', 'yelp');

        let loadingSpan = $('<span>').addClass('sr-only').text('Loading...');
        let spinnerDiv = $('<div>').addClass('spinner-border');
        let loadingContainer = $('<div>').addClass('d-flex justify-content-center loading-container');

        yelpDomElement.append(loadingContainer).append(spinnerDiv).append(loadingSpan);

        for (var i = 0; i < this.results.businesses.length; i++) {
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

            const address = this.results.businesses[i].location.display_address;
            let displayAddress = '';

            for (let j = 0; j <= address.length-1; j++) {
                if (j != address.length-1) {
                    displayAddress += address[j] + ', ';
                } else {
                    displayAddress += address[j]
                }
            }

            resultInfo['address'] = displayAddress;

            var newDomElement = $("<div>").attr("href", `#${resultInfo.id}`).addClass('resultDiv restaurantDivider');
            var categories = "";

            for (var j=0; j<this.results.businesses[i].categories.length; j++) {
                categories+=this.results.businesses[i].categories[j].title
                if (j<this.results.businesses[i].categories.length - 1) {
                    categories+=', '
                }
            }

            $(newDomElement).append(
                $("<div>").addClass('restaurantInfo').attr('resultID', this.results.businesses[i].id)
                    .append($("<a>", {
                        class: 'restaurantName',
                        text: resultInfo.name,
                        href: resultInfo.url,
                        target: "_blank"
                    }))
                    .append($("<p>").addClass('restaurantLocation').text('Address: ' + displayAddress))
                    .append($("<p>").addClass('restaurantPhone').text('Phone: ' + resultInfo.phone))
                    .append($("<p>").addClass('restaurantPrice').text('Price: ' + resultInfo.price))
                    .append($("<p>").addClass('restaurantRating').text('Rating: ' + resultInfo.rating))
                    .append(
                        $("<p>")
                            .addClass('restaurantCategories')
                            .text('Category: ' + categories))
                    
            ).prepend(
                $("<div>")
                    .addClass('imageContainer').append('<img class="restaurantImage" resultID="'+resultInfo.id+'" src="'+resultInfo.image+'"/>')
            );
            
            $(yelpDomElement).append(newDomElement);

            this.generateMarkerCallback(resultInfo);
        }

        this.setCenterCallback(this.results.region.center);

        $('.tabsContainer').append(yelpDomElement);

        this.clickHandler();
    }

    handleYelpError () {
        alert('yelp error');
    }

    toggleResultsWindow () {
        $("#yelp").toggle();

        if ($("#yelp")) {
            $(".leftContainer").removeClass('row col-xs-12 col-sm-12 col-md-12').addClass('row col-xs-6 col-sm-6 col-md-6');
        } else {
            $(".leftContainer").removeClass('row col-xs-6 col-sm-6 col-md-6').addClass('row col-xs-12 col-sm-12 col-md-12');
        }
    }

    getBusinessData () {
        const resultID = $(this).attr('resultID');
        $.ajax({
            url: 'yelpid.php',
            dataType: 'json',
            method: 'GET',
            data: {
                'apikey': '_OTDIm5KUtFhOupgc4hIxc-3pHB_Ksl5BQvHSkkZoLUN_OlZZ8Yz1bX0FojgG7N76q8JtoyKS8y7eFtsSgYVD4eGCgfSr5Qz4C00lsHg2TvqiQWHwG8VXgi5A3bgXHYx',
                'id': resultID
            },
            success: (resp) => {
                yelpData.handleBusinessModal(resp);
            },
            error: () => {
                console.log('Unable to retrieve business data.')
            }
        }) 
    }

    clickHandler () {
        $('.restaurantImage').on('click', this.getBusinessData);
        
        $('.modal-close').on('click', () => {
            $('#modalCarousel').css('display', 'none')
        }); 

        $('.restaurantInfo').on('click', () => {
            this.zoomToLocationCallback($(event.currentTarget).attr('resultID'));
        });
    }

    handleBusinessModal (response) {
        const photosArray = response.photos;
        this.toggleModal(photosArray);
    }

    toggleModal (photosArray) {
        $('.carousel-inner').empty();
      
        for (var index=0; index<photosArray.length; index++) {
            var image = $("<div>", {
                "style": 'background-image: url('+photosArray[index]+')',
                "class": "image"
            })

            if (index === 0) {
                var modalImage = $("<div>").addClass("item").addClass("active");
            } else {
                var modalImage = $("<div>").addClass("item");
            }
            
            modalImage.append(image);

            $('.carousel-inner').append(modalImage);
        }

        $('#modalCarousel').css('display', 'block');
    }
}
