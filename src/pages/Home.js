import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


// Search bar for input as a functional component. 
// Since the platform and the summoner inputs will be changed, this is where we will update the states.
function SummonerForm(){
    // States
    const [platform, setPlatform] = useState('na1');
    const [summoner, setSummoner] = useState('');

    const navigate = useNavigate();

    const ProcessForm = function(event){
        event.preventDefault();
        navigate('/profile/'+platform+'/'+summoner, {state: {'platform': platform, 'summoner': summoner}});
        setSummoner('');
        document.getElementById('summonerName').value = '';
        document.getElementById('summonerName').focus();
        
    }

    const ValidateData = function(event){
        if(document.getElementById('summonerName').value.length < 3){
            alert('Error, your input is less than 3 characters long.  Please try again.');
            event.preventDefault();
            document.getElementById('summonerName').value = '';
            document.getElementById('summonerName').focus();
        }
    }

    return (
        <form onSubmit={ProcessForm}>
            <select name="platform" id="platform" value={platform} onChange={e => setPlatform(e.target.value)} >
                <optgroup label="America" id="americas">
                    <option value="br1">Brazil</option>
                    <option value="na1">North America</option>
                    <option value="la1">Latin America1</option>
                    <option value="la2">Latin America2</option>
                </optgroup>
                <optgroup label="Europe" id="europe">
                    <option value="eun1">Europe Northeast</option>
                    <option value="euw1">Europe West</option>
                    <option value="tr1">Turkey</option>
                    <option value="ru">Russia</option>
                </optgroup>
                <optgroup label="Southeast Asia" id="sea">
                    <option value="oc1">Oceania</option>
                    <option value="ph2">Phillipines</option>
                    <option value="sg2">Singapore</option>
                    <option value="th2">Thailand</option>
                    <option value="tw2">Taiwan</option>
                    <option value="vn2">Vietnam</option>
                </optgroup>
                <optgroup label="Asia" id="asia">
                    <option value="jp1">Japan</option>
                    <option value="kr">Korea</option>
                </optgroup>
            </select>
            <input type="text" id="summonerName" name="summonerName" onChange={e => setSummoner(e.target.value)}/>
            <input type="submit" value="Submit" id='summonerSubmitInput' onClick={ValidateData}/>
        </form>
    )
}

// This functional component gets both the Title and the Search Bar together.
function SearchView(){
    return (
        <>
            <div className='app-title'>
                <h1>React League of Legends Profile Viewer</h1>
            </div>
            <div className="app-summoner-name-input">
                <p>Input summoner name below:</p>
                <SummonerForm />
            </div>
        </>
    )
}

// This is the main function that will be returned as a reusable functional component (puts the SearchView component inside a div)
export default function Home(){
    return (
        <>
            <div className='search-container'>
                <SearchView />
            </div>
        </>
    );
}