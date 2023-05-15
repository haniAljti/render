
$( document ).ready(() => {

  let averageStars = $('.review-holder .review').data('averagestars');
  let count = 0;
  $('.review-holder .review span').each(function(){
    if(count < averageStars){
      $(this).toggleClass('selected');
      count++;
    }
  });

  $('.review-holder .review span').on('click', function(event){
    let quiz_id = $(this).parent().data('id');
    let stars;
    switch ($(this).data('description')) {
      case 'hate it':
        stars = 1;
        break;
      case 'don\'t like it':
        stars = 2;
        break;
      case 'it\'s ok':
        stars = 3;
        break;
      case 'it\'s good':
        stars = 4;
        break;
      case 'it\'s great':
        stars = 5;
        break;
    }

    $.ajax({
      url: '/quiz/' + quiz_id + '/feedback/' + stars,
      type: 'POST',
      success: function(data){
        location.reload();
      },
      error: function(data){
        alert('error! in conrollerino');
      }
    });
  });
});
