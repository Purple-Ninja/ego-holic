var API = (function() {

    var hostname = 'https://ego-holic.herokuapp.com';
    var getCardUrl = hostname + '/getBestMoment?q=';
    var getImageUrl = hostname + '/getImage?url=';
    var cache = {};

    var fetch = function( query ) {
        $.get(getCardUrl + query, function( data ) {
                insertNewCard( data );
            }
        );
    };

    var insertNewCard = function( data ) {

        $('.ui-content').empty();

        if ( data.status === 'success' ) {

            var newCard;

            if (cache.hasOwnProperty(data.movie.url)) {
                newCard = '<div class="card"><div class="card-img"><h2>' + data.recipe.title + '</h2><img src="' + cache[data.movie.url] + '"></div></div>';
            } else {
                newCard = '<div class="card"><div class="card-img"><h2>' + data.recipe.title + '</h2><img src=""></div></div>';
            }

            $('.ui-content').append(newCard);

            $.get( getImageUrl + data.movie.url, function( imgData ) {
                // update the image URL
                $('.ui-content img').attr('src', imgData.imgUrl);

                // update cache
                cache[data.movie.url] = imgData.imgUrl;
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