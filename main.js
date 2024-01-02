   import { getComments, postCommet } from "./components/api.js";
  
  
  //Объявляем переменные
  
  const commentsElement = document.getElementById("comments");
  const addFormButtonElement = document.getElementById("add-form-button");
  const nameInputElement = document.getElementById("add-form-name");
  const textInputElement = document.getElementById("add-form-text");
  const form = document.getElementById("add-form");
  
  
  const loadingCommentEl = document.getElementById("loadingComment");
  

  loadingCommentEl.style.display = "none"; //При первоначальной загрузке страницы, сообщение "Комментарий добавляется" -> ОТКЛЮЧАЕМ!!!

  //Массив обьектов

  export let comments = [
    /*{
        name: "Глеб Фокин",
        date: "12.02.22 12:18",
        text: "Это будет первый комментарий на этой странице",
        likeCounter: 3,
        isLiked: true,
      },

      {
        name: "Варвара Н.",
        date: "13.02.22 19:22",
        text: "Мне нравится как оформлена эта страница! ❤",
        likeCounter: 75,
        isLiked: false,
      },*/
  ];

 export const setComments = (newComments) => {
    comments = newComments

  }

  //ДАТА, мой первый вариант

  /* let currentDate = new Date();
  let zero = (n) => {
    return n < 10 ? `0${n}` : n;
  };

  const formDate = (currentDate) => {
    return `${zero(currentDate.getDate())}.${zero(
      currentDate.getMonth() + 1
    )}.${currentDate.getFullYear() % 100} ${zero(
      currentDate.getHours()
    )}:${zero(currentDate.getMinutes())}`;
    /*zero(currentDate.getDate()) + "." + zero(currentDate.getMonth() + 1) + "." + currentDate.getFullYear() % 100 + " " +
      zero(currentDate.getHours()) + ":" + zero(currentDate.getMinutes())
  }; */

  //Еще один вариант ДАТЫ

  /*  const formatDateTime = (date) => {
    let dateTime = new Date(date);
    const day = String(dateTime.getDate()).padStart(2, "0");
    const month = String(dateTime.getMonth()).padStart(2, "0");
    const year = String(dateTime.getFullYear() - 2000);
    const minutes = String(dateTime.getMinutes()).padStart(2, "0");
    const hours = String(dateTime.getHours()).padStart(2, "0");
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  };
*/

   //При клике на кнопку НАПИСАТЬ, форму ввода комментария убираем, а ЛОАДЕР загрузки включаем
  addFormButtonElement.addEventListener("click", () => {
    loadingCommentEl.style.display = "block";
    form.style.display = "none";

    //Безопастное введение replace
   postCommet(nameInputElement, textInputElement, addFormButtonElement);
  });

 

  //Функция, что поля ввода имени не пустые

const initImputValidate = (nameInputElement, textInputElement) => {
  nameInputElement.addEventListener("input", () => {
    if (nameInputElement.value === "" || textInputElement.value === "") {
      addFormButtonElement.classList.add("empty");
      addFormButtonElement.disabled = true;
    } else if (
      nameInputElement.value !== "" &&
      textInputElement.value !== ""
    ) {
      addFormButtonElement.classList.remove("empty");
      addFormButtonElement.disabled = false;
    }
  });

  textInputElement.addEventListener("input", () => {
    if (textInputElement.value === "" || nameInputElement.value === "") {
      addFormButtonElement.classList.add("empty");
      addFormButtonElement.disabled = true;
    } else if (
      textInputElement.value !== "" &&
      nameInputElement.value !== ""
    ) {
      addFormButtonElement.classList.remove("empty");
      addFormButtonElement.disabled = false;
    }
  });
}
initImputValidate(nameInputElement, textInputElement);
  
getComments();