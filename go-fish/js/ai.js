class AI extends User {
    constructor (key,url,playerKeys, gameInstanceVarName) {
        super(key,url); 
        //determines opponents by removing own key from all player keys
        this.opponentKeys = playerKeys.filter(key => key !== this.playerKey); 
        //each element object represents a card an opponent requested or traded  
        this.memory = [];
        //represents the selected card instance (object) within player instance's hand
        this.currentCard = null;
        //represents the player key (string) of the selected opponent 
        this.currentOpponentKey = null;
        //represents the previouslt selected card instance; updates as takeTurn() is called
        this.previousCard = null; 
        //represents the previously selected opponent key; updates as takeTurn() is called
        this.previousOpponentKey = null; 
        //tally of card instance names within ai's hand ("cardName": num)
        this.quantifiedHandCardNames = {};
        //quantifiedHandCardNames sorted from most to least occuring; updated as takeTurn() is called
        this.sortedQuantifiedHandCardNames = [];
        //in 2 player mode, holds filtered card options to prevent AI from making the same choice twice when chosing randomly from hand; updated as takeTurn() is called
        this.randomCardOptions = [];
        //in 3 or 4 player mode, holds filtered opponent key options to prevent AI from making the same choice twice when chosing randomly from hand; updated as takeTurn() is called
        this.randomPlayerOptions = [];
        //last minute solution to avoid ai selecting an opponent with no cards in their hand; not ideal but works 
        //passes game class instance variable name so that player instances' hand lengths can be read within specific player instance 
        this.gameInstanceVarName = gameInstanceVarName; 
    }
    //called by game class whenever opponent card swap is made, opponent request is made, or opponent go fish card is revealed 
    remember (cardInstance) {
        //avoids adding a duplicate copy of a card to memory 
        this.memory.indexOf(cardInstance) === - 1 ? this.memory.push(cardInstance) : false; 
    }
    //called by game class whenever an AI gains a card instance name that was selected from memory, in order to prevent self owned cards in AI memory
    forget (cardInstance) {
        this.memory.splice(this.memory.indexOf(cardInstance), 1); 
    }
    //returns as object, a quantity of each card instance's name in AI's hand
    quantifyHandCards () { 
        //clears old data 
        this.quantifiedHandCardNames = []; 
        //adds each card name in AI's hand as a property key
        this.hand.forEach(cardInstance => this.quantifiedHandCardNames[cardInstance.name] = 0);
        //compares the name of each property key with the name of each card in AI's hand; tallies any matches 
        Object.keys(this.quantifiedHandCardNames).forEach(name => this.hand.forEach(cardInstance => name === cardInstance.name ? this.quantifiedHandCardNames[name] += 1 : false));
    }
    //retrieves as object, a card to be requested during the current turn phase 
    selectCard () {
        //calls quantifyHandCards method (seperate functionality) 
        this.quantifyHandCards();
        //sorts quantified hand cards by most occurences in descending order
        this.sortedQuantifiedHandCardNames = Object.keys(this.quantifiedHandCardNames).sort((name1,name2) => this.quantifiedHandCardNames[name2] - this.quantifiedHandCardNames[name1]);
        //finds a card in AI's memory that matches the mode (or next best) card name in AI's hand
        //since sortedQuantifiedHandCardNames is sorted in descending order, find() will return a higher match first 
        const bestMatch = this.memory.find(memoryCardInstance => this.sortedQuantifiedHandCardNames.find(handCardName => memoryCardInstance.name === handCardName)); 
        //if no card in AI's memory matches a card in AI's hand, selects the mode card of AI's hand instead
        this.currentCard = typeof bestMatch === 'object' ? bestMatch : this.hand.find(card => card.name === this.sortedQuantifiedHandCardNames[0]); 
    }
    //returns as object, the name of the card and opponent id selected for the current turn phase:
      takeTurn () {                                                                             //NEEDS FURTHER TESTING
        // saves previous card instance selection incase comparison needed
        this.previousCard = this.currentCard;
        // saves previous opponent key selection incase comparison needed
        this.previousOpponentKey = this.currentOpponentKey;
        //makes card selection; must appear before randomCardOptions or risks causing a rare error via using nonupdated this.sortedQuantifiedHandCardNames
        this.selectCard(); 

        //filters out the name of the previous card instance from the sorted quantified hand count array to avoid identical selections with 2 players
        //conditional (this.previousCard !== null ?) required to prevent error on ai's first turn (cannot read property of null)
        this.randomCardOptions = this.previousCard !== null ? this.sortedQuantifiedHandCardNames.filter(name => name !== this.previousCard.name) : null;
        //filters out key of previous opponent key selection to avoid identical selections with 3 or 4 players
        this.randomPlayerOptions = this.opponentKeys.filter(key => (key !== this.previousOpponentKey) &&
        //last minute fix to preventing selection of players with no cards in hand; not ideal but works 
            (this.gameInstanceVarName.players[key].hand.length > 0));
       
        //for debugging
        console.log(this.previousCard !== null ? `previous card was ${this.previousCard.name}` : false);
        console.log(this.previousOpponentKey !== null ? `previous opponent was ${this.previousOpponentKey}` : false);
        console.log(this.currentCard.owner !== this.playerKey ? "from memory" : "from hand");
        console.log(`original choice is ${this.currentCard.name}`);
        console.log(`randomCardOptions are ${this.randomCardOptions}`);
        console.log(`randomPlayerOptions are ${this.randomPlayerOptions}`);
        
        //if the current card was selected from memory, the current opponent key will be its owner; 
        this.currentOpponentKey = this.currentCard.owner !== this.playerKey ? this.currentCard.owner : 
        //otherwise if there is at least 1 alternative opponent, the current opponent key will be chosen between players who were not selected the previous turn 
            this.randomPlayerOptions.length > 0 ?  this.randomPlayerOptions[Math.floor(Math.random() * this.randomPlayerOptions.length)] : this.opponentKeys[0]; 
        
        //if there is only 1 opponent option when chosing from hand, instead of selecting random player, selects random card if at least 1 alternative option exists 
        (this.currentOpponentKey === this.previousOpponentKey) && (this.currentCard.name === this.previousCard.name) && (this.randomCardOptions.length > 0)  ? 
                this.currentCard = this.hand.find(cardInstance => cardInstance.name === this.randomCardOptions[0]) : false
        
        //adding protection incase Ai selection ever fails 
            typeof this.currentCard !== 'object' ? this.currentCard = this.hand[Math.floor(Math.random() * this.hand.length)] : false;
            typeof this.currentOpponentKey !== 'string' ? this.currentOpponentKey = this.opponentKeys[Math.floor(Math.random() * this.opponentKeys.length)] : false;
       
        //for debugging
        console.log(`updated choice is ${this.currentCard.name}`)
        console.log(`opponent is ${this.currentOpponentKey}`)

        //formats choice as object
        return {card: this.currentCard, key: this.currentOpponentKey};
    }
}
