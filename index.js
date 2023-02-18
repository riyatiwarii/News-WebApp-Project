require('dotenv').config();
const API_KEY = process.env.API_KEY;
const cardsBox = document.querySelector(".cards-append");
const cards = Array.from(document.querySelectorAll(".col"));
const newsCategory = Array.from(document.getElementsByClassName("category"));
const paginationWrapper = document.querySelector(".pagination");
const tickerListItem = Array.from(document.querySelectorAll(".ticker-list > li"))

newsCategory.forEach((category) => {
  category.addEventListener("click", (e) => {
    let categoryValue = e.target.innerText.toLowerCase();
    fetchNews(1, categoryValue);
    tickerListItem.forEach((item) => {
      if(e.target.innerText !== 'TOP TRENDING'){
        item.innerText = e.target.innerText + " " + 'News'
      } else {
        item.innerText = 'Top Trending News'
      }
    })
  });
});

function fetchNews(currPage, categoryValue, stopPaginationRender) {
  const url = `https://newsapi.org/v2/top-headlines?country=in&page=1&category=${categoryValue}&apiKey=${API_KEY}`;
  async function fetchData(url) {
    cardsBox.innerHTML = "";
    const response = await fetch(url);
    const apiData = await response.json();
    return apiData;
  }

  fetchData(url).then((apiData) => {
    articlesList = apiData.articles;
    const totalCount = articlesList.length;
    const itemsPerPage = 9;
    const countPaginationNo = Math.ceil(totalCount / itemsPerPage);
    if (!stopPaginationRender) {
      console.log("Hi, I am pagination and I am not getting rendered");
      renderPagination(countPaginationNo, categoryValue);
    } 
    articlesList.forEach((article, index) => {
      const nextRange = currPage * itemsPerPage;
      const prevRange = nextRange - itemsPerPage;
      console.log(currPage);
      if (index >= prevRange && index < nextRange) {
        populateNews(article);
      }
    });
  });
}

function populateNews(article) {
  function timeAgo(value) {
    const seconds = Math.floor(
      (new Date().getTime() - new Date(value).getTime()) / 1000
    );
    let interval = seconds / 31536000;
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
    if (interval > 1) {
      return rtf.format(-Math.floor(interval), "year");
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return rtf.format(-Math.floor(interval), "month");
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return rtf.format(-Math.floor(interval), "day");
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return rtf.format(-Math.floor(interval), "hour");
    }
    interval = seconds / 60;
    if (interval > 1) {
      return rtf.format(-Math.floor(interval), "minute");
    }
    return rtf.format(-Math.floor(interval), "second");
  }
  const time = timeAgo(article.publishedAt);
  const card = document.createElement("div");
  card.classList.add("col");
  if (!article.description) {
    article.description = "";
  }
  if (!article.title) {
    article.title = "";
  } 
  card.innerHTML = `<div class="card shadow-sm">
      <img src=${
        article.urlToImage
      } width="100%" height="225" alt= "Loading..." >
      <div class="card-body">
          <h4>${article.title.slice(0, 55)}...</h4>
          <h6>${article.source.name}</h6>
          <p class="card-text">${article.description.slice(0, 70)}...</p>
          <div class="d-flex justify-content-between align-items-center">
          <div class="btn-group">
              <button type="button" class="btn btn-sm btn-outline-secondary"> <a class = "aTag" href="${
                article.url
              }" target = "_blank">View</a></button>
          </div>
          <small class="text-muted">${time}</small>
          </div>
      </div>
      </div>`;
    card.classList.add('x')
  cardsBox.appendChild(card);
}

const homeButton = document.querySelector(".button-85");
homeButton.addEventListener("click", () => {
  fetchNews(1, "general");
});

fetchNews(1, "general", false);
function renderPagination(countPaginationNo, categoryValue) {
  paginationWrapper.innerHTML = "";
  for (let i = 0; i < countPaginationNo; i++) {
    const anchor = document.createElement("a");
    anchor.classList.add("page-link");
    anchor.innerHTML = i + 1;
    const pageItem = document.createElement("li");
    pageItem.classList.add("page-item");
    pageItem.appendChild(anchor);
    paginationWrapper.appendChild(pageItem);
    if (i === 0) {
      pageItem.classList.add("active");
    }
    pageItem.addEventListener("click", (e) => {
      const currPage = e.target.innerText;
      fetchNews(currPage, categoryValue, true);
      wrapper = Array.from(paginationWrapper.querySelectorAll("li"))
      console.log(wrapper);
      wrapper.forEach(item => {
        item.classList.remove("active");
      })
      pageItem.classList.add("active");
    });

  }

}

