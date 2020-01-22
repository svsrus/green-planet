/**
 * Constants.
 */
const ARTICLE_STATE_PARTIAL_CODE = 1
const ARTICLE_STATE_VERIFIED_BY_USER_CODE = 2
const REPRESENTATION_IMAGE_TYPE_CODE = 1;
const REPRESENTATION_VIDEO_TYPE_CODE = 2;
const REQUEST_TYPE_POST = "POST";
const REQUEST_TYPE_PUT = "PUT";
const REQUEST_TYPE_DELETE = "DELETE";

/**
 * Global Variables.
 */
var shownArticlesCount = 0;

/**
 * Function shows on main page list of articles.
 */
function showArticles() {
    $.get(URL_LATEST_ARTICLES, {"shownArticlesCount": shownArticlesCount}, function (latestArticles) {
        var latestArticlesHTML = "";
        var currentColumnIndex = 0;
        $.each(latestArticles, function (index, latestArticle) {
            latestArticlesHTML += getEach3ColumnsOpeningHtmlTag('<div class="row">', index, currentColumnIndex);
            latestArticlesHTML += '<div class="sm-1-3">';
            latestArticlesHTML += '	<div class="wrap-col">';
            latestArticlesHTML += '		<div class="box-entry">';
            latestArticlesHTML += '			<div class="box-entry-inner">';
            latestArticlesHTML += '				<img src="' + getArticleFirstImageFile(latestArticle) + '" class="img-responsive" />';
            latestArticlesHTML += '				<div class="entry-details">';
            latestArticlesHTML += '					<div class="entry-des">';
            latestArticlesHTML += '						<span>' + latestArticle.creation_date + '</span>';
            latestArticlesHTML += '						<h3><a href="javascript:showArticle(' + latestArticle.article_id + ')">' + latestArticle.title + '</a></h3>';
            latestArticlesHTML += '						<h4>' + latestArticle.author_nickname + '</a></h4>';
            latestArticlesHTML += '						<p>' + latestArticle.header_text + '</p>';
            latestArticlesHTML += '						<a class="button button-skin" href="javascript:showArticle(' + latestArticle.article_id + ')">Читать</a>';
            latestArticlesHTML += '					</div>';
            latestArticlesHTML += '				</div>';
            latestArticlesHTML += '			</div>';
            latestArticlesHTML += '		</div>';
            latestArticlesHTML += '	</div>';
            latestArticlesHTML += '</div>';
            latestArticlesHTML += getEach3ColumnsClosingHtmlTag('</div>', index, currentColumnIndex, false);
            currentColumnIndex = (currentColumnIndex < 2 ? ++currentColumnIndex : 0);
            shownArticlesCount++;
        });
        if (!(shownArticlesCount % 3 === 0) && currentColumnIndex != 2) { //Closing row div in case it has 1 or 2 articles
            latestArticlesHTML += '</div>';
        }
        if (latestArticles.length == 0) { //Hide show next articles button if no more articles are found
            $("#showNextArticlesButton").hide();
        }
        $("#latestArticles").append(latestArticlesHTML);
    });
}

/**
 * Function returns given opening HTML tag, every 3 elements.
 */
function getEach3ColumnsOpeningHtmlTag(htmlTag, index, currentColumnIndex) {
    if (index % 3 === 0 && currentColumnIndex == 0) {
        return htmlTag;
    }
    return "";
}

/**
 * Function returns given closing HTML tag, every 3 elements.
 */
function getEach3ColumnsClosingHtmlTag(htmlTag, index, currentColumnIndex) {
    if ((index+1) % 3 === 0 && currentColumnIndex == 2) {
        return htmlTag;
    }
    return "";
}

/**
 * Function shows next N articles.
 */
function showNextArticles() {
    shownArticlesCount += 3;
    showArticles();
}

/**
 * Function is used as a direct link to latest articles.
 */
