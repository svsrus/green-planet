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
const VALID_KEYWORDS_REX = /^[A-ZÑa-zñА-ЯЁа-яё,\. ]{3,255}$/;

/**
 * Global Variables.
 */
var shownArticlesCount = 0;
var lockedLanguageSelection = false;

/**
 * Function changes current language to a given language.
 */
function changeLanguage(languageCode) {
    lockedLanguageSelection = true;
    showLanguageSelection(languageCode);
    $("#language").val(languageCode);
    document.getElementById('languageForm').submit();
}

function showLanguageSelection(languageCode) {
    if (!lockedLanguageSelection) {
        hideAllLanguages();
        document.getElementById("language_" + languageCode).src = document.getElementById("language_" + languageCode).src.replace(".png", "_on.png");
    }
}

/**
 * Function hides languages except currently selected.
 */
function hideLanguageSelection() {
    if (!lockedLanguageSelection) {
        hideAllLanguages();
        document.getElementById("language_" + CURRENT_LANGUAGE_CODE).src = document.getElementById("language_" + CURRENT_LANGUAGE_CODE).src.replace(".png", "_on.png");
    }
}

/**
 * Function hides all languages.
 */
function hideAllLanguages() {
    document.getElementById("language_ru").src = document.getElementById("language_ru").src.replace("_on.png", ".png");
    document.getElementById("language_es").src = document.getElementById("language_es").src.replace("_on.png", ".png");
    document.getElementById("language_en").src = document.getElementById("language_en").src.replace("_on.png", ".png");
}

/**
 * Function shows on main page list of latest articles.
 */
function showLatestArticles() {
    $.get(URL_LATEST_ARTICLES, {"articleKeywordCategoryId": $("#articleKeywordCategoryId").val(), "shownArticlesCount": shownArticlesCount}, renderArticles);
}

/**
 * Function shows next N articles.
 */
function showNextArticles() {
    showLatestArticles();
}

/**
 * Function is used as a direct link to latest articles.
 */
function showAndScrollToLatestArticles() {
    shownArticlesCount = 0;
    $("#articleKeywordCategoryId").val(""); //get all articles of all categories
    $("#latestArticles").hide(1000);
    $("#latestArticles").html("");
    showLatestArticles();
    $([document.documentElement, document.body]).animate({
        scrollTop: $("#latestArticlesSection").offset().top
    }, 1000);
}

/**
 * Function is used as a direct link to filtered articles by category.
 */
function showAndScrollToArticlesByCategory(articleKeywordCategoryId) {
    shownArticlesCount = 0;
    showArticlesByCategory(articleKeywordCategoryId);
    $([document.documentElement, document.body]).animate({
        scrollTop: $("#latestArticlesSection").offset().top
    }, 1000);
}

/**
 * Function shows filtered articles by main categories.
 */
function showArticlesByCategory(articleKeywordCategoryId) {
    shownArticlesCount = 0;
    $("#latestArticles").hide(1000);
    $("#latestArticles").html("");
    $("#articleKeywordCategoryId").val(articleKeywordCategoryId);
    showLatestArticles();
}

/**
 * Function renders articles list.
 */
