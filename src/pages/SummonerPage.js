import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Home from './Home';
import ApiKey from '../util/ApiKey';
import RankDisplay from '../components/RankDisplay';

/**
 * Given the platform, return the region.
 * @param {string} platform 
 * @returns string (either 'americas', 'europe', 'sea', or 'asia')
 */
function GetRegion(platform){
    if(['br1', 'na1', 'la1', 'la2'].includes(platform))
        return 'americas';
    else if(['eun1', 'euw1', 'tr1', 'ru'].includes(platform))
        return 'europe';
    else if(['oc1', 'ph2', 'sg2', 'th2', 'tw2', 'vn2'].includes(platform))
        return 'sea';
    else
        return 'asia';
}

/**
 * This function simply creates a list of strings, with the list containing a list of urls.  
 * These urls are for further processing in the Riot Games API, assuming that the summoner input is valid
 * 
 * @param {object} summonerApiData, must NOT BE NULL, otherwise the function will return an empty list.
 * @param {string} currentPlatform 
 * @param {const string} api_key 
 * @returns                         [string] --> a list of strings
 */
function GetNewUrls(summonerApiData, currentPlatform, api_key){
    // First things first, do not process if the summonerApiData object is null, i.e. there was an error or the data hasn't been processed yet
    if(!summonerApiData)
        return [];

    // Begin adding the list of string urls to the list
    let ValidSummonerUrls = [];

    // Pass in the summoner rank url
    ValidSummonerUrls.push('https://' + currentPlatform + '.api.riotgames.com/lol/league/v4/entries/by-summoner/' + summonerApiData['id'] + '/?api_key=' + api_key);

    // Pass in the summoner mastery url
    ValidSummonerUrls.push('https://' + currentPlatform + '.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/' + summonerApiData['id'] + '/top?count=7&api_key=' + api_key);

    // Pass in the summoner match history url
    ValidSummonerUrls.push('https://' + GetRegion(currentPlatform) + '.api.riotgames.com/lol/match/v5/matches/by-puuid/' + summonerApiData['puuid'] + '/ids?start=0&count=10&api_key=' + api_key);

    // Finally, return the list
    return ValidSummonerUrls;
}

/**
 * This function creates a list of each individual match object after summonerMatchHistoryApiData has been populated.
 * For this function specifically, it'll create an API link to the match in question.
 * 
 */
function getAllMatchUrls(currentPlatform, summonerMatchHistoryApiData, api_key){
    let result = [];
    for(let i = 0; i < summonerMatchHistoryApiData.length; i++)
        result.push('https://' + GetRegion(currentPlatform) + '.api.riotgames.com/lol/match/v5/matches/' + summonerMatchHistoryApiData[i] + '?api_key=' + api_key)
    return result;
}

/**
 * Delays execution by some # of seconds
 * @param {int} second
 * @returns 
 */
function delay(second) {
    console.log('Delaying...');
    return new Promise(resolve => setTimeout(resolve, second * 1000));
}

/**
 * This is the functional component of the summoner page, which consists of the Home page and the valid detailed information.
 * 
 * @param {object} championData 
 * @param {object} summonerSpellData 
 * @param {object} queueData 
 * @param {object} mapData 
 * @param {object} itemData 
 * @returns                             a loading spinner or a rendered detail of the summoner page
 */
