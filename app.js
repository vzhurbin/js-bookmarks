const body = document.body;

const input = document.querySelector('input[type=text]');
const button = document.querySelector('.floater-bottom button');
const overlay = document.querySelector('.overlay');

const showFloater = () => {
  if (!body.classList.contains('show-floater')) {
    body.classList.add('show-floater');
  }
}

const closeFloater = () => {
  if (body.classList.contains('show-floater')) {
    body.classList.remove('show-floater');
  }
}

const closeFloaterKeys = (event) => {
  switch (event.key) {
    case 'Enter':
    case 'Escape':
      closeFloater();
      break;
    default:
      break;
  }
}

input.addEventListener('focus', showFloater);
input.addEventListener('click', showFloater);
input.addEventListener('keydown', closeFloaterKeys);
button.addEventListener('keydown', closeFloaterKeys);
overlay.addEventListener('click', closeFloater);


const bookmarksList = document.querySelector('.bookmarks-list');
const bookmarkForm = document.querySelector('.bookmark-form');
const bookmarkInput = bookmarkForm.querySelector('input[type=text]');
const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];

// service to fetch url data
const apiUrl = 'https://opengraph.io/api/1.1/site';
const appId = '5a7191d03e22ba981a395bf4';

const isUrl = (str) => {
  const pattern = /^(http|https)?:\/\//;
  return pattern.test(str)
};

function createBookmark(e) {
  // console.log(e.type);
  e.preventDefault();

  const userInput = bookmarkInput.value;
  console.log(userInput);

  if (!userInput) {
    return;
  }

  console.log(isUrl(userInput));

  if (!isUrl(userInput)) {
    const bookmark = { title: userInput }
    updateBookmarkList (bookmarkForm, bookmarks, bookmark);
  } else {
    const url = encodeURIComponent(userInput);
    fetch(`${apiUrl}/${url}?app_id=${appId}`)
      .then(response => response.json())
      .then(data => {
        const bookmark = {
          title: data.hybridGraph.title,
          image: data.hybridGraph.image,
          favicon: data.hybridGraph.favicon,
          link: data.hybridGraph.url,
        }
        updateBookmarkList (bookmarkForm, bookmarks, bookmark);
      })
      .catch(error => {
        console.log(error);
        console.log(userInput);
        alert('There was an error :(');
      });
  }
};

const updateBookmarkList = (bookmarkForm, bookmarks, bookmark) => {
  bookmarks.push(bookmark);
  fillBookmarksList(bookmarks);
    storeBookmarks(bookmarks);
    bookmarkForm.reset();
}

const fillBookmarksList = (bookmarks = []) => {
  const bookmarksHtml = bookmarks.map((bookmark, i) => {
    if (bookmark.link && bookmark.image) {
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
    }
    if (bookmark.link && bookmark.favicon) {
      return `
          <div class="bookmark" data-id="${i}">
            <a href="${bookmark.link}">
              <div class="img" style="background-image:url('${bookmark.favicon}')"></div>
            </a>
            <a href="${bookmark.link}">
              <div class="title">${bookmark.title}</div>
            </a>
            <span class="glyphicon glyphicon-remove"></span>
           </div>
        `;
    }
    if (bookmark.link) {
      return `
          <div class="bookmark" data-id="${i}">
            <a href="${bookmark.link}">
              <div class="title">${bookmark.title}</div>
            </a>
            <span class="glyphicon glyphicon-remove"></span>
          </div>
        `;
    } else {
      return `
          <div class="bookmark" data-id="${i}">
            <div class="title">${bookmark.title}</div>
            <span class="glyphicon glyphicon-remove"></span>
          </div>
          `;
    }
  }).join('');

  bookmarksList.innerHTML = bookmarksHtml;
};

fillBookmarksList(bookmarks);

const removeBookmark = (e) => {
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

const storeBookmarks = (bookmarks = []) => {
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
}

bookmarkForm.addEventListener('submit', createBookmark);
bookmarksList.addEventListener('click', removeBookmark);
