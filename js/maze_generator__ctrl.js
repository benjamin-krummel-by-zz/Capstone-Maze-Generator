Maze.controller('mazeGenerator',function($scope,$http){

		var MAZE_SIZE = 30;
		var R_START = 1;
		var C_START = Math.ceil(MAZE_SIZE/2);
		var FOUND_GOAL = false;

		// Used to create a default maze.
		$scope.mazeList = [
				{id:Math.ceil(Math.random()*9999),name:"Generate Maze", matrix:generateMaze(),goals:1, compass:[0,1]}
		];

		$scope.loadMaze = function(){
				// initializing a new maze with a random id.
				var newMaze = {
													id:Math.ceil(Math.random()*9999),
													matrix:generateMaze()
											};
				// Edit parent scope attribute -> mazeCtrl
				$scope.maze.matrix = newMaze.matrix;
				$scope.maze.id = newMaze.id;
				$scope.maze.compass = [0,Math.ceil(MAZE_SIZE/2)];
		}

		$scope.isActive = function(mazeID){
				return mazeID === $scope.maze.id ? 'active' : '';
		}

		/**
		 * Generates a 2D maze using depth first search algorithm.
		 * @return {Array} 2D Array that is the maze to be displayed on screen.
		 */
		function generateMaze(){
	     var maze = new Array(MAZE_SIZE);
			 var userData = getUserPastData();
			 FOUND_GOAL = false;
			 for (var i = 0; i < MAZE_SIZE; i++) {
				  	maze[i] = new Array(MAZE_SIZE);
			 }
	     // Initialize
	     for (var i = 0; i < MAZE_SIZE; i++)
	         for (var j = 0; j < MAZE_SIZE; j++)
	             maze[i][j] = 1;

	      //　Allocate the maze with recursive method.
	      recursion(R_START, C_START, maze, userData, false);
				//puts the start in the top middle of the maze.
				maze[0][Math.ceil(MAZE_SIZE/2)] = 2;
				maze[1][Math.ceil(MAZE_SIZE/2)] = 4;

	      return maze;
	  }

		/**
		* Grabs the user information from the database
		* @return {Array} 2D Array containing user's data
		*/
		function getUserPastData() {
				var solutions = new Array();
				firebase.database().ref('user').on('value', function(snapshot) {
						// Looping through Firebase data and loading the object
						snapshot.forEach((childSnapshot) => {

								Object.keys(childSnapshot.val()).forEach(function(key) {
										solutions.push(childSnapshot.val()[key]);
								});
						});
				});
				return solutions;
		}

	/**
	 * Creates the maze using depth first algorithm.
	 * @param {Integer} r the row number
	 * @param {Integer} c the column number
	 * @param {Array} maze 2D array containing the mazeID
	 * @param {Array} userData contains all the data of the user.
	 */
	 function recursion(r, c, maze, userData, startover) {
			while(startover) {
					if (r != R_START && c != C_START) {
							return;
					}	else {
							startover = false;
					}
			}

			var tendency = getUserTendency(userData);
			// 4 random directions
			var randDirs = generateRandomDirections(tendency);

      // Examine each direction
      for (var i = 0; i < randDirs.length; i++) {
          switch(randDirs[i]) {
		          case 1: // Up
		              //　Whether 2 cells up is out or not
		              if (r - 2 <= 0) {
											if (i == randDirs.length - 1 && !FOUND_GOAL) {
													startover = addGoal(maze, r - 1, c);
													recursion(r, c, maze, userData, startover);
													continue;
											}
											continue;
									}
		              if (maze[r - 2][c] != 0 && maze[r - 2][c] != 3 &&
										 		maze[r - 1][c] != 0 && maze[r - 1][c] != 3) {
		                  maze[r-2][c] = 0;
		                  maze[r-1][c] = 0;
		                  recursion(r - 2, c, maze, userData, startover);
		              }
		              break;
		          case 2: // Right
		              // Whether 2 cells to the right is out or not
		              if (c + 2 >= (maze.length - 1)) {
											if (i == randDirs.length - 1 && !FOUND_GOAL) {
													startover = addGoal(maze, r, c + 1);
													recursion(r, c, maze, userData, startover);
											}
											continue;
									}
		              if (maze[r][c + 2] != 0 && maze[r][c + 2] != 3 &&
										 		maze[r][c + 1] != 0 && maze[r][c + 1] != 3) {
		                  maze[r][c + 2] = 0;
		                  maze[r][c + 1] = 0;
		                  recursion(r, c + 2, maze, userData, startover);
		              }
		              break;
		          case 3: // Down
		              // Whether 2 cells down is out or not
		              if (r + 2 >= (maze.length - 1)) {
											if (i == randDirs.length - 1 && !FOUND_GOAL) {
													startover = addGoal(maze, r + 1, c);
													recursion(r, c, maze, userData, startover);
											}
											continue;
									}
		              if (maze[r + 2][c] != 0 && maze[r + 2][c] != 3 &&
										 		maze[r + 1][c] != 0 && maze[r + 1][c] != 3) {
		                  maze[r+2][c] = 0;
		                  maze[r+1][c] = 0;
		                  recursion(r + 2, c, maze, userData, startover);
		              }
		              break;
		          case 4: // Left
		              // Whether 2 cells to the left is out or not
		              if (c - 2 <= 0) {
											if (i == randDirs.length - 1 && !FOUND_GOAL) {
													startover = addGoal(maze, r, c - 1);
													recursion(r, c, maze, userData, startover);
											}
											continue;
									}
		              if (maze[r][c - 2] != 0 && maze[r][c - 2] != 3 &&
										 		maze[r][c - 1] != 0 && maze[r][c - 1] != 3) {
		                  maze[r][c - 2] = 0;
		                  maze[r][c - 1] = 0;
		                  recursion(r, c - 2, maze, userData, startover);
		              }
		              break;
          	}
      	}
	  }

		/**
	  * Generate an array containing the direction and the percentage of
		* the user choosing that direction.
		* @param {Array} userData contains all the data of the user.
	  * @return {Array} containing 4 directions with percentages
	  */
		function getUserTendency(userData) {
				var up = 0;
				var	right = 0;
				var	down = 0;
				var	left = 0;
				var	total = 0;

				for (var i = 0; i < userData.length; i++) {
						for (var j = 0; j<userData[i].length; j++) {
							switch(userData[i][j]){
								case 1: up++;
								case 2: right++;
								case 3: down++;
								case 4: left++;
							}
						}
				}
				total = up + right + down + left;

				/*
				 * Have to minus one from it so that the option the user least likely
				 * chooses will be the one that is most likely to be chosen when generating
				 * the maze.
				 */
				return [[Math.ceil((1-(up / total))*100), 1],
				 				[Math.ceil((1-(right / total))*100), 2],
								[Math.ceil((1-(down / total))*100), 3],
								[Math.ceil((1-(left / total))*100), 4]];
		}

		/**
		 * Adds the goal to either the bottom left corner or bottom right. Depending
		 * on what the value of direction is.
		 * @param {Array} maze 2D array containing the mazeID
		 * @param {Integer} r the row number
		 * @param {Integer} c the column number
		 * @param {Integer} direction either 4 for left or 2 for right.
		 */
		function addGoal(maze, r, c, direction) {
				maze[r][c] = 3;
				FOUND_GOAL = true;
				return true;
		}

	  /**
	  * Generate an array with random directions 1-4
		* @param {Array} tendency containing 4 directions with percentages.
	  * @return {Array} containing 4 directions in random order
	  */
	  function generateRandomDirections(tendency) {
	       var randoms = new Array(4);
				 // percentages is the total percentages from each directional tendency
				 var percentages = tendency[0][0] + tendency[1][0] + tendency[2][0] + tendency[3][0];

				 /**
				  * Main AI functionality for figuring out what direction to try first
					* then second and so on. First a random number is calculated using
					* the total percentages for each direction. Then we grab the first
					* percentage and set the number we are comparing to that.
					* We than continue to add the percentages of the next numbers to the
					* number we are comparing until we reach a number greater than the
					* random number. We then add that direction into the randoms array and
					* take out that record from the tendency array. We then update the
					* percentages to take into account that number not being there.
					*/
				 for(var x = 0; x<4; x++) {
					 	var rand = Math.ceil((Math.random() * percentages));
						var compNum = tendency[0][0];
						for(var j = 0; j<tendency.length; j++) {
								if(rand < compNum) {
										randoms[x] = tendency[j][1];
										percentages = percentages - tendency[j][0];
										tendency.splice(j, 1);
										break;
								} else {
									 compNum += tendency[j][0];
								}
						}
				 }

	      return randoms;
	  }


});
