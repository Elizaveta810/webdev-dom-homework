import {comments, fetchAndRenderComments, user} from "../main.js";
import { renderLogin} from "./renderLogin.js";
import { postComment, token } from "./api.js";
import { format } from "date-fns";


const sanitizeHtml = (htmlString) => {
  return htmlString.replaceAll("<", "&lt;").replaceAll(">", "&gt;");};





export const renderComment = () => {
  const appElement = document.getElementById("app");
//Добавление Разметки списка комментариев(лента всех комментариев)
  const commentHtml = comments
    .map((comment, index) => {
      const createDate = format(new Date(comment.date), 'yyyy-MM-dd hh.mm.ss')
      return `<li class="comment" data-index="${index}">
  <div class="comment-header">
    <div>${comment.name}</div>
      <div>${createDate}</div>
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

    // Форма добавления комментария
    const formHtml = () => {
      if (!token) return btnLogin;
      return `
    <div id="add-form" class="add-form">
    <input type="text" id="name-input" class="add-form-name" value="${user.name}" readonly/> 
    <textarea type="textarea" id="textarea-input" class="add-form-text" placeholder="Введите ваш коментарий"
      rows="4"></textarea>
    <div class="add-form-row">
      <button id="add-button" class="add-form-button">Написать</button>
    </div>
  
  </div>
  <div id="add-comment" ></div>
  `
    }
  
    const btnLogin = `
  <p class="render-login-btn">  Чтобы добавить комментарий, <u>авторизуйтесь</u> </p>
  `
  //Активация кнопки АВТОРИЗИРУЙТЕСЬ
    function actionRenderLoginbtn() {
      if (token) return
      const btn = document.querySelector(".render-login-btn")
      btn.addEventListener('click', () => {
        renderLogin()
      })
    }
  
    const appHtml = `
      <div class="container">
      <ul id="list" class="comments">
  
  ${commentHtml}
      </ul>
     ${formHtml()}
    </div>
      `;
  
    appElement.innerHTML = appHtml;
  
    actionRenderLoginbtn();




// new comment

const addNewComment = () => {

  const textareaInputElement = document.getElementById("textarea-input");


  textareaInputElement.classList.remove("error");

  if (textareaInputElement.value === "") {
    textareaInputElement.classList.add("error");

    return;
  }


  const addForm = document.getElementById("add-form");
  const addComment = document.getElementById("add-comment");

  addForm.classList.add("hidden");

  addComment.innerHTML = "Элемент добавляется...";
  console.log(addComment.innerHTML);



  postComment({
    text: sanitizeHtml(textareaInputElement.value),

  })
    .then((response) => {
      if (response.status === 201) {

        fetchAndRenderComments()



        addForm.classList.remove("hidden");
        addComment.classList.add("hidden");
        textareaInputElement.value = '';

        return
      }
      if (response.status === 400) {
        return Promise.reject("вы ввели имя короче 3-х символов");
      }
      if (response.status === 500) {
        return Promise.reject("ошибка сервера");
      }
      return Promise.reject("сервер упал");

    })
    .catch((error) => {
      addForm.classList.remove("hidden");
      addComment.classList.add("hidden");
      alert(error);
      //todo:отправлять в систему сбора ошибок??
      console.warn(error);
    })

};

if (token) {
  const buttonElement = document.getElementById('add-button');

  buttonElement.addEventListener('click', addNewComment);
}

initLikeListeners();
initCommentListeners();

};






 //Счетчик лайков
const initLikeListeners = () => {
  const likeButtons = document.querySelectorAll(".like-button");
  for (const likeButton of likeButtons) {
    likeButton.addEventListener("click", (event) => {
      event.stopPropagation();
      if (!token) {
        alert ('Пожалуйста авторизируйтесь!')
        return
      }
      const index = likeButton.dataset.index;
      comments[index].likes += comments[index].isLiked ? -1 : +1;
      comments[index].isLiked = !comments[index].isLiked;

      renderComment();
    });
  }
};

//Цитата
const initCommentListeners = () => {
  const textareaInputElement = document.getElementById("textarea-input");
  const commentButtons = document.querySelectorAll(".comment");
  for (const commentButton of commentButtons) {
    commentButton.addEventListener("click", () => {
      const index = commentButton.dataset.index;
      textareaInputElement.value = `${comments[index].name}:\n ${comments[index].text}`;
    });
  }
};