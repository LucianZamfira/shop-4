window.addEventListener('DOMContentLoaded', () => {
	if (DH.elementExists('iframe')) {
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

	if (DH.elementExists('.owl--carousel')) {
		$('.owl--carousel').each(function () {
			if ($(this).attr('data-options') !== undefined) {
				$(this).owlCarousel($.extend(carouselDefaultConfiguration, $(this).data('options')));
			} else {
				$(this).owlCarousel(carouselDefaultConfiguration);
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

	if (DH.elementExists('.popup-youtube')) {
		$('.popup-youtube').magnificPopup({
			type: 'iframe',
			removalDelay: 300,
			mainClass: 'mfp-fade',
		});
	}

	// Magnific Popup Image
	if (DH.elementExists('.popup-image')) {
		$('.popup-image').magnificPopup({
			type: 'image',
			gallery: {
				enabled: true,
			},
		});
	}

	// Magnific Popup Image Gallery
	if (DH.elementExists('.gallery-image')) {
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
		if (t == '') return false;

		// @link https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
		document.getElementById(t).scrollIntoView({
			block: 'nearest',
			behavior: 'smooth',
		});
	});

	$('.scroll-top').on('click', function (event) {
		event.preventDefault();

		// @link https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
		document.querySelector('body').scrollIntoView({ behavior: 'smooth', block: 'start' });
	});

	// Remove cookiebar
	$('#cookiebar__close, #cookiebar__accept').on('click', function (event) {
		event.preventDefault();

		$(this).parents('.cookiebar').removeClass('active');
	});

	// Init toast
	$('.add-cart').on('click', function (event) {
		event.preventDefault();

		$('#productToast').toast('show');
	});

	// Init background image pseudo element
	if (DH.elementExists('.section--boutique')) {
		var backgroundSrc = document.querySelector('.section--boutique').dataset.image;
		document.styleSheets[0].addRule('.section--boutique:after', `background-image: url("${backgroundSrc}");`);
	}

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
	var levelHeight = document.querySelector('.show .menu-shell').offsetHeight;
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
	if (DH.elementExists('.owl-dot')) {
		$('.owl-dot').each(function (index) {
			$(this).attr('aria-label', 'slid-' + index);
		});
	}
});
