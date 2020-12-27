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

jQuery.fn.exists = function () {
	return this.length > 0;
};

jQuery.fn.hasAttr = function (name) {
	return this.attr(name) !== undefined;
};

const ResponsiveEmbed = {
	youtube: /youtube\.com|youtu\.be/i,
	vimeo: /vimeo\.com/i,
	video: {},
	create: function (o) {
		this.iframe = $(o);
		this.setAttributes();
		if (this.isYouTube()) {
			this.addYouTubeJsApiSupport();
		} else if (this.isVimeo()) {
			this.addVimeoJsApiSupport();
		} else {
			this.makeItResponsive();
		}
	},
	setAttributes: function () {
		this.video = {
			width: this.iframe.width(),
			height: this.iframe.height(),
			ratio: this.iframe.width() / this.iframe.height(),
			src: this.iframe.attr('src'),
			random_id: this.getRandomId(),
			vendor_id: null,
			cover: 'https://api.webmanage.eu/placeholder/900x506?text=' + document.querySelector('meta[property="og:site_name"]').content.replace('&', '-'),
		};
		if (this.isVimeo() || this.isYouTube()) {
			this.video.vendor_id = this.isVimeo() ? this.getVimeoId() : this.getYoutubeId();
		}
		if (this.isYouTube()) {
			this.video.cover = this.getYouTubeCover();
		}
		if (this.isVimeo()) {
			this.getVimeoCover();
		}
		this.video.bs4_class = this.getBs4RatioClass();
	},
	getBs4RatioClass: function () {
		if (this.video.ratio <= 1) {
			return '1by1';
		}
		if (this.video.ratio > 1 && this.video.ratio <= 4 / 3) {
			return '4by3';
		}
		if (this.video.ratio > 4 / 3 && this.video.ratio < 1.8) {
			return '16by9';
		}
		if (this.video.ratio >= 1.8) {
			return '21by9';
		}
	},
	getRandomId: function () {
		return (
			Math.random()
				.toString(36)
				.replace(/[^a-z]+/g, '')
				.substr(2, 10) +
			'-' +
			Date.now()
		);
	},
	getYoutubeId: function () {
		let url = this.video.src.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
		return url[2] !== undefined ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0];
	},
	getVimeoId: function () {
		return this.video.src.split(/\//).slice(-1)[0];
	},
	getYouTubeCover: function () {
		if (this.video.width > 640) {
			return 'https://i.ytimg.com/vi_webp/' + this.video.vendor_id + '/maxresdefault.webp';
		}
		if (this.video.width > 480) {
			return 'https://i.ytimg.com/vi_webp/' + this.video.vendor_id + '/sddefault.webp';
		}
		return 'https://i.ytimg.com/vi_webp/' + this.video.vendor_id + '/hqdefault.webp';
	},
	getVimeoCover: async function () {
		const response = await axios.get('https://vimeo.com/api/oembed.json?url=https://vimeo.com/' + this.video.vendor_id);
		this.video.cover = response.data.thumbnail_url.replace(/\d+\x\d+/, '900x506');
		document.querySelector('.video-' + this.video.random_id).style = 'background-image: url(' + this.video.cover + ')';
	},
	isYouTube: function () {
		return this.youtube.test(this.video.src) === !0;
	},
	isVimeo: function () {
		return this.vimeo.test(this.video.src) === !0;
	},
	makeItResponsive: function () {
		this.iframe
			.removeAttr('height')
			.removeAttr('width')
			.wrap('<div class="embed-responsive embed-responsive-' + this.video.bs4_class + ' video-' + this.video.random_id + '">');
	},
	addYouTubeJsApiSupport: function () {
		if (window.YT_IFRAME_API === undefined) {
			var s = document.createElement('script');
			s.setAttribute('src', 'https://www.youtube.com/iframe_api');
			document.body.appendChild(s);
			window.YT_IFRAME_API = !0;
		}
		this.iframe.replaceWith('<div class="embed-responsive embed-responsive-' + this.video.bs4_class + ' video-' + this.video.random_id + '" style="background: url(' + this.video.cover + ') no-repeat center center; background-size: cover"><div class="embed-responsive-placeholder" id="' + this.video.random_id + '">');
		$('#' + this.video.random_id)
			.attr('data-youtubeid', this.video.vendor_id)
			.on('click', function () {
				if (!$(this).hasAttr('data-youtubeid')) {
					return;
				}
				let yt = new YT.Player($(this).attr('id'), {
					videoId: $(this).data('youtubeid'),
					playerVars: {
						autoplay: 0,
						autohide: 0,
						disablekb: 1,
						controls: 1,
						showinfo: 0,
						modestbranding: 1,
						loop: 0,
						fs: 0,
						autohide: 0,
						rel: 0,
						enablejsapi: 1,
					},
					events: {
						onReady: function (e) {
							e.target.playVideo();
						},
					},
				});
				$(this).removeAttr('data-youtubeid');
			});
	},
	addVimeoJsApiSupport: function () {
		if (window.VIMEO_IFRAME_API === undefined) {
			var s = document.createElement('script');
			s.setAttribute('src', 'https://player.vimeo.com/api/player.js');
			document.body.appendChild(s);
			window.VIMEO_IFRAME_API = !0;
		}
		this.iframe.replaceWith('<div class="embed-responsive embed-responsive-' + this.video.bs4_class + ' video-' + this.video.random_id + '" style="background-image: url(\'' + this.video.cover + '\'); background-repeat: no-repeat; background-position: center center; background-size: cover"><div data-vimeoid="' + this.video.vendor_id + '" class="embed-responsive-placeholder" id="' + this.video.random_id + '">');
		$('#' + this.video.random_id).on('click', function () {
			if (!$(this).hasAttr('data-vimeoid')) {
				return;
			}
			let vm = new Vimeo.Player($(this).attr('id'), {
				id: $(this).data('vimeoid'),
				width: 640,
				title: 0,
				byline: 0,
				responsive: 0,
				transparent: 0,
			});
			vm.ready().then(function () {
				vm.play();
			});
			$(this).removeClass('embed-responsive-placeholder').removeAttr('data-vimeoid');
		});
	},
};

window.addEventListener('DOMContentLoaded', () => {
	if ($('iframe').exists()) {
		$('iframe').each(function () {
			ResponsiveEmbed.create(this);
		});
	}
});

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
	$('.carousel-product .owl-item').on('click', function (event) {
		event.preventDefault();
		event.stopPropagation();
	});

	$('.carousel-product a').on('mouseenter', function () {
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

	// Init toolbar-actions
	$('.toolbar-actions .selected').on('click', function () {
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
		$('.toolbar-actions ul').removeClass('show');
	});

	$('.toolbar-actions .selected').on('click', function (event) {
		event.stopPropagation();
	});

	$('.toolbar-actions li').on('click', function (event) {
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
