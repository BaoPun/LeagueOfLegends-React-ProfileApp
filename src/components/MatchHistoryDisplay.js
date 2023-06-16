
/**
 * Given the passed in summoner match history detail data object,
 * Display the match history
 * @param {object} summonerMatchHistoryDetailData 
 * @returns 
 */
export default function MatchHistoryDisplay({summonerMatchHistoryDetailData, queueData}){
    return (
        <>
            {!summonerMatchHistoryDetailData
                ?  
                    <p>Waiting...</p>
                : 
                    summonerMatchHistoryDetailData.map(match => (
                        <div className='match-history-detail'>
                            <ul key={match['gameId']}>
                                <p>Game Start Date: {new Date(match['gameCreation']).toLocaleDateString()}</p>
                                <p>Queue Type: {queueData[match['queueId']][0]}</p>
                            </ul>
                        </div>
                    ))
            }
        </>
    )
}