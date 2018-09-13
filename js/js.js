var dataObjTags = new XMLHttpRequest();
var dataObjFilms = new XMLHttpRequest();

dataObjFilms.overrideMimeType("application/json");
dataObjTags.overrideMimeType("application/json");

dataObjFilms.open('GET', "films.json", true); 
dataObjTags.open('GET', "tags.json", true); 

dataObjTags.onreadystatechange = function () {
	dataObjFilms.onreadystatechange = function () {
    if (dataObjTags.readyState == 4 && dataObjTags.status == "200" && dataObjFilms.readyState == 4 && dataObjFilms.status == "200") {
		var dataTags = JSON.parse(dataObjTags.response);
		var dataFilms = JSON.parse(dataObjFilms.response);
		
		function searchByFilms(data, fromdata, todata){
			if (dataFilms.length <= todata) { todata = dataFilms.length;}
			
			var output = '<table class="table table-bordered">';
			
			for(var i = 0; i < todata; i++){
					output += '<tbody>';
					output += '<tr id="data-films">';
					output += '<td>' + dataFilms[i].title + '</td>';
					output += '<td class="icon-star-data">' + '<i class="fa fa-star-o" aria-hidden="true"></i>' + '</td>';
					output += '</tr>';
					output += '</tbody>';
			}
			
			output += '</table>';
			
			if (dataFilms.length > todata) {
				outputBut = '<button type="button" class="btn btn-primary btn-lg" id="add-next-data">Показать ещё</button>'; 
	
				document.getElementById('button').innerHTML = outputBut;
				var divButton = document.getElementById("add-next-data");
				
				divButton.addEventListener('click', function () {
					filmsHTML(searchByFilms(dataFilms, todata, todata + 15), todata, todata + 15);

					this.remove(this);
				});
			}
			
			return output;
		}
		
		//вывод шаблона для закладок
		document.getElementById("pills-profile-tab").onclick = function(){
			function bookMarks(data, fromdata, todata){
				if (data.length <= todata) { todata = data.length;}
				var output = '<table class="table table-bordered" id="data-book-marks-table">';
				
				for(var i = 0; i < data.slice(0, todata).length; i++){
					output += '<tbody id="data-book-marks">';
					output += '<tr>';
					output += '<td>' + data[i] + '</td>';
					output += '<td class="icon-book-marks-data">' + '<i class="fa fa-star" aria-hidden="true"></i>' + '</td>';
					output += '</tr>';
					output += '</tbody>';
				}
				
				output += '</table>';
				
				if (data.length > todata) {
					outputBut = '<button type="button" class="btn btn-primary btn-lg" id="add-next-data-book-marks">Показать ещё</button>'; 
		
					document.getElementById('button-book-marks').innerHTML = outputBut;
					var divButton = document.getElementById("add-next-data-book-marks");
					
					divButton.addEventListener('click', function () {
						bookMarksHTML(bookMarks(data, todata, todata + 15), todata, todata + 15);
						
						this.remove(this);
					});
				}
			 
				return output;
			}
			
			function bookMarksHTML(list, from, to){
				var listHtml = list;
				
				document.getElementById('bookmarks').innerHTML = listHtml;
				
				//удаление из закладок
				var k;
				var blockData = document.querySelectorAll("#data-book-marks-table tbody tr");
				var arr = [];
				
				for(k = 0; k < blockData.length; k++){
					blockData[k].num = k;
					
					arr = Object.keys(JSON.parse(localStorage.getItem("dataFilms")));
					
					blockData[k].addEventListener('click', function (e) {
						var block = this.parentNode;
						
						this.lastChild.firstChild.className = (this.lastChild.firstChild.className == 'fa fa-star' ? 'fa fa-star-o' : 'fa fa-star');
						block.parentNode.removeChild(block);
						
						var itemData = JSON.parse(localStorage.getItem("dataFilms"));
						
						 if(itemData){	
							delete itemData[arr[this.num]];	
						}
						localStorage.setItem("dataFilms", JSON.stringify(itemData));  
						
					});
				} 
			}
			
			var bookMarksData = JSON.parse(localStorage.getItem("dataFilms"));
			var arrBookMarks = [];
			if(bookMarksData != null){
				for(var key in bookMarksData){
					arrBookMarks.push(bookMarksData[key]);
				}
			}
			bookMarksHTML(bookMarks(arrBookMarks, 0, 15), 0, 15);
		}
		
		//вывод шаблона для фильмов
		function filmsHTML(list, from, to) {
			var listHtml = list;

			document.getElementById('update').innerHTML = listHtml;
			
			//добавление в закладки
			var k;
			var blockData = document.querySelectorAll("table tbody tr");
			var obj = {};

			for(k = 0; k < blockData.length; k++){
				blockData[k].num = k;
				
				blockData[k].addEventListener('click', function (e) {
					
					this.lastChild.firstChild.className = (this.lastChild.firstChild.className == 'fa fa-star-o' ? 'fa fa-star' : 'fa fa-star-o');
				
					obj[this.num] = this.firstChild.innerText;
					if(this.lastChild.firstChild.className == 'fa fa-star'){
						localStorage.setItem("dataFilms", JSON.stringify(obj));
					} else {
						var itemData = JSON.parse(localStorage.getItem("dataFilms"));
						
						for(var key in itemData){
							delete itemData[this.num];		
						} 
						localStorage.setItem("dataFilms", JSON.stringify(itemData));
					}
				});
			}  
		}
		
		filmsHTML(searchByFilms(dataFilms, 0, 15), 0, 15);
		
		var output = '';
		
		for(var j = 0; j < dataTags.length; j++){
			output += '<span class="badge indigo">';
			output += dataTags[j];
			output += '</span>';
		}
		
		document.getElementById('tags').innerHTML = output;
		
		//поиск по полю search
		document.getElementById('search').onkeyup = function(e){
			var searchField = document.getElementById('search').value;
			var myExp = new RegExp(searchField, "i");
			var output = '<table class="table table-bordered">';
			
			for(var i = 0; i < dataFilms.length; i++){
				if(dataFilms[i].title.search(myExp) != -1){
					output += '<tbody>';
					output += '<tr>';
					output += '<td>' + dataFilms[i].title + '</td>';
					output += '<td class="icon-star-data">' + '<i class="fa fa-star-o" aria-hidden="true"></i>' + '</td>';
					output += '</tr>';
					output += '</tbody>';
				}
			}
			
			output += '</table>';
			
			document.getElementById('update').innerHTML = output;
			
			if(document.getElementById('add-next-data') != null){
				document.getElementById('add-next-data').parentNode.removeChild(document.getElementById('add-next-data'));
			}
			
			//добавление в закладки при поиске через поисковую строку
			var k;
			var blockData = document.querySelectorAll("table tbody tr");
			var obj = {};

			for(k = 0; k < blockData.length; k++){
				blockData[k].num = k;
				
				blockData[k].addEventListener('click', function (e) {
					
					this.lastChild.firstChild.className = (this.lastChild.firstChild.className == 'fa fa-star-o' ? 'fa fa-star' : 'fa fa-star-o');
				
					obj[this.num] = this.firstChild.innerText;
					
					if(this.lastChild.firstChild.className == 'fa fa-star'){
						localStorage.setItem("dataFilms", JSON.stringify(obj));
					} else {
						var itemData = JSON.parse(localStorage.getItem("dataFilms"));
						
						for(var key in itemData){
							delete itemData[this.num];		
						} 
						localStorage.setItem("dataFilms", JSON.stringify(itemData));
					}
				});
			}  
		};
		
		//поиск по тегам
		document.getElementById("tags").addEventListener('click', function (e) {
			var button = e.target;
			
			var filter = button.innerText;
			filterTag(filter);
			
			if(document.getElementById('add-next-data') != null){
				document.getElementById('add-next-data').parentNode.removeChild(document.getElementById('add-next-data'));
			}
		});   
		
		function filterTag(filter){
			var output = '<table class="table table-bordered">';
			
			for(var i = 0; i < dataFilms.length; i++){
				var itemTags = dataFilms[i].tags;
				
				if (itemTags != null) {
					if (itemTags.indexOf(filter) != -1) {
						output += '<tbody>';
						output += '<tr>';
						output += '<td>' + dataFilms[i].title + '</td>';
						output += '<td class="icon-star-data">' + '<i class="fa fa-star-o" aria-hidden="true"></i>' + '</td>';
						output += '</tr>';
						output += '</tbody>';
					}
				}
			}
			
			output += '</table>';
			
			document.getElementById('update').innerHTML = output;
			
			//добавление в закладки при поиске по тегам
			var k;
			var blockData = document.querySelectorAll("table tbody tr");
			var obj = {};

			for(k = 0; k < blockData.length; k++){
				blockData[k].num = k;
				
				blockData[k].addEventListener('click', function (e) {
					
					this.lastChild.firstChild.className = (this.lastChild.firstChild.className == 'fa fa-star-o' ? 'fa fa-star' : 'fa fa-star-o');
				
					obj[this.num] = this.firstChild.innerText;
					
					if(this.lastChild.firstChild.className == 'fa fa-star'){
						localStorage.setItem("dataFilms", JSON.stringify(obj));
					} else {
						var itemData = JSON.parse(localStorage.getItem("dataFilms"));
						
						for(var key in itemData){
							delete itemData[this.num];		
						} 
						localStorage.setItem("dataFilms", JSON.stringify(itemData));
					}
				});
			}  
		}
		
      }
	}
};
dataObjTags.send(null); 
dataObjFilms.send(null);