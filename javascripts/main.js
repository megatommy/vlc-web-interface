StartHere();


$('#start').click(function(){
    sendCommand({'command':'pl_pause'});
    $(this).blur();
});


$('#backward').click(function(){
    sendCommand({'command':'pl_previous'});
    $(this).blur();
});


$('#forward').click(function(){
    sendCommand({'command':'pl_next'});
    $(this).blur();
});

$('#repeat').click(function(){
    sendCommand({'command':'pl_loop'});
    $(this).blur();
});


$('#random').click(function(){
    sendCommand({'command':'pl_random'});
    $(this).blur();
});

$('#radio-channels').on('click', function (e) {
    var target = $(e.target),
        trackid = target.closest('.channel-link').data('trackid');
    sendCommand('command=pl_play&id=' + trackid);

});


//search input
$('#searchform').submit(function(e){
    var str = $('#search').val();

    $('#radio-channels .radio-channel').show();
    $('#dummytrack').hide();

    if(str == '') return;

    var str = str.toLowerCase();

    $('#radio-channels .radio-channel').each(function(){

        var station = $(this).find('.channel-name').text().toLowerCase();

        if(station.indexOf(str) == -1 ) $(this).hide();

    });
    return false;
});

function StartHere(){
    $.getJSON('/requests/playlist.json', function(data){
        var vlc_playlist = data.children[0].children;

        vlc_playlist.forEach(function(el, i){

            var clone = $('#dummytrack').clone();

            clone.find('.channel-link').attr('data-trackid', el.id);

            clone.find('.channel-name').text(el.name);

            clone.find('.channel-station').text(format_time(el.duration));

            clone.css('display', 'block');

            clone.appendTo('#radio-channels');

        });
    });
    setInterval(update_status, 950);
}



function format_time(time){
    time = Math.round(time);

        var minutes = Math.floor(time / 60),
            seconds = time - minutes * 60;

        seconds = seconds < 10 ? '0' + seconds : seconds;

        return minutes + ":" + seconds;
}

function sendCommand(params){
    $.get('/requests/status.xml',params);
}

function update_status(){
    $.get('/requests/status.xml',function(data){
        var status = {
            random: JSON.parse($('random', data).text()),
            repeat: JSON.parse($('loop', data).text()),
            state: $('state', data).text(),

            time: $('time', data).text(),
            length: $('length', data).text(),
            title: $('[name="title"]', data).text(),
            artist: $('[name="artist"]', data).text(),
        };

        if(status.state == 'playing'){
            $('#start span').removeClass('glyphicon-play').addClass('glyphicon-pause');
        } else {
            $('#start span').removeClass('glyphicon-pause').addClass('glyphicon-play');
        }

        $('#repeat').toggleClass('inactive', !status.repeat);
        $('#random').toggleClass('inactive', !status.random);

        $('.track-name').html('<b>'+ status.title +'</b> by '+ status.artist);
        console.log(status);
    });
}