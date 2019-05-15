Maze.controller('mazeBoard',function($scope) {

	$scope.blocks = ["PATH","WALL","START","FINISH","OPEN_PATH","GOAL"];
	$scope.moves = new Array();

	/**
	* This function figures out if the person chose a valid move if they didn't
	* it returns out of the function. If they did it will then normalize the maze.
	* @param blockID  {Integer} the number that corresponds to the type of block.
	* @param blockRow {Integer} row that the person is moving to.
	* @param blockCol {Integer} column that the person is moving to.
	*/
	$scope.evalPath = function(blockID,blockRow,blockCol) {
			// Check if it is the finish
			if(blockID == 5){
				return $scope.finish();
			}
			// Check if it is an open path
			if(blockID != 4){
				return;
			}
			//determining the direction the player chose
			setUserDirection(blockRow, blockCol);
			// Move
			var mtx = $scope.maze.matrix;
			// Find new open path around the current position
			var lowerRow = (blockRow > 0) ? (blockRow - 1) : 0;
			var upperRow = (blockRow < ($scope.maze.matrix.length-1)) ? (blockRow + 1) : ($scope.maze.matrix.length-1);
			var lowerCol = (blockCol > 0) ? (blockCol - 1) : 0;
			var upperCol = (blockCol < ($scope.maze.matrix[0].length-1)) ? (blockCol + 1) : ($scope.maze.matrix[0].length-1);
			// Find the new open path (digonal directions are not allowed)
			var adjList = [[upperRow,blockCol],[lowerRow,blockCol],[blockRow,upperCol],[blockRow,lowerCol]];

			// Adjusts paths around the green dot to open paths if they were previously regular paths.
			for (var i = adjList.length - 1; i >= 0; i--) {
					var block = mtx[adjList[i][0]][adjList[i][1]];
					if(block == 0) {
							block = 4;
					} else if (block == 3) {
							//Have to switch the finish to goal block so that the user can complete the maze.
							block = 5;
					}
					mtx[adjList[i][0]][adjList[i][1]] = block;
			}

			// Current block become a path
			mtx[$scope.maze.compass[0]][$scope.maze.compass[1]] = 4;

			// Update new current block
			mtx[blockRow][blockCol] = 2;
			$scope.maze.compass[0] = blockRow;
			$scope.maze.compass[1] = blockCol;

			// Normalize the matrix restoring the open path to normal path if no more adjacent to the current block
			for (var i = (mtx.length-1); i >= 0; i--) {
					for (var k = (mtx[i].length - 1); k >= 0; k--) {
							var old = [i,k];
							if( !inMatrix(old,adjList) ) {
									if(mtx[i][k] == 4) {
											mtx[i][k] = 0;
									}
							}
					};
			};

			// Update maze matrix
			$scope.maze.matrix = mtx;

	}

	$scope.finish = function() {
			alert("Congrats! You did it!");
			//pushes the array of moves that the user took to the database
			firebase.database().ref("user").push({direction:$scope.moves});
			$scope.resetGame();
	}

	/**
	* This function steps through the maze and finds places that were previously
	* open paths. If it finds an open path that is no longer an open path it returns
	* false.
	* @param old {Integer} contains the maze information.
	* @param adjList {Integer} contains the new cordinates for the open paths.
	* @return {Boolean} the boolean value of whether an open path should be a path
	*/
	function inMatrix(old, adjList) {
			for (var i = adjList.length - 1; i >= 0; i--) {
					if(compareArr(old, adjList[i])) {
							return true;
					}
			}
			return false;
	}

	/**
	* This function figures out if the position of an open path matches the adjusted
	* list of open paths.
	* @param old {Integer} contains the maze information.
	* @param adjList {Integer} contains the new cordinates for the open paths.
	* @return {Boolean} the boolean value of whether an open path should be a path
	*/
	function compareArr(old, adjList) {
			for (var i = adjList.length - 1; i >= 0; i--) {
					if(adjList[i] != old[i]) {
							return false;
					}
			}
			return true;
	}

	/**
	* This function figures out if the person went up, right, down or left
	* @param blockRow {Integer} row that the person is moving to.
	* @param blockCol {Integer} column that the person is moving to.
	*/
	function setUserDirection(blockRow, blockCol) {
			if($scope.maze.compass[0] - blockRow == 0) {
					if($scope.maze.compass[1] - blockCol == 1) {
						 $scope.moves[$scope.moves.length] = 4;
					} else {
						$scope.moves[$scope.moves.length] = 2;
					}
			}	else {
					if($scope.maze.compass[0] - blockRow == 1) {
						 $scope.moves[$scope.moves.length] = 1;
					}	else {
						$scope.moves[$scope.moves.length] = 3;
					}
			}
	}

});
