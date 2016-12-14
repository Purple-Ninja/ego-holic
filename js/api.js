var API = (function() {
    var url = 'http://52.198.213.105/getBestMoment.php?q=';

    var fetch = function( query ) {
        $.ajax({
            url: url + query,
            type: 'GET',
            jsonpcallback: 'callback',
            dataType: 'jsonp',
            success: function( data ) {
                insertNewCard( data );
            },
            error: function( data ) {
                insertNewCard( data.msg );
            }
        });
    };

    var insertNewCard = function( data ) {
        console.log( data );
    }

    return {
        fetch: fetch
    }
})();