/**
 * Constants.
 */
const REPRESENTATION_IMAGE_TYPE_CODE = 1;
const REPRESENTATION_VIDEO_TYPE_CODE = 2;

/**
 * Function initializes main page with latest articles list.
 */
function initializePage() {
    $.get(URL_LATEST_ARTICLES, function (latestArticles) {
        var latestArticlesHTML = "";
        $.each(latestArticles, function (index, latestArticle) {
            latestArticlesHTML += '<div id="latestArticles" class="sm-1-3">';
            latestArticlesHTML += '	<div class="wrap-col">';
            latestArticlesHTML += '		<div class="box-entry">';
            latestArticlesHTML += '			<div class="box-entry-inner">';
            latestArticlesHTML += '				<img src="' + getArticleFirstImageFile(latestArticle) + '" class="img-responsive" />';
            latestArticlesHTML += '				<div class="entry-details">';
            latestArticlesHTML += '					<div class="entry-des">';
            latestArticlesHTML += '						<span>' + latestArticle.creation_date + '</span>';
            latestArticlesHTML += '						<h3><a href="javascript:showArticle(' + latestArticle.article_id + ')">' + latestArticle.title + '</a></h3>';
            latestArticlesHTML += '						<p>' + latestArticle.header_text + '</p>';
            latestArticlesHTML += '						<a class="button button-skin" href="javascript:showArticle(' + latestArticle.article_id + ')">Читать</a>';
            latestArticlesHTML += '					</div>';
            latestArticlesHTML += '				</div>';
            latestArticlesHTML += '			</div>';
            latestArticlesHTML += '		</div>';
            latestArticlesHTML += '	</div>';
            latestArticlesHTML += '</div>';
        });
        $("#latestArticles").html(latestArticlesHTML);
    });
}

/**
 * Function is used as a direct link to latest articles.
 */
function showLatestArticles() {
    initializePage();
    $([document.documentElement, document.body]).animate({
        scrollTop: $("#latestArticlesSection").offset().top
    }, 1000);
}

/**
 * Function retrieves from response article json the first image and resturns it,
 * otherwise default image is returned.
 */
function getArticleFirstImageFile(article) {
    if (article.article_representations.length > 0) {
        return article.article_representations[0].representation.image_file;
    }
    return DEFAULT_ARTICLE_IMAGE;
}

/**
 * Function shows article details page.
 */
function showArticle(articleId) {
    $("#page-content").hide(1000, function () {
        $.get(URL_ARTICLES + articleId, function (articleData) {
            var articleHTML = "";
            articleHTML += "<div class='wrap-container zerogrid'>";
            articleHTML += "	<div class='crumbs'>";
            articleHTML += "		<ul>";
            articleHTML += "			<li><a href=\""+URL_INDEX+"\">Главная</a></li>"
            articleHTML += "			<li><a href=\"javascript:showAbout()\">О проекте</a></li>"
            articleHTML += "		</ul>";
            articleHTML += "</div>";
            articleHTML += "<div id='about-us'>";
            articleHTML += "	<article class='post-entry single-post'>";
            articleHTML += "		<div class='wrap-post'>";
            articleHTML += "			<div class='entry-header'>";
            articleHTML += "				<h1 id='articleTitle' class='entry-title'>" + articleData.title + "</h1>";
            articleHTML += "					<div class='entry-meta'>";
            articleHTML += "						<a id='articleCreationDate'><i class='fa fa-calendar'> " + articleData.creation_date + " </i></a>";
            articleHTML += "						<!--<a><i class='fa fa-comments'></i> 0 Comments</a>-->";
            articleHTML += "						<!--<a><i class='fa fa-tag'></i> Event, New</a>-->";
            articleHTML += "					</div>";
            articleHTML += "				</div>";
            articleHTML += "				<div id='articleMainText' class='entry-content'>" + articleData.main_text + "</div>";
            articleHTML += "			</div>";
            articleHTML += "		</article>";
            articleHTML += "	</div>";
            articleHTML += "</div>";
            $("#page-content").html(articleHTML).show(1000);
            $([document.documentElement, document.body]).animate({
                scrollTop: $("#page-content").offset().top
            }, 2000);
        });

    });
}

/**
 * Function shows new article page, and sets up HTML Redactor component.
 */
