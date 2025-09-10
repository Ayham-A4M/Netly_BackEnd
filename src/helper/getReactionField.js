const getReactionField = (reaction) => {
    if (reaction == 'love') { return 'loveCount' }
    else if (reaction == 'sad') { return 'sadCount' }
    else if (reaction == 'happy') { return 'happyCount' }
    else if (reaction == 'like') { return 'likesCount' }
    else if (reaction == 'wow') { return 'wowCount' }
}
module.exports=getReactionField