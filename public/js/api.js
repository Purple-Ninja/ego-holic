var API = (function() {

    var getCardUrl = '/getBestMoment?q=';
    var getImageUrl = '/getImage?url=';

    var fetch = function( query ) {
        $('.spinner').removeClass('hide');
        $.get(getCardUrl + query, function( data ) {
                insertNewCards( data );
            }
        );
    };

    var Card = function () {
        var self = this;
        self.container = $('<div></div>').addClass('card');
        self.components = {};
        var tag;
        self.add = function (components) {
            components.forEach(function(component){
                tag = component === 'title' ? '<a></a>' : '<div></div>';
                self.components[component] = $(tag).addClass('card-'+ component).appendTo(self.container);
            });
        };
        self.mount = function (entry) {
            $(entry).append(self.container);
        };
    };

    var groupIcons = {
        movie: '<i class="fa fa-video-camera" aria-hidden="true"></i>',
        recipe: '<i class="fa fa-apple" aria-hidden="true"></i>'
    };

    var insertNewCard = function (entity, callback) {
        
        var card = new Card();

        card.add(['group', 'title', 'tag', 'img', 'description']);

        card.components.group.html(groupIcons[entity.type]);

        card.components.title.text(entity.title);
        card.components.title.attr('href', entity.url);
        card.components.tag.text(entity.tag);
        card.components.description.text(entity.description);

        var error = null;
        $.get( getImageUrl + entity.url, function( imgData ) {
            if (imgData.imgUrl) {
                card.components.img.attr('data-original', imgData.imgUrl);
                card.components.img.addClass('lazy');
            } else {
                error = 'no image';
            }
            card.mount('.ui-content');
            callback(error, entity.type);
        });
    }

    var insertNewCards = function( data ) {

        $('.ui-content').empty();

        if ( data.status === 'success' ) {
            var newCard;
            var groups = Object.keys(data)
                            .filter(function (e) {
                                return e !== 'status';
                            })
                            .map(function (entityType) {
                                var entity = _.cloneDeep(data[entityType]);
                                entity.type = entityType;
                                return entity;
                            });

            async.map(groups, insertNewCard, function(err, results) {
                console.log('>>> done');
                // lazy load image
                setTimeout(function(){
                    $('.lazy').lazyload({ effect : "fadeIn" });
                    $('.spinner').removeClass('hide').addClass('hide');
                }, 50);
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