$(document).ready(function() {

  'use strict';

  // =====================
  // Membership Navigation
  // Add current class to
  // the current page
  // =====================

  var pathname = window.location.pathname;

  $('.js-nav__link-membership[href="'+ pathname +'"]').addClass('c-nav__link--current');

  // =====================
  // Navigation
  // =====================

  $('.js-nav-toggle').click(function(e) {
    e.preventDefault();
    $('.c-header-drawer').toggleClass('is-active');

    // $(this).toggleClass('c-nav-toggle--close');

    $('body').toggleClass('e-mode-mobile');
  });
  // =====================
  // Koenig Gallery
  // =====================
  var gallery_images = document.querySelectorAll('.kg-gallery-image img');

  gallery_images.forEach(function (image) {
    var container = image.closest('.kg-gallery-image');
    var width = image.attributes.width.value;
    var height = image.attributes.height.value;
    var ratio = width / height;
    container.style.flex = ratio + ' 1 0%';
  });

  // =====================
  // Decode HTML entities returned by Ghost translations
  // Input: Plus d&#x27;articles
  // Output: Plus d'articles
  // =====================

  function decoding_translation_chars(string) {
    return $('<textarea/>').html(string).text();
  }

  // =====================
  // Responsive videos
  // =====================

  $('.c-content').fitVids({
    'customSelector': [ 'iframe[src*="ted.com"]'          ,
                        'iframe[src*="player.twitch.tv"]' ,
                        'iframe[src*="dailymotion.com"]'  ,
                        'iframe[src*="facebook.com"]'
                      ]
  });

  // =====================
  // Images zoom
  // =====================

  $('.c-content img').attr('data-action', 'zoom');

  // If the image is inside a link, remove zoom
  $('.c-content a img').removeAttr('data-action');

  // =====================
  // Clipboard URL Copy
  // =====================

  var clipboard = new ClipboardJS('.js-share__link--clipboard');

  clipboard.on('success', function(e) {
    var element = $(e.trigger);

    element.addClass('tooltipped tooltipped-s');
    element.attr('aria-label', clipboard_copied_text);

    element.mouseleave(function() {
      $(this).removeAttr('aria-label');
      $(this).removeClass('tooltipped tooltipped-s');
    });
  });

  // =====================
  // Ajax Load More
  // =====================

  var pagination_next_url = $('link[rel=next]').attr('href'),
    $load_posts_button = $('.js-load-posts');

  $load_posts_button.click(function(e) {
    e.preventDefault();

    var request_next_link =
      pagination_next_url.split(/page/)[0] +
      'page/' +
      pagination_next_page_number +
      '/';

    $.ajax({
      url: request_next_link,
      beforeSend: function() {
        $load_posts_button.text(decoding_translation_chars(pagination_loading_text));
        $load_posts_button.addClass('c-btn--loading');
      }
    }).done(function(data) {
      var posts = $('.js-post-card__wrap', data);

      $('.js-grid').append(posts);

      $load_posts_button.text(decoding_translation_chars(pagination_more_posts_text));
      $load_posts_button.removeClass('c-btn--loading');

      pagination_next_page_number++;

      // If you are on the last pagination page, hide the load more button
      if (pagination_next_page_number > pagination_available_pages_number) {
        $load_posts_button.addClass('c-btn--disabled').attr('disabled', true);
      }
    });
  });

  // =====================
  // Mobile Search form
  // =====================
  var mSearchForm = document.getElementById("c-search");
  if (mSearchForm) {
    mSearchForm.addEventListener('submit', function(e) {
      e.preventDefault();

      var searchParam = $(this).find('.c-search__stx')[0].value;
      window.location.href = '/search/' + encodeURIComponent(searchParam.trim());
      return false;
    });
  }

  // =====================
  // Tab
  // =====================
  $('.c-home__post-tabs .c-home__post-tab--link').click(function(){
    var tab_id = $(this).attr('data-tab');

    $('.c-home__post-tabs .c-home__post-tab--link').removeClass('current');
    $('.c-home__post-tab--content').removeClass('current');

    $(this).addClass('current');
    $("#"+tab_id).addClass('current');
  })

  // Internal tag arrange
  const internalTagChips = $('.c-product-card__internal-tag .c-product-card__chips--link');
  if (internalTagChips) {
    internalTagChips.lettering().parents('.c-product-card__internal-tag').addClass('computed');
  };

  // Overwrite portal popup style
  const portalBtn = document.querySelector('a[data-portal="account"]');
  if (portalBtn) {
    portalBtn.addEventListener('click', function (e){

      const portalIframe = $('#ghost-portal-root iframe');
      portalIframe.on('load', function() {
        let head = portalIframe.contents().find("head");
        // let css = '<style>/* 여기에 css 코드를 쓰세요 */</style>';
        // $(head).append(css);

        var cssLink = document.createElement("link");
        cssLink.href = "/assets/css/portal-popup.css";
        cssLink.rel = "stylesheet";
        cssLink.type = "text/css";
        $(head).append(cssLink);
      });

    });
  }
});

