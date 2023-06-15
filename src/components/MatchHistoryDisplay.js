
/**
 * Given the passed in summoner match history detail data object,
 * Display the match history
 * @param {object} summonerMatchHistoryDetailData 
 * @returns 
 */
export default function MatchHistoryDisplay({summonerMatchHistoryDetailData}){
    return (
        <>
            {!summonerMatchHistoryDetailData
                ?  
                    <p>Waiting...</p>
                : 
                    summonerMatchHistoryDetailData.map(match => (
                        <div className='match-history-detail'>
                            <ul key={match['gameId']}>
                                
                                <p>Queue type: {new Date(match['gameCreation']).toLocaleDateString()}</p>
                            </ul>
                        </div>
                    ))
            }
        </>
    )
}