export default function SummonerPage({ championData, summonerSpellData, queueData, mapData, itemData }){
    // Get the state arguments that were passed to this page using useLocation
    // Its mapping will NOT be used at all in this component, but it's necessary for the summonerData useEffect hook to trigger, since each form input changes the state.
    const state  = useLocation();

    // Get the states before loading the summoner data
    const [summonerApiData, setSummonerApiData] = useState(null);
    const [errorData, setErrorData] = useState(null);
    const [currentPlatform, setCurrentPlatform] = useState(null);
    const [currentSummoner, setCurrentSummoner] = useState(null);


    // If summonerApiData is valid, then also store the below states
    const [summonerRankApiData, setSummonerRankApiData] = useState(undefined);
    const [summonerMasteryApiData, setSummonerMasteryApiData] = useState(undefined);
    const [summonerMatchHistoryApiData, setSummonerMatchHistoryApiData] = useState(undefined);
    const [summonerMatchHistoryDetailData, setSummonerMatchHistoryDetailData] = useState(undefined);
    var summonerMatchHistoryDetailList = useRef([]);

    // Store the api key and the url as constants
    var splitUrlArray = useRef(window.location.href.split('/'));
    const api_key = useRef(ApiKey());
    var summoner_api_url = useRef('https://' + splitUrlArray.current[splitUrlArray.current.length-2] + '.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + splitUrlArray.current[splitUrlArray.current.length-1] + '?api_key=' + api_key.current);

    /**
     * For summoner data gathering (check if the summoner exists in the riot games db), keep track of the current state using 2 booleans:
     *      1 to be true initially (is the data valid)
     *      1 to be false initially (is the data loaded)
     */
    // If the data is valid, then keep this as True. Otherwise, set to False later on
    // If the data is loaded, then flip this to True.  Otherwise, keep it as false
    const [isSummonerDataGenerated, setisSummonerDataGenerated] = useState(true);
    var isSummonerDataValid = useRef(true);
    var isSummonerDataLoaded = useRef(false);

    // If the data is valid, then store the list of summoner urls to be individually processed on each useEffect hook.
    const ValidSummonerUrls = useRef([]);

    /**
     * For rank data gathering, keep track of the current state using 1 boolean:
     *      1 to be false initially (switch to True after the data is processed)
     */
    const [isRankDataGenerated, setIsRankDataGenerated] = useState(true);
    var isRankDataLoaded = useRef(false);

    /**
     * For mastery data gathering, keep track of the current state using 1 boolean:
     *      1 to be false initially (switch to True after the data is processed)
     */
    const [isMasteryDataGenerated, setIsMasteryDataGenerated] = useState(true);
    var isMasteryDataLoaded = useRef(false);

    /**
     * For match history LIST gathering, keep track of the current state using 1 boolean:
     *      1 to be false initially (switch to True after the data is processed)
     */
    const [isMatchHistoryListGenerated, setIsMatchHistoryListGenerated] = useState(true);
    var isMatchHistoryListLoaded = useRef(false);

    /**
     * For match history data gathering, keep track of the current state using 1 boolean:
     *      1 to be false initially (switch to True after the data is processed)
     */
    const [isMatchHistoryDataGenerated, setIsMatchHistoryDataGenerated] = useState(true);
    var isMatchHistoryDataLoaded = useRef(false);
    
    /*
    ---------------------------------------------------------------------------------------------------------------------------------------------------
        USE EFFECT CALLS BELOW THIS BLOCK
    ---------------------------------------------------------------------------------------------------------------------------------------------------
    */

    /**
     * This is the first useEffect hook and the most important one.
     * Attempt to gather information about the summoner from the API.  
     * If unable to do so, then errorData will be populated and summonerApiData will be null --> no further processing of other API calls.
     * Otherwise, then errorData will be null and summonerApiData will be populated --> further processing of other API calls.
     */
    useEffect(() => {
        // Initially, the data is NOT loaded.  Also update the splitUrlArray and summoner_api_url variables for each new data
        if(!isSummonerDataLoaded.current){
            setisSummonerDataGenerated(false);
            splitUrlArray.current = window.location.href.split('/');
            summoner_api_url.current = 'https://' + splitUrlArray.current[splitUrlArray.current.length-2] + '.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + splitUrlArray.current[splitUrlArray.current.length-1] + '?api_key=' + api_key.current;
            summonerMatchHistoryDetailList.current = [];
            setSummonerMatchHistoryApiData(undefined);
        }

        // If the data already exists, then don't process anything
        if(isSummonerDataGenerated && (summonerApiData || errorData)){
            //console.log('Final summoner data: ' + JSON.stringify(summonerApiData) + ' vs ' + JSON.stringify(errorData) + ' and status = ' + isSummonerDataGenerated);
            isSummonerDataLoaded.current = false;    // change this to false for the next summoner input

            // Set up the isSummonerDataValid flag.  If errorData has data, then no such summoner exists (mark False).  Otherwise, mark True.
            if(errorData)
                isSummonerDataValid.current = false;
            else
                isSummonerDataValid.current = true;

            // Set the current platform and summoner for future usage
            setCurrentPlatform(splitUrlArray.current[splitUrlArray.current.length-2]);
            if(errorData)
                setCurrentSummoner(splitUrlArray.current[splitUrlArray.current.length-1].replaceAll('%20', ' '));
            else
                setCurrentSummoner(summonerApiData['name']);

            // Load up the arrays
            ValidSummonerUrls.current = GetNewUrls(summonerApiData, splitUrlArray.current[splitUrlArray.current.length-2], api_key.current);
            return;
        }

        // Begin fetching the data asynchronously
        const loadSummonerData = async () => {
            try{
                console.log('fetching summoner data...');
                const summonerDataResponse = await fetch(summoner_api_url.current);

                // Catch bad responses here
                if(!summonerDataResponse.ok)
                    throw new Error('Error, status is ' + summonerDataResponse.status);
                
                // Response is valid, process it
                const data = await summonerDataResponse.json();
                if(!isSummonerDataGenerated){
                    console.log('done fetching summoner data!');
                    setSummonerApiData(data);
                    setErrorData(null);
                    setisSummonerDataGenerated(true);
                    isSummonerDataLoaded.current = true;
                }
            } catch(e){
                setErrorData({'error': {'message': e.message, 'status': e.status, 'statusCode': e.statusCode}});
                setSummonerApiData(null);
                setisSummonerDataGenerated(true);
                isSummonerDataLoaded.current = true;
            }
        };

        // Call the data fetch
        loadSummonerData();
    }, [state, summonerApiData, errorData, isSummonerDataGenerated]);

    /**
     * More useEffects to process API calls. For this call, call upon the summoner's rank information.
     * However, do not process anything if the summoner data is NOT valid from the first useEffect hook.
     */
    useEffect(() => {
        // Initially, the data is NOT loaded
        if(!isRankDataLoaded.current)
            setIsRankDataGenerated(false);

        // If summonerRankApiData is fully processed and summonerApiData is valid, then print out the data to the console and escape the useEffect hook.
        // Also escape the useEffect hook if summonerApiData is NOT valid.
        // In both cases, make sure to change the loaded boolean back to False so that the next input can be processed ater submission.
        if(!isSummonerDataValid || ValidSummonerUrls.current.length === 0 || (summonerApiData && summonerRankApiData !== undefined && isRankDataGenerated)){
            //console.log('Rank data: ' + JSON.stringify(summonerRankApiData) + '\nHas data been processed: ' + isRankDataLoaded.current);
            isRankDataLoaded.current = false;
            return;
        }

        // Begin fetching the data asynchronously
        const loadSummonerRankData = async () => {
            try{
                console.log('fetching rank data...');
                const summonerRankDataResponse = await fetch(ValidSummonerUrls.current[0]);

                // Catch error
                if(!summonerRankDataResponse)
                    throw new Error('Error, status is ' + summonerRankDataResponse.status);

                // Finish parsing through the response
                const data = await summonerRankDataResponse.json();
                if(!isRankDataGenerated){
                    console.log('Finished fetching rank data!');
                    setSummonerRankApiData(data);
                    setIsRankDataGenerated(true);
                    isRankDataLoaded.current = true;
                }
            } catch(e){
                console.log('No error should be happening but it happened anyways...');
                setIsRankDataGenerated(true);
                isRankDataLoaded.current = true;
            }
        };

        // Call the data fetch
        loadSummonerRankData();
    }, [summonerApiData, summonerRankApiData, isRankDataGenerated]);

    /**
     * More useEffects to process more API calls.  For this call, call upon the summoner's mastery information.
     * However, do not process anything if the summoner data is NOT valid from the first useEffect hook.
     */
    // Parse through the top 10 mastery champions
    useEffect(() => {
        // Initially, the mastery data is NOT loaded
        if(!isMasteryDataLoaded.current)
            setIsMasteryDataGenerated(false);

        // If summonerMasteryApiData is fully processed and summonerApiData is valid, then print out the data to the console and escape the useEffect hook.
        // Also escape the useEffect hook if summonerApiData is NOT valid.
        // In both cases, make sure to change the loaded boolean back to False so that the next input can be processed ater submission.
        if(!isSummonerDataValid.current || ValidSummonerUrls.current.length === 0 || (summonerApiData && summonerMasteryApiData !== undefined && isMasteryDataGenerated)){
            //console.log('Mastery data: ' + JSON.stringify(summonerMasteryApiData) + '\nHas data been processed: ' + isMasteryDataLoaded.current);
            isMasteryDataLoaded.current = false;
            return;
        }
        
        // Begin fetching the data asynchronously
        const loadSummonerMasteryData = async () => {
            try{
                console.log('fetching mastery data...');
                const summonerMasteryDataResponse = await fetch(ValidSummonerUrls.current[1]);

                // Catch bad responses here
                if(!summonerMasteryDataResponse.ok)
                    throw new Error('Error, status is ' + summonerMasteryDataResponse.status);

                // Response is valid, process it
                const data = await summonerMasteryDataResponse.json();
                if(!isMasteryDataGenerated){
                    console.log('Finished fetching mastery data!');
                    setSummonerMasteryApiData(data);
                    setIsMasteryDataGenerated(true);
                    isMasteryDataLoaded.current = true;
                }
            } catch(e){
                console.log('No errors should be happening here, but it still happened zzz');
                setIsMasteryDataGenerated(true);
                isMasteryDataLoaded.current = true;
            }
        };

        // Call the data fetch
        loadSummonerMasteryData();
    }, [summonerApiData, summonerMasteryApiData, isMasteryDataGenerated]);

    /**
     * More useEffects to process API calls.  For this call, call upon the last 7 match history games.
     * However, do not process anything if the summoner data is NOT valid from the first useEffect hook.
     */
    useEffect(() => {
        // Initially, the data is NOT loaded
        if(!isMatchHistoryListLoaded.current)
            setIsMatchHistoryListGenerated(false);

        // If the data is loaded, or if summonerApiData is null (there is an error), then immediately exit the hook
        if(!isSummonerDataValid.current || ValidSummonerUrls.current.length === 0 || (summonerApiData && summonerMatchHistoryApiData !== undefined && isMatchHistoryListGenerated)){
            //console.log('Match history data: ' + JSON.stringify(summonerMatchHistoryApiData));
            isMatchHistoryListLoaded.current = false;
            if(summonerApiData && summonerMatchHistoryApiData !== undefined && isMatchHistoryListGenerated)
                summonerMatchHistoryDetailList.current = getAllMatchUrls(splitUrlArray.current[splitUrlArray.current.length-2], summonerMatchHistoryApiData, api_key.current);
            return;
        }

        // Begin fetching the data asynchronously
        const loadMatchHistoryData = async () => {
            try{
                console.log('fetching match history data...');
                const summonerMatchHistoryDataResponse = await fetch(ValidSummonerUrls.current[2]);

                // Throw bad responses here
                if(!summonerMatchHistoryDataResponse)
                    throw new Error('Error, status is ' + summonerMatchHistoryDataResponse.status)

                // Response is valid, process it.
                const data = await summonerMatchHistoryDataResponse.json();
                if(!isMatchHistoryListGenerated){
                    console.log('Finished fetching match history data!');
                    setSummonerMatchHistoryApiData(data);
                    setIsMatchHistoryListGenerated(true);
                    isMatchHistoryListLoaded.current = true;
                }
            } catch(e){
                console.log('No errors should be happening here, but it still happened zzz');
                setIsMatchHistoryListGenerated(true);
                isMatchHistoryListLoaded.current = true;
            } 
        };

        // Call the data fetch
        loadMatchHistoryData();
    }, [summonerApiData, summonerMatchHistoryApiData, isMatchHistoryListGenerated]);

    /**
     * More useEffects to process API calls.  For this call, process the list of the 20 most recent matches played.
     * However, do not process anything if the summoner data is NOT valid or if summonerMatchHistoryApiData is not fully loaded yet.
     */
    useEffect(() => {
        // Initially, the mastery list data has NOT been loaded yet 
        if(!isMatchHistoryDataLoaded.current)
            setIsMatchHistoryDataGenerated(false);

        // If the match history hasn't been loaded yet, then immediately escape this useEffect hook
        if(!summonerApiData || !summonerMatchHistoryApiData){
            console.log('You are not ready to view the list of matches for this user, please wait.');
            setSummonerMatchHistoryDetailData(undefined);
            return;
        }

        // If the match history data is already populated, then don't do anything
        if(isMatchHistoryDataGenerated && summonerMatchHistoryDetailData !== undefined && summonerMatchHistoryDetailData.length === summonerMatchHistoryDetailList.current.length){
            console.log('Individual match data already exists: \n' + JSON.stringify(summonerMatchHistoryDetailData));
            isMatchHistoryDataLoaded.current = false;
            return;
        }   

        const loadMatchData = async (matchUrl, idx) => {
            try{
                console.log('fetching match');
                await delay(3);
                const matchDataResponse = await fetch(matchUrl);
                
                if(!matchDataResponse.ok)
                    throw new Error('Error, status is ' + matchDataResponse.status);

                let data = await matchDataResponse.json();
                if(data){
                    summonerMatchHistoryDetailList.current[idx] = data['info'];
                    while(summonerMatchHistoryDetailList.current[idx] !== data['info'])
                        summonerMatchHistoryDetailList.current[idx] = data['info'];
                    console.log('Finished fetching match!')
                    if(idx === summonerMatchHistoryDetailList.current.length - 1){
                        setSummonerMatchHistoryDetailData(summonerMatchHistoryDetailList.current);
                        isMatchHistoryDataLoaded.current = true;
                        setIsMatchHistoryDataGenerated(true);
                    }
                }
            } catch(e){
                console.log('why is this erroring out...: ' + e.message);
            }
        };

        console.log('You are now ready to view the match history data for each match.');
        // Process each match from the list of matches from summonerMatchHistoryApiData
        for(let i = 0; i < summonerMatchHistoryDetailList.current.length; i++){
            loadMatchData(summonerMatchHistoryDetailList.current[i], i);
        }
    }, [summonerApiData, summonerMatchHistoryApiData, summonerMatchHistoryDetailData, isMatchHistoryDataGenerated]);
    

    // If the data hasn't been processed, then display the spinner
    // Otherwise, display the summoner's page
    return (
        <>
            {(!isSummonerDataGenerated && !errorData) || ((!summonerRankApiData || !summonerMasteryApiData || !summonerMatchHistoryApiData || !summonerMatchHistoryDetailData) && !errorData)
                ? 
                    <div className="spinner-container">
                        <div className="loading-spinner"></div>
                    </div>
                : 
                    <>
                        <Home />
                        <div className='summoner-profile-container'>
                            {
                                summonerApiData && summonerRankApiData ? 
                                <>
                                    <h1>Level {summonerApiData['summonerLevel']}: {currentSummoner} from {currentPlatform}</h1>
                                    <RankDisplay summonerRankApiData={summonerRankApiData} />
                                </>
                                :
                                <h1>Summoner {currentSummoner} from {currentPlatform} does not exist.  WH OMEGALUL?</h1>
                            }
                            <button type="button" id='profile_champion_mastery'>View Most Played Champions</button>
                            <button type="button" id='profile_match_history'>View Recent Match History</button>
                            <button type="button" id='profile_live_game'>View Live Game Data</button>
                            <div className='summoner-profile-info'>
                                <>
                                    <div id='summoner-mastery-container'>
                                        <p>Top 7 champions</p>
                                        {summonerMasteryApiData && !errorData ? summonerMasteryApiData.map(championMasteryInfo => (
                                            <ul key={championData[championMasteryInfo['championId']][0]}>
                                                <img src={championData[championMasteryInfo['championId']][1]} alt='ICANT KEKW'/>
                                                <p>{championData[championMasteryInfo['championId']][0]} - Mastery {championMasteryInfo['championLevel']} with {championMasteryInfo['championPoints']} points.</p>
                                            </ul>
                                        )) : (!errorData ? 
                                                <p>Rendering</p>
                                                : <p>DATA HAS ERROR xdd</p>
                                            )
                                        }
                                    </div>
                                </>
                            </div>
                            <div className='summoner-profile-info'>
                                <p>Match History</p>
                                <>
                                    {!summonerMatchHistoryDetailData
                                        ?  
                                            <p>Waiting...</p>
                                        : 
                                            summonerMatchHistoryDetailData.map(match => (
                                                <ul key={match['gameId']}>
                                                    <p>Queue type: {match['gameDuration']}</p>
                                                </ul>
                                            ))
                                    }
                                </>
                            </div>
                        </div>
                    </>
            }
        </>
    );
}