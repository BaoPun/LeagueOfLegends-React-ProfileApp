/**
 * This function will determine the path of the static emblem file.
 * Assumes that there is a solo q (or even flex q) rank to parse through
 */
function EmblemString(tier){
    const folder = '/rank_borders/emblem-';
    switch(tier){
        case 'IRON':
            return folder + 'iron.png';
        case 'BRONZE':
            return folder + 'bronze.png';
        case 'SILVER':
            return folder + 'silver.png';
        case 'GOLD':
            return folder + 'gold.png';
        case 'PLATINUM':
            return folder + 'platinum.png';
        case 'DIAMOND':
            return folder + 'diamond.png';
        case 'MASTER':
            return folder + 'master.png';
        case 'GRANDMASTER':
            return folder + 'grandmaster.png';
        case 'CHALLENGER':
            return folder + 'challenger.png';
        default:
            return folder + 'emerald.png';
    }
}

/**
 * Display the ranked solo q information for the given data.
 * One additional check: if the person ONLY plays flex, then return the RankFlexEmblemDisplay data (use a ternary operator)
 */
function RankSoloEmblemDisplay({summonerRankApiData}){
    if(summonerRankApiData.length === 0)
        return;
    let path = EmblemString(summonerRankApiData[0]['tier']);
    return (
        <>
            {summonerRankApiData[0]['queueType'] !== 'RANKED_FLEX_SR' 
                ?
                    <div id='rank-solo-display'>
                        <img src={path} id='rank-solo-border-display' alt='rank-solo-border' width='50%'/>
                        <p>RANK: {summonerRankApiData[0]['tier']} {summonerRankApiData[0]['rank']} with {summonerRankApiData[0]['leaguePoints']} LP</p>
                        <p>{summonerRankApiData[0]['wins']} wins and {summonerRankApiData[0]['losses']} losses</p>
                        <p>S13 RANKED SOLO QUEUE</p>
                    </div>
                :
                    <div id='rank-flex-display'>
                        <img src={path} id='rank-flex-border-display' alt='rank-flex-border' width='50%'/>
                        <p>RANK: {summonerRankApiData[0]['tier']} {summonerRankApiData[0]['rank']} with {summonerRankApiData[0]['leaguePoints']} LP</p>
                        <p>{summonerRankApiData[0]['wins']} wins and {summonerRankApiData[0]['losses']} losses</p>
                        <p>S13 RANKED FLEX QUEUE</p>
                    </div>
            }
        </>
    );
}

/**
 * Display the ranked flex q informtion for the given data
 */
function RankFlexEmblemDisplay({summonerRankApiData}){
    if(summonerRankApiData.length < 2)
        return;
    let path = EmblemString(summonerRankApiData[1]['tier']);
    return (
        <>
            {summonerRankApiData[1]['queueType'] !== 'RANKED_SOLO_5x5' 
                ?
                    <div id='rank-flex-display'>
                        <img src={path} id='rank-flex-border-display' alt='rank-flex-border'  width='50%' />
                        <p>RANK: {summonerRankApiData[1]['tier']} {summonerRankApiData[1]['rank']} with {summonerRankApiData[1]['leaguePoints']} LP</p>
                        <p>{summonerRankApiData[1]['wins']} wins and {summonerRankApiData[1]['losses']} losses</p>
                        <p>S13 RANKED FLEX QUEUE</p>
                    </div>
                :
                    <div id='rank-solo-display'>
                        <img src={path} id='rank-solo-border-display' alt='rank-solo-border'  width='50%'/>
                        <p>RANK: {summonerRankApiData[1]['tier']} {summonerRankApiData[1]['rank']} with {summonerRankApiData[1]['leaguePoints']} LP</p>
                        <p>{summonerRankApiData[1]['wins']} wins and {summonerRankApiData[1]['losses']} losses</p>
                        <p>S13 RANKED SOLO QUEUE</p>
                    </div>
            }
        </>
    );
}

/**
 * Return the display of the summoner's rank.
 * Uses the helper function - RankSoloEmblemDisplay and RankFlexEmblemDisplay - to determine which emblem to showcase.
 * In the event that there is no rank, then simply make the container have an attribute of display: none
 */
export default function RankDisplay({summonerRankApiData}){
    return (
        <>
            {summonerRankApiData && summonerRankApiData.length > 0
                ? 
                    <div id='summoner-rank-container' style={{display: 'flex', justifyContent: 'center', textAlign: 'center'}}>
                        <RankSoloEmblemDisplay summonerRankApiData={summonerRankApiData} />
                        <RankFlexEmblemDisplay summonerRankApiData={summonerRankApiData} />
                    </div>
                :
                    <>
                        <h3>This player is UNRANKED!</h3>
                        <div id='summoner-rank-container' style={{display: 'none'}}/>
                    </>
            }
        </>
    );
}