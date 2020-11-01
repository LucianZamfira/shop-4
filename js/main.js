function CustomDropDown() {
	$('body').on('click', function () {
		$('.custom-dropdown').removeClass('active');
	});

	$('.custom-dropdown').on('click', function (event) {
		event.stopPropagation();

		var elementTop = $(this).offset().top + 40;
		var windowHeight = $(window).height();
		var windowsScroll = $(window).scrollTop();
		var elementHeight = $(this).find('.dropdown-content').outerHeight();
		var forceTop = windowHeight - (elementTop - windowsScroll + elementHeight);

		if ($(this).hasClass('active')) {
			$(this).removeClass('active');
			return;
		} else {
			$('.custom-dropdown').removeClass('active');
			$(this).addClass('active');
			if (forceTop < 0) $(this).addClass('force-top');
		}
	});

	$('.dropdown-option').on('click', function (event) {
		event.stopPropagation();
	});
}

function simulateClick(element) {
	element.querySelector('.link').click();
}

$(document).ready(function () {
	var selectOpen = false;

	// INIT DROPDOWN
	if ($('.custom-dropdown').length > 0) {
		CustomDropDown();
	}

	// Trick for deselecting the select tag
	$('select').on('click', function (event) {
		if (selectOpen === false) {
			selectOpen = true;
		} else {
			selectOpen = false;
			$('select').blur();
		}
	});

	$('select').on('blur', function (event) {
		selectOpen = false;
	});

	// Toggle menu
	$('.burger-menu').on('click', function (event) {
		$('body').toggleClass('show-menu');
	});

	// Article click start
	$('.card--clickable .link').on('click', function (event) {
		event.stopPropagation();
	});

	$('.card--clickable').on('click', function (event) {
		simulateClick(this);
	});
	// Article click end

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
		navText: ["<i class='icon-chevron-thin-left'></i>", "<i class='icon-chevron-thin-right'></i>"],
		lazyLoad: true,
		items: 1,
	};

	if ($('.owl--carousel').length > 0) {
		$('.owl--carousel').each(function () {
			if ($(this).attr('data-options') !== undefined) {
				$(this).owlCarousel($.extend(carouselDefaultConfiguration, $(this).data('options')));
			} else {
				$(this).owlCarousel(carouselDefaultConfiguration);
			}
		});
	}

	// Init custom-select
	if ($('.custom-select').length > 0) {
		$('.custom-select').select2();
	}
});
