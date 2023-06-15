/**
 * This takes in the champion data in a JSON format
 * and then converts it to a new dictionary with the mapping of {id: [championName, champion image url]}
 */

export default function CreateNewChampionData(oldData){
    let result = {};
    
    for(let championNameKey of Object.keys(oldData))
        result[oldData[championNameKey]['key']] = oldData[championNameKey] !== 'MonkeyKing' ? [oldData[championNameKey]['id'], 'http://ddragon.leagueoflegends.com/cdn/13.11.1/img/champion/' + oldData[championNameKey]['id'] + '.png'] : ['Wukong', 'http://ddragon.leagueoflegends.com/cdn/13.11.1/img/champion/MonkeyKing.png'];
    
    // Add a -1 key-value pair as well
    result['-1'] = ['N/A', 'N/A'];
    return result;
}