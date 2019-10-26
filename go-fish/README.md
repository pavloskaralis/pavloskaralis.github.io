Live Site: https://pavloskaralis.github.io/go-fish/

Languages Used: HTML, CSS, JS

Libraries Used: jQuery

Inspiration Source: https://cardgames.io/gofish/

HTML/CSS Approach: 
All non-game-piece items are hard coded into the HTML;
The HTML is divided into 8 sections: game piece containers, start screen, end screen, prompt, scores, buttons, art credit, and backgrounds; 
The game piece containers are positioned relative within the flex body;
All other containers are positioned absolute with varying z-indexes; 
The background is created overlapping png files with a gif file; 
While many containers share style, css is intentially repeated for visibility and to avoid mixing different html sections;
VH and VW is heavily relied on for dynamic display;
@media is applied to prevent font from being too small on mobile; 
4 animations are used: show, hide, float (deck), and sway(players);

JS Approach:
JS is divided into 4 classes/files: card, user, ai, and app;
The card class is utilized to construct 52 card instances;
It includes the following helper functions: updateOwner, flipCard, and fetchNode;
updateOwner helps the card instance update its owner when passed around;
flipCard toggles the currentFace image between two files; 
fetchNode helps retrieve the node version of the card instance;
The nodeID property helps link the card instance to its node version;
The value property is passed to the node and used to sort it numerically within a players hand;

The user class is designed specifically for a human player, and is therefore more sparse than the AI class that extends from it;
In addition to its own fetchNode helper method, it has a takeCard and giveCard method;
These methods help to add or remove card instances to the player's hand property; 
The user and each AI also have a unique player key that helps the game class identify them from one another;

The AI class extends off of the user class in order to implement a specific strategy for AI players to take; 
The stragey is to first memorize all requested or swapped cards during gameplay;
Then during card/opponent selection, AI chooses the memorized card which matches the most repeated value within their hand;
If no cards exist in AI's memory, or if no cards in AI's hand match any memorized card's value, AI selects their most repeated hand card value; 
Certain conditions are employed to avoid repeating a card/opponent selection, as well as avoid selecting a player who has no cards in their hand;
To assist with this strategy, the AI is designed with specific methods and properties;
One such property is the memory array, which stores various requested or matched card instances throughout the game;
Summarily, each turn the AI first uses a method to quantify its hand card values; 
Then, another method is used to sort these values, so that a more frequently occuring value is prioritzed when filtered against memory card values;
If the card is chosen from memory, the opponent is the memorized card's owner;
If the card is chosen from hand, the opponent is picked at random and the previously selected opponent is not included as an option;
If there is only 1 opponent to pick from, and they were selected the previous turn, the AI does not pick the previously selected card; 
Finally, the combined card/opponent selection is returned to the game class as an object; 

The game class contains all cards and players within its properties;
There also exist other properties that help to track turn variables such as the current turn, a player's selection, matching instances in an opponents hand, etc.
Overall, the game class is divided into five method sections: start screen, board setup, turn mechanics, helper functions, and end game;

The start screen method section deals with loading the title screen and allows the user to select a player count;
It does so by defining a specific value within each button's event listener that generates the game board with that value's amount of players; 

The board setup method section is tasked with rendering the game board and attaching all event listeners;
There is a method within this section that serves as a method hub in that it calls all other rendering methods; 
Each of these other rendering methods is tasked with a specific responsibility in order to seperate functionality and make debugging simpler; 
Furthermore, the creation of an instance and its node version is also seperated for the same reasons;

The turn mechanics section is also grouped by functionality, and begins by reseting all turn variables and checking whether the game has ended; 
Assuming the game ending condition has not been met, the control flow then checks to see if a player has cards in their hand;
If the player's hand is empty, they are dealt cards, otherwise the control flow moves on to identify the player;
From here the control flow briefly splits depending on whether the player is human or ai;
A human clicking event listeners triggers a continuation of the control flow, while for AI, a selection is returned after a brief delay;
Once a player makes their selection, the game class sets out to find if any matches exist, and enacts a swap;
If matches are found, the player gets to request again, otherwise they must fish a card out of the deck;
If the card they fish matches their failed request, they get to make another request, otherwise their turn ends, and the current turn counter is updated;
Regardless of which of the 3 outcomes occur, all pass through another check to see if 4 matched values exist within a players hand;
If a match exists, that player gains a point, and the matched cards are removed from the game;

Conclusively, this cycle repeats itself until no cards remain in play;
The end game method section is then tasked with determining the highest score value;
It then checks to see how many player scores match the highest score valye and declares either a winner or a tie; 
A reset button exists in the bottom right corner of the game, so that the user may restart at their choosing; 
In brief mention of the helper function section, it consists of methods that are repeatedly called within multiple turn mechanic methods;
Some examples include a prompt renderer, a card swap animation, and a user pointer events toggler;

Of course, the above is an oversimplified explaination, and the script should be read directly in order to observe the precise mechanics; 
Regardless, the key to the game's success likely lies in its seperation of functionality;
In hindsight, I feel it was even risky to merge user and ai control flow in order to condense code;
Seeing how large the code ended up being, a better structure would have been to create seperate classes for the game rendering, user flow, and ai flow;
These classes could then be pieced together within the game class, along with all the game piece instances; 
Having not created such an app before, this and some other aspects were unforseeable to me;
For instance, there were a handful of methods whose necessity was not known until that part of the game was being written; 
In the future, creating an actual diagram of the control flow could help uncover such surprises in advance;
Also, the necessity for AI to be able to access other player's hand length wasn't realized until the very end;
This was because the issue of AI selecting an empty handed player didn't present itself until end game; 
A last minute solution of having the game class instance pass itself to its housed player instances was executed;
This seems like something that should be avoided (not sure why, just does), but was done because of time constraints; 
Finally, the importance of well  written conditionals made itself abundantly clear;
Some conditionals were written around the object properties of objects who were deleted at various phases of the control flow;
Because of this, if the conditional was not ordered properly, an undefined error occured; 

To end, here is a list of the most challenging bugs that occured, and the solutions that helped fix them;

1. Random deal was not dealing the correct amount of cards, because sometimes the same card was selected twice;
to fix this, a conditional was implemented that prevented pushing duplicates, and the function ran until a specific dealt cards array length was met; 

2. The float animation skipped over some nodes, because a player's turn disrupted the length of the deck array;
to fix this, the float animation was re-applied each turn phase until the amount of deck cards equaled the amount of cards with a float animation class; 

3. At end game, AI were selecting empty handed players because their hand lengths weren't being passed;
A quick solution was the pass the game class instance itself, so that the player instances could read each other's hand lengths; 

4. Using a sometimes undefined object’s property in a conditional often resulted in an error; 
the conditional had to be written in a way that only required the object's property to be read at times it was defined; 

5. Old data was not reseting properly within an AI's memory, causing it to select a card it no longer owned; 
the solution was to change the sequence of callbacks so that the data would reset before a card was selected; 

6. Pointer events were not registering when float animation and deck node creation were combined via set interval;
the solution was to seperate functionality, creating all the nodes first so that they actually existed when event listeners were applied; 

7. Animations were not showing because AI were randomly selecting card instances whose node version was still awaiting animation via set interval; 
the solution was to have AI randomly select from animated nodes only, and then find that node's instance version; 



 
