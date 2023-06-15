/**
 * This takes in the raw map data as a JSON
 * and returns a new mapping of {id: map name}
 */
export default function CreateMapData(data){
    let result = {};
    for(let mapData of data)
        result[mapData['mapId']] = mapData['mapName'];
    return result;
}