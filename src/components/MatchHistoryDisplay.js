import { useRef } from 'react';

/**
 * Get the index of the summoner from the participants array. 
 * This is made into a function because other methods reuse the same array.
 */
function GetIndexOfPlayerFromMatch(match, summonerId){
    for(let i = 0; i < match.length; i++){
        if(match[i]['summonerId'] === summonerId)
            return i;
    }
    return -1;
}


/**
 * From the api data, iterate through the participants to return the image of the champion
 * @param {list} match['participants']
 */
function GetChampionImgOfPlayerFromMatch(match, summonerId, championData){
    const idx = GetIndexOfPlayerFromMatch(match, summonerId);
    if(idx === -1)
        return;
    return championData[match[idx]['championId']][1];
}

/**
 * Change the background color of the match, depending if the player won or lost the match
 * If the game was a remake (less than 3 minutes, then make the background color gray)
 * If the game was won, then make the background color blue
 * If the game was lost, then make the background color red
 */
function changeBackgroundColor(match, summonerId, gameDuration){
    const idx = GetIndexOfPlayerFromMatch(match, summonerId);
    if(idx === -1)
        return;
    return {backgroundColor: (gameDuration <= 180 ? 'gray' : (match[idx]['win'] ? '#006db0' : '#9d2933'))};
}

/**
 * Simply return a string of the new uri
 */
function getNewUri(platform, summoner){
    return '/profile/' + platform + '/' + summoner;
}

/**
 * Compute the kda.  If deaths is 0, then return INFINITE
 */
function computeKDA(kills, deaths, assists){
    return (deaths === 0 ? 'INFINITE' : Math.round((kills + assists)/deaths*100, 2)/100);
}

/**
 * Alter the team position string.
 * If the role is utility, then change to support
 * If the role is another role, then add padding to the beginning of the string to match
 * If the game mode wasn't in summoner's rift, then simply add a padding of 8 spaces
 */
function getRolePosition(role){
    if(role === '')
        return '      ';
    else if(role === 'UTILITY')
        return 'SUPPORT';
    else{
        let result = '';
        for(let i = 0; i < (7 - role.length); i++)
            result = result.concat(' ');
        return result + role;
    }
}

/**
 * Given the passed in summoner match history detail data object,
 * Display the match history
 * @param {object} summonerMatchHistoryDetailData 
 * @returns 
 */
export default function MatchHistoryDisplay({summonerMatchHistoryDetailData, platform, summonerApiData, errorData, championData, queueData}){
    // 7 false states initially
    let isExpandedMatchDetailView = useRef([false, false, false, false, false, false, false]);

    /**
     * When the specific match is clicked, either expand or collapse the details.
     * By default, the details are collapsed.  
     */
    function ExpandOrCollapseMatchDetail(idx){
        isExpandedMatchDetailView.current[idx] = !isExpandedMatchDetailView.current[idx];
        if(isExpandedMatchDetailView.current[idx])
            document.getElementsByClassName('match-expanded-detail')[idx].style.display = 'block';
        else
            document.getElementsByClassName('match-expanded-detail')[idx].style.display = 'none';
    }

    return (
        <>
            {errorData
            ?
                <p>DATA HAS ERROR xdd</p>
            :
                !summonerMatchHistoryDetailData
                    ?  
                        <p>Waiting...</p>
                    : 
                        summonerMatchHistoryDetailData.map((match, idx) => (
                            <div className='match-history-detail'>
                                <ul key={match['gameId']} className="match-detail" style={changeBackgroundColor(match['participants'], summonerApiData['id'], match['gameDuration'])} onClick={() => ExpandOrCollapseMatchDetail(idx)}>
                                    <img src={GetChampionImgOfPlayerFromMatch(match['participants'], summonerApiData['id'], championData)} alt='plink'/>
                                    <p>Game Start Date: {new Date(match['gameCreation']).toLocaleString()}</p>
                                    <p>Game Duration: {Math.floor(match['gameDuration'] / 60)} minutes, {match['gameDuration'] % 60} seconds</p>
                                    <p>Queue Type: {queueData[match['queueId']][0]}</p>
                                    <div className='match-expanded-detail' style={{display: 'none'}} onClick={(e) => e.stopPropagation()}>
                                        {
                                            match['participants'].map( participant => (
                                                <p>
                                                    <a href={getNewUri(platform, participant['summonerName'])}>{participant['summonerName']}</a>
                                                    {' => '} {getRolePosition(participant['teamPosition'])}
                                                    <img src={championData[participant['championId']][1]} alt="kekw"/><br/>
                                                    {participant['kills']} kills / {participant['deaths']} deaths / {participant['assists']} assists {' => '} ({computeKDA(participant['kills'], participant['deaths'], participant['assists'])}) KDA.
                                                </p>
                                            ))
                                        }
                                    </div>
                                </ul>
                            </div>
                        ))
            }
        </>
    )
}

/**
 * 
 * 
 * 
 * <div class='match-history-viewer-container'>
        {% for participant in match.participants %}
            {{ participant.teamPosition }}&emsp;&emsp;
            <a href='/platform/{{ match.platform }}/summoner/{{ participant.summonerName }}' class='navigate-to-different-user'>{{ participant.summonerName }}</a>&emsp;&emsp;
            <img src='{{ participant.championImage }}' class="match-history-champion-image">&emsp;&emsp;
            {{ participant.kills }} kills/{{ participant.deaths }} deaths/{{participant.assists }} assists
            <div class='participant-items'>
                {% for item in participant.items %}
                    {% for key, omegalul_useless_value_icant_kekw in item.items %}
                    {% if key > 0 %}
                        <img src="http://ddragon.leagueoflegends.com/cdn/{{ match.version }}/img/item/{{ key }}.png" class="item-icon-name">
                        <div class="item-tooltip">
                            This item is {{ omegalul_useless_value_icant_kekw }}
                        </div>
                        <br>
                    {% endif %}
                    {% endfor%}
                {% endfor %}
            </div>
            <br><br>
        {% endfor %}
    </div>
 */