function showLatestArticles() {
    showArticles();
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
            articleHTML += "    </div>";
            articleHTML += "    <div id='about-us'>";
            articleHTML += "	    <article class='post-entry single-post'>";
            articleHTML += "		    <div class='wrap-post'>";
            articleHTML += "			    <div class='entry-header'>";
            articleHTML += "				    <h1 id='articleTitle' class='entry-title'>" + articleData.title + "</h1>";
            articleHTML += "				    <h3 id='articleAuthorNickname' class='entry-title'><p>" + articleData.author_nickname + "</p></h2>";
            articleHTML += "					<div class='entry-meta'>";
            articleHTML += "						<i class='fa fa-calendar' alt='Число публикации статьи' title='Число публикации статьи'> " + articleData.creation_date + " </i>";
            articleHTML += "						<i class='fa fa-eye' alt='Количество просмотров статьи' title='Количество просмотров статьи'> " + articleData.total_views + " </i>";
            articleHTML += "						<!--<a><i class='fa fa-comments'></i> 0 Comments</a>-->";
            articleHTML += "						<!--<a><i class='fa fa-tag'></i> Event, New</a>-->";
            articleHTML += "					</div>";
            articleHTML += "				</div>";
            articleHTML += "				<div id='articleMainText' class='entry-content'>" + articleData.main_text + "</div>";
            articleHTML += "			    <div class='entry-header' style='margin:0;padding:0;'>";
            articleHTML += "				    <div class='entry-meta'>";
            articleHTML += "				    	" + getArticleOriginalSourceOptionalURL(articleData);
            articleHTML += "				    </div>";
            articleHTML += "				</div>";
            articleHTML += "			</div>";
            articleHTML += "	    </article>";
            articleHTML += "    </div>";
            articleHTML += "</div>";
            $("#page-content").html(articleHTML).show(1000);
            $([document.documentElement, document.body]).animate({
                scrollTop: $("#page-content").offset().top
            }, 2000);
        });

    });
}

/**
 * Function returns optional Original Source URL of Article.
 */
