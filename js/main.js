/* function CustomDropDown() {
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
} */

// function simulateClick(element) {
// 	element.querySelector('.link').click();
// }

$(document).ready(function () {
	/* var selectOpen = false;

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
	// Article click end */

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

	if ($('.owl--carousel').length > 0) {
		$('.owl--carousel').each(function () {
			if ($(this).attr('data-options') !== undefined) {
				$(this).owlCarousel($.extend(carouselDefaultConfiguration, $(this).data('options')));
			} else {
				$(this).owlCarousel(carouselDefaultConfiguration);
			}
		});
	}

	// Google Map For Single Property Map
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

	// Init custom-select
	/* if ($('.custom-select').length > 0) {
		$('.custom-select').select2();
	} */
});
