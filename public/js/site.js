// namespace our app
var Album = window.Album || {};

// on document ready
$(function() {
    Album.resizeMainContent();
    Album.trackWindowResize();
    Album.loadGalleryData('js/gallery_json.js', Album.initGallery);
});

Album.resizeMainContent = function() {
    var headerAndFooter = $('header').height() + $('footer').outerHeight();
    var footerBorderWidth = 1; // silly CSS box model
    // make height of #main fill the rest of the page
    $('#main').css({
        height: ($(window).height() - headerAndFooter - footerBorderWidth) + 'px'
    });
};

Album.trackWindowResize = function() {
    $(window).resize(Album.resizeMainContent);
};

Album.loadGalleryData = function(url, callback) {
    $.getJSON(url, callback);
};

Album.initGallery = function(data) {
    $('#albumTitle').html(data.album.name);
};


