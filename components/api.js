import { renderComment } from "./render.js";
import { comments, setComments } from "../main.js";



let urlApi = "https://wedev-api.sky.pro/api/v1/zudina/comments";

const formDataComment = (commentDate) => {
       const dateComment = new Date(commentDate);
      const formatDate =
        dateComment.getDate().toString().padStart(2, '0') + '.' +
        (dateComment.getMonth() + 1).toString().padStart(2, '0') + '.' +
        dateComment.getFullYear().toString().slice(-2) + ' ' +
        dateComment.getHours().toString().padStart(2, '0') + ':' +
        dateComment.getMinutes().toString().padStart(2, '0');
        return formatDate
     }


export function getComments() {
  let fetchPromise = fetch(urlApi, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .then((responseData) => {
      const newComments = responseData.comments.map((comment) => {
        return {
          name: comment.author.name,
          date: formDataComment(comment.date),
          id: comment.id,
          isLiked: comment.isLiked,
          likes: comment.likes,
          text: comment.text,
        };
      });
      setComments(newComments);
      renderComment();
    });
}

export const postCommet = (nameInputElement, textInputElement, addFormButtonElement) => {
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
     const newComments = responseData.comments
     setComments(newComments);
      addFormButtonElement.disabled = false;
      textInputElement.value = "";
      nameInputElement.value = "";
      getComments();
    })
   
     .catch((error) => {
      addFormButtonElement.disabled = false;
      if (error.message === "Неверный запрос") {
        console.warn("Имя и комментарий должны быть не короче 3 символов");
      //  return
      } if (error.message === "Сервер упал") {
        console.warn("Кажется, что-то пошло не так, попробуйте позже");
        getComments();
      }  if (error.message === "Failed to fetch") {
        console.warn("Кажется, сломался интернет, попробуйте позже");
       
      } 
             
      renderComment();
    })

}