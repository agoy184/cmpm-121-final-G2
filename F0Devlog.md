## How we satisfied the software requirements
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

