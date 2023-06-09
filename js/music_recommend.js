let mood = "";
let genre = "";

function getMusicRecommendation()
{
    if ( ( mood == "" || mood == undefined ) && ( genre == "" || genre == undefined ) )
    {
        document.getElementById( "recommend_result" ).innerHTML = "Select mood or genre";
        return;
    }
    let prompt = mood + genre + " 노래 3개 추천해줘";
    if ( genre != "팝송" )
    {
        prompt = "한국 노래 중에 " + prompt;
    }
    document.getElementById( "recommend_result" ).innerHTML = "Getting recommendation ...";

    let request = $.ajax({
        url: 'https://api.openai.com/v1/completions',
        headers: {
            'Authorization': `Bearer ${apikeys.OPENAI_APIKEY}`,
            'Content-Type': 'application/json'
        },
        method: 'POST',
        data: JSON.stringify({
            model: "text-davinci-003",
            prompt: prompt,
            max_tokens: 500,
        }),
        success: function ( response )
        {
            console.log( response );
            let result = response.choices[0].text.split( "\n" );
            document.getElementById( "recommend_result" ).innerHTML = "";
            for ( let i = 0; i < result.length; ++ i )
            {
                if ( result[i] == "" )
                {
                    continue;
                }
                let search_button = "<button onclick='searchRecommendation( this )' class='btn'>Search</button>"
                document.getElementById( "recommend_result" ).innerHTML += "<div>" + result[i] + "</div>" + search_button + "<br>";
            }
        },
        error: function ( xhr, status, error )
        {
            console.error( error );
        }
    });
}

function searchRecommendation( obj )
{
    document.getElementById( "search_keyword" ).value = obj.previousElementSibling.innerHTML;
    getSearchResult();
}

function setMood( new_mood )
{
    if ( new_mood == "" || new_mood == undefined )
    {
        document.getElementById( "current_mood" ).innerHTML = "None";
        return;
    }
    document.getElementById( "current_mood" ).innerHTML = new_mood;
    mood = new_mood;
}

function setGenre( new_genre )
{
    if ( new_genre == "" || new_genre == undefined )
    {
        document.getElementById( "current_genre" ).innerHTML = "None";
        return;
    }
    document.getElementById( "current_genre" ).innerHTML = new_genre;
    genre = new_genre;
}