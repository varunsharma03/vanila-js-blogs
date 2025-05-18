document.addEventListener("DOMContentLoaded", () => {
  const userId = localStorage.getItem("userId");
  const blogId = localStorage.getItem("selectedBlogId");

  const authBtn = document.getElementById("auth-btn");
  authBtn.textContent = userId ? "Logout" : "Login / Register";
  authBtn.onclick = () => {
    if (userId) {
      localStorage.removeItem("userId");
      location.reload();
    } else {
      window.location.href = "auth.html";
    }
  };

  const blogDetailsDiv = document.getElementById("blog-details");
  const commentsList = document.getElementById("comments-list");
  const commentBtn = document.getElementById("comment-btn");

  // Fetch blog details
  fetch("http://localhost:3000/blog/details", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ blogId }),
  })
    .then((res) => res.json())
    .then(({ data }) => {
      if (!data) throw new Error("No data");

      // Update view count
      fetch("http://localhost:3000/update/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blogId }),
      });

      // Render blog info
      blogDetailsDiv.innerHTML = `
          <h2>${data.name}</h2>
          <img src="${data.imageUrl}" alt="Blog Image" class="blog-image" />
          <p>${data.descriptions}</p>
          <p class="blog-author">By ${data.user?.name || "Anonymous"}</p>
          <p>Views: ${data.view} | Likes: ${data.like} | Dislikes: ${
        data.dislike
      }</p>
        `;

      // Render comments
      commentsList.innerHTML = data.comment
        .map(
          (c) =>
            `<div class="comment-box"><strong>${c?.user?.name}</strong>: ${c.comment}</div>`
        )
        .join("");
    })
    .catch(() => {
      blogDetailsDiv.innerHTML = "<p>Error loading blog.</p>";
    });

  // Like button
  document.querySelector(".like-btn").onclick = () => {
    if (!userId) return alert("Login required");
    fetch("http://localhost:3000/update/blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blogId, like: true }),
    }).then(() => location.reload());
  };

  // Dislike button
  document.querySelector(".dislike-btn").onclick = () => {
    if (!userId) return alert("Login required");
    fetch("http://localhost:3000/update/blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blogId, dislike: true }),
    }).then(() => location.reload());
  };

  // Post comment
  commentBtn.onclick = () => {
    if (!userId) return alert("Login required");
    const comment = document.getElementById("comment-input").value.trim();
    if (!comment) return alert("Comment cannot be empty");

    fetch("http://localhost:3000/add/comment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, blogId, comment }),
    })
      .then((res) => res.json())
      .then(() => location.reload());
  };
});
