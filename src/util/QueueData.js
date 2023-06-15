/**
 * This takes in the raw queue data in a JSON format
 * and returns a new mapping of {id: [description, map]}
 */
export default function CreateQueueData(data){
    let result = {};
    for(let queue of data){
        if(queue['notes'] !== null)
            result[queue['queueId']] = [queue['description'], queue['map']];
    }
    return result;
}