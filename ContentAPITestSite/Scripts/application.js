$(document).ready(function () {
    var authData = localStorage.getItem("authorizationDataToken");
    if(!authData)
        login();
    var bodyHtml = $("body").html();
    var language = $("body").data("language");


    $("[data-content]").each(function () {
        var divHtml = $(this).html();
        var contentId = $(this).data("content");
        var replacementContent = {};
        console.log("Found content: " + contentId);
        var content = GetContent(contentId);
        if (language != null) {
            var contentItem = $.grep(content.Localisations, function(item) {
                return item.Language.Code == language;
            });
            if (contentItem.length) {
                replacementContent = contentItem[0];
            } else {
                replacementContent = content.Localisations[0];
            }
        }
        $(this).html(divHtml.replace("::Title::", content.Title).replace("::Body::", replacementContent.ModificationHistory[replacementContent.ModificationHistory.length - 1].ContentData));
    });
    $("html").fadeIn();
});

function GetContent(contentId) {
    var authData = localStorage.getItem("authorizationDataToken");
    var content;
    if (authData) {
        $.ajax({
            beforeSend: function(xhr) { xhr.setRequestHeader("Authorization", "Bearer " + authData) },
            type: "GET",
            url: "http://capi-test.regus.com/v1/content/" + contentId + "/?select.ContentData=true&select.Localisations=all&select.ContentVersions=all",
            dataType: "json",
            async: false
        }).done(function(msg) {
            content = msg;
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.log("Request failed: " + textStatus);
            console.log(errorThrown);
        });
    } else {
        console.log("No Auth Token Found: " + authData);
    }
    return content;
}

function login() {
    var data = "grant_type=password&username=johnstephenson&password=Turbul3nc3!";

    $.post("http://capi-test.regus.com/token", data, {
        headers:
        { 'Content-Type': "application/x-www-form-urlencoded" }
    }).success(function (response) {
        localStorage.setItem("authorizationDataToken", response.access_token);
    }).error(function (err, status) {
        console.log("Error Logging in: " + err);
    });
};

