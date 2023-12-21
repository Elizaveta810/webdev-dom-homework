  //Объявляем переменные

  const commentsElement = document.getElementById("comments");
  const addFormButtonElement = document.getElementById("add-form-button");
  const nameInputElement = document.getElementById("add-form-name");
  const textInputElement = document.getElementById("add-form-text");
  const form = document.getElementById("add-form");
  const listElement = document.getElementById("comments");
  let urlApi = "https://wedev-api.sky.pro/api/v1/zudina/comments";
  const loadingCommentEl = document.getElementById("loadingComment");
  const loadingTextEl = document.getElementById("loadingText");

  loadingCommentEl.style.display = "none"; //При первоначальной загрузке страницы, сообщение "Комментарий добавляется" -> ОТКЛЮЧАЕМ!!!

  //Массив обьектов

  let comments = [
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

  //Новый формат ДАТЫ

  const formatDateTime = new Date();
  const formatDate =
    formatDateTime.getDate().toString().padStart(2, "0") +
    "." +
    (formatDateTime.getMonth() + 1).toString().padStart(2, "0") +
    "." +
    formatDateTime.getFullYear().toString().slice(-2) +
    " " +
    formatDateTime.getHours().toString().padStart(2, "0") +
    ":" +
    formatDateTime.getMinutes().toString().padStart(2, "0");

  // GET запрос. Возвращает сохраненную на сервере строку.

  function getComments() {
    let fetchPromise = fetch(urlApi, {
      method: "GET",
    })
      .then((response) => {
        return response.json();
      })
      .then((responseData) => {
        comments = responseData.comments.map((comment) => {
          return {
            name: comment.author.name,
            date:
              formatDateTime.getDate().toString().padStart(2, "0") +
              "." +
              (formatDateTime.getMonth() + 1).toString().padStart(2, "0") +
              "." +
              formatDateTime.getFullYear().toString().slice(-2) +
              " " +
              formatDateTime.getHours().toString().padStart(2, "0") +
              ":" +
              formatDateTime.getMinutes().toString().padStart(2, "0"),
            id: comment.id,
            isLiked: comment.isLiked,
            likes: comment.likes,
            text: comment.text,
          };
        });
        console.log(comments);
        renderComment();
      });
  }

  //При клике на кнопку НАПИСАТЬ, форму ввода комментария убираем, а ЛОАДЕР загрузки включаем
  addFormButtonElement.addEventListener("click", () => {
    loadingCommentEl.style.display = "block";
    form.style.display = "none";

    //Безопастное введение replace
    const protectinHtml = (string) => {
      return string
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll("&", "&amp;")
        .replaceAll('"', "&quot;");
    };

    // POST запрос. Сохраняет переданную строку на сервер.
    return fetch(urlApi, {
      method: "POST",
      body: JSON.stringify({
        name: protectinHtml(nameInputElement.value),
        text: protectinHtml(textInputElement.value),
        forceError: true,
      }),
    })
      .then((response) => {
        console.log(response);
          if (response.status === 201) {
          return response.json();            
        }
         if (response.status === 400) {
          throw new Error("Неверный запрос");
        }
        if (response.status === 500) {
          throw new Error("Сервер упал");
        }
        //return response.json();
      })
       .then((responseData) => {
        comments = responseData.comments
        addFormButtonElement.disabled = false;
        textInputElement.value = "";
        nameInputElement.value = "";
        getComments();
      })
     
       .catch((error) => {
        addFormButtonElement.disabled = false;
        if (error.message === "Неверный запрос") {
          alert("Имя и комментарий должны быть не короче 3 символов");
        //  return
        } if (error.message === "Сервер упал") {
          //alert("Кажется, что-то пошло не так, попробуйте позже");
          getComments();
        }  if (error.message === "Failed to fetch") {
          alert("Кажется, сломался интернет, попробуйте позже");
         
        } 
               
        renderComment();
      })
  });

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
    const commentButtons = document.querySelectorAll(".comment");
    for (const commentButton of commentButtons) {
      commentButton.addEventListener("click", () => {
        const index = commentButton.dataset.index;
        textInputElement.value = `${comments[index].name}:\n ${comments[index].text}`;
      });
    }
  };

  //Проверка, что поля ввода имени не пустые

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

  //Рендер коментария

  const renderComment = () => {
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

  /*//Кнопка Enter
    form.addEventListener("keyup", (e) => {
      if (e.code === "Enter") addNewComment();
    });*/

  getComments();