function getArticleOriginalSourceOptionalURL(articleData) {
    if (articleData.original_source_url != null && articleData.original_source_url != "") {
        return "<a id='articleOriginalSourceURL' href='"+articleData.original_source_url+"'><i class='fa fa-external-link'> Источник статьи. </i></a>";
    }
    return "";
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
        articleHTML += "					<span>Автор статьи:</span>";
        articleHTML += "					<span id='author_nickname_error' class='errorMessage'>пожалуйста напишите имя и фамилию автора статьи, либо авторский псевдоним.</span>";
        articleHTML += "					<input id='author_nickname' name='author_nickname' type='text' onblur='isValidRequiredField(\"author_nickname\")' required/>";
        articleHTML += "				</label>";
        articleHTML += "				<label>";
        articleHTML += "					<span>Заголовок статьи:</span>";
        articleHTML += "					<input id='article_id' name='article_id' type='hidden'/>";
        articleHTML += "					<input id='state_code' name='state_code' type='hidden' value='" + ARTICLE_STATE_PARTIAL_CODE + "'/>";
        articleHTML += "					<span id='title_error' class='errorMessage'>пожалуйста озаглавьте статью.</span>";
        articleHTML += "					<input id='title' name='title' type='text' onblur='isValidRequiredField(\"title\")' required/>";
        articleHTML += "				</label>";
        articleHTML += "				<label>";
        articleHTML += "					<span>Краткое описание статьи:</span>";
        articleHTML += "					<span id='header_text_error' class='errorMessage'>пожалуйста вкратце опишите статью.</span>";
        articleHTML += "					<input id='header_text' name='header_text' type='text' onblur='isValidRequiredField(\"header_text\")' required/>";
        articleHTML += "				</label>";
        articleHTML += "				<label>";
        articleHTML += "					<span>Главный текст статьи:</span>";
        articleHTML += "					<span id='main_text_error' class='errorMessage'>пожалуйста напишите статью.</span>";
        articleHTML += "					<textarea id='main_text' name='main_text' rows='40'></textarea/>";
        articleHTML += "				</label>";
        articleHTML += "				<label>";
        articleHTML += "				    <P>";
        articleHTML += "					    <span>Если статья не оригинальная, введите ссылку на источник статьи:</span>";
        articleHTML += "					    <span id='original_source_url_error' class='errorMessage'>пожалуйста введите рабочую ссылку на оригинал статьи.</span>";
        articleHTML += "					    <input id='original_source_url' name='original_source_url' type='url' onblur='isValidRequiredUrlField(\"original_source_url\")'/>";
        articleHTML += "				    </p>";
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
function addArticleRepresentations(formData, files, event, upload) {
    if (isValidForm()) {
        return new Promise(function(resolve, reject) {
            $("body").addClass("loading"); //Turn on waiting globe
            var request_json = getArticleRequestJson();
            $.ajax({
                type: getPostPutRequestType(),
                url: URL_ARTICLES,
                data: JSON.stringify(request_json),
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            }).done(function(data) {
                $("#article_id").val(data["article_id"]); //Sets new created article_id to hidden field for later update
                request_json["article_id"] = data["article_id"]; //Sets new created_article_id for article image update request 
                addArticleRepresentationImage(files, request_json); //Adds image representation to article request
                formData.append("json_data", JSON.stringify(request_json)); //Wraps request with formData object
                $.ajax({
                    type: REQUEST_TYPE_PUT,
                    url: URL_ARTICLE_REPRESENTATIONS,
                    data: formData,
                    contentType: false,
                    processData: false,
                }).done(function(data) {
                    var lastRepresentationIndex = data["article_representations"].length - files.length;
                    var representation = data["article_representations"][lastRepresentationIndex]["representation"];
                    if (REPRESENTATION_IMAGE_TYPE_CODE == representation["representation_type_code"]) {
                        response_json = {"file": {"id": representation["representation_id"], "url": representation["image_file"]}};
                        resolve(response_json);
                    }
                }).fail(function(error) {
                    reject(processError(error));
                });
            }).fail(function(error) {
                reject(processError(error));
            });
        }).then(function(response_json) {
            upload.complete(response_json);
            $("body").removeClass("loading"); //Turn off waiting globe
        }).catch(function(error) {
            upload.complete(error);
            $("body").removeClass("loading"); //Turn off waiting globe
        });
    }
    return null;
}

/**
 * Function returns filled Article json for post/put request.
 */
function getArticleRequestJson() {
    return {
        "article_id": $("#article_id").val(),
        "author_nickname": $("#author_nickname").val(),
        "title": $("#title").val(),
        "header_text": $("#header_text").val(),
        "main_text": $("#main_text").val(),
        "original_source_url": $("#original_source_url").val(),
        "state_code": $("#state_code").val(),
        "article_representations": []
    };
}

/**
 * Function detects if this is a new article, then POST request type is return,
 * otherwise PUT request type is returned for article data update.
 */
function getPostPutRequestType() {
    if ($("#article_id").val() == null || $("#article_id").val() == "") {
        return REQUEST_TYPE_POST;
    }
    return REQUEST_TYPE_PUT;
}

/**
 * Function adds one image representation element for image upload and saving process.
 */
function addArticleRepresentationImage(files, request_json) {
    for (var i = 0; i < files.length; i++) {
        request_json["article_representations"].push({
            "representation": {
                "representation_type_code": REPRESENTATION_IMAGE_TYPE_CODE
            }
        });
    }
}

/**
 * Function saves final article if not already saved, or updates it with latest modifications,
 * then user is redirected to the main page.
 */
function saveFinalArticle() {
    if (isValidForm()) {
        //Set state verified by user to be shown in main page
        $("#state_code").val(ARTICLE_STATE_VERIFIED_BY_USER_CODE);
        if ($("#article_id").val() == "") {
            createArticle(); //In case of article has no images
        } else {
            updateArticle();
        }
    }
}

/**
 * Function validates that all required or valid fields to create article.
 */
function isValidForm() {
    var authorNicknameValid = isValidRequiredField("author_nickname");
    var titleValid = isValidRequiredField("title");
    var headerTextValid = isValidRequiredField("header_text");
    var mainTextValid = isValidRequiredTextAreaField("main_text");
    var originalSourceURL = isValidRequiredUrlField("original_source_url");
    return authorNicknameValid && titleValid && headerTextValid && mainTextValid && originalSourceURL;
}

/**
 * Function validates given required field, in case is empty, error message is shown, otherwise hidden.
 */
function isValidRequiredField(fieldId) {
    if ($("#" + fieldId).val() == "") {
        showErrorMessage(fieldId);
        return false;
    }
    hideErrorMessage(fieldId);
    return true;
}

/**
 * Function validates given required text area field, in case is empty, error message is shown, otherwise hidden.
 */
function isValidRequiredTextAreaField(fieldId) {
    var strippedText = $("<div/>").html($("#" + fieldId).val()).text().trim();
    console.log("strippedText = '" + strippedText + "'");
    if (strippedText == "") {
        showErrorMessage(fieldId);
        return false;
    }
    hideErrorMessage(fieldId);
    return true;
}

/**
 * Function validates given URL, in case it is filled and not valid, error message is shown, otherwise hidden.
 */
function isValidRequiredUrlField(fieldId) {
    var url = $("#" + fieldId).val();
    if (url != "" && !isUrlValid(url)) {
        showErrorMessage(fieldId);
        return false;
    }
    hideErrorMessage(fieldId);
    return true;
}

/**
 * Function validates URL: updated to latest regex on May 23rd, 2015.
 */
function isUrlValid(url) {
    return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url);
}

