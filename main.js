var mines_matrix = [];
var mines_pos = [];
var click_count = [];
var mines;
window.onload = function() {
	var field = document.getElementById("field");
	
	var unit = 50;
	var firstClick = true;
	var xOffSet = field.getBoundingClientRect().left;
	var yOffSet = field.getBoundingClientRect().top;
	var xCells = field.getBoundingClientRect().width / unit;
	var yCells = field.getBoundingClientRect().height / unit;
	mines = Math.floor((xCells * yCells) * 0.15);
	
	for(var i = 0; i < xCells; i++) {
		mines_matrix[i] = [];
		for(var j = 0; j < yCells; j++) {
			mines_matrix[i][j] = 0;
			
			var cell = document.createElement("input");
			cell.type = "button";
			cell.name = "mine_cell";
			cell.style.position = "fixed";
			cell.style.left = Math.floor(i * unit + xOffSet) + "px";
			cell.style.top = Math.floor(j * unit + yOffSet) + "px";
			cell.setAttribute("x", i);
			cell.setAttribute("y", j);
			cell.id = i + ":" + j;
			cell.style.height = "50px";
			cell.style.width = "50px";
			cell.oncontextmenu = function() {
				this.readOnly = !this.readOnly;
			}
			cell.onclick = function() {
				if(!this.readOnly) {
					click_action(this);
					this.disabled = true;
					if(this.getAttribute("cell_value") == "-1") {
						end_game();
					} else {
						this.value = this.getAttribute("cell_value");
					}
				}				
			}
			
			field.appendChild(cell);
		}
	}
	
	function end_game() {
		var mine_cells = document.getElementsByName("mine_cell");
		for(var i = 0; i < xCells; i++) {
			for(var j = 0; j < yCells; j++) {
				mine_cells[i * xCells + j].onclick = function() {};
				if(mines_matrix[i][j] == -1) {
					mine_cells[i * xCells + j].style.backgroundColor = "#900";
				}
			}
		}
	}
	
	function click_action(clicked_cell) {
		if(firstClick) {
			firstClick = false;
			generate_mines(clicked_cell.getAttribute("x"), clicked_cell.getAttribute("y"));
		} else {				
			if(clicked_cell.getAttribute("cell_value") === "0") {
				var cellX = Number.parseInt(clicked_cell.getAttribute("x"));
				var cellY = Number.parseInt(clicked_cell.getAttribute("y"));
				var nbr_pos = [
					{
						x: cellX - 1,
						y: cellY
					},
					{
						x: cellX,
						y: cellY - 1
					},
					{
						x: cellX + 1,
						y: cellY
					},
					{
						x: cellX,
						y: cellY + 1
					},
					{
						x: cellX - 1,
						y: cellY - 1
					},
					{
						x: cellX - 1,
						y: cellY + 1
					},
					{
						x: cellX + 1,
						y: cellY - 1
					},
					{
						x: cellX + 1,
						y: cellY + 1
					}
				];
				for(var i in nbr_pos) {
					if(nbr_pos[i].x >= 0 && nbr_pos[i].y >= 0 && nbr_pos[i].x < xCells && nbr_pos[i].y < yCells && !document.getElementById(nbr_pos[i].x + ":" + nbr_pos[i].y).disabled) {
						var nbr_cell = document.getElementById(nbr_pos[i].x + ":" + nbr_pos[i].y);
						if(nbr_cell.getAttribute("cell_value") != "-1") nbr_cell.click();
					}
				}
			}
		}
	}
	
	function generate_mines(nomine_x, nomine_y) {
		function refresh_mines_matrix() {
			var mine_cells = document.getElementsByName("mine_cell");
			for(var i = 0; i < xCells; i++) {
				for(var j = 0; j < yCells; j++) {
					if(mines_matrix[i][j] != -1) {
						var mine_count = 0;
						if((i - 1) >= 0 && mines_matrix[i - 1][j] === -1) mine_count++;
						if((j - 1) >= 0 && mines_matrix[i][j - 1] === -1) mine_count++;
						if((i + 1) < xCells && mines_matrix[i + 1][j] === -1) mine_count++;
						if((j + 1) < yCells && mines_matrix[i][j + 1] === -1) mine_count++;
						if((i - 1) >= 0 && (j - 1) >= 0 && mines_matrix[i - 1][j - 1] === -1) mine_count++;
						if((i - 1) >= 0 && (j + 1) < yCells && mines_matrix[i - 1][j + 1] === -1) mine_count++;
						if((i + 1) < xCells && (j - 1) >= 0 && mines_matrix[i + 1][j - 1] === -1) mine_count++;
						if((i + 1) < xCells && (j + 1) < yCells && mines_matrix[i + 1][j + 1] === -1) mine_count++;
						
						mines_matrix[i][j] = mine_count;
						mine_cells[i * xCells + j].setAttribute("cell_value", mine_count);
						//mine_cells[i * xCells + j].value = mine_count;
					} else {
						mine_cells[i * xCells + j].setAttribute("cell_value", -1);
						//mine_cells[i * xCells + j].value = -1;
					}
					if(i === xCells - 1 && j === yCells - 1 && document.getElementById(nomine_x + ":" + nomine_y).getAttribute("cell_value") === "0") {
						document.getElementById(nomine_x + ":" + nomine_y).click();
					}
				}
			}
		}
		
		function add_mines_to_matrix() {
			for(var i in mines_pos) {
				mines_matrix[mines_pos[i].x][mines_pos[i].y] = -1;
				if(i == mines - 1) refresh_mines_matrix();
			}
		}
		
		for(var i = 0; i < mines; i++) {
			var temp_mine_pos = {
				x: Math.floor(Math.random() * xCells),
				y: Math.floor(Math.random() * yCells)
			};
			
			if(temp_mine_pos.x == Number.parseInt(nomine_x) && temp_mine_pos.y == Number.parseInt(nomine_y)) {
				i--;
			} else {
				mines_pos[i] = temp_mine_pos;
			}
			
			if(i === mines - 1) add_mines_to_matrix();
		}
	}
}