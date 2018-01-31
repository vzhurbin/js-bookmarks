const body = document.body;

const input = document.querySelector('input[type=text]');
const overlay = document.querySelector('.overlay');

function showFloater() {
  body.classList.add('show-floater');
}

function closeFloater() {
  if (body.classList.contains('show-floater')) {
    body.classList.remove('show-floater');
  }
}

input.addEventListener('focus', showFloater);
input.addEventListener('click', showFloater);
input.addEventListener('focusout', closeFloater);
input.addEventListener('keydown', function (e) {
  // console.log(e);
  // console.log(e.key);
  console.log(e.key === "Escape");
  if (e.key === "Escape" || e.key === "Enter") {
    closeFloater();
  }

  return;
});

overlay.addEventListener('click', closeFloater);

// =========================

const bookmarksList = document.querySelector('.bookmarks-list');
const bookmarkForm = document.querySelector('.bookmark-form');
const bookmarkInput = bookmarkForm.querySelector('input[type=text]');
const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
const apiUrl = 'https://opengraph.io/api/1.1/site';
const appId = '5a7191d03e22ba981a395bf4';

fillBookmarksList(bookmarks);

function createBookmark(e) {
  console.log(e.type);
  e.preventDefault();
  if (!bookmarkInput.value) {
    return;
  }

  const url = encodeURIComponent(bookmarkInput.value);

  // add a new bookmark to the bookmarks
  fetch(`${apiUrl}/${url}?app_id=${appId}`)
    .then(response => response.json())
    .then(data => {

      const bookmark = {
        title: data.hybridGraph.title,
        image: data.hybridGraph.image,
        link: data.hybridGraph.url,
      };

      bookmarks.push(bookmark);
      fillBookmarksList(bookmarks);
      storeBookmarks(bookmarks);
      bookmarkForm.reset();
    })
    .catch(error => {

      if (bookmarkInput.value) {

        const bookmark = {
          title: bookmarkInput.value,
        };

        bookmarks.push(bookmark);
        fillBookmarksList(bookmarks);
        storeBookmarks(bookmarks);
        bookmarkForm.reset();

      } else {
        alert('Could not fetch data :(')
      }
    });
}

function fillBookmarksList(bookmarks = []) {
  const bookmarksHtml = bookmarks.map((bookmark, i) => {
    return `
          <div class="bookmark" data-id="${i}">
            <a href="${bookmark.link}">
              <div class="img" style="background-image:url('${bookmark.image}')"></div>
            </a>
            <a href="${bookmark.link}">
              <div class="title">${bookmark.title}</div>
            </a>
            <span class="glyphicon glyphicon-remove"></span>
          </div>
        `;
  }).join('');

  bookmarksList.innerHTML = bookmarksHtml;
}

function removeBookmark(e) {
  console.log(e.type);
  if (!e.target.matches('.glyphicon-remove')) return;

  // find the index
  // remove from the bookmarks using splice
  // fill the list
  // store back to localStorage
  const index = e.target.parentNode.dataset.id;
  bookmarks.splice(index, 1);
  fillBookmarksList(bookmarks);
  storeBookmarks(bookmarks);
}

function storeBookmarks(bookmarks = []) {
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
}

bookmarkForm.addEventListener('submit', createBookmark);
bookmarksList.addEventListener('click', removeBookmark);