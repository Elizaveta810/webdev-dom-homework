import {comments } from "../main.js";

const loadingCommentEl = document.getElementById("loadingComment");
const loadingTextEl = document.getElementById("loadingText");  
const listElement = document.getElementById("comments");
const form = document.getElementById("add-form");


//Счетчик лайков
const initLikeListeners = () => {
  const likeButtons = document.querySelectorAll(".like-button");
  for (const likeButton of likeButtons) {
    likeButton.addEventListener("click", (event) => {
      event.stopPropagation();
      const index = likeButton.dataset.index;
      comments[index].likes += comments[index].isLiked ? -1 : +1;
      comments[index].isLiked = !comments[index].isLiked;

      renderComment();
    });
  }
};

//Цитата
const initCommentListeners = () => {
  const textInputElement = document.getElementById("add-form-text");
  const commentButtons = document.querySelectorAll(".comment");
  for (const commentButton of commentButtons) {
    commentButton.addEventListener("click", () => {
      const index = commentButton.dataset.index;
      textInputElement.value = `${comments[index].name}:\n ${comments[index].text}`;
    });
  }
};


export const renderComment = () => {
 

  const commentHtml = comments
    .map((comment, index) => {
      return `<li class="comment" data-index="${index}">
  <div class="comment-header">
    <div>${comment.name}</div>
      <div>${comment.date}</div>
  </div>
    <div class="comment-body">
      <div class="comment-text">
        ${comment.text}
      </div>
    </div>
    <div class="comment-footer">
      <div class="likes">
        <span class="likes-counter">${comment.likes}</span>
        <button class="like-button ${
          comment.isLiked ? "-active-like" : ""
        }" data-index="${index}"></button>
      </div>
    </div>
</li>`;
    })
    .join("");

  loadingTextEl.style.display = "none"; // При загрузке ленты комментария, сообщение убирается
  loadingCommentEl.style.display = "none";
  form.style.display = "flex";

  listElement.innerHTML = commentHtml;
 // textInputElement.value = "";
 // nameInputElement.value = "";

  initLikeListeners();
  initCommentListeners();
};


 