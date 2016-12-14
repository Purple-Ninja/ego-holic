var API = (function() {

    var getCardUrl = '/getBestMoment?q=';
    var getImageUrl = '/getImage?url=';

    var fetch = function( query ) {
        $('.spinner').toggleClass('hide');
        $.get(getCardUrl + query, function( data ) {
                insertNewCard( data );
            }
        );
    };

    var Card = function () {
        var self = this;
        self.container = $('<div></div>').addClass('card');
        self.components = {};

        self.add = function (components) {
            components.forEach(function(component){
                var tag = component === 'img' ? '<img></img>' : '<div></div>';
                self.components[component] = $(tag).addClass('card-'+ component).appendTo(self.container);
            });
        };
        self.mount = function (entry) {
            $(entry).append(self.container);
        };
    };

    var insertNewCard = function( data ) {

        $('.ui-content').empty();

        if ( data.status === 'success' ) {
            var newCard;
            var entity = data.movie;
            var card = new Card();

            card.add(['title', 'tag', 'img']);
            

            $.get( getImageUrl + entity.url, function( imgData ) {
                $('.spinner').toggleClass('hide');
                card.components.title.text(entity.title);
                card.components.img.attr('src', imgData.imgUrl);
                card.mount('.ui-content');
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