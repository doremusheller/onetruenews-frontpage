/* ============================================================
   tafaj2.js — One True Infotainment v2
   Injects the TAFAJ meter (left-rail image) once per page.
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  // Avoid duplicate insertion
  if (document.getElementById("tafaj-meter")) return;

  // Verify the media asset exists (assumed path)
  const tafajPath = "media/tafajatan.png";

  // Create the container
  const aside = document.createElement("aside");
  aside.id = "tafaj-meter";

  const img = document.createElement("img");
  img.src = tafajPath;
  img.alt = "TAFAJ meter";

  aside.appendChild(img);

  // Insert after banner (or at end of body if banner missing)
  const header = document.querySelector(".site-header");
  if (header && header.parentNode) {
    header.parentNode.insertBefore(aside, header.nextSibling);
  } else {
    document.body.appendChild(aside);
  }

  console.log("%cTAFAJ meter injected.", "color:#b80000;");
});
