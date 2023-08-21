function getClipboardText(callback) {
    let textArea = document.createElement("textarea");
    document.body.appendChild(textArea);
    textArea.focus();
    document.execCommand('paste');
    let clipboardText = textArea.value;
    document.body.removeChild(textArea);
    callback(clipboardText);
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.action == "getClipboardText") {
            getClipboardText(sendResponse);
        }
        return true;
    }
);