$( document ).ready(function() {
    $('#submit-btn').on('click', function(e) {
        e.stopPropagation();
        e.preventDefault();

        API.fetch($('input').val());
    })
})