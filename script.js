let articles = JSON.parse(
  localStorage.getItem("myBlogArticles")
) || [];

let selectedPhotos = [];


/* =========================
   ページ表示
========================= */

function showHome() {
  document.getElementById("home").classList.remove("hidden");
  document.getElementById("create").classList.add("hidden");
  document.getElementById("tagPage").classList.add("hidden");

  displayArticles(articles);
  displayTags();
}


function showCreate() {
  document.getElementById("home").classList.add("hidden");
  document.getElementById("create").classList.remove("hidden");
  document.getElementById("tagPage").classList.add("hidden");

  setDefaultDate();
}


/* =========================
   日付の初期値
========================= */

function setDefaultDate() {

  const now = new Date();

  const date =
    now.getFullYear() +
    "-" +
    String(now.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(now.getDate()).padStart(2, "0");

  const time =
    String(now.getHours()).padStart(2, "0") +
    ":" +
    String(now.getMinutes()).padStart(2, "0");

  document.getElementById("date").value = date;
  document.getElementById("time").value = time;
}


/* =========================
   写真プレビュー
========================= */

document.getElementById("photos").addEventListener(
  "change",
  function(event) {

    selectedPhotos = [];

    const files = event.target.files;
    const preview = document.getElementById("preview");

    preview.innerHTML = "";

    Array.from(files).forEach(file => {

      const reader = new FileReader();

      reader.onload = function(e) {

        selectedPhotos.push(e.target.result);

        const img = document.createElement("img");
        img.src = e.target.result;

        preview.appendChild(img);
      };

      reader.readAsDataURL(file);
    });
  }
);


/* =========================
   記事投稿
========================= */

function postArticle() {

  const title =
    document.getElementById("title").value.trim();

  const date =
    document.getElementById("date").value;

  const time =
    document.getElementById("time").value;

  const content =
    document.getElementById("content").value.trim();

  const tagText =
    document.getElementById("tags").value.trim();


  if (!title || !content) {
    alert("タイトルと本文を入力してください！");
    return;
  }


  const tags = tagText
    .split(/\s+/)
    .filter(tag => tag !== "")
    .map(tag => {
      if (!tag.startsWith("#")) {
        return "#" + tag;
      }
      return tag;
    });


  const article = {

    id: Date.now(),

    title: title,

    date: date,

    time: time,

    content: content,

    photos: selectedPhotos,

    tags: tags
  };


  articles.unshift(article);

  localStorage.setItem(
    "myBlogArticles",
    JSON.stringify(articles)
  );


  alert("記事を投稿しました！");


  document.getElementById("title").value = "";
  document.getElementById("content").value = "";
  document.getElementById("tags").value = "";

  selectedPhotos = [];

  document.getElementById("preview").innerHTML = "";

  document.getElementById("photos").value = "";


  showHome();
}


/* =========================
   記事表示
========================= */

function displayArticles(list) {

  const area =
    document.getElementById("articleList");

  area.innerHTML = "";


  if (list.length === 0) {

    area.innerHTML =
      "<p>まだ記事がありません。</p>";

    return;
  }


  list.forEach(article => {

    area.innerHTML += createArticleHTML(article);

  });
}


/* =========================
   記事HTML
========================= */

function createArticleHTML(article) {

  let photosHTML = "";

  article.photos.forEach(photo => {

    photosHTML +=
      `<img src="${photo}" alt="">`;

  });


  let tagsHTML = "";

  article.tags.forEach(tag => {

    tagsHTML +=
      `<span class="tag"
        onclick="openTag('${escapeHTML(tag)}')">
        ${escapeHTML(tag)}
      </span>`;

  });


  return `
    <article class="article">

      <div class="articleDate">
        ${article.date.replaceAll("-", "/")}
        ${article.time}
      </div>

      <div class="articleTitle">
        ${escapeHTML(article.title)}
      </div>

      <div class="articleContent">
        ${escapeHTML(article.content)}
      </div>

      ${photosHTML}

      <div class="tags">
        ${tagsHTML}
      </div>

      <button
        class="deleteButton"
        onclick="deleteArticle(${article.id})">
        この記事を削除
      </button>

    </article>
  `;
}


/* =========================
   タグ一覧
========================= */

function displayTags() {

  const area =
    document.getElementById("tagArea");

  const allTags = [];

  articles.forEach(article => {

    article.tags.forEach(tag => {

      if (!allTags.includes(tag)) {
        allTags.push(tag);
      }

    });

  });


  area.innerHTML = "";

  allTags.forEach(tag => {

    area.innerHTML += `
      <button
        class="tagButton"
        onclick="openTag('${escapeHTML(tag)}')">
        ${escapeHTML(tag)}
      </button>
    `;

  });
}


/* =========================
   タグページ
========================= */

function openTag(tag) {

  document.getElementById("home").classList.add("hidden");
  document.getElementById("create").classList.add("hidden");
  document.getElementById("tagPage").classList.remove("hidden");

  document.getElementById("tagTitle").textContent =
    tag;


  const result =
    articles.filter(article =>
      article.tags.includes(tag)
    );


  const area =
    document.getElementById("tagArticles");

  area.innerHTML = "";


  result.forEach(article => {

    area.innerHTML +=
      createArticleHTML(article);

  });


  if (result.length === 0) {

    area.innerHTML =
      "<p>このタグの記事はありません。</p>";

  }
}


/* =========================
   削除
========================= */

function deleteArticle(id) {

  if (!confirm("この記事を削除しますか？")) {
    return;
  }


  articles =
    articles.filter(article =>
      article.id !== id
    );


  localStorage.setItem(
    "myBlogArticles",
    JSON.stringify(articles)
  );


  showHome();
}


/* =========================
   HTMLエスケープ
========================= */

function escapeHTML(text) {

  const div =
    document.createElement("div");

  div.textContent = text;

  return div.innerHTML;
}


/* =========================
   起動
========================= */

showHome();
