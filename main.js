import { getComments} from "./components/api.js";
import { formDataComment } from "./components/formDataComment.js";
import { renderComment } from "./components/render.js";

export let user = null;
export const setUser = (newUser) => {
    user = newUser;
};
  
  //Массив обьектов

  export let comments = [];


//Получаем с API комментарии

export const fetchAndRenderComments = () => {
  getComments()
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
  comments = newComments;
  renderComment();
});
}
fetchAndRenderComments();