document.addEventListener("DOMContentLoaded", () => {
  const blogContainer = document.getElementById("blog-container");
  const authBtn = document.getElementById("auth-btn");

  // Update button based on login state
  const userId = localStorage.getItem("userId");
  authBtn.textContent = userId ? "Logout" : "Login / Register";

  authBtn.addEventListener("click", () => {
    if (localStorage.getItem("userId")) {
      localStorage.removeItem("userId");
      location.reload();
    } else {
      window.location.href = "auth.html"; // Replace with your login/signup page
    }
  });

  // Fetch blogs from backend
  fetch("http://localhost:3000/allBlogs")
    .then((res) => res.json())
    .then((data) => {
      data?.data?.forEach((blog) => {
        const card = document.createElement("div");
        card.className = "blog-card";

        const imageUrl =
          blog.imageUrl ||
          "https://via.placeholder.com/400x200.png?text=No+Image";

        card.innerHTML = `
          <img src="${imageUrl}" alt="Blog Image" class="blog-image" />
          <div class="blog-content">
            <h3>${blog.name}</h3>
            <p>${blog.descriptions.substring(0, 200)}...</p>
            <p class="blog-author">By ${blog.user?.name || "Anonymous"}</p>
          </div>
        `;

        blogContainer.appendChild(card);
      });
    })
    .catch((err) => {
      blogContainer.innerHTML =
        "<p>Error loading blogs. Please try again later.</p>";
      console.error("Error fetching blogs:", err);
    });
});
