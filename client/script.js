document.addEventListener("DOMContentLoaded", function () {
  // Common functionality for all pages
  initMobileMenu();

  // Page-specific functionality
  if (document.querySelector(".verify-container")) {
    initVerifyPage();
  }

  if (document.querySelector(".about-container")) {
    initAboutPage();
  }
});

// Mobile menu toggle for smaller screens
function initMobileMenu() {
  const menuToggle = document.createElement("div");
  menuToggle.className = "mobile-menu-toggle";
  menuToggle.innerHTML = "☰";
  menuToggle.style.display = "none";
  menuToggle.style.position = "fixed";
  menuToggle.style.top = "20px";
  menuToggle.style.right = "20px";
  menuToggle.style.zIndex = "1000";
  menuToggle.style.fontSize = "2rem";
  menuToggle.style.cursor = "pointer";
  menuToggle.style.color = "#00ffff";
  document.body.appendChild(menuToggle);

  const nav = document.querySelector("nav");

  function toggleMenu() {
    if (nav.style.display === "flex") {
      nav.style.display = "none";
    } else {
      nav.style.display = "flex";
    }
  }

  menuToggle.addEventListener("click", toggleMenu);

  function checkScreenSize() {
    if (window.innerWidth <= 768) {
      menuToggle.style.display = "block";
      nav.style.display = "none";
      nav.style.flexDirection = "column";
      nav.style.position = "fixed";
      nav.style.top = "80px";
      nav.style.right = "20px";
      nav.style.background = "rgba(0,0,0,0.9)";
      nav.style.padding = "1rem";
      nav.style.borderRadius = "5px";
      nav.style.border = "1px solid #00ffff";
    } else {
      menuToggle.style.display = "none";
      nav.style.display = "flex";
      nav.style.position = "static";
      nav.style.background = "transparent";
      nav.style.padding = "0";
      nav.style.border = "none";
    }
  }

  window.addEventListener("resize", checkScreenSize);
  checkScreenSize();
}

// Verify Page Specific Functions
function initVerifyPage() {
  const dropZone = document.getElementById("dropZone");
  const fileInput = document.getElementById("fileInput");
  const previewGrid = document.getElementById("previewGrid");
  const verifyForm = document.getElementById("verifyForm");
  const resultsSection = document.getElementById("resultsSection");

  // Drag and drop functionality
  ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    dropZone.addEventListener(eventName, preventDefaults, false);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  ["dragenter", "dragover"].forEach((eventName) => {
    dropZone.addEventListener(eventName, highlight, false);
  });

  ["dragleave", "drop"].forEach((eventName) => {
    dropZone.addEventListener(eventName, unhighlight, false);
  });

  function highlight() {
    dropZone.classList.add("active");
  }

  function unhighlight() {
    dropZone.classList.remove("active");
  }

  dropZone.addEventListener("drop", handleDrop, false);

  function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
  }

  fileInput.addEventListener("change", function () {
    handleFiles(this.files);
  });

  function handleFiles(files) {
    [...files].forEach((file) => {
      if (!file.type.match("image.*")) return;

      const reader = new FileReader();

      reader.onload = function (e) {
        const previewItem = document.createElement("div");
        previewItem.className = "preview-item";

        const img = document.createElement("img");
        img.src = e.target.result;

        const removeBtn = document.createElement("button");
        removeBtn.className = "remove-btn";
        removeBtn.innerHTML = "×";
        removeBtn.addEventListener("click", function () {
          previewGrid.removeChild(previewItem);
        });

        previewItem.appendChild(img);
        previewItem.appendChild(removeBtn);
        previewGrid.appendChild(previewItem);
      };

      reader.readAsDataURL(file);
    });
  }

  // Form submission with fake verification
  verifyForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Show loading state
    resultsSection.style.display = "block";
    document.getElementById("resultStatus").textContent = "ANALYZING...";
    document.getElementById("resultDetails").innerHTML = "";
    document.getElementById("confidenceMeter").style.width = "0%";
    document.getElementById("confidenceValue").textContent = "0%";
    document.getElementById("expertFeedback").innerHTML = "";

    // Simulate API call with timeout
    setTimeout(() => {
      // Random result for demo purposes
      const isAuthentic = Math.random() > 0.3;
      const confidence = Math.floor(Math.random() * 30) + 70; // 70-100%

      document.getElementById("resultStatus").textContent = isAuthentic
        ? "AUTHENTIC"
        : "FAKE";
      document.getElementById("resultStatus").className = isAuthentic
        ? "result-status authentic"
        : "result-status fake";

      const details = isAuthentic
        ? "Our analysis confirms this item is authentic based on stitching, materials, and labeling."
        : "Several inconsistencies were found including incorrect labeling and poor stitching quality.";

      document.getElementById("resultDetails").textContent = details;

      // Animate confidence meter
      animateValue("confidenceValue", 0, confidence, 1000);
      animateWidth("confidenceMeter", 0, confidence, 1000);

      // Expert feedback
      const feedback = isAuthentic
        ? "Expert Note: This item matches all the characteristics of an authentic product. The materials and craftsmanship are consistent with the brand's standards."
        : "Expert Note: The item shows clear signs of being counterfeit. Pay special attention to the uneven stitching and incorrect font on the label.";

      document.getElementById("expertFeedback").textContent = feedback;

      // Scroll to results
      resultsSection.scrollIntoView({ behavior: "smooth" });
    }, 2000);
  });

  // Helper functions for animations
  function animateValue(id, start, end, duration) {
    const obj = document.getElementById(id);
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const value = Math.floor(progress * (end - start) + start);
      obj.textContent = value + "%";
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  function animateWidth(id, start, end, duration) {
    const obj = document.getElementById(id);
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const value = progress * (end - start) + start;
      obj.style.width = value + "%";
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }
}

// About Page Specific Functions
function initAboutPage() {
  // Animate stats on scroll into view
  const stats = document.querySelectorAll(".stat-number");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const stat = entry.target;
          const target = parseInt(stat.textContent);
          let current = 0;

          const increment = target / 50;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              clearInterval(timer);
              stat.textContent = target;
            } else {
              stat.textContent = Math.floor(current);
            }
          }, 20);

          observer.unobserve(stat);
        }
      });
    },
    { threshold: 0.5 }
  );

  stats.forEach((stat) => {
    observer.observe(stat);
  });

  // Team member hover effects
  const teamMembers = document.querySelectorAll(".team-member");
  teamMembers.forEach((member) => {
    member.addEventListener("mouseenter", function () {
      const image = this.querySelector(".member-image");
      image.style.borderColor = "#ff00ff";
    });

    member.addEventListener("mouseleave", function () {
      const image = this.querySelector(".member-image");
      image.style.borderColor = "#00ffff";
    });
  });
}
