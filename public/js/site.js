// Namespace our app
var Album = window.Album || {};

// Set a variable for the ID of the selected photo
// Important we set it to false here rather than 0 since we do a check
// to make sure we can deselect something down in Album.selectPhoto
Album.selectedPhotoId = false;

// On document ready, do this stuff
$(function() {
    Album.resizeMainContent(); // for using the entire browser window
    Album.trackWindowResize(); // make the layout adapt to scrolling
    Album.loadGalleryData('js/gallery_json.js', Album.initGallery);
    Album.bindNavButtons();
});

Album.resizeMainContent = function() {
    var headerAndFooter = $('#header').height() + $('#footer').outerHeight();
    var footerBorderWidth = 1; // Silly CSS box model
    // Make height of #main fill the rest of the page
    $('#main').css({
        height: (
            $(window).height() -
            headerAndFooter -
            footerBorderWidth
        ) + 'px'
    });

    // We also want to size the main photo image so that it takes up
    // the remaining height in the main content area. To do this we
    // need to take into account some styling options
    var selectedPhotoMargin = 17 + 17;
    var selectedPhotoBorder = 8 + 8;
    $('#selectedPhotoCont').css({
        height: (
            $('#main').outerHeight() -
            $('#selectedPhotoCaption').outerHeight() -
            selectedPhotoMargin -
            selectedPhotoBorder
        ) + 'px'
    });
};

Album.trackWindowResize = function() {
    $(window).resize(Album.resizeMainContent);
};

Album.loadGalleryData = function(url, callback) {
    $.getJSON(url, callback);
};

Album.initGallery = function(data) {
    // Preload images to avoid ugly flashes on photo select
    // (Uses jquery UI imageloader plugin)
    var image_urls = [];
    $.each(data.photos, function(i, p) {
        image_urls.push(p.url);
    });
    $({}).imageLoader({images: image_urls, async: true});

    // Set the title
    $('#albumTitle').html(data.album.name);

    // If we didn't get any photos, complain
    if(data.photos.length <= 0) {
        alert("We couldn't find any photos to display!");
        return;
    }

    // There's a design question about what to do if there are more than
    // 6 photos to display (perhaps a carousel). For now, just alert that
    // we'll only show 6 photos
    if(data.photos.length > 6) {
        alert("More than 6 photos were loaded; only showing first 6!");
        data.photos = data.photos.slice(0, 6);
    }

    // Figure out which photo is last for CSS reasons
    data.photos[data.photos.length - 1].isLast = true;

    // Get photo data into a different format so we can get photo by ID
    Album.photos = data.photos;

    // Build thumbnails
    $.each(Album.photos, function(i, photo) {
        var thumb = $(
            '<a href="javascript:void(0);" ' +
                'class="thumbLink" data-id="' + photo.id + '" ' +
                'id="thumb' + photo.id + '">' +
                    '<img src="' + photo.thumb_url + '" />' +
            '</a>'
        );

        if(photo.isLast) {
            thumb.addClass('last');
        }

        $('#thumbsCont').append(thumb);
    });

    var thumbWidth = 100 + 3 + 3; // width + border
    var thumbMargin = 22;

    // Set the width of the thumbs container so it can be centered
    $('#thumbsCont').css({
        width: (data.photos.length * thumbWidth + ((data.photos.length - 1) * thumbMargin)) + 'px'
    });

    // Select the first photo
    Album.selectPhoto(data.photos[0].id);

    // Bind thumbnail link behavior
    $('.thumbLink').click(function() {
        Album.selectPhoto($(this).data('id'));
    });
};

Album.selectPhoto = function(photo_id) {

    // Deselect the current link before selecting new photo
    if(Album.selectedPhotoId !== false) {
        $('#thumb' + Album.selectedPhotoId).removeClass('selected');
    }

    Album.selectedPhotoId = photo_id;

    var photo = Album.getPhotoForId(photo_id);

    // Load new photo data into the viewer
    var img = $('<img src="' + photo.url + '" />');
    $('#selectedPhotoCont').html(img);
    $('#selectedPhotoTitle').html(photo.title);
    $('#selectedPhotoDesc').html('Taken on ' + photo.date + ' in ' + photo.location);

    // Change the 'selected' state of the selected photo's thumb
    $('#thumb' + photo_id).addClass('selected');
};

Album.getPhotoForId = function(id, return_index) {
    if(typeof return_index === 'undefined') {
        return_index = false;
    }

    var response = undefined;

    $.each(Album.photos, function(i, p) {
        if(p.id == id) {
            if(return_index) {
                response = i;
            } else {
                response = p;
            }
        }
    });
    return response;
};

Album.getIndexForId = function(id) {
    return Album.getPhotoForId(id, true);
};

Album.bindNavButtons = function() {
    $('#nextButton').click(function() {
        var curIndex = Album.getIndexForId(Album.selectedPhotoId);
        curIndex++;
        if(curIndex >= Album.photos.length) {
            curIndex = 0;
        }
        Album.selectPhoto(Album.photos[curIndex].id);
    });

    $('#prevButton').click(function() {
        var curIndex = Album.getIndexForId(Album.selectedPhotoId);
        curIndex--;
        if(curIndex < 0) {
            curIndex = Album.photos.length - 1;
        }
        Album.selectPhoto(Album.photos[curIndex].id);
    });
};
