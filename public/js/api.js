var API = (function() {

    var hostname = 'https://ego-holic.herokuapp.com';
    var getCardUrl = hostname + '/getBestMoment?q=';
    var getImageUrl = hostname + '/getImage?url=';

    var fetch = function( query ) {
        $.get(getCardUrl + query, function( data ) {
                insertNewCard( data );
            }
        );
    };

    var insertNewCard = function( data ) {

        $('.ui-content').empty();

        if ( data.status === 'success' ) {

            $.get( getImageUrl + data.movie.url, function( imgData ) {
                var newCard = '<div class="card"><div class="card-img"><h2>' + data.recipe.title + '</h2><img src="' + imgData.imgUrl + '"></div></div>';

                $('.ui-content').append(newCard);
            });
        } else {
            // no result
            var newCard = '<div class="card"><div class="card-img"><h2>No Result</h2></div></div>';
            $('.ui-content').append(newCard);
        }
    };

    return {
        fetch: fetch
    };
})();