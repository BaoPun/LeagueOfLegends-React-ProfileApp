/**
 * This takes in the raw item data in a JSON format
 * and converts it to a new mapping of {id: {name: itemName, gold: itemGold}}
 * but only if at least one of the conditions hold true:
 * 1. The item is in store
 * 2. The item is purchasable
 * 3. The item is a trinket
 * 4. The item is a masterwork ornn item
 * 5. The item is available in summoner's rift
 * 6. The item is available in aram
 */
export default function CreateItemData(data){
    let result = {};

    for(let [itemId, itemData] of Object.entries(data)){
        if(itemData['inStore'] || itemData['gold']['purchasable'] || itemData['tags'].includes('Trinket') || itemData['description'].includes('ornn') || itemData['maps']['11'] || itemData['maps']['12'])
            result[itemId] = {'name': itemData['name'], 'gold': itemData['gold']['total']};
    }
    
    return result;
}