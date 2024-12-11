$(document).ready(function () {
  $('#header').load('./components/header.html');
  $('#footer').load('./components/footer.html');
});

$(document).ready(function () {
  //snb
  $('.kfsi-snb-item-sub .kfsi-snb-item').on('click', function () {
    $(this).parents('.kfsi-snb-item-sub').toggleClass('active');
    return false;
  });

  // $('.kfsi-datepicker').datepicker({
  //   language: 'ko',
  //   format: 'yyyy/mm/dd',
  //   autoclose: true,
  // });
  //main

  $('.kfsi-main-search-popular-mo').on('click', function (e) {
    e.stopPropagation(); // 이벤트 버블링 방지
    $('.kfsi-main-search-popular-mo').toggleClass('active');
  });

  $(document).on('click', function (e) {
    if (
      !$('.kfsi-main-search-popular-mo').is(e.target) &&
      $('.kfsi-main-search-popular-mo').has(e.target).length === 0
    ) {
      $('.kfsi-main-search-popular-mo').removeClass('active');
    }
  });
});
// $('div.dropzone').dropzone({
//   url: 'https://httpbin.org/post',
//   method: 'post',
// });
