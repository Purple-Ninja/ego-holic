$( document ).ready(function() {
    $('#submit-btn').on('click', function(e) {
        e.stopPropagation();
        e.preventDefault();

        console.log("you pressed the button!");
    })
})