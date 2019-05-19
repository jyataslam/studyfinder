$(document).ready(initializeApp);

var yelpData = null;

function initializeApp () {
    tasks = new Tasks();
    map = new Maps();

    clickHandler();
}

function clickHandler () {
    const mapCallbacks = {
        generateMarkerCallback: map.generateMarker,
        removeMarkersCallback: map.removeMarkers,
        zoomToLocationCallback: map.zoomToLocation,
        setCenterCallback: map.setCenter
    }

    $('.searchContainer').on('keypress', function (e) {
        var locationInput = $('#locationInput').val().replace(' ', '_');

        if (e.keyCode === 13 && locationInput !== "") {
            yelpData = new YelpData (locationInput, mapCallbacks);
            $(".leftContainer").toggleClass("active");
            $(".searchContainer").toggleClass("active");
        }
    });

    $('.submitSearch').on('click', () => {
        var search = $('#searchInput').val().replace(' ', '_');
        var locationInput = $('#locationInput').val().replace(' ', '_');

        if (search !== "") {
            yelpData = new YelpData (search, locationInput, mapCallbacks);
        }
    });

    $('ul li:nth-child(1)').on('click', function() {
        if ($("#yelp").css('display','none')) {
            $("#yelp").show();
            $('ul li:nth-child(1)').addClass('active');
            $('.tasksContainer').hide();
            $('ul li:nth-child(2)').removeClass('active');
        }
    })

    $('ul li:nth-child(2)').on('click', function() {
        if ($('.tasksContainer').css('display','none')) {
            $('.tasksContainer').show().addClass('active');
            $('ul li:nth-child(2)').addClass('active');
            $('#yelp').hide();
            $('ul li:nth-child(1)').removeClass('active');
        }
    })
}