function renderArticles(articlesList) {
    var articlesListHTML = "";
    var currentColumnIndex = 0;
    $.each(articlesList, function (index, latestArticle) {
        articlesListHTML += getEach3ColumnsOpeningHtmlTag('<div class="row">', index, currentColumnIndex);
        articlesListHTML += '<div class="sm-1-3">';
        articlesListHTML += '	<div class="wrap-col">';
        articlesListHTML += '		<div class="box-entry">';
        articlesListHTML += '			<div class="box-entry-inner">';
        articlesListHTML += '				<img src="' + getArticleFirstImageFile(latestArticle) + '" class="img-responsive" />';
        articlesListHTML += '				<div class="entry-details">';
        articlesListHTML += '					<div class="entry-des">';
        articlesListHTML += '						<span>' + latestArticle.creation_date + '</span>';
        articlesListHTML += '						<h3><a href="javascript:showArticle(' + latestArticle.article_id + ')">' + latestArticle.title + '</a></h3>';
        articlesListHTML += '						<h4>' + latestArticle.author_nickname + '</a></h4>';
        articlesListHTML += '						<p>' + latestArticle.header_text + '</p>';
        articlesListHTML += '						<a class="button button-skin" href="javascript:showArticle(' + latestArticle.article_id + ')">Читать</a>';
        articlesListHTML += '					</div>';
        articlesListHTML += '				</div>';
        articlesListHTML += '			</div>';
        articlesListHTML += '		</div>';
        articlesListHTML += '	</div>';
        articlesListHTML += '</div>';
        articlesListHTML += getEach3ColumnsClosingHtmlTag('</div>', index, currentColumnIndex, false);
        currentColumnIndex = (currentColumnIndex < 2 ? ++currentColumnIndex : 0);
        shownArticlesCount++;
    });
    if (!(shownArticlesCount % 3 === 0) && currentColumnIndex != 2) { //Closing row div in case it has 1 or 2 articles
        articlesListHTML += '</div>';
    }
    if (articlesList.length == 0) { //Hide show next articles button if no more articles are found
        $("#showNextArticlesButton").hide();
    }
    $("#latestArticles").append(articlesListHTML);
    $("#latestArticles").show(1000);
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
            articleHTML += "			<li><a href=\"javascript:showAbout()\">" + LABEL_ARTICLE + "</a></li>"
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
        articleHTML += "			<li><a href=\"javascript:showAbout()\">Новая статья</a></li>";
        articleHTML += "		</ul>";
        articleHTML += "</div>";
        articleHTML += "<div class='zerogrid'>";
        articleHTML += "	<div class='comments-are'>";
        articleHTML += "		<div id='comment'>";
        articleHTML += "			<h3>Новая статья</h3>";
        articleHTML += "			<p><span>Напишите и опубликуйте статью связанную с сохранением нашей общей Природы.</span></p><br/>";
        articleHTML += "			<form id='updateArticleForm' name='updateArticleForm' method='post' enctype='multipart/form-data'>" + TOKEN_ELEMENT;
        articleHTML += "				<label>";
        articleHTML += "					<span>Автор статьи или публикации:</span>";
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
        articleHTML += "					<textarea id='main_text' name='main_text' rows='40'></textarea/><br/>";
        articleHTML += "				</label>";
        articleHTML += "				<label>";
        articleHTML += "					<span>К какому разделу относится статья:</span>";
        articleHTML += "					<span id='article_keyword_category_error' class='errorMessage'>выберите пожалуйста раздел который лучше всего описывает статью.</span>";
        articleHTML += "					<select id='article_keyword_category' name='article_keyword_category' onchange='isValidRequiredField(\"article_keyword_category\")'>";
        articleHTML += "					    <option value=''>Выберите...</option>";
        articleHTML += "					    <option value='1'>Что я могу сделать сам</option>";
        articleHTML += "					    <option value='2'>Что может сделать семья</option>";
        articleHTML += "					    <option value='3'>Что может сделать человечество</option>";
        articleHTML += "					</select>";
        articleHTML += "				</label>";
        articleHTML += "				<label>";
        articleHTML += "					<span>Ключевые слова и словосочетания (через запятую) описывающие статью:</span>";
        articleHTML += "					<span id='article_keywords_error' class='errorMessage'>пожалуйста напишите хотя бы одно ключевое слово или словосочетание к которым относится эта публикация. Допускаются только буквы и запятые для разделения ключевых слов или словосочетаний.</span>";
        articleHTML += "					<input id='article_keywords' name='article_keywords' type='text' onblur='isValidRequiredKeywordsField(\"article_keywords\")' required/>";
        articleHTML += "				</label>";
        articleHTML += "				<label>";
        articleHTML += "					<span>Если статья не оригинальная, введите ссылку на источник статьи:</span>";
        articleHTML += "					<span id='original_source_url_error' class='errorMessage'>пожалуйста введите рабочую ссылку на оригинал статьи.</span>";
        articleHTML += "					<input id='original_source_url' name='original_source_url' type='url' onblur='isValidRequiredUrlField(\"original_source_url\")'/>";
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
                buttons: ['format', 'bold', 'italic', 'underline', 'deleted', 'sup', 'sub', 'ol', 'ul', 'indent', 'outdent', 'image', 'link', 'redo', 'undo'],
                formatting: ['h4', 'h5', 'h6', 'p', 'blockquote'],
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
    if (isValidPartialForm()) {
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
    var articleRequestJson = {
        "article_id": $("#article_id").val(),
        "language_code": CURRENT_LANGUAGE_CODE,
        "author_nickname": $("#author_nickname").val(),
        "title": $("#title").val(),
        "header_text": $("#header_text").val(),
        "main_text": $("#main_text").val(),
        "original_source_url": $("#original_source_url").val(),
        "state_code": $("#state_code").val(),
        "article_keywords": getArticleKeywords(),
        "article_representations": []
    };
    return articleRequestJson;
}

/**
 * Method adds selected key word category and separates article key words by comma and returns JSON.
 */
function getArticleKeywords() {
    var articleKeywordsJson = [];
    var articleKeywordCategoryId = $("#article_keyword_category").val();
    var articleKeywordCategoryText = $("#article_keyword_category option:selected").text();
    var articleKeywords = $("#article_keywords").val().split(",");

    if (articleKeywordCategoryId != "") {
        articleKeywordsJson.push({
            "article_keyword_id": parseInt(articleKeywordCategoryId),
            "text": articleKeywordCategoryText
        });
    }
    for (var i = 0; i < articleKeywords.length; i++) {
        if (articleKeywords[i].trim() != "") {
            articleKeywordsJson.push({
                "article_keyword_id": 0,
                "text": articleKeywords[i].trim()
            });
        }
    }
    return articleKeywordsJson;
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
 * Function validates all required fields to create article.
 */
function isValidPartialForm() {
    var authorNicknameValid = isValidRequiredField("author_nickname");
    var titleValid = isValidRequiredField("title");
    var headerTextValid = isValidRequiredField("header_text");
    return authorNicknameValid && titleValid && headerTextValid;
}

/**
 * Function validates that all required and optional fields with valid values to create article.
 */
function isValidForm() {
    var mainTextValid = isValidRequiredTextAreaField("main_text");
    var articleKeywordCategoryValid = isValidRequiredField("article_keyword_category");
    var articleKeywordsValid = isValidRequiredKeywordsField("article_keywords");
    var originalSourceURLValid = isValidUrlField("original_source_url");
    return isValidPartialForm() && mainTextValid && articleKeywordCategoryValid && articleKeywordsValid && originalSourceURLValid;
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
    if (strippedText == "") {
        showErrorMessage(fieldId);
        return false;
    }
    hideErrorMessage(fieldId);
    return true;
}

/**
 * Function validates given keywords, using only letters and commas regular expression.
 */
function isValidRequiredKeywordsField(fieldId) {
    var keywords = $("#" + fieldId).val();
    if (keywords.trim() == "" || !VALID_KEYWORDS_REX.test(keywords)) {
        showErrorMessage(fieldId);
        return false;
    }
    hideErrorMessage(fieldId);
    return true;
}

/**
 * Function validates given URL, in case it is filled and not valid, error message is shown, otherwise hidden.
 */
function isValidUrlField(fieldId) {
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