//start btn
$('#start').click(function(){
    sendCommand({'command':'pl_pause'});
});

$('#radio-channels').on('click', function (e) {
    var target = $(e.target),
        trackid = target.closest('.channel-link').data('trackid');
    console.log(e.target);
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

$.getJSON('requests/playlist.json', function(data){
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



function format_time(time){
    time = Math.round(time);

        var minutes = Math.floor(time / 60),
            seconds = time - minutes * 60;

        seconds = seconds < 10 ? '0' + seconds : seconds;

        return minutes + ":" + seconds;
}

function sendCommand(params){
    $.get('requests/status.xml',params);
}