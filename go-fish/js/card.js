
class Card {
    constructor(name,value,faceUp,index){
        //keeps track of instance creating for-loop's i value, in order to call specific card instance from game's deck array
        this.cardIndex = index;  
        //links card instance to card node
        this.nodeID = `card${index}`; 
        //such as "seven" and "queen"
        this.name = name;
        //used by game class to sort nodes numerically 
        this.value = value;   
        //updates as card instance is passed around
        this.owner = null;  
        //back and front side of card node, along with the current displaying face (either up or down)
        this.faceUp = faceUp; 
        this.faceDown = 'img/faceDown.png';
        this.currentFace = this.faceDown;
    }
    //updates owner as card is collected/traded
    updateOwner (playerKey) {
        this.owner = playerKey; 
    }
    //toggles current face to opposite side
    flipCard () {
        this.currentFace === this.faceDown ? this.currentFace = this.faceUp : this.currentFace = this.faceDown;  
    }
    //helps retrieve node version
    fetchNode () {
        const $node = $(`#${this.nodeID}`); 
        return $node;  
    }
}

