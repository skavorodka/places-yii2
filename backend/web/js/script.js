$(function() {

    var base_href = '/admin';

    // Общее
    $('input.phone').mask("+7 (999) 999-99-99", {autoclear: false});

	// Транслитерация
    var alias_source = $('.alias-source'),
        alias_target = $('.alias-target');

    if (!alias_target.val()) {
		alias_source.keyup(function() {
			alias_target.val(slugify(alias_source.val()));
	    });
    }

    alias_source.focusout(function() {
    	if (!alias_target.val()) alias_target.val(slugify(alias_source.val()));
    });

    // Изображения
    $('a.delete-image').click(function() {
        var item = $(this);
        $.get(item.attr('href'), function(data) {
            item.closest('li').remove();
        });
        return false;
    });

    $('a.rotate-image').click(function() {
        var item = $(this),
            img = item.closest('li').find('img');
        $.get(item.attr('href'), function(data) {
            img.attr('src', data);
        });
        return false;
    });

    var sortable_photoes = $("#sortable_photoes");
    sortable_photoes.sortable({
        update: function(event, ui) {
            var order = []; 
            sortable_photoes.find('li').each( function(e) {
                order.push($(this).data('id'));
            });
            $.get(sortable_photoes.data('url') + '?order=' + order.join(';'));
        }
    });

    // Рейтинг
    var features_score = $('.features_score'),
        placereview_rating = $('#placereview-rating');
    features_score.change(function() {
        var total = 0;
        features_score.each(function(index, el) {
            total += parseInt($(this).val()) || 0;
        });
        var rating = (total / features_score.length).toFixed(2);
        placereview_rating.rating('update', rating);
    });

    // Часы работы
    if ($('#calendar').length) {
        var controller = new MainController();
        controller.init();

        $('[data-date-range-view]').click(function() {
            controller.getView().getDateRangeView().tab($(this).data('date-range-view'));
            return false;
        });

        $('#range-nav').on('click', '[data-tab]', function() {
            controller.getView().getCalendarView().tab($(this).data('tab'));
            return false;
        });
    }

    // Связь города и районов
    var city_select = $('.city-select');
    if (city_select.length) {
        var district_select = $('.district-select'),
            station_select = $('#place-station_id');

        //Смена города
        city_select.change(function() {
            $.get(base_href + '/districts/find-by-city/?city_id=' + $(this).val(), function(data) {
                var districts = '<option value="">Выберите район</option>';
                for (var i = 0; i < data.length; i++) {
                    districts += '<option value="' + data[i]["id"] + '">' + data[i]["name"] + '</option>';
                }
                district_select.html(districts).prop('disabled', districts ? false : true);
            });
        });

        //Смена района
        district_select.change(function() {
            $.get(base_href + '/stations/find-by-district/?district_id=' + $(this).val(), function(data) {
                var stations = '';
                for (var i = 0; i < data.length; i++) {
                    stations += '<option value="' + data[i]["id"] + '">' + data[i]["name"] + '</option>';
                }
                station_select.html(stations).prop('disabled', stations ? false : true);
            });
        });
    }

    // Карта в форме добавления заведения
    var place_map = $('#place-map');
    if (place_map.length) ymaps.ready(initPlaceAddMap);

    function initPlaceAddMap() {
        console.log(place_map.data('coords').split(','))
        var myMap = new ymaps.Map('place-map', {
            center: place_map.data('coords').split(','),
            zoom: 12
        });
    }
	
});