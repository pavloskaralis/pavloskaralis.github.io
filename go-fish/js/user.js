class User {
    constructor (key, url) {
        //helps game class target a specific player instance
        this.playerKey = key;
        this.score = 0; 
        //each element object represents one card:
        this.hand = []; 
        this.image = url; 
        //links player instance to player node 
        this.nodeID = `player${key}`  
    }
    //helps retrieve node version
    fetchNode () {
        const $node = $(`#${this.nodeID}`); 
        return $node; 
    }
    takeCard (cardInstance) {
        //places card instance into player instance's hand 
        this.hand.push(cardInstance);
        //calls method of card instance to update its owner
        cardInstance.updateOwner(this.playerKey);
    }
    //removes card from hand via splice 
    giveCard (cardInstance) {
        const cardIndex = this.hand.indexOf(cardInstance);
        this.hand.splice(cardIndex,1);
    }
}