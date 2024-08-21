let isCaptureMode = false;
let currentElement = null;
let isDisabled = false;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.captureMode !== undefined) {
    isCaptureMode = message.captureMode;
    sendResponse({ isCaptureMode });
    console.log("Capture mode:", isCaptureMode);
  }
});

document.addEventListener("mousemove", (event) => {
  if (isCaptureMode || isDisabled) return;

  const element = document.elementFromPoint(event.clientX, event.clientY);

  if (!element || element === currentElement) return;

  if (currentElement) {
    resetHighlight(currentElement);
  }

  highlightElement(element);
  currentElement = element;
  console.log("Highlighted element:", currentElement);
});

document.addEventListener("click", (event) => {
  if (isCaptureMode || isDisabled) return;

  event.preventDefault();
  event.stopPropagation();

  if (currentElement) {
    const capturedContent = currentElement.outerHTML;

    chrome.runtime.sendMessage({ action: "capture", content: capturedContent });

    disableMouseActions();
    isDisabled = true;

    resetHighlight(currentElement);
    console.log("Captured element:", currentElement);


    currentElement = null;

    isCaptureMode = false;
    chrome.runtime.sendMessage({ captureMode: false });
  }
});

function highlightElement(element) {
  element.style.transition =
    "background-color 0.3s ease, border-color 0.3s ease";
  element.style.backgroundColor = "rgba(128, 128, 128, 0.5)";
  element.style.border = "2px solid red";
}

function resetHighlight(element) {
  element.style.backgroundColor = "";
  element.style.border = "";
  element.style.transition = "";
}

function disableMouseActions() {
  document.body.style.pointerEvents = "none";
  window.addEventListener("scroll", enableScrolling);
}

function enableScrolling(event) {
  event.stopImmediatePropagation();
  window.removeEventListener("scroll", enableScrolling);
}

document.addEventListener("keydown", (event) => {
  if (
    event.key === "Tab" ||
    event.key === "ArrowUp" ||
    event.key === "ArrowDown" ||
    event.key === "ArrowLeft" ||
    event.key === "ArrowRight"
  ) {
    isDisabled = false;
    document.body.style.pointerEvents = "auto";
  }
});
