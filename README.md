# CMPM121 Final Project: Group 2
# Devlog Entry - [11/20/2023]

## Introducing the team
### Tools Lead 
Julian Lara
### Engine Lead 
Hung Nguyen
#### Assistant Engine Lead 
Benthan Vu
### Design Lead
Abel Goy
#### Assistant Design Lead 
Anthony Garcia


## Tools and materials
### Engine
We intend to use Phaser, since everyone on our team took CMPM 120, so we already have experience with using Phaser. It’s also built for making web games, and quickly making prototypes, which is perfect for this project.

### Language
We are using JavaScript since it’s what we’ve used for our previous Phaser projects, and so we already have a lot of sample code we can reuse and rework to quickly implement the design requirements and focus on polishing and refactoring our code.

### Tools
The tools we expect to use are VScode, GitHub, Prettier, and ChatGPT.  VScode is a simple choice due to it being very compatible with the Phaser engine, which we intend to use.  GitHub is also an easy choice, as it’s the best platform for code management and version control.  Prettier will be a useful tool to keep our code format consistent and easy to read.  ChatGPT, while likely not being the main crux of writing code for our project, will be used for debugging.  


## Outlook
### Accomplishment Goals
Our team is hoping to accomplish the creation of a farming game that utilizes tilemaps and grid-based inventories for farming.  We also hope to accomplish a quality level of game feel by utilizing Phaser’s particle emitter system.  

### Hardest/Riskiest Part
We anticipate that the hardest part of the project will be having to change our implementation of core elements of our game due to the changing requirements. We also anticipate that maintaining a good design in order to easily add future design requirements may be difficult.

### Hoping to learn
We are hoping to learn how to quickly refactor our code to make future code changes easier to perform, which will be made significantly easier with the tools we chose, since we are already familiar with them. For us, the challenge won’t be learning the tools we use, but the actual core of the project and its changing requirements.

# Devlog Entry - [11/28/2023]
## (F0) How we satisfied the software requirements
### [F0.a] You control a character moving on a 2D grid.
We satisfied this requirement by creating a player prefab and adding listeners for the keys W, S, A, and D as directions for controlling the character.

### [F0.b] You advance time in the turn-based simulation manually.
We satisfied this requirement by creating a listener for player input on key T so that each time a player presses that key, a UI indicator in the top left shows that what time has passed and what day the player is on according to the time.

### [F0.c] You can reap (gather) or sow (plant) plants on the grid when your character is near them.
We satisfied this requirement by creating plant classes with seperate growth levels/requirements in Plant.js, as well as allowing the player to reap the plants with key Q and sow new plants with keys 1, 2, or 3, sowing carrots, tomatoes, and potatoes respectively.

### [F0.d] Grid cells have sun and water levels. The incoming sun and water for each cell is somehow randomly generated each turn. Sun energy cannot be stored in a cell (it is used immediately or lost) while water moisture can be slowly accumulated over several turns.
We fulfilled this requirement by creating a prefab, Grid.js, which generated a random amount of sunlight and water for each cell on the grid. Each grid cell has a sun and water level that is viewable by pressing the key E, which will display through text both variables pertaining the water and sunlight information.

### [F0.e] Each plant on the grid has a type (e.g. one of 3 species) and a growth level (e.g. “level 1”, “level 2”, “level 3”).
We fulfilled this requirement through creating plant classes in the Plant.js prefab specifying each plants type and growth levels. Each plant starts at growth level 1, and setting the sprite scale to increase in size once it's growth levels have been reached.

### [F0.f] Simple spatial rules govern plant growth based on sun, water, and nearby plants (growth is unlocked by satisfying conditions).
We fulfilled this requirement by first creating a function in our grid prefab known as getNearCells, which creates and returns an array of data and based on what cells are around a plant that has been sown. Once the plant has been sown, conditionals read by using the nearCells array will be used to determine whether the plant is able to ascend to the next level or not by the next day.

### [F0.g] A play scenario is completed when some condition is satisfied (e.g. at least X plants at growth level Y or above).
We fulfilled this requirement by creating an inventory system for the player to show the plants that they've collected, as well as a conditional that checks whether they have collected a total of 5 plants for their inventory at growth level 3. 

## Reflection

### How has the team’s plan changed?
So far the team's plan hasn't necessarily changed, as we are laying a base foundation for our game's mechanics. We have not yet reached a point where our team has had to change course for what our finished game will look like.

### Did you reconsider any of the choices you previously described for Tools and Materials or your Roles?
We have not reconsidered our choices regarding tools or materials, as all of the currently established tools and materials are satisfactory with all of the current requirements.

# Devlog Entry - [12/04/2023]
## (F1) How we satisfied the software requirements
### [F1.a] The important state of each cell of your game’s grid must be backed by a single contiguous byte array in AoS or SoA format. Your team must statically allocate memory usage for the whole grid.


### [F1.b] The player must be able to undo every major choice (all the way back to the start of play), even from a saved game. They should be able to redo (undo of undo operations) multiple times.
We satisfied this requirement by creating two stacks: one for undone actions and one for redone actions. Any time an action is made, that action is pushed onto the undo stack. Actions can be defined through a player's movement, time passing, plant sowing and reaping. Whenever an action is undone, that action is popped from the undo stack and pushed onto the redo stack. 
The redo stack ONLY keeps tracks of actions that have been undone. If the player chooses to redo, the latest action is popped off of the redo stack and the game's state is changed accordingly. 

### [F1.c] The player must be able to manually save their progress in the game in a way that allows them to load that save and continue play another day. The player must be able to manage multiple save files (allowing save scumming).
We satisfied this requirement by creating a save file prefab, which retains the water and sun levels of each of the cells, the day and time that the player saves at, which plants are on each of the cells in the grid and what level each plant is currently at. 
The save file also retains what the plants are stocked in the inventory, as well as the undo and redo stacks. All of this is stored locally in a stringified JSON, which is parsed upon loading.

### [F1.d] The game must implement an implicit auto-save system to support recovery from unexpected quits. (For example, when the game is launched, if an auto-save entry is present, the game might ask the player "do you want to continue where you left off?" The auto-save entry might or might not be visible among the list of manual save entries available for the player to load as part of F1.c.)
We satisfied this requirement by setting a time interval of about 50 seconds, as to which the state of the game is stored locally and will be automatically loaded upon reopening the window (on the condition that the user chooses to load the autosave via text prompt button).

## Reflection

