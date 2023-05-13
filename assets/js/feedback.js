
$( document ).ready(() => {

  $('.review-holder .review span').on('load', function(event){
    let averageStars = $(this).parent().data('averageStars');

    $('.review-holder .review span').each({
      function() {
        $(this).addClass('selected');  
      }
    });
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
        alert(data);
      },
      error: function(data){
        alert('error! in conrollerino');
      }
    });
  });
});
