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

  //textarea
  // 최대 글자 수 설정
  const maxCharCount = 4000;

  // 공통으로 적용: .char-count 클래스가 있는 textarea에 이벤트 바인딩
  $('.kfsi-textarea .form-control').on('input', function () {
    const textArea = $(this);
    const text = textArea.val();
    let charCount = 0;

    // 문자별 바이트 계산 (한글 2바이트, 영문 1바이트)
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      charCount += charCode > 127 ? 2 : 1; // 한글은 2바이트, 영문은 1바이트
      if (charCount > maxCharCount) {
        break; // 최대 바이트 수 초과시 중단
      }
    }

    // 초과된 경우 문자열 자르기
    if (charCount > maxCharCount) {
      let newText = '';
      let newCharCount = 0;
      for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i);
        const charSize = charCode > 127 ? 2 : 1;
        if (newCharCount + charSize > maxCharCount) break;
        newText += text[i];
        newCharCount += charSize;
      }
      textArea.val(newText); // 수정된 텍스트 적용
      charCount = newCharCount; // 글자 수 갱신
    }

    // 글자 수 업데이트
    textArea.closest('.kfsi-textarea').find('strong').text(charCount);
  });
});
