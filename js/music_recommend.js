let mood = "";
let genre = "";

function getMusicRecommendation()
{
    if ( ( mood == "" || mood == undefined ) && ( genre == "" || genre == undefined ) )
    {
        document.getElementById( "current_setting" ).innerHTML = "장르 또는 분위기를 선택해주세요";
        return;
    }
    let prompt = mood + genre + " 노래 3개 추천해줘";
    if ( genre != "팝송" )
    {
        prompt = "한국 노래 중에 " + prompt;
    }
    document.getElementById( "current_setting" ).innerHTML = mood + " " + genre;
    document.getElementById( "recommend_result" ).innerHTML = "노래를 추천 중 입니다 ...";

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
            let result = response.choices[0].text.split;
            document.getElementById( "recommend_result" ).innerHTML = result;
        },
        error: function ( xhr, status, error )
        {
            console.error( error );
        }
    });
}

function setMood( new_mood )
{
    mood = new_mood;
}

function setGenre( new_genre )
{
    genre = new_genre;
}