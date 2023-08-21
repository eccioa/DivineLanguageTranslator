chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
        "id": "gltroot",
        "title": "Divine Language",
        "contexts": ["selection"]
    });

    chrome.contextMenus.create(toMenu("nhentai"));
    chrome.contextMenus.create(toMenu("e-hentai"));
    chrome.contextMenus.create(toMenu("exhentai"));
    chrome.contextMenus.create(toMenu("紳士漫畫"));
    chrome.contextMenus.create(toMenu("禁漫天堂"));
    chrome.contextMenus.create(toMenu("pixiv"));
    chrome.contextMenus.create(toMenu("twitter"));
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
    const selectedText = info.selectionText;

    let baseURL;

    switch(info.menuItemId) {
        case "gltnhentai":
            baseURL = "https://nhentai.net/g/";
            break;
        case "glte-hentai":
            baseURL = "https://e-hentai.org/g/";
            break;
        case "gltexhentai":
            baseURL = "https://exhentai.org/g/";
            break;
        case "glt紳士漫畫":
            baseURL = "https://www.wnacg.com/photos-index-aid-";
            break;
        case "glt禁漫天堂":
            baseURL = "https://18comic.vip/album/";
            break;
        case "gltpixiv":
            baseURL = "https://www.pixiv.net/artworks/";
            break;
        case "glttwitter":
            baseURL = "https://twitter.com/xxx/status/";
            break;
        default:
            return;
    }

    const newURL = baseURL + selectedText;
    chrome.tabs.create({ url: newURL });
});

function toMenu(name) {
    return {
        "id": "glt" + name,
        "parentId": "gltroot",
        "title": name,
        "contexts": ["selection"]
    }
}