import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import SummonerPage from './pages/SummonerPage';
import Page404 from './pages/Page404';
import CreateNewChampionData from './util/ChampionData';
import CreateSummonerSpellData from './util/SummonerSpellData';
import CreateQueueData from './util/QueueData';
import CreateMapData from './util/MapData';
import CreateItemData from './util/ItemData';
// Run using 'npm start'

// This is the main function in App.js and it'll be referenced outside this file
export default function App() {
	// States of each data
	const [version, setVersion] = useState(null);
	const [championData, setChampionData] = useState(null);
	const [summonerSpellData, setSummonerSpellData] = useState(null);
	const [queueData, setQueueData] = useState(null);
	const [mapData, setMapData] = useState(null);
	const [itemData, setItemData] = useState(null);

	// Generate the version
	useEffect(() => {
		// Only render the data once; don't render it again if the data is already loaded
		let isDataGenerated = false;
		if(isDataGenerated || version)
			return;

		// Create an asynchronous timer to fetch the data (every 1 second interval)
		const timer = setTimeout(async () => {
			const response = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
			const data = await response.json();
			if(!isDataGenerated)
				setVersion(data[0]);
		}, 1000);

		// Once the timer runs out, clear the timer itself and switch the boolean flag to true
		return () => { 
			clearTimeout(timer);
			isDataGenerated = true; 
		};
	}, [version]);

	// Generate the champion data
	useEffect(() => {
		// Only render the data once
		let isDataGenerated = false;

		// Don't do anything if the version hasn't been generated yet OR if the data has already been generated
		if(!version || isDataGenerated || championData)
			return;

		// Create an asynchronous timer to fetch the data (every 1 second interval)
		const timer = setTimeout(async () => {
			const response = await fetch('http://ddragon.leagueoflegends.com/cdn/'+ version + '/data/en_US/champion.json');
			const data = await response.json();
			if(!isDataGenerated)
				setChampionData(CreateNewChampionData(data['data']));
		}, 1000);
		
		// Once the timer runs out, clear the timer itself and switch the boolean flag to true
		return () => {
			clearTimeout(timer);
			isDataGenerated = true;
		}
	}, [version, championData]);

	// Generate the summoner spell information
	useEffect(() => {
		// Only render the data once
		let isDataGenerated = false;

		// Don't do anything if the version hasn't been generated yet OR if the data has already been generated
		if(!version || isDataGenerated || summonerSpellData)
			return;

		// Create an asynchronous timer to fetch the data 
		const timer = setTimeout(async () => {
			const response = await fetch('http://ddragon.leagueoflegends.com/cdn/' + version + '/data/en_US/summoner.json');
			const data = await response.json();
			if(!isDataGenerated)
				setSummonerSpellData(CreateSummonerSpellData(data['data']));
		}, 1000);

		// Once the timer runs out, clear the timer itself and switch the boolean flag to true
		return () => {
			clearTimeout(timer);
			isDataGenerated = true;
		}
	}, [version, summonerSpellData]);

	// Generate the queue information (ranked solo q, normals, clash, etc)
	useEffect(() => {
		// Only render the data once
		let isDataGenerated = false;

		// Don't do anything if the data is already generated
		if(isDataGenerated || queueData)
			return;

		// Create an asynchronous timer to fetch the data
		const timer = setTimeout(async () => {
			const response = await fetch('https://static.developer.riotgames.com/docs/lol/queues.json');
			const data = await response.json();
			if(!isDataGenerated)
				setQueueData(CreateQueueData(data));
		}, 1000);

		// Once the timer runs out, clear the timer itself and switch the boolean flag to true
		return () => {
			clearTimeout(timer);
			isDataGenerated = true;
		};
	}, [queueData]);

	// Generate the map information
	useEffect(() => {
		// Only render the data once
		let isDataGenerated = false;

		// Don't do anything if the data is already generated
		if(isDataGenerated || mapData)
			return;

		// Create an asynchronous timer to fetch the data
		const timer = setTimeout(async () => {
			const response = await fetch('https://static.developer.riotgames.com/docs/lol/maps.json');
			const data = await response.json();
			if(!isDataGenerated)
				setMapData(CreateMapData(data));
		}, 1000);

		// Once the timer runs out, clear the timer itself and switch the boolean flag to true
		return () => {
			clearTimeout(timer);
			isDataGenerated = true;
		};

	}, [mapData]);

	// Generate the item information
	useEffect(() => {
		// Only render the data once
		let isDataGenerated = false;

		// Don't do anything if the data is already generated
		if(!version || isDataGenerated || itemData)
			return;

		// Create an asynchronous timer to fetch the data
		const timer = setTimeout(async () => {
			const response = await fetch('http://ddragon.leagueoflegends.com/cdn/' + version + '/data/en_US/item.json')
			const data = await response.json();
			if(!isDataGenerated)
				setItemData(CreateItemData(data['data']));
		}, 1000);

		// Once the timer runs out, clear the timer itself and switch the boolean flag to true
		return () => {
			clearTimeout(timer);
			isDataGenerated = true;
		};
	}, [version, itemData]);

	// If any part of the data has not been loaded yet, then display the loading spinner
	if(!version || !championData || !summonerSpellData || !queueData || !mapData || !itemData){
		return (
			<div className="spinner-container">
				<div className="loading-spinner"></div>
			</div>
		)
	}

	return (
		<BrowserRouter>
			<Routes>
				<Route path='/profile/:platform/:summoner' element={<SummonerPage championData={championData} summonerSpellData={summonerSpellData} queueData={queueData} mapData={mapData} itemData={itemData} version={version}/>}/>
				<Route path='/' element={<Home />}/>
				<Route path='*' element={<Page404 />}/>
			</Routes>
		</BrowserRouter>
	);
}


