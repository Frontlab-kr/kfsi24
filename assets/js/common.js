$(document).ready(function () {
  $('#header').load('./components/header.html');
  $('#footer').load('./components/footer.html');
});

$(document).ready(function () {
  //snb
  $('.kfsi-snb-item-sub > .kfsi-snb-item').each(function () {
    if (!$(this).find('.hidden').length) {
      $(this).append('<span class="hidden">하위메뉴 접힘</span>');
    }
  });

  $('.kfsi-snb-item-sub > .kfsi-snb-item').on('click', function () {
    const $sub = $(this).parent('.kfsi-snb-item-sub');
    const $status = $(this).find('.hidden');

    $sub.toggleClass('active');

    if ($sub.hasClass('active')) {
      $status.text('하위메뉴 펼쳐짐');
    } else {
      $status.text('하위메뉴 접힘');
    }

    return false;
  });

  //약관동의 접근성
  // 초기 세팅: active li에 hidden span 삽입
  $('.kfsi-nav ol li.active').each(function () {
    if (!$(this).find('.hidden').length) {
      $(this).append('<span class="hidden">현재 진행중인 단계</span>');
    }
  });

  //아이콘 접근성
  $(function () {
    $('.ico-lock').each(function () {
      if (!$(this).find('.hidden').length) {
        $(this).append('<span class="hidden">게시글 잠김</span>');
      }
    });

    $('.ico-lock-off').each(function () {
      if (!$(this).find('.hidden').length) {
        $(this).append('<span class="hidden">게시글 열림</span>');
      }
    });

    $('span.text-danger').each(function () {
      // 안의 텍스트가 '*'만 있는 경우
      if ($(this).text().trim() === '*' && !$(this).find('.hidden').length) {
        $(this).append('<span class="hidden">필수입력 항목</span>');
      }
    });
  });

  //active 접근성
  $(function () {
    // 탭 트리거를 넓게 잡아준다 (data-API가 없더라도 .nav-link 클릭은 잡힘)
    const TRIGGER =
      '.nav-link, [data-bs-toggle="tab"], [data-bs-toggle="pill"]';

    function updateTitles() {
      const $tabs = $(TRIGGER);
      $tabs.removeAttr('title');
      // 활성 탭은 .active 또는 aria-selected="true" 로 판단
      $tabs.filter('.active, [aria-selected="true"]').attr('title', '선택됨');
    }

    // 초기 1회
    updateTitles();

    // 1) 부트스트랩 이벤트(있다면 여기서 1차로 갱신)
    $(document).on('shown.bs.tab', TRIGGER, function () {
      // console.log('shown.bs.tab', this);
      updateTitles();
    });

    // 2) 클릭 Fallback (data-bs-toggle이 없어도 동작)
    $(document).on('click', TRIGGER, function () {
      // console.log('click', this);
      // 부트스트랩이 활성화 클래스를 반영한 뒤에 실행되도록
      setTimeout(updateTitles, 0);
    });

    // 3) 동적 생성 Fallback: 탭 트리거가 나중에 붙는 경우도 대비
    const mo = new MutationObserver(() => {
      updateTitles();
    });
    mo.observe(document.body, { childList: true, subtree: true });
  });

  $(function () {
    // 모든 title 초기화
    $('.kfsi-snb-item, .kfsi-snb-item-sub-item').removeAttr('title');

    // 1뎁스 active에 title 추가
    $('.kfsi-snb-item-sub.active > .kfsi-snb-item').attr('title', '선택됨');

    // 2뎁스 active에 title 추가
    $('.kfsi-snb-item-sub-item.active').attr('title', '선택됨');

    // 단일 .kfsi-snb-item.active (ex. 로그인)에 title 추가
    $('.kfsi-snb-item.active').attr('title', '선택됨');

    // 모든 pagination에서 active 항목 처리
    $('.pagination .page-item.active .page-link')
      .attr('title', '현재 페이지')
      .parent('.page-item')
      .attr('aria-current', 'page');
  });
  $(function () {
    // 함수: target="_blank" 링크에 title 추가
    function addNewWindowTitle($scope) {
      $scope.find('a[target="_blank"]').each(function () {
        const $link = $(this);
        if (!$link.attr('title')) {
          $link.attr('title', '새창으로 열립니다.');
        }
      });
    }

    // 초기 실행 (페이지 로드 시)
    addNewWindowTitle($(document));

    // 동적 변경 감시
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        if (m.addedNodes.length) {
          $(m.addedNodes).each(function () {
            const $node = $(this);
            if ($node.is('a[target="_blank"]')) {
              // 추가된 a 태그일 경우
              if (!$node.attr('title')) {
                $node.attr('title', '새창으로 열립니다.');
              }
            } else if ($node.find) {
              // 추가된 요소 내부에 a[target="_blank"]가 있는 경우
              addNewWindowTitle($node);
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });

  //탭 접근성
  // 모든 탭을 Tab 순서에 포함시키기: tabindex를 항상 0으로 유지
  $(function () {
    const $tabs = $('[data-bs-toggle="tab"][role="tab"]');

    // 초기화
    $tabs.attr('tabindex', '0');

    // 부트스트랩이 탭 변경 시 비활성 탭에 -1을 다시 넣는 것을 방지
    $tabs.on('shown.bs.tab hidden.bs.tab', function () {
      $tabs.attr('tabindex', '0');
    });

    // 접근성 보강(선택): Space/Enter로 활성화 보장
    $tabs.on('keydown', function (e) {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        $(this).tab('show');
      }
    });
  });
  $(function () {
    $('.tab-pane[role="tabpanel"]').removeAttr('tabindex');
  });

  $(document).on('click', 'a[href="#kfsi-body"]', function (e) {
    e.preventDefault();

    const $container = $('.kfsi-contents').first();

    if ($container.length) {
      // 포커스 가능한 요소 선택자
      const focusable = $container
        .find(
          'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
        .filter(':visible');

      if (focusable.length) {
        focusable.first().focus();
      } else {
        // 내부에 포커스 가능한 요소가 없으면 container에 포커스
        if (!$container.attr('tabindex')) {
          $container.attr('tabindex', '-1');
        }
        $container.focus();
      }
    }
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

  // 모든 data-bs-toggle="tooltip" 요소 초기화
  const tooltipTriggerList = document.querySelectorAll(
    '[data-bs-toggle="tooltip"]'
  );
  tooltipTriggerList.forEach(function (tooltipTriggerEl) {
    new bootstrap.Tooltip(tooltipTriggerEl);
  });
});
