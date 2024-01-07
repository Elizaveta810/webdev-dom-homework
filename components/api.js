let urlApi = "https://wedev-api.sky.pro/api/v2/zudina/comments";
const userUrl = "https://wedev-api.sky.pro/api/user/login";
const userUrlReg = "https://wedev-api.sky.pro/api/user";



     export let token = null;
     export const setToken = (newToken) => {
         token = newToken;
     };

export function getComments() {
  return fetch(urlApi, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
  },
})
    .then((response) => {
      return response.json();
    })
    
}

export function postComment({ text }) {
  return fetch(urlApi,
      {
          method: "POST",
          headers: {
              Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
              text: text,

          }),
      })
}

//Функция, которая проверяет верно ли правильно логин и пароль 
export function login({ login, password }) {
  return fetch(userUrl, {
      method: "POST",
      body: JSON.stringify({
          login,
          password,
      }),
  }).then((response) => {
      if (response.status === 201) {
          return response.json();
      }
      if (response.status === 400) {
          return Promise.reject("вы ввели не верный логин или пароль");
      }
      if (response.status === 500) {
          return Promise.reject("ошибка сервера");
      }
      return Promise.reject("сервер упал");

  })
      .catch((error) => {
          alert(error);
          //todo:отправлять в систему сбора ошибок??
          console.warn(error);
      })
};


//Функция регистрации нового пользователя
export function register({ login, name, password }) {
  return fetch(userUrlReg, {
      method: "POST",
      body: JSON.stringify({
          login,
          name,
          password,
      }),
  }).then((response) => {
      if (response.status === 201) {
          console.log("регистрация прошла успешно");
          //отрисуй страницу комментариев с формой ввода комментария
          return response.json();
      }
      if (response.status === 400) {
          return Promise.reject("пользователь с таким логином уже существует");
      }
      if (response.status === 500) {
          return Promise.reject("ошибка сервера");
      }
      return Promise.reject("сервер упал");

  })
      .catch((error) => {
          alert(error);
          //todo:отправлять в систему сбора ошибок??
          console.warn(error);
      })
};