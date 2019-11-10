$( () => {
    class Game {
        constructor(){
            //represents cards currently in the go fish pile
            this.cards = [];
            //object so that ['1'] refers to player1, avoiding array conversion
            this.players = {};
            //refer to current turn's player and their card/opponent select
            this.currentTurn = 1; 
            this.currentCard = null;
            this.currentOpponent = null; 
            this.matchingCardInstances = [];
            this.currentGoFish = null;
            this.dealtCards = []; 
            this.winner = null; 
            //last minute solution to avoid AI selecting opponents with no cards in their hand (late game issue for 3 or more players)
            //passess game class instance variable name to AI instances
            this.instanceVarName = null; 
        }
////////////////////////////
////////START SCREEN////////
////////////////////////////
        //passes self to internally housed instances to avoid AI selection of player with empty hand 
        //quick last minute solution to pass player hand lengths to ai; not ideal but works 
        passSelf (instanceVariable) {
            this.instanceVarName = instanceVariable;
        }
        //initiates title screen and player count selection
        renderStart () {
            setTimeout(()=>$('#title').addClass('show'),500);
            setTimeout(()=>$('#player-count-container').addClass('show').css('pointer-events','auto'),1000);
            //attached specific number to each player count button
            for(let num = 0; num < 3; num ++){
                //passes player count as param (2, 3, or 4) to initiate next method grouping 
                $('.player-count').eq(num).css('cursor','pointer').on('click',()=> this.createBoard(num+2));
            }
            $('#player-count-container').css('cursor','default');
        }
////////////////////////////
//////////BOARD SETUP///////
////////////////////////////

/////////METHOD HUB/////////
        createBoard (num) {
            $('#start-container').children().removeClass('show').addClass('hide').css('pointer-events','none');
            //num = 2, 3, or 4 (player count)
            this.createPlayerInstances(num);
            this.renderButtons(); 
            this.renderScoreNodes();
            this.renderPlayerNodes();
            this.renderFillerNodes(); 
            //must create deck AND hands before rendoring either
            this.createCardInstances(); 
            this.createPlayerInstanceHands();
            this.renderDeckCardNodes();
            this.renderDeckCardNodeAnimation();
            this.renderHandCardNodes();
            this.addEventListeners();
            //initiates next method grouping 
            this.turnSelector();
        }
/////////DISPLAY//////////
        renderButtons () {
            $('#button-container').addClass('show');
            $('#restart').css('pointer-events','auto');
            $('#restart').on('click',()=> location.reload());
            $('#art-credit').css('pointer-events','auto');
            $('#art-credit').on('click',() => {
                $('#credit-container').addClass('show').css('pointer-events','auto');
                $('#close').on('click', () => 
                    $('#credit-container').removeClass('show').addClass('hide').css('pointer-events','none')
                );
            });
        }
        renderScoreNodes () {
            //score creation based on whether ai or user container 
            Object.keys(this.players).forEach(playerKey => {
                const $score = $('<div>').addClass('score').html(`player${playerKey} <span class='orange'> &nbsp score ${this.players[playerKey].score}</span>`);    
                const $userScore = $('<div>').addClass('score').html(`your <span class='orange'> &nbsp score ${this.players[playerKey].score}</span>`);     
                playerKey === '1' ? $('#user-score-container').append($userScore.attr('id',`score${playerKey}`)) : $('#ai-score-container').append($score.attr('id',`score${playerKey}`));
            });
            //score fade in
            $('#user-score-container').addClass('show');
            $('#ai-score-container').addClass('show');
        }
/////////PLAYERS//////////
        createPlayerInstances (num) {
            //num = 2, 3, or 4 (player count)
            //pre assigns player keys so they can be immediately passed to AI on creation
            for(let i = 1; i <= num; i++){
                this.players[i] = null;  
            }
            //creates user (always player 1)
            this.players['1'] = new User('1',`img/boat1.png`);
            //creates ai (up to 3)
            for(let i = 2; i <= num ; i++){
                this.players[i] = new AI (i.toString(),`img/boat${i}.png`,Object.keys(this.players),this.instanceVarName);
            }
        }
        renderPlayerNodes () {
            //renders user (player 1)
            const $user = $('<div>')
            $user.addClass('boat').css('background-image',`url(${this.players['1'].image})`).attr('id','player1');
            //renders user's hand container
            $user.append($('<div>').addClass('hand'));
            $('#user-container').append($user);
            //renders ai with selective rotation
            for(let i = 2; i <= Object.keys(this.players).length; i++){
                const rotate45 = `rotate(45deg)`; 
                const rotateMinus45 = `rotate(-45deg)`; 
                const $ai = $('<div>').addClass('boat').css('background-image',`url(${this.players[i].image})`).attr('id',`player${i}`);
                ((Object.keys(this.players).length === 3) || (Object.keys(this.players).length === 4)) && (i === 2) ? $ai.css('transform',rotateMinus45) : 
                ((Object.keys(this.players).length === 3) && (i === 3)) || ((Object.keys(this.players).length === 4) && (i === 4)) ? $ai.css('transform',rotate45) : false;
                //renders ai's hand container 
                $ai.append($('<div>').addClass('hand'));
                $('#ai-container').append($ai);
            }
            //boat fade in; no .show since float animation already attached
           setTimeout(()=> $('.boat').css('opacity','1'), 0);
           setTimeout(()=> $('.boat').css('transition','none'), 1000);

        }  
        //adds selective invisible players to produce balanced flex  
        renderFillerNodes () {
            Object.keys(this.players).length > 2  ? $('#user-container').append($('<div>').addClass('boat').css('pointer-events','none')) : false; 
            Object.keys(this.players).length > 2  ? $('#user-container').prepend($('<div>').addClass('boat').css('pointer-events','none')) : false; 
            Object.keys(this.players).length === 3 ? $('<div>').addClass('boat').css('pointer-events','none').insertAfter($('#ai-container').children().eq(0)) : false; 
        }
/////////CARDS/////////
        //creates 52 card class instances
        createCardInstances () { 
            const suits = ['Hearts','Spades','Clubs','Diamonds'];
            const names = ['Ace','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Jack','Queen','King'];
            let index = 0;
            suits.forEach(suit => {
                for(let i = 0; i <= 12; i ++){
                    //image files are named sequentially for easy pairing 
                    let card = new Card(names[i],i+1,`cards/faceUp${suit}${i+1}.png`,index);
                    this.cards.push(card); 
                    index ++;  
                }
            });   
        }
        //renders cards available in go fish pile 
        renderDeckCardNodes () {
            for(let i = 0; i < this.cards.length; i ++) {
                //randomized angle and placement 
                const posOrNeg = Math.random() >= .5 ? 1 : -1; 
                const randomMargin = `${(Math.round(Math.random() * 5 * posOrNeg))}vh`;
                const randomRotate = `rotate(${Math.round(Math.random() * 80 + 45)}deg)`; 
                const $card = $('<img>').attr('src',this.cards[i].currentFace).addClass('deck-card').css('margin-top',randomMargin).css('transform',randomRotate)
                $card.attr('id',this.cards[i].nodeID).attr('data-value',`${this.cards[i].value}`).attr('data-name',`${this.cards[i].name}`);
                $('#card-container').append($card);                
            }
        }
        //uses set interval to launch deck card nodes 1 at a time
        renderDeckCardNodeAnimation () {
            let i = 0;
            const renderDelay = setInterval( () => { 
                $('.deck-card').eq(i).addClass('float');
                i ++; 
                if (i > this.cards.length - 1){clearInterval(renderDelay);}
            }, 1500);
        }
        //pushes 5 cards into each player hand at random, then removes that card from go fish pile:
        createPlayerInstanceHands () {
            Object.keys(this.players).forEach(playerKey => {
                for(let i = 0; i < 5; i ++){
                    const randomIndex = Math.floor(Math.random() * this.cards.length); 
                    this.players[playerKey].takeCard(this.cards[randomIndex]);
                    this.cards = this.cards.filter(card => card.owner === null); 
                }
            });
        }
        renderHandCardNodes () {
            Object.keys(this.players).forEach(playerKey => {
                this.players[playerKey].hand.forEach(cardInstance => {
                    const $card = $('<img>').attr('src',cardInstance.currentFace).addClass('hand-card');
                    $card.attr('id',`${cardInstance.nodeID}`).attr('data-value',`${cardInstance.value}`).attr('data-name',`${cardInstance.name}`);
                    //appends card nodes to each player's hand node 
                    this.players[playerKey].fetchNode().children().append($card);
                }); 
            });
            //renders user's hand face up
            this.players['1'].hand.forEach(cardInstance => this.renderCardNodeFlip(cardInstance));
            //sorts nodes in players's hand by value
            Object.keys(this.players).forEach(playerKey => this.renderSortedHand(this.players[playerKey].fetchNode())); 
        }
/////////PLAYER AND CARD EVENT LISTENERS/////////
        addEventListeners () {
            //adds on click to each card node in user's hand node using helper method 
            this.players['1'].hand.forEach(cardInstance => this.addHandCardNodeEvent(cardInstance));
            this.cards.forEach(cardInstance => {
                cardInstance.fetchNode().on('click', () => {
                    //returns card object to global selection monitor 
                    this.currentGoFish = cardInstance;
                    //continues user's turn flow
                    this.checkGoFishMatch();
                })
            })
            //adds on click to boat nodes for user's opponent selection (except when 2 players)
            Object.keys(this.players).length > 2 ? 
                Object.keys(this.players).forEach(playerKey => {
                    this.players[playerKey].fetchNode().on('click', () => {
                        this.renderPrompt(`you selected <span class='orange'>  ${this.players[playerKey].fetchNode().attr('id')} </span> `);
                        this.currentOpponent = this.players[playerKey];
                        //continues user's turn flow
                        this.checkTurnCompletion();
                    }) 
                }) : false;
            $('#player1').off('click');
        }
        
////////////////////////////
/////////TURN MECHANICS/////
////////////////////////////

/////////SETUP/////////
        startTurn () {
            //solution for node animations getting skipped as a result of player go fish phase changing interval loop's source array length
            $('.deck-card').length !== $('.float').length ? this.renderDeckCardNodeAnimation() : false; 
            //clears global monitors
            this.currentCard = null;
            this.currentOpponent = null; 
            this.matchingCardInstances = [];
            this.currentGoFish = null; 
            this.dealtCards = []; 
            this.checkForEnd();
            //for debugging animation
            console.log($('.deck-card').length);
            console.log($('.float').length);
            console.log(this.cards.length);
        }        
        checkForEnd () {
            console.log("in check for end");
            //game ends when center is empty and all hands are empty
            (this.cards.length < 1) && (Object.keys(this.players).filter(playerKey => this.players[playerKey].hand.length < 1).length === Object.keys(this.players).length) ? 
                this.selectWinner() : this.checkIfEmptyHand();
        }
        checkIfEmptyHand () {
            console.log("in checkIfEmptyHand");
            //if the current player has cards in their hand or no go fish pile left, then don't deal
            (this.cards.length === 0) || (this.players[this.currentTurn].hand.length > 0) ? this.turnSelector() :
            //otherwise if there are more than 5 cards left in deck, deal them 5; if not, the remainder; check end should prevent dealing with 0 cards left 
                this.cards.length >= 5 ? this.dealCardInstances(5) : this.dealCardInstances(this.cards.length);
        }
        dealCardInstances (num) {
            console.log("in dealCardInstances")
            //has to run until the dealt amount of cards equals tge amount of cards that need to be dealt
            for(let i = 0; num > this.dealtCards.length; i ++) {
                //helps to ensure animation shows
                const $randomDeckNode = $('.float').eq(Math.floor(Math.random() * $('.float').length)); 
                //conditional necessary to prevent random selection from picking the same card twice when dealing
               this.dealtCards.findIndex(cardInstance => cardInstance.nodeID === $randomDeckNode.attr('id')) === -1 ? 
               //finds the cardinstance paired with the random card node and pushes it into dealt cards array
                    this.dealtCards.push(this.cards.find(cardInstance => cardInstance.nodeID === $randomDeckNode.attr('id'))) : false; 
                //for debugging 
                console.log(this.dealtCards);
            }
            //adds card instance to player instance's hand and removes from card deck array 
            this.dealtCards.forEach(cardInstance => {
                this.players[this.currentTurn].takeCard(cardInstance);
                this.cards.splice(this.cards.indexOf(cardInstance), 1);
            });
            this.dealCardNodes(); 
        }
        dealCardNodes () {
            //different prompt based on user or ai
            this.currentTurn !== 1 ? 
                this.renderPrompt(`dealing cards to <span class='orange'>player${this.currentTurn}</span>`) :
                this.renderPrompt(`dealing cards to <span class='orange'>you</span>`);
            this.dealtCards.forEach(cardInstance => {
                this.cardSwapAnimation(cardInstance);
                //if user, flips card face up 
                setTimeout(() => this.currentTurn === 1 ? this.renderCardNodeFlip(cardInstance) : false, 2000);
                cardInstance.fetchNode().off('click');
                this.currentTurn === 1 ? this.addHandCardNodeEvent(cardInstance) : false;
            });
            setTimeout(() => this.turnSelector(), 3500);
        }
/////////PLAYER SELECTION/////////
        turnSelector () {
            console.log("in turn selector");
            //if player has no cards left because go fish pile is empty, their turn is skipped 
            this.players[this.currentTurn].hand.length === 0 ? this.updateCurrentTurn() : 
            //initiates user or ai turn; both userTurn() and aiTurn() share all other turn mechanic methods
            this.currentTurn === 1 ? this.userTurn() : this.aiTurn();
        }
        userTurn () {
            console.log("in userTurn")
            //enables user select of hand nodes and player nodes
            this.toggleUserPointerEvents();
            //altered prompt based on player count 
            Object.keys(this.players).length > 2 ? 
                this.renderPrompt(`select a <span class='orange'> player </span> <br> and <span class='orange'> card </span>`) :
                this.renderPrompt(`select a <span class='orange'> card </span>`);
            //automatic opponent selection when only 2 players
            Object.keys(this.players).length === 2 ? this.currentOpponent = this.players[2] : false; 
        }
        aiTurn () {
            this.renderPrompt(`waiting for <span class='orange'>player${this.currentTurn}</span>`); 
            //uses ai class method to return object containing selected card and opponent key
            const aiTurn = this.players[this.currentTurn].takeTurn();
            this.currentCard = aiTurn.card
            this.currentOpponent = this.players[aiTurn.key]; 
            //different prompts based on opponent selection and player cpunt
            setTimeout(() => {
                (Object.keys(this.players).length === 2 ) && (this.currentTurn !== 1) ?
                    this.renderPrompt(`player${this.currentTurn} selects card 
                        <span class='orange'>  ${this.currentCard.fetchNode().attr('data-name')} </span> `) : 
                this.currentOpponent.playerKey !== '1' ?
                    this.renderPrompt(`player${this.currentTurn} selects <br> 
                        <span class='orange'>  ${this.currentOpponent.fetchNode().attr('id')} </span>
                         and card <span class='orange'>  ${this.currentCard.fetchNode().attr('data-name')} </span> `) :
                    this.renderPrompt(`player${this.currentTurn} selects <br> 
                        <span class='orange'> you </span> and card <span class='orange'>  ${this.currentCard.fetchNode().attr('data-name')} </span> `)
            },2000);
            //continues ai control flow
            setTimeout(() => this.checkTurnCompletion(), 3500);
        }
/////////REQUEST PHASE/////////
        checkTurnCompletion () {
            console.log('in checkTurnCompletion')
            //for debugging 
            console.log(game);
            //initates card match check when user selects both a card and opponent
            this.currentCard === null || this.currentOpponent === null ? false : this.checkPlayerCardMatch();
        }
        checkPlayerCardMatch () {
            console.log("in checkplayercardmatch")
            //if user turn, disables further card or opponent selection using helper method 
            this.currentTurn === 1 ? this.toggleUserPointerEvents() : false;
            //when a card is requested, opponents will know the player has it, whether user or ai 
            this.aiRemember(this.currentCard)
            //filters any matching card instances into global monitor 
            this.matchingCardInstances = this.currentOpponent.hand.filter(cardInstance => cardInstance.name === this.currentCard.name);
            setTimeout(()=>  {
                //initiates a card swap or go fish; delayed to prevent instance prompt 
                this.matchingCardInstances.length > 0 ? this.playerCardMatchFound() : 
                //skip go fish phase if no more deck cards 
                    this.cards.length > 0 ? this.goFish() : this.updateCurrentTurn()
            }, 1500); 
        }
        playerCardMatchFound () {
            console.log("in playercardmatchfound")
            //when a card is gained, opponents will know the player has it, whethe ruser or ai 
            this.matchingCardInstances.forEach(cardInstance => this.aiRemember(cardInstance));
            //different prompts based on opponent selection 
            this.currentOpponent !== this.players['1'] ? 
                this.renderPrompt(`<span class='orange'> player${this.currentOpponent.playerKey} </span>  has <span class='orange'> 
                     ${this.matchingCardInstances.length}</span>  of this card`) :
                this.renderPrompt(`<span class='orange'> you </span>  have <span class='orange'> 
                     ${this.matchingCardInstances.length}</span>  of this card`);
            //swaps card instance, then card node 
            this.swapPlayerCardInstances();
            this.swapPlayerCardNodes();
            //a match triggers a second turn in go fish 
            setTimeout(()=> this.checkIfFourMatch(), 3000);
        }
        swapPlayerCardInstances () {
            //uses user and ai class methods to facilitate swap 
            this.matchingCardInstances.forEach(cardInstance => {
                this.players[this.currentTurn].takeCard(cardInstance);
                //ai must forget all cards they gain 
                this.currentTurn !== 1 ? this.players[this.currentTurn].forget(cardInstance) : false; 
                this.currentOpponent.giveCard(cardInstance);
            });
        }
        swapPlayerCardNodes () {
            this.matchingCardInstances.forEach(cardInstance => {
                //both ai and user cards are revealed on swap; if ai gains user cards, no need to flip since already showing face up
                this.currentOpponent !== this.players['1'] ? this.renderCardNodeFlip(cardInstance) : false; 
                //show and hide animation won't work because float animation already attached
                this.cardSwapAnimation(cardInstance);
                //ai player card nodes turn face down once in their hand; delayed to match swap animation 
                setTimeout(() => this.currentTurn !== 1 ? this.renderCardNodeFlip(cardInstance) : false, 2000);
                //adds hand card node on click to user's gains only 
                this.currentTurn === 1 ? this.addHandCardNodeEvent(cardInstance) : false;
                //in case ai selects user, removes the on click event
                this.currentOpponent === this.players['1'] ? cardInstance.fetchNode().off('click') : false;
            });
        }
/////////GO FISH PHASE/////////
        goFish () {
            this.renderPrompt(`go <span class='orange'> fish </span>`);
            setTimeout(() => $('#prompt-container').removeClass('show').addClass('hide'), 500);
            //if current turn is ai player, returns random card from go fish pile 
            this.currentTurn !== 1 ? 
                setTimeout(() => {
                    //helps to keep ai's go fish animation on screen; selects random node
                    const randomDeckNode = $('.float').eq(Math.floor(Math.random() * $('.float').length)); 
                    this.currentGoFish =  this.cards.find(cardInstance => cardInstance.nodeID === randomDeckNode.attr('id')); 
                    this.checkGoFishMatch();
                }, 1500) : 
                //otherwise toggles pointer events for go fish pile card nodes 
                setTimeout(() => this.cards.forEach(cardInstance => this.pointerEventsToggle(cardInstance)), 500);
        }
        checkGoFishMatch () {
            //after user select, removes pointer events from go fish pile card nodes
            this.currentTurn === 1 ? this.cards.forEach(cardInstance => this.pointerEventsToggle(cardInstance)) : false //////????
            //removes deck card event listener from fished card
            this.currentGoFish.fetchNode().off('click'); 
            //places fished card instance into player instance's hand and removes from go fish pile 
            this.players[this.currentTurn].takeCard(this.currentGoFish);
            this.cards.splice(this.cards.indexOf(this.currentGoFish), 1);
            //checks whether fished card matches requested card 
            this.currentGoFish.name === this.currentCard.name ? this.goFishMatchFound() : this.goFishNotMatch(); 
        }
        goFishMatchFound () {
            console.log("in gofish match found")
            this.currentTurn !== 1 ? 
                this.renderPrompt(`player${this.currentTurn} fished <span class='orange'>  ${this.currentGoFish.fetchNode().attr('data-name')} </span> `) : 
                this.renderPrompt(`you fished <span class='orange'>  ${this.currentGoFish.fetchNode().attr('data-name')} </span> `);
            //card shows to all players if go fish is a match 
            this.aiRemember(this.currentGoFish); 
            this.renderCardNodeFlip(this.currentGoFish);
            //show and hide animation won't apply due to float animation
            this.cardSwapAnimation(this.currentGoFish);
            //ai player gains turn face down once in their hand
            setTimeout(() => this.currentTurn !== 1 ? this.renderCardNodeFlip(this.currentGoFish) : false, 2000);
            //if user, adds hand card event listener
            this.currentTurn === 1 ? this.addHandCardNodeEvent(this.currentGoFish) : false;
            //player gets to go again
            setTimeout(()=> this.checkIfFourMatch(),3000);

        }
        goFishNotMatch () {
            console.log(`in end turn`)
            //if go fish card isn't a match, only the card catcher can read prompt
            this.currentTurn === 1 ? this.renderPrompt(`you fished <span class='orange'>  ${this.currentGoFish.fetchNode().attr('data-name')} </span> `) : false; 
            //show and hide animation won't apply due to float animation
            this.cardSwapAnimation(this.currentGoFish);
            //if go fish card isn't a match, only the card catcher can see it 
            setTimeout(() => this.currentTurn === 1 ? this.renderCardNodeFlip(this.currentGoFish) : false, 2000);  
            //if user, adds hand card event listener
            this.currentTurn === 1 ? this.addHandCardNodeEvent(this.currentGoFish) : false; 
            //cycles to next player
            setTimeout(()=> this.checkIfFourMatch(), 2500);
        }
/////////ENDING TURN/////////
        checkIfFourMatch () {
            console.log("in check if four match")
            const quantifiedHandCardNames = {};
            //adds each card name in AI's hand as a property key
            this.players[this.currentTurn].hand.forEach(cardInstance => quantifiedHandCardNames[cardInstance.name] = 0);
            //compares the name of each property key with the name of each card in AI's hand; tallies any matches 
            Object.keys(quantifiedHandCardNames).forEach(name => 
                    this.players[this.currentTurn].hand.forEach(cardInstance => 
                        name === cardInstance.name ? quantifiedHandCardNames[name] += 1 : false
                ));
            //checks for and stores card name that has 4 occurences 
            const matchFound = Object.keys(quantifiedHandCardNames).find(key => quantifiedHandCardNames[key] === 4); 
            //cycles turn depending on conditionals 
            typeof matchFound === 'string' ? this.matchOfFourFound(matchFound) : 
            //conditional works but only in specific order due to .name === .name being null if placed first (player request occurs before gofish exists)
                (this.matchingCardInstances.length > 0) || (this.currentCard.name === this.currentGoFish.name) ? 
                        this.startTurn() : this.updateCurrentTurn(); 
        }
        matchOfFourFound (matchingName) {
            console.log("in match of 4")
            //different prompts based on ai or user 
            this.currentTurn !== 1 ? 
            this.renderPrompt(`player${this.players[this.currentTurn].playerKey} matched all <span class='orange'>${matchingName}</span>'s `) : 
                this.renderPrompt(`you matched all <span class='orange'>${matchingName}</span>'s `);
            //score updates player instance and score node 
            this.players[this.currentTurn].score += 1;
            this.currentTurn !== 1 ? 
                $(`#score${this.players[this.currentTurn].playerKey}`).html(`player${this.players[this.currentTurn].playerKey} <span class='orange'> &nbsp score ${this.players[this.currentTurn].score}</span>`) :  
                $(`#score${this.players[this.currentTurn].playerKey}`).html(`your <span class='orange'> &nbsp score ${this.players[this.currentTurn].score}</span>`);  
            //finds all matching card instances in player's hand 
            const matchingInstances = this.players[this.currentTurn].hand.filter(cardInstance => cardInstance.name === matchingName);
             //if face down (ai), reveals matching card nodes; seperated to avoid flip lag
            matchingInstances.forEach(cardInstance => this.currentTurn !== 1 ? this.renderCardNodeFlip(cardInstance) : false)
            matchingInstances.forEach(cardInstance => {
                //fades matching card nodes
                setTimeout(()=> cardInstance.fetchNode().css('transition','1s').css('opacity','0'), 1000);
                //removes matching card nodes
                setTimeout(()=> cardInstance.fetchNode().remove(), 2000);
                //removes matching card instance 
                setTimeout(()=> this.players[this.currentTurn].hand.splice(this.players[this.currentTurn].hand.indexOf(cardInstance), 1), 2500)
            }); 
            //cycles turn based on path
            setTimeout(()=> {
                //conditional works but only in specific order due to .name === .name being null if placed first (player request occurs before gofish exists)
                (this.matchingCardInstances.length > 0) || (this.currentCard.name === this.currentGoFish.name) ? 
                        this.startTurn() : this.updateCurrentTurn();
            }, 4000);
        }
        updateCurrentTurn () {
            console.log("in update current turn")
            //updates current turn depending on value 
            this.currentTurn < Object.keys(this.players).length ? this.currentTurn += 1 : this.currentTurn = 1
            this.startTurn();
        }
    ////////////////////////
    ////HELPER FUNCTIONS////
    ////////////////////////
        //ai class method helps to store requested or earned cards into their memory 
        aiRemember (cardInstance) {
            Object.keys(this.players).forEach(playerKey => 
                playerKey !== '1' && playerKey !== this.players[this.currentTurn].playerKey ? this.players[playerKey].remember(cardInstance) : false
            )
        }
        //designed to work for both player and go fish pile swaps 
        cardSwapAnimation (cardInstance) {
            //fades out card node
            cardInstance.fetchNode().css('transition','1s').css('opacity','1');
            setTimeout(()=>cardInstance.fetchNode().css('opacity','0'),1000);
            setTimeout(()=> {
                //re appends card node to new player
                this.players[this.currentTurn].fetchNode().children().append(cardInstance.fetchNode());
                //fades in card node; for go fish pile card node, updates css to match hand card node
                cardInstance.fetchNode().removeClass('deck-card').removeClass('float').removeAttr('style').addClass('hand-card').css('opacity','1');
                //sorts hand numerically; only visible for user cards though kept dynamic 
                this.renderSortedHand(this.players[this.currentTurn].fetchNode());
            }, 2000);
        }
        renderPrompt (string) {
            $('#prompt-container').addClass('show');
            $('#prompt').html(string);
        }
        //sorts nodes in player's hand by card value in ascending order
        renderSortedHand(playerNode) {
            playerNode.children().children().sort((a,b) => 
                parseFloat($(a).attr('data-value')) - parseFloat($(b).attr('data-value'))).appendTo(playerNode.children());
        }
        //assists in flipping card face image by pairing card instance and node update together
        renderCardNodeFlip(cardInstance)    {
            cardInstance.flipCard();
            cardInstance.fetchNode().attr('src',cardInstance.currentFace);
        }
        toggleUserPointerEvents () {
            //turns on pointer events for AI boat nodes
            Object.keys(this.players).forEach(playerKey => playerKey !== '1' ? 
                this.pointerEventsToggle(this.players[playerKey]) : false );
            //turns on pointer events for card nodes in user's hand node
            this.players['1'].hand.forEach(cardInstance => this.pointerEventsToggle(cardInstance));
        }
        //assists in toggling node pointer events 
        pointerEventsToggle (instance) {
            //checks current pointer-events value and returns opposite
            instance.fetchNode().css('pointer-events') !== 'none' ? 
                instance.fetchNode().css('pointer-events','none') : instance.fetchNode().css('pointer-events','auto').css('cursor','pounter');
        }
        //adds event listener to each card node in user's hand node
        addHandCardNodeEvent (cardInstance) {
            cardInstance.fetchNode().on('click', () => {
                //returns card name to prompt
                this.renderPrompt(`you selected <span class='orange'>  ${cardInstance.fetchNode().attr('data-name')} </span> `);
                //returns card object to global selection monitor 
                this.currentCard = this.players['1'].hand.find(handCardInstance => handCardInstance.nodeID === cardInstance.fetchNode().attr('id'));
                setTimeout(()=> this.checkTurnCompletion(), 500);
            });
        } 
    ////////////////////////
    ////////END GAME////////
    //////////////////////// 
        selectWinner () {
            //sorts users by score in descending order
            const sortedScores = Object.keys(this.players).sort((playerKey1, playerKey2) => this.players[playerKey2].score - this.players[playerKey1].score);
            console.log(sortedScores);
            //stores the highest score
            const highestScore = this.players[sortedScores[0]].score; 
            //filters all users with the highest score 
            this.winner = sortedScores.filter(playerKey => this.players[playerKey].score === highestScore); 
            this.endGame();
        }
        
        endGame () {
            //different prompt depending on ai or user winner
            (this.winner.length === 1) && (this.winner[0] !== `1`) ? $('#winner').html(`player${this.winner[0]} <span class='orange'> wins </span>`) :
            (this.winner.length === 1) && (this.winner[0] === `1`) ? $('#winner').html(`you <span class='orange'> win </span>`) :
           //different prompt for tie
            $('#winner').html(`tie <span class='orange'> game </span>`);
            $('#winner').addClass('show');
        }
    }

////////////////////////
///////INITIALIZE///////
////////////////////////
    //create game class instance
    const game = new Game();
    //passes Game class instance variable name to AI class instances to avoid AI selection of player with empty hand 
    game.passSelf(game);
    //render start screen  
    game.renderStart();
});

