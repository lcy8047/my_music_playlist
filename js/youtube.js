let music_list = new Array();
let my_music_list = new Array();
let my_music_count = 0;
let player;
let played = false;
let cur_played_music_idx = -1;

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

    let music_title = my_music_list[my_music_count].snippet.title;
    
    let music_row = "<tr><td>" + music_title + "</td>";
    music_row += "<td><button onclick=\"playMusic(" + my_music_count + ")\">play</button></td>";
    music_row += "</tr>";
    
    document.getElementById( "playlist_table_body" ).innerHTML += music_row;
    
    my_music_count ++;
}

function playMusic( index )
{
    if ( index >= my_music_count )
    {
        return;
    }

    let music_item = my_music_list[index];

    if ( played )
    {
        player.loadVideoById( music_item.id.videoId );
        cur_played_music_idx = index;
    }
    else
    {
        played = true;
        player = new YT.Player('play', {
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
            cur_played_music_idx = index;
        }
        function onPlayerStateChange( event )
        {
            if ( event.data == YT.PlayerState.ENDED )
            {
                console.log( "music is done" + cur_played_music_idx );
                playMusic( cur_played_music_idx + 1 );
            }
        }
    }
}
