$(document).ready(function() {
	var BASE_URL = "http://127.0.0.1/app/";
	var CATEGORIES_URL = BASE_URL + "categories.php";
	var BOOKMARKS_URL = BASE_URL + "bookmarks.php";
	
	var currentCategoryId;
	var currentBookmarkId;
	var editedCategory;
	var editedBookmark;
	
	refreshData();

	function refreshData() {
		$.getJSON(CATEGORIES_URL, function(data) {
			categories = data.categories;
			showCategories();
		});
		
		$.getJSON(BOOKMARKS_URL, function(data) {
			bookmarks = data.bookmarks;
			showBookmarks();
		});		
	};
	
	function showCategories() {
		var str = "";
		for (var key in categories) {
			str += "<li class = \"category\" id = \"category" + categories[key].id + "\">" + categories[key].name;
		}
		$("#categoriesList").html(str);
		if (currentCategoryId) {
			markElement('#category' + currentCategoryId, true);
		};
	}				
	
	var showBookmarks = function() {
		console.log("Current category id = " + currentCategoryId);
		var bookmarksInCategory = bookmarks.filter(function(bookmark) {return bookmark.categoryid == currentCategoryId;});
		var str = "";
		for (var key in bookmarksInCategory) {
			str += "<li class = \"bookmark\" id = \"bookmark" + bookmarksInCategory[key].id + "\">" + bookmarksInCategory[key].name;
		}
		$("#bookmarksList").html(str);
		if (currentBookmarkId) {
			markElement('#bookmark' + currentBookmarkId, true);
		};
	}				
	
	$("ul").on("click", ".category", function(event) {
		var newCategoryId = this.id.slice(8);		
		if (currentCategoryId == newCategoryId) {
			return;
		};
		if (currentCategoryId) {
			markElement('#category' + currentCategoryId, false);
		};
		currentCategoryId = newCategoryId;
		markElement('#category' + currentCategoryId, true);
		currentBookmarkId = null;
		editedBookmark = null;
		showBookmarks();
	});
	
	$("ul").on("click", ".bookmark", function(event) {
		var newBookmarkId = this.id.slice(8);		
		if (currentBookmarkId == newBookmarkId) {
			return;
		};
		if (currentBookmarkId) {
			markElement('#bookmark' + currentBookmarkId, false);
		};	
		currentBookmarkId = newBookmarkId;
		markElement('#bookmark' + currentBookmarkId, true);
	});
	
	function markElement(id, status) {
		var bgColor = status ? '#77ff77' : '#ffffff';
		$(id).css('backgroundColor', bgColor);
	};
	
	function makePostRequest(URL, data) {
		console.log("Starting post request with data: " + data + " and url: " + URL);
				$.when($.post(URL, data, function(data, status) {
					console.log(status);
				})).then(function() {console.log("Refreshing data"); refreshData();});
	}
	
	$("#addCategory").click(function() {
		var data = {
								action: "add",
								name: $("#categoryName").val(),
								description: $("#categoryDescription").val()
							};
		currentCategoryId = null;
		makePostRequest(CATEGORIES_URL, data);
	});
	
	$("#emptyCategoryAddingModal").click(function() {
		$("#categoryName").val('');
		$("#categoryDescription").val('');
	});
	
	$("#fillCategoryEditingModal").click(function() {
		if (!currentCategoryId) {
			return;
		};
		var arr = categories.filter(function(category) {return category.id == currentCategoryId});
		editedCategory = arr[0];
		$("#categoryNameEdit").val(editedCategory.name);
		$("#categoryDescriptionEdit").val(editedCategory.description);
	});
	
	$("#editCategory").click(function() {
		if (!editedCategory) {
			alert("Please, choose category for editing!");
			return;
		};
		
		var data = {
								action: "edit",
								id: editedCategory.id,
								name: $("#categoryNameEdit").val(),
								description: $("#categoryDescriptionEdit").val()
							};
		editedCategory = null;
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
								action: 'add',
								name: $("#bookmarkName").val(),
								description: $("#bookmarkDescription").val(),
								link: $("#bookmarkLink").val(),
								imgsource: 'http://bipbap.ru/wp-content/uploads/2017/05/VOLKI-krasivye-i-ochen-umnye-zhivotnye.jpg',
								categoryid: currentCategoryId
							};
		currentBookmarkId = null;
		makePostRequest(BOOKMARKS_URL, data);
	});
	
	$("#emptyBookmarkAddingModal").click(function() {
		$("#bookmarkName").val('');
		$("#bookmarkDescription").val('');
		$("#bookmarkLink").val('');		
	});
	
	$("#fillBookmarkEditingModal").click(function() {
		if (!currentBookmarkId) {
			return;
		};
		var arr = bookmarks.filter(function(bookmark) {return bookmark.id == currentBookmarkId});
		editedBookmark = arr[0];
		$("#bookmarkNameEdit").val(editedBookmark.name);
		$("#bookmarkDescriptionEdit").val(editedBookmark.description);
		$("#bookmarkLinkEdit").val(editedBookmark.link);		
	});
	
	$("#editBookmark").click(function() {
		if (!editedBookmark) {
			alert("Please, choose bookmark for editing!");
			return;
		};
		
		var data = {
								action: "edit",
								id: editedBookmark.id,
								name: $("#bookmarkNameEdit").val(),
								description: $("#bookmarkDescriptionEdit").val(),
								link: $("#bookmarkLinkEdit").val(),
								imgsource: 'http://bipbap.ru/wp-content/uploads/2017/05/VOLKI-krasivye-i-ochen-umnye-zhivotnye.jpg',
								categoryid: currentCategoryId
							};
		editedBookmark = null;
		makePostRequest(BOOKMARKS_URL, data);
	});
	
	$("#deleteBookmark").click(function() {
		if (currentBookmarkId) {
			var data = {
									action: "delete",
									id: currentBookmarkId								
								};
			currentBookmarkId = null;
			makePostRequest(BOOKMARKS_URL, data);
		}
	});	
});