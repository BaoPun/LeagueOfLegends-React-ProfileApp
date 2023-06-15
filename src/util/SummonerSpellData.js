/**
 * This takes in the summoner spell in a JSON format
 * and iterates through the values to return a new mapping of {id: [name, description, image url]}
 */
export default function CreateSummonerSpellData(data){
    let result = {};

    for(let spellValue of Object.values(data))
        result[spellValue['key']] = [spellValue['name'], spellValue['description'], 'http://ddragon.leagueoflegends.com/cdn/13.11.1/img/spell/' + spellValue['id'] + '.png'];
    
    return result;
}