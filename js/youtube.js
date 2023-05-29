let music_list = new Array();
let my_music_list = new Array();
let my_music_count = 0;
function getSearchResult()
{
    let searchKeyword = document.getElementById( "search_keyword" ).value;
    if ( searchKeyword == "" )
    {
        document.getElementById( "result" ).innerHTML = "please input search keyword";
        return;
    }
    else
    {
        document.getElementById( "result" ).innerHTML = "";
    }

    let request = $.ajax({
        type: "GET",
        url: "https://www.googleapis.com/youtube/v3/search?",
        data: {
            part:"snippet",
            key: apikeys.YOUTUBE_APIKEY,
            q: searchKeyword,
            order: "relevance",
            type: "video"
        },
    });

    request.done( function ( msg ) {
        msg.items.forEach( ( item, index ) => {
            music_list[index] = item;
            let video_title = item.snippet.title;
            let video_src = "https://www.youtube.com/embed/" + item.id.videoId;
            let video_iframe = "<iframe src=" + video_src + "></iframe>";
            let add_button = "<button onclick=\"addMusic(" + index + ")\">Add</button>"

            document.getElementById( "result" ).innerHTML += video_title + "<br>";
            document.getElementById( "result" ).innerHTML += video_iframe + "<br>";
            document.getElementById( "result" ).innerHTML += add_button + "<br>";
        });
        
        console.log( msg );
    });
}

function addMusic( music_index )
{
    const find = my_music_list.find( ( element ) => {
        return element == music_list[music_index];
    });
    if ( find != undefined ) {
        alert( "이미 추가된 음악입니다" );
        return;
    }
    my_music_list[my_music_count] = music_list[music_index];
    my_music_count ++;

    let music_title = my_music_list[my_music_count-1].snippet.title;

    document.getElementById( "playlist_table_body" ).innerHTML += "<tr><td>" + music_title + "</td></tr>"
    // let music_rows = document.getElementById( "playlist_table_body" ).getElementsByTagName( "tr" );
    // for ( let i = 1; i < music_rows.length; ++ i )
    // {

    // }
}

function test()
{
    let music_rows = document.getElementById( "playlist_table_body" ).getElementsByTagName( "tr" );
    for ( let i = 1; i < music_rows.length; ++ i )
    {
        music_rows[i].innerHTML += "<button onclick=\"playMusic(" + (i - 1) + ")\">play</button>";
    }
}

function playMusic( index )
{
    let music_item = my_music_list[index];
    let video_src = "https://www.youtube.com/embed/" + music_item.id.videoId + "?enablejsapi=1";
    let video_iframe = "<iframe id=\"cur_play\" style=\"width=100%;height=100%;\" src=" + video_src + "></iframe>";
    // document.getElementById( "play" ).innerHTML = video_iframe;
    var player = new YT.Player('play', {
        videoId: music_item.id.videoId,
        playerVars: {
            'loop' : 1,
            'autoplay': 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
    function onPlayerReady( event )
    {
        event.target.playVideo();
    }
    function onPlayerStateChange( event )
    {
        if ( event.data == YT.PlayerState.ENDED )
        {
            player.cueVideoById( {
                videoId:my_music_list[index + 1].id.videoId,
                startSeconds: 0,
            })
            player.playVideo();
        }
    }

    // for ( let i = index + 1; i < my_music_count; ++ i )
    // {
    //     player.cueVideoById( {
    //         videoId:my_music_list[i].id.videoId
    //     })
    // }
}