(function () {
  "use strict";

  var root = document.querySelector("[data-room-root]");
  if (!root) return;

  var state = {
    me: null,
    shouts: [],
    posts: [],
    activePost: null
  };

  var statusEl = root.querySelector("[data-room-status]");
  var identityEl = root.querySelector("[data-room-identity]");
  var shoutForm = root.querySelector("[data-shout-form]");
  var postForm = root.querySelector("[data-post-form]");
  var shoutInput = root.querySelector("#room-shout");
  var shoutImageInput = root.querySelector("#room-shout-image");
  var postInput = root.querySelector("#room-markdown");
  var fileInput = root.querySelector("#room-markdown-file");
  var shoutCount = root.querySelector("[data-shout-count]");
  var postCount = root.querySelector("[data-post-count]");
  var shoutsList = root.querySelector("[data-shouts-list]");
  var postsList = root.querySelector("[data-posts-list]");
  var postReader = root.querySelector("[data-post-reader]");
  var pendingImageKey = null;

  function setStatus(message, isError) {
    statusEl.textContent = message;
    statusEl.classList.toggle("is-error", Boolean(isError));
  }

  function api(path, options) {
    var init = options || {};
    init.headers = Object.assign({ "Accept": "application/json" }, init.headers || {});
    if (init.body && !init.headers["Content-Type"]) {
      init.headers["Content-Type"] = "application/json";
    }

    return fetch(path, init).then(function (response) {
      var contentType = response.headers.get("content-type") || "";
      return response.text().then(function (text) {
        var data = {};
        if (text && contentType.indexOf("application/json") !== -1) {
          data = JSON.parse(text);
        } else if (text) {
          throw new Error("Room API returned HTML instead of JSON. The Pages Function for /us/api/* is not active yet.");
        }
        if (!response.ok) {
          var message = data && data.error ? data.error : "Request failed.";
          throw new Error(message);
        }
        return data;
      });
    });
  }

  function formatDate(value) {
    if (!value) return "";
    var date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString([], {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function setBusy(form, busy) {
    Array.prototype.forEach.call(form.elements, function (field) {
      field.disabled = busy;
    });
  }

  function textEl(tag, className, text) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    el.textContent = text || "";
    return el;
  }

  function renderDeleteButton(entry) {
    if (!entry.can_delete) return null;
    var button = document.createElement("button");
    button.type = "button";
    button.className = "us-room__delete";
    button.textContent = "Hide";
    button.addEventListener("click", function () {
      if (!window.confirm("Hide this entry from the room?")) return;
      api("/us/api/entries/" + encodeURIComponent(entry.id), { method: "DELETE" })
        .then(function () {
          setStatus("Entry hidden.");
          return refreshRoom();
        })
        .catch(function (error) {
          setStatus(error.message, true);
        });
    });
    return button;
  }

  function renderEntryHead(entry) {
    var head = document.createElement("div");
    head.className = "us-room__entry-head";
    head.appendChild(textEl("span", "us-room__author", entry.author_handle || "unknown"));

    var actions = document.createElement("span");
    actions.className = "us-room__entry-actions";
    actions.appendChild(textEl("time", "", formatDate(entry.created_at)));
    var deleteButton = renderDeleteButton(entry);
    if (deleteButton) actions.appendChild(deleteButton);
    head.appendChild(actions);

    return head;
  }

  function renderShouts() {
    shoutsList.replaceChildren();
    if (!state.shouts.length) {
      shoutsList.appendChild(textEl("p", "us-room__empty", "No shouts yet. Leave the first one."));
      return;
    }

    state.shouts.forEach(function (entry) {
      var article = document.createElement("article");
      article.className = "us-room__shout";
      article.appendChild(renderEntryHead(entry));

      if (entry.image_url) {
        var img = document.createElement("img");
        img.src = entry.image_url;
        img.alt = entry.body_text || "";
        img.className = "us-room__shout-image";
        img.loading = "lazy";
        img.referrerPolicy = "no-referrer";
        article.appendChild(img);
      }

      article.appendChild(textEl("p", "us-room__shout-body", entry.body_text || entry.body_markdown || ""));
      shoutsList.appendChild(article);
    });
  }

  function renderPosts() {
    postsList.replaceChildren();
    if (!state.posts.length) {
      postsList.appendChild(textEl("p", "us-room__empty", "No Markdown posts yet."));
      postReader.replaceChildren(textEl("p", "us-room__empty", "Select a Markdown post."));
      return;
    }

    state.posts.forEach(function (entry) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "us-room__post-item";
      if (state.activePost && state.activePost.id === entry.id) {
        button.classList.add("is-active");
      }

      button.appendChild(textEl("h3", "us-room__post-title", entry.title || "Untitled note"));
      button.appendChild(textEl("p", "us-room__post-summary", entry.summary || formatDate(entry.created_at)));
      button.addEventListener("click", function () {
        loadPost(entry.slug || entry.id);
      });
      postsList.appendChild(button);
    });
  }

  function renderPostReader(post) {
    state.activePost = post;
    postReader.replaceChildren();

    var title = textEl("h2", "", post.title || "Untitled note");
    var meta = textEl("p", "us-room__post-meta", (post.author_handle || "unknown") + " | " + formatDate(post.created_at));
    var body = document.createElement("div");
    body.className = "us-room__post-body";
    body.innerHTML = post.body_html || "";

    postReader.appendChild(title);
    postReader.appendChild(meta);

    var deleteButton = renderDeleteButton(post);
    if (deleteButton) {
      var actionRow = document.createElement("p");
      actionRow.appendChild(deleteButton);
      postReader.appendChild(actionRow);
    }

    postReader.appendChild(body);
    renderPosts();
  }

  function loadPost(slugOrId) {
    setStatus("Loading Markdown post...");
    return api("/us/api/posts/" + encodeURIComponent(slugOrId))
      .then(function (data) {
        renderPostReader(data.post);
        setStatus("Post loaded.");
      })
      .catch(function (error) {
        setStatus(error.message, true);
      });
  }

  function refreshRoom() {
    return Promise.all([
      api("/us/api/entries?kind=shout"),
      api("/us/api/entries?kind=post")
    ]).then(function (results) {
      state.shouts = results[0].entries || [];
      state.posts = results[1].entries || [];
      renderShouts();
      renderPosts();
      if (state.activePost) {
        var stillPresent = state.posts.some(function (entry) {
          return entry.id === state.activePost.id;
        });
        if (!stillPresent) {
          state.activePost = null;
          postReader.replaceChildren(textEl("p", "us-room__empty", "Select a Markdown post."));
        }
      }
    });
  }

  function activateTab(name) {
    Array.prototype.forEach.call(root.querySelectorAll("[data-room-tab]"), function (tab) {
      var active = tab.getAttribute("data-room-tab") === name;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", active ? "true" : "false");
    });
    Array.prototype.forEach.call(root.querySelectorAll("[data-room-panel]"), function (panel) {
      panel.classList.toggle("is-active", panel.getAttribute("data-room-panel") === name);
    });
  }

  function updateCounts() {
    if (shoutCount && shoutInput) {
      shoutCount.textContent = String(shoutInput.value.length) + " / 500";
    }
    if (postCount && postInput) {
      var bytes = new Blob([postInput.value]).size;
      var kb = Math.round(bytes / 1024);
      postCount.textContent = String(kb) + " / 100 KB";
    }
  }

  Array.prototype.forEach.call(root.querySelectorAll("[data-room-tab]"), function (tab) {
    tab.addEventListener("click", function () {
      activateTab(tab.getAttribute("data-room-tab"));
    });
  });

  shoutInput.addEventListener("input", updateCounts);
  postInput.addEventListener("input", updateCounts);

  shoutImageInput.addEventListener("change", function () {
    var file = shoutImageInput.files && shoutImageInput.files[0];
    if (!file) {
      pendingImageKey = null;
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setStatus("Image is over the 5 MB limit.", true);
      shoutImageInput.value = "";
      pendingImageKey = null;
      return;
    }

    var formData = new FormData();
    formData.append("image", file);
    setStatus("Uploading image...");

    fetch("/us/api/images", {
      method: "POST",
      body: formData
    })
      .then(function (response) {
        return response.text().then(function (text) {
          var data = {};
          if (text && response.headers.get("content-type") && response.headers.get("content-type").indexOf("application/json") !== -1) {
            data = JSON.parse(text);
          }
          if (!response.ok) {
            throw new Error((data && data.error) ? data.error : "Image upload failed.");
          }
          return data;
        });
      })
      .then(function (data) {
        pendingImageKey = data.key;
        setStatus("Image ready: " + (file.name || "attached"));
      })
      .catch(function (error) {
        setStatus(error.message, true);
        shoutImageInput.value = "";
        pendingImageKey = null;
      });
  });

  fileInput.addEventListener("change", function () {
    var file = fileInput.files && fileInput.files[0];
    if (!file) return;
    if (file.size > 102400) {
      setStatus("Markdown file is over the 100 KB v1 limit.", true);
      fileInput.value = "";
      return;
    }
    file.text().then(function (text) {
      postInput.value = text;
      updateCounts();
      setStatus("Loaded " + file.name + " into the composer.");
    });
  });

  shoutForm.addEventListener("submit", function (event) {
    event.preventDefault();
    setBusy(shoutForm, true);
    var shoutBody = { body: shoutInput.value };
    if (pendingImageKey) shoutBody.image_key = pendingImageKey;

    api("/us/api/shouts", {
      method: "POST",
      body: JSON.stringify(shoutBody)
    })
      .then(function () {
        shoutInput.value = "";
        shoutImageInput.value = "";
        pendingImageKey = null;
        updateCounts();
        setStatus("Shout posted.");
        return refreshRoom();
      })
      .catch(function (error) {
        setStatus(error.message, true);
      })
      .finally(function () {
        setBusy(shoutForm, false);
      });
  });

  postForm.addEventListener("submit", function (event) {
    event.preventDefault();
    setBusy(postForm, true);
    api("/us/api/posts", {
      method: "POST",
      body: JSON.stringify({ body_markdown: postInput.value })
    })
      .then(function (data) {
        postInput.value = "";
        fileInput.value = "";
        updateCounts();
        activateTab("posts");
        setStatus("Markdown post published.");
        return refreshRoom().then(function () {
          if (data.post && (data.post.slug || data.post.id)) {
            return loadPost(data.post.slug || data.post.id);
          }
        });
      })
      .catch(function (error) {
        setStatus(error.message, true);
      })
      .finally(function () {
        setBusy(postForm, false);
      });
  });

  updateCounts();
  api("/us/api/me")
    .then(function (data) {
      state.me = data.user;
      identityEl.textContent = "signed in as " + (data.user.handle || data.user.email);
      setStatus("Connected. Reading the room log...");
      return refreshRoom();
    })
    .then(function () {
      setStatus("Connected.");
    })
    .catch(function (error) {
      identityEl.textContent = "not connected";
      setStatus(error.message, true);
    });
}());
