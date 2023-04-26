$('.review-holder .review span').on('click', function(event){
  let quiz_id = $(this).parent().data('id');
  let stars;
  switch ($(this).data('description')) {
    case "hate it":
      stars = 1;
      break;
    case "don't like it":
      stars = 2;
      break;
  }

  $.ajax({
    url: '/quiz/' + quiz_id + '/feedback/' + stars,
    type: 'POST',
    success: function(data){
      alert('Juchei');
    },
    error: function(data){
      alert('error! in conrollerino');
    }
  });
});
