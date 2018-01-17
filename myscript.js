$(document).ready(function() {
	var BASE_URL = "http://127.0.0.1/app/";
	var CATEGORIES_URL = BASE_URL + "categories.php";
	var BOOKMARKS_URL = BASE_URL + "bookmarks.php";
	
	var currentCategoryId;
	var currentBookmarkId;
	

	function refreshData() {
		$.getJSON(CATEGORIES_URL, function(data) {
			categories = data.categories;
			showCategories();
		});
		
		$.getJSON(BOOKMARKS_URL, function(data) {
			bookmarks = data.bookmarks;
		});		
	};
	
	refreshData();
	
	function collectFormInfo() {
		
	};		
	
	function showCategories() {
		var str = "";
		for (var key in categories) {
			str += "<li class = \"category\" id = \"" + categories[key].id + "\">" + categories[key].name;
		}
		$("#categoriesList").html(str);
	}				
	
	var showBookmarks = function(id) {
		var bookmarksInCategory = bookmarks.filter(function(bookmark) {return bookmark.categoryid == id;});
		var str = "";
		for (var key in bookmarksInCategory) {
			str += "<li class = \"bookmark\" id = \"" + bookmarksInCategory[key].id + "\">" + bookmarksInCategory[key].name;
		}
		$("#bookmarksList").html(str);
	}				
	
	$("ul").on("click", ".category", function(event) {
		currentCategoryId = this.id;
		showBookmarks(currentCategoryId);
	});
	
	$("ul").on("click", ".bookmark", function(event) {
		currentBookmarkId = this.id;
		// showBookmarks(currentCategoryId);
	});
	
	function makePostRequest(URL, data) {
				$.when($.post(URL, data, function(data, status) {
					// alert(status);
				})).then(function() {refreshData();});
	}
	
	$("#addCategory").click(function() {
		var data = {
								action: "add",
								name: $("#categoryName").val(),
								description: $("#categoryDescription").val()
							};
		makePostRequest(CATEGORIES_URL, data);
	});
	
	$("#editCategory").click(function() {
		var data = {
								action: "add",
								name: $("#categoryName").val(),
								description: $("#categoryDescription").val()
							};
		makePostRequest(CATEGORIES_URL, data);
	});
	
	$("#deleteCategory").click(function() {
		if (currentCategoryId) {
			var data = {action: "delete",
									id: currentCategoryId
								};
			currentCategoryId = null;
			makePostRequest(CATEGORIES_URL, data);
		}
	});
	
	$("#addBookmark").click(function() {
		var data = {
								action: "add",
								name: $("#bookmarkName").val(),
								link: $("#bookmarkLink").val(),
								description: $("#bookmarkDescription").val(),
								categoryid: currentCategoryId
							}
		makePostRequest(BOOKMARKS_URL, data);
	});
	
	$("#deleteBookmark").click(function() {
		if (currentBookmarkId) {
			var data = {action: "delete",
									id: currentBookmarkId								
								};
			currentBookmarkId = null;
			makePostRequest(BOOKMARKS_URL, data);
		}
	});	
});