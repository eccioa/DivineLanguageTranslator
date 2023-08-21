async function getActiveTab() {
    return new Promise((resolve) => {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            resolve(tabs[0]);
        });
    });
}

async function updateTabURLAndWaitForLoad(tabId, url) {
    return new Promise((resolve) => {
        chrome.tabs.update(tabId, { url }, () => {
            chrome.tabs.onUpdated.addListener(function listener(updateTabId, info) {
                if (tabId === updateTabId && info.status === 'complete') {
                    chrome.tabs.onUpdated.removeListener(listener);
                    resolve();
                }
            });
        });
    });
}


async function getClipboardText(tabId) {
    return new Promise((resolve) => {
        chrome.tabs.sendMessage(tabId, { action: "getClipboardText" }, function (clipboardText) {
            resolve(clipboardText);
        });
    });
}

chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
        "id": "gltroot",
        "title": "Divine Language",
        "contexts": ["all"]
    });

    chrome.contextMenus.create(toMenu("nhentai"));
    chrome.contextMenus.create(toMenu("e-hentai"));
    chrome.contextMenus.create(toMenu("exhentai"));
    chrome.contextMenus.create(toMenu("紳士漫畫"));
    chrome.contextMenus.create(toMenu("禁漫天堂"));
    chrome.contextMenus.create(toMenu("pixiv"));
    chrome.contextMenus.create(toMenu("twitter"));
});

chrome.contextMenus.onClicked.addListener(async function(info, tab) {
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

    if (info.selectionText) {
        const newURL = baseURL + info.selectionText;
        chrome.tabs.create({ url: newURL });
    } else {
        const currentTab = await getActiveTab();

        if (currentTab.url.startsWith("chrome://")) {
            const urlObj = new URL(baseURL);
            await updateTabURLAndWaitForLoad(tab.id, urlObj.origin);

            const clipboardText = await getClipboardText(tab.id);
            const newURL = baseURL + clipboardText;
            chrome.tabs.update(tab.id, { url: newURL });
        } else {
            const clipboardText = await getClipboardText(tab.id);
            const newURL = baseURL + clipboardText;
            chrome.tabs.create({ url: newURL });
        }
    }
});

function toMenu(name) {
    return {
        "id": "glt" + name,
        "parentId": "gltroot",
        "title": name,
        "contexts": ["all"]
    }
}