/**
 * Function shows error message.
 */
function showErrorMessage(fieldId) {
    $("#" + fieldId + "_error").show(200);
    $("#" + fieldId).css('background-color', '#ffe1e1');
}

/**
 * Function hides error message.
 */
function hideErrorMessage(fieldId) {
    $("#" + fieldId + "_error").hide(200);
    $("#" + fieldId).css('background-color', '#ffffff');
}

/**
 * Function creates new article.
 */
function createArticle() {
    $.ajax({
        type: "POST",
        url: URL_ARTICLES,
        data: JSON.stringify(getArticleRequestJson()),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            window.location.href = URL_INDEX;
        },
        error: function(error) {
            processError(error);
        }
    });
}

/**
 * Function updates article with latest modifications.
 */
function updateArticle() {
    $("body").addClass("loading"); //Turn on waiting globe
    return updateArticleConditionalPromise().then(function(data) {
        $("body").removeClass("loading"); //Turn off waiting globe
        window.location.href = URL_INDEX;
    }).catch(function(error) {
        $("body").removeClass("loading"); //Turn off waiting globe
    });
}

/**
 * Function deletes removed images and updates article or just updates article.
 */
function updateArticleConditionalPromise() {
    request_json = getRemovedImages();
    if (request_json.deleted_image_representations.length > 0) {
        return deleteRemovedImages(request_json).then(updateArticleData);
    }
    return updateArticleData();
}

/**
 * Function searches for deleted images from TextArea and returns filled json list if found any.
 */
function getRemovedImages() {
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
    return request_json;
}

/**
 * Function sends a request to delete in backend, removed images from TextArea.
 */
function deleteRemovedImages(request_json) {
    return new Promise(function(resolve, reject) {
        $.ajax({
            type: REQUEST_TYPE_DELETE,
            url: URL_ARTICLE_REPRESENTATIONS,
            data: JSON.stringify(request_json),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }).done(function(data) {
            console.log("deleted images = " + request_json.deleted_image_representations.length)
            resolve(data);
        }).fail(function(error) {
            reject(processError(error));
        });
    });
}

/**
 * Function updates Article with data from input form.
 */
function updateArticleData() {
    return new Promise(function(resolve, reject) {
        $.ajax({
            type: REQUEST_TYPE_PUT,
            url: URL_ARTICLES,
            data: JSON.stringify(getArticleRequestJson()),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }).done(function(data) {
            resolve(data);
        }).fail(function(error) {
            reject(processError(error));
        });
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