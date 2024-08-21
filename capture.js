let isCaptureMode = false;
const navbarIcon = document.getElementById("navbar-icon");

if (navbarIcon) {
  navbarIcon.addEventListener("click", () => {
    isCaptureMode = !isCaptureMode;
    const message = isCaptureMode ? "Exit Capture Mode" : "Toggle Capture Mode";

    chrome.runtime.sendMessage({ captureMode: isCaptureMode });

    navbarIcon.setAttribute("title", message);

    if (isCaptureMode) {
      navbarIcon.classList.add("active");
    } else {
      navbarIcon.classList.remove("active");
    }
  });
} else {
  console.error("El icono del navbar no se encontró.");
}

 document.addEventListener("DOMContentLoaded", () => {
   chrome.storage.local.get("capturedContent", (data) => {
     const contentElement = document.getElementById("content");
     if (contentElement) {
       contentElement.innerText = data.capturedContent || "No content captured";
     }
   });
 });