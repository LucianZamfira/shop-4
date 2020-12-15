/**
 * Check the presence of DOM element
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/Node/contains
 * @param {String} element DOM selector
 * @return Boolean
 */
function nodeExists(element) {
	return document.body.contains(document.querySelector(element));
}

$(document).ready(function () {
	// Trick for deselecting the select tag
	$('select')
		.on('click', function () {
			let open_state = $(this).attr('data-open') || false;

			if (!open_state) {
				$(this).attr('data-open', 1);
			} else {
				$(this).removeAttr('data-open');
				$('select').blur();
			}
		})
		.on('blur', function () {
			$(this).removeAttr('data-open');
		});

	/**
	 * Defaults for Owl carousel
	 *
	 * To add or alter some defaults, just set the data-options='{}' attribute for the targeted carousel in your HTML view.
	 *
	 * (!) passing JSON in data- attribute has an important rule: all keys must be double quouted.
	 * If you need to pass double qoutes in some config, such as NavText, you need to pass the HTML encoding entity (eg. &#34;)
	 *
	 * @link https://owlcarousel2.github.io/OwlCarousel2/docs/api-options.html
	 * @link https://www.w3schools.com/html/html_entities.asp
	 */
	let carouselDefaultConfiguration = {
		dots: false,
		loop: false,
		nav: true,
		navText: ["<i class='icon-arrow-left'></i>", "<i class='icon-arrow-right'></i>"],
		lazyLoad: true,
		items: 1,
	};

	if (nodeExists('.owl--carousel')) {
		$('.owl--carousel').each(function () {
			if ($(this).attr('data-options') !== undefined) {
				$(this).owlCarousel($.extend(carouselDefaultConfiguration, $(this).data('options')));
			} else {
				$(this).owlCarousel(carouselDefaultConfiguration);
			}
		});
	}

	// Google Map For Single Property Map
	if (nodeExists('.googleMap')) {
		$('.googleMap').each(function () {
			if ($(this).length) {
				var $this = $(this);
				var $lat = $this.data('lat');
				var $long = $this.data('long');

				function initialize() {
					var mapOptions = {
						zoom: 14,
						scrollwheel: false,
						center: new google.maps.LatLng($lat, $long),
						styles: [
							{
								featureType: 'water',
								elementType: 'geometry.fill',
								stylers: [
									{
										color: '#F1F1F1',
									},
								],
							},
							{
								featureType: 'transit',
								stylers: [
									{
										color: '#F1F1F1',
									},
									{
										visibility: 'off',
									},
								],
							},
							{
								featureType: 'road.highway',
								elementType: 'geometry.stroke',
								stylers: [
									{
										visibility: 'on',
									},
									{
										color: '#fff',
									},
								],
							},
							{
								featureType: 'road.highway',
								elementType: 'geometry.fill',
								stylers: [
									{
										color: '#fff',
									},
								],
							},
							{
								featureType: 'road.local',
								elementType: 'geometry.fill',
								stylers: [
									{
										visibility: 'on',
									},
									{
										color: '#F1F1F1',
									},
									{
										weight: 1.8,
									},
								],
							},
							{
								featureType: 'road.local',
								elementType: 'geometry.stroke',
								stylers: [
									{
										color: '#ECECEC',
									},
								],
							},
							{
								featureType: 'poi',
								elementType: 'geometry.fill',
								stylers: [
									{
										visibility: 'on',
									},
									{
										// color: '#FF5151',
										color: '#dcb14a',
									},
								],
							},
							{
								featureType: 'administrative',
								elementType: 'geometry',
								stylers: [
									{
										color: '#fff',
									},
								],
							},
							{
								featureType: 'road.arterial',
								elementType: 'geometry.fill',
								stylers: [
									{
										color: '#F1F1F1',
									},
								],
							},
							{
								featureType: 'road.arterial',
								elementType: 'geometry.fill',
								stylers: [
									{
										color: '#ffffff',
									},
								],
							},
							{
								featureType: 'landscape',
								elementType: 'geometry.fill',
								stylers: [
									{
										visibility: 'on',
									},
									{
										color: '#F9F9F9',
									},
								],
							},
							{
								featureType: 'road',
								elementType: 'labels.text.fill',
								stylers: [
									{
										color: '#B7B7B7',
									},
								],
							},
							{
								featureType: 'administrative',
								elementType: 'labels.text.fill',
								stylers: [
									{
										visibility: 'on',
									},
									{
										color: '#8b8b8b',
									},
								],
							},
							{
								featureType: 'poi',
								elementType: 'labels.icon',
								stylers: [
									{
										visibility: 'off',
									},
								],
							},
							{
								featureType: 'poi',
								elementType: 'labels',
								stylers: [
									{
										visibility: 'off',
									},
								],
							},
							{
								featureType: 'road.arterial',
								elementType: 'geometry.stroke',
								stylers: [
									{
										color: '#d6d6d6',
									},
								],
							},
							{
								featureType: 'road',
								elementType: 'labels.icon',
								stylers: [
									{
										visibility: 'off',
									},
								],
							},
							{},
							{
								featureType: 'poi',
								elementType: 'geometry.fill',
								stylers: [
									{
										color: '#EBEBEB',
									},
								],
							},
						],
					};
					var map = new google.maps.Map(document.getElementById('googleMap'), mapOptions);
					var marker = new google.maps.Marker({
						position: map.getCenter(),
						icon: '',
						map: map,
						overlay: {
							values: [
								{
									address: '40.7590615,-73.969231',
									position: 'center',
									options: {
										content: '',
									},
								},
							],
							events: {
								mouseover: function (overlay, event, context) {
									var target = overlay.getDOMElement();

									target.style.zIndex = 2;

									var info = $(target).find('.gmap-info-wrapper');
									info.find('.gmap-info-template').show();
								},
								mouseout: function (overlay) {
									var target = overlay.getDOMElement();

									target.style.zIndex = 1;

									var info = $(target).find('.gmap-info-wrapper');
									info.find('.gmap-info-template').hide();
								},
							},
						},
					});
				}

				google.maps.event.addDomListener(window, 'load', initialize);
			}
		});
	}

	// Countdown Activation
	$('[data-countdown]').each(function () {
		var $this = $(this),
			finalDate = $(this).data('countdown');
		$this.countdown(finalDate, function (event) {
			$this.html(event.strftime('<li><span class="countdown__time">%D</span><h4 class="countdown__text">Days</h4></li><li><span class="countdown__time">%H</span><h4 class="countdown__text">Hours</h4></li><li><span class="countdown__time">%M</span><h4 class="countdown__text">Mints</h4></li><li><span class="countdown__time">%S</span><h4 class="countdown__text">Secs</h4></li>'));
		});
	});

	// Magnific Popup Video

	if (nodeExists('.popup-youtube')) {
		$('.popup-youtube').magnificPopup({
			type: 'iframe',
			removalDelay: 300,
			mainClass: 'mfp-fade',
		});
	}

	// Magnific Popup Image
	if (nodeExists('.popup-image')) {
		$('.popup-image').magnificPopup({
			type: 'image',
			gallery: {
				enabled: true,
			},
		});
	}

	// Magnific Popup Image Gallery
	if (nodeExists('.gallery-image')) {
		$('.gallery-image').each(function () {
			// the containers for all your galleries
			$(this).magnificPopup({
				delegate: 'a', // the selector for gallery item
				type: 'image',
				gallery: {
					enabled: true,
				},
			});
		});
	}

	// Init Bootstrap tooltips
	if (window.innerWidth > 767) {
		$('[data-toggle="tooltip"]').tooltip();
	}

	// Quantity functionality
	// TODO: block the input to accept only numbers
	$('.quantity-widget').on('click', 'button', function () {
		var quantityElement = $(this).siblings('input');
		var currentQuantity = parseInt(quantityElement.val());
		var maxQuantity = parseInt($(quantityElement).data('max')) || 9999;

		if (isNaN(currentQuantity)) currentQuantity = 0;

		if ($(this).hasClass('quantity-decrease') && currentQuantity > 1) {
			currentQuantity -= 1;
			$(quantityElement).val(currentQuantity);
		} else if ($(this).hasClass('quantity-increase') && currentQuantity < maxQuantity) {
			currentQuantity += 1;
			$(quantityElement).val(currentQuantity);
		}
	});

	// Init suggestion
	$('.review-suggestions .badge').on('click', function (event) {
		var textarea = $(this).parents('.input-row').find('textarea');
		$(textarea).val($(this).text());
	});

	// Fix the autohide dropdown
	$('.header-list .dropdown-menu').on('click', function (event) {
		event.stopPropagation();
	});

	// Init product carousel actions
	$('.carousel-product a').on('click', function (event) {
		event.preventDefault();
		event.stopPropagation();

		var newImageSrc = $(this).attr('href');
		$('.product-preview a').attr('href', newImageSrc);
		$('.product-preview img').attr('src', newImageSrc);
	});

	// Init custom-select
	/* if ($('.custom-select').length > 0) {
		$('.custom-select').select2();
	} */

	// Init custom scroll
	$('.scroll-to').on('click', function (event) {
		event.preventDefault();

		let t = $(this).attr('href').replace(/\#/, '');
		if (t == '') {
			return false;
		}
		// @link https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
		document.getElementById(t).scrollIntoView({
			block: 'nearest',
			behavior: 'smooth',
		});
	});

	$('.scroll-top').on('click', function (event) {
		event.preventDefault();

		console.log('dss');

		// @link https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
		document.querySelector('body').scrollIntoView({ behavior: 'smooth' });
	});

	// Init toast
	$('.add-cart').on('click', function (event) {
		event.preventDefault();

		$('#productToast').toast('show');
	});

	// Hide all collapsed start
	// $('main, .menu-level').on('click', function () {
	// 	$('.collapse').collapse('hide');
	// });

	// Sticky menu
	window.onscroll = function () {
		var scroll = window.pageYOffset;
		var headerHeight = $('header').outerHeight();

		if (window.innerWidth >= 320) {
			if (scroll < headerHeight + 200) {
				$('body').css('padding-top', 0);
				$('header').attr('class', 'sticky-no');
				$('nav').removeAttr('style');
			} else {
				$('body').css('padding-top', headerHeight);
				$('header').attr('class', 'sticky-yes');
				$('nav').hide();
			}
		}

		if (scroll < 100) {
			$('.scroll-top').removeClass('show');
		} else {
			$('.scroll-top').addClass('show');
		}
	};

	// Init burger menu action
	$('.menu-mobile button').on('click', function () {
		$('nav').show();
		$('body').toggleClass('menu-show');
	});

	$('.close-menu').on('click', function () {
		$('body').toggleClass('menu-show');
	});

	// TODO: clean this shit start!
	$('.toggle').on('click', function () {
		if ($('body').hasClass('menu-show')) {
			if ($(this).parent().hasClass('show')) {
				$(this).parent().toggleClass('show');
				return false;
			}

			$('nav .show').removeClass('show');
		} else {
			$(this).closest('ul').find('.show').removeClass('show');
		}

		$(this).parent().toggleClass('show');
	});

	$('.sticky-no .categories .toggle').on('click', function () {
		// If has submenu (level 3)
		var levelHeight = $(this).parent().find('.menu-shell').outerHeight();
		$(this).parents('.categories').css('min-height', levelHeight);
	});

	// On load set height
	var levelHeight = $('.categories .show').find('.menu-shell').outerHeight();
	$('.categories').css('min-height', levelHeight);
	// TODO: clean this shit end!

	$('.menu-dropdown').on('click', function (event) {
		event.stopPropagation();
	});

	$('#productToast').on('hidden.bs.toast', function () {
		console.log('myToast: hidden.bs.toast');
	});

	// Init lc-widget
	$('.lc-widget .selected').on('click', function () {
		let items = $(this).next().find('li').length;
		let newHeight = $(this).next().find('li').outerHeight() * items;

		if ($(this).next().hasClass('show')) {
			$(this).next().removeClass('show');
			$(this).next().removeAttr('style');
		} else {
			$(this).next().addClass('show');
			$(this).next().css('max-height', newHeight);
		}
	});

	$('body').on('click', function () {
		$('.lc-widget ul').removeClass('show');
	});

	$('.lc-widget .selected').on('click', function (event) {
		event.stopPropagation();
	});

	$('.lc-widget li').on('click', function (event) {
		event.stopPropagation();
		let newValue = $(this).text();

		$(this).parent().find('.active').removeClass('active');
		$(this).addClass('active');
		$(this).parents('.group').find('.selected').text(newValue);
		$(this).parent().removeClass('show');
		$(this).parent().removeAttr('style');
	});

	// Custom classname for safari
	if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) document.body.className += ' safari';

	// Fix owl accessibility
	if (nodeExists('.owl-dot')) {
		$('.owl-dot').each(function (index) {
			$(this).attr('aria-label', 'slid-' + index);
		});
	}
});
