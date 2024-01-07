export const formDataComment = (commentDate) => {
  const dateComment = new Date(commentDate);
 const formatDate =
   dateComment.getDate().toString().padStart(2, '0') + '.' +
   (dateComment.getMonth() + 1).toString().padStart(2, '0') + '.' +
   dateComment.getFullYear().toString().slice(-2) + ' ' +
   dateComment.getHours().toString().padStart(2, '0') + ':' +
   dateComment.getMinutes().toString().padStart(2, '0');
   return formatDate
}