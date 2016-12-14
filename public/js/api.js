var API = (function() {
    var url = 'http://localhost:9527/getBestMoment?q=';

    var fetch = function( query ) {
        $.get(url + query, function( data ) {
                insertNewCard( data );
            }
        );
    };

    var insertNewCard = function( data ) {
        console.log( data );
    };

    return {
        fetch: fetch
    };
})();