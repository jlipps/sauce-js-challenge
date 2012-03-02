// namespace our app
var Album = window.Album || {};

// on document ready
$(function() {
    Album.resizeMainContent();
    Album.trackWindowResize();
});

Album.resizeMainContent = function() {
    var headerAndFooter = $('header').height() + $('footer').height();
    // make height of #main fill the rest of the page
    $('#main').css({
        height: ($(window).height() - headerAndFooter) + 'px'
    });
};

Album.trackWindowResize = function() {
    $(window).resize(Album.resizeMainContent);
}
