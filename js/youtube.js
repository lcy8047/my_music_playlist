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
    document.getElementById( "playlist" ).innerHTML += music_list[music_index].snippet.title + "<br>";
    my_music_count ++;
}