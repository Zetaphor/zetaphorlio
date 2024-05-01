document.addEventListener('DOMContentLoaded', () => {
  const articles = document.querySelectorAll('.project-item');
  const tagContainer = document.getElementById('tag-container');
  const keywordInput = document.getElementById('keyword-input');
  const resultsCountElement = document.getElementById('results-count');
  let allTags = new Set();
  let activeTag = null;

  // Extract unique tags from articles
  articles.forEach(article => {
    const tags = article.querySelectorAll('.tags span');
    tags.forEach(tag => allTags.add(tag.textContent.trim()));
  });

  // Display unique tags as clickable elements
  allTags.forEach(tag => {
    const tagElement = document.createElement('button');
    tagElement.textContent = tag;
    tagElement.onclick = () => {
      if (activeTag === tag) {
        setActiveTag(null);
        filterArticles(null, null);
      } else {
        setActiveTag(tag);
        filterArticles(null, tag);
      }
    };
    tagContainer.appendChild(tagElement);
  });

  // Reset Button
  const resetButton = document.createElement('button');
  resetButton.textContent = 'Reset Filter';
  resetButton.classList.add('reset-button');
  resetButton.onclick = () => {
    setActiveTag(null);
    keywordInput.value = '';
    filterArticles(null, null);
  };
  keywordInput.insertAdjacentElement('afterend', resetButton);

  // Keyword filter event
  keywordInput.addEventListener('input', (e) => {
    setActiveTag(null);
    filterArticles(e.target.value, null);
  });

  function setActiveTag(tag) {
    activeTag = tag;
    Array.from(tagContainer.children).forEach(child => {
      if (child.tagName.toLowerCase() === 'button') {
        child.classList.toggle('active', child.textContent === tag);
      }
    });
  }


  function sortArticles() {
    const articlesContainer = document.getElementById('articles-container');
    const articles = Array.from(articlesContainer.querySelectorAll('.project-item'));

    articles.sort((a, b) => {
      // Extract date strings
      const dateA = new Date(a.querySelector('.date').textContent.replace('First Commit: ', ''));
      const dateB = new Date(b.querySelector('.date').textContent.replace('First Commit: ', ''));

      // Sort from newest to oldest
      return dateB - dateA;
    });

    // Clear the container and append sorted articles
    articlesContainer.innerHTML = '';
    articles.forEach(article => articlesContainer.appendChild(article));
  }



  function updateResultsCount() {
    const visibleArticles = Array.from(articles).filter(article => article.style.display !== 'none');
    resultsCountElement.textContent = `Total Results: ${visibleArticles.length}`;
  }

  function filterArticles(keyword, tag) {
    articles.forEach(article => {
      const title = article.querySelector('.project-title').textContent.toLowerCase();
      const description = article.querySelector('.description').textContent.toLowerCase();
      const tags = Array.from(article.querySelectorAll('.tags span')).map(span => span.textContent.toLowerCase());

      if (keyword && !title.includes(keyword.toLowerCase()) && !description.includes(keyword.toLowerCase())) {
        article.style.display = 'none';
      } else if (tag && !tags.includes(tag.toLowerCase())) {
        article.style.display = 'none';
      } else {
        article.style.display = '';
      }
    });
    updateResultsCount();
  }

  sortArticles();
  updateResultsCount();
});