function showNewArticle() {
    $("#page-content").hide(1000, function () {
        var articleHTML = "";
        articleHTML += "<div class='wrap-container zerogrid'>";
        articleHTML += "	<div class='crumbs'>";
        articleHTML += "		<ul>";
        articleHTML += "			<li><a href=\"" + URL_INDEX + "\">Главная</a></li>";
        articleHTML += "			<li><a href=\"javascript:showAbout()\">О проекте</a></li>";
        articleHTML += "		</ul>";
        articleHTML += "</div>";
        articleHTML += "<div class='zerogrid'>";
        articleHTML += "	<div class='comments-are'>";
        articleHTML += "		<div id='comment'>";
        articleHTML += "			<h3>Новая статья</h3>";
        articleHTML += "			<p><span>Напишите и опубликуйте статью связанную с сохранением нашей общей Природы.</span></p><br/>";
        articleHTML += "			<form id='updateArticleForm' name='updateArticleForm' method='post' enctype='multipart/form-data'>" + TOKEN_ELEMENT;
        articleHTML += "				<label>";
        articleHTML += "					<span>Заголовок статьи:</span>";
        articleHTML += "					<input id='article_id' name='article_id' type='hidden'/>";
        articleHTML += "					<input id='title' name='title' type='text' required/>";
        articleHTML += "				</label>";
        articleHTML += "				<label>";
        articleHTML += "					<span>Краткое описание статьи:</span>";
        articleHTML += "					<input id='header_text' name='header_text' type='text' required/>";
        articleHTML += "				</label>";
        articleHTML += "				<label>";
        articleHTML += "					<span>Текст:</span>";
        articleHTML += "					<textarea id='main_text' name='main_text' rows='40'></textarea/>";
        articleHTML += "				</label>";
        articleHTML += "				<center>";
        articleHTML += "					<input type='button' onclick='saveFinalArticle()' name='postArticle' value='Отправить' class='button button-skin'>";
        articleHTML += "				</center>";
        articleHTML += "			</form>";
        articleHTML += "		</div>";
        articleHTML += "	</div>";
        articleHTML += "</div>";
        $("#page-content").html(articleHTML).show(1000, function() {
            $R('#main_text', {
                buttons: ['html', 'bold', 'italic', 'underline', 'deleted', 'sup', 'sub', 'ol', 'ul', 'indent', 'outdent', 'image', 'link', 'redo', 'undo'],
                lang: 'ru',
                minHeight: '300px',
                imageLink: true,
                imageCaption: true,
                imagePosition: true,
                imageResizable: true,
                imageUploadParam: 'image',
                clipboardUpload: true,
                multipleUpload: false,
                imageUpload: addArticleRepresentations
            });
          });
        $([document.documentElement, document.body]).animate({
            scrollTop: $("#page-content").offset().bottom
        }, 2000);
    });
}

/**
 * Function adds article representation and uploads files to backend.
 */
function addArticleRepresentations(formData, files, event) {
    var response_json = {};
    var request_json = {
        "article_id": createArticle(),
        "title": $("#title").val(),
        "header_text": $("#header_text").val(),
        "main_text": $("#main_text").val(),
        "article_representations": []
    };
    for (var i = 0; i < files.length; i++) {
        request_json["article_representations"].push({
            "representation": {
                "representation_type_code": 1
            }
        });
    }
    formData.append("json_data", JSON.stringify(request_json));
    $.ajax({
        type: "PUT",
        url: URL_ARTICLE_REPRESENTATIONS,
        data: formData,
        contentType: false,
        processData: false,
        async: false,
        success: function (data) {
            var lastRepresentationIndex = data["article_representations"].length - files.length;
            var representation = data["article_representations"][lastRepresentationIndex]["representation"];
            if (REPRESENTATION_IMAGE_TYPE_CODE == representation["representation_type_code"]) {
                response_json["file"] = {
                    "id": representation["representation_id"],
                    "url": representation["image_file"]
                };
            }
        },
        error: function(error) {
            processError(error);
        }
    });
    return response_json;
}

/**
 * Function creates new article.
 */
function createArticle() {
    var article_id = $("#article_id").val();
    if (article_id == "") {
        request_json = {
            "title": $("#title").val(),
            "header_text": $("#header_text").val(),
            "main_text": $("#main_text").val(),
            "article_representations": []
        };
        $.ajax({
            type: "POST",
            url: URL_ARTICLES,
            data: JSON.stringify(request_json),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: function (data) {
                article_id = data["article_id"];
                $("#article_id").val(article_id);
            },
            error: function(error) {
                processError(error);
            }
        });
    }
    return article_id;
}

/**
 * Function saves final article if not already saved, or updates it with latest modifications,
 * then user is redirected to the main page.
 */
function saveFinalArticle() {
    if ($("#article_id").val() == "") {
        createArticle(); //In case of article has no images
    } else {
        deleteRemovedImages();
        updateArticle();
    }
    window.location.href = URL_INDEX;
}

/**
 * Function searches for deleted images from TextArea, if found sends a request to delete it from backend.
 */
function deleteRemovedImages() {
    var changes = $R('#main_text', 'storage.getChanges');
    request_json = {
        "deleted_image_representations": [],
    };
    for (var key in changes) {
        // If element was deleted
        if (changes[key].status === false) {
            request_json.deleted_image_representations.push({"image_representation_id" : changes[key].id});
        }
    }
    if (request_json.deleted_image_representations.length > 0) {
        $.ajax({
            type: "DELETE",
            url: URL_ARTICLE_REPRESENTATIONS,
            data: JSON.stringify(request_json),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: function (data) {
                console.log("deleted images = " + request_json.deleted_image_representations.length)
            },
            error: function(error) {
                processError(error);
            }
        });
    }
}

/**
 * Function updates article with latest modifications.
 */
function updateArticle() {
    request_json = {
        "article_id": $("#article_id").val(),
        "title": $("#title").val(),
        "header_text": $("#header_text").val(),
        "main_text": $("#main_text").val(),
        "article_representations": []
    };
    $.ajax({
        type: "PUT",
        url: URL_ARTICLES,
        data: JSON.stringify(request_json),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {
            article_id = data["article_id"];
            $("#article_id").val(article_id);
        },
        error: function(error) {
            processError(error);
        }
    });
}

/**
 * Function shows About page.
 */
function showAbout() {
    $("#page-content").hide(1000, function () {
        $.get(URL_ABOUT, function (data) {
            $("#page-content").html(data);
            $("#page-content").show(1000);
            $([document.documentElement, document.body]).animate({
                scrollTop: $("#page-content").offset().top
            }, 2000);
        });
    });
}

/**
 * Function handles error response.
 */
function processError(error) {
    console.log("Error ocurred: " + error.statusText + " " + error.status + " message: " + error.responseText);
}