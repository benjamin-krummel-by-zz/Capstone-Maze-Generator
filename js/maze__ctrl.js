Maze.controller('mazeCtrl',function($scope) {

	var welcome_message = "Press the generate maze button.\n " +
												"Reach the Red Square by hovering\n " +
												"over the blue circles with your mouse\n " +
												"to move the green circle";

	$scope.maze = {
			id:0,
			name: welcome_message,
			matrix: [],
			goals:0,
			compass: []
	};

	$scope.resetGame = function(){
			$scope.maze.id = 0;
			$scope.maze.name = welcome_message;
			$scope.maze.matrix = [];
			$scope.maze.compass = [0,1];
	}

});
