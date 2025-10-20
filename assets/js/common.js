$(document).ready(function () {
  $('#header').load('./components/header.html');
  $('#footer').load('./components/footer.html');
});

$(document).ready(function () {
  // header
  $(document).on('click', function (e) {
    const $target = $(e.target);

    if ($('html').hasClass('kfsi--menu')) {
      if (
        !$target.closest('.kfsi-header-menu-wrap').length &&
        !$target.closest('.kfsi-header-menu__open').length
      ) {
        $('html').removeClass('kfsi--menu');
      }
    }
  });

  // snb
  $('.kfsi-snb-item-sub > .kfsi-snb-item').each(function () {
    if (!$(this).find('.hidden').length) {
      $(this).append('<span class="hidden">하위메뉴 접힘</span>');
    }
  });

  // 로드 시 active 상태 체크
  $('.kfsi-snb-item-sub').each(function () {
    const $sub = $(this);
    const $item = $sub.children('.kfsi-snb-item');
    const $status = $item.find('.hidden');

    if ($sub.hasClass('active')) {
      $status.text('하위메뉴 펼쳐짐');
    } else {
      $status.text('하위메뉴 접힘');
    }
  });

  // 클릭 이벤트
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
  $('.kfsi-nav ol li.active, .kfsi-test-nav ul li.active').each(function () {
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
  setTimeout(() => {
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
  }, 500);

  $(document).on('click', 'a[href="#kfsi-body"]', function (e) {
    const $container = $('.kfsi-contents').first();

    if ($container.length) {
      e.preventDefault();

      const focusable = $container
        .find(
          'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
        .filter(':visible');

      if (focusable.length) {
        focusable.first().focus();
      } else {
        if (!$container.attr('tabindex')) {
          $container.attr('tabindex', '-1');
        }
        $container.focus();
      }
    } else {
      // 기본 동작 유지 (#kfsi-body로 이동)
      // e.preventDefault() 호출 안 함
    }
  });

  $(function () {
    // #dropzone 내부의 small을 button으로 교체
    $('#dropzone small').each(function () {
      const text = $(this).text().trim();
      $(this).replaceWith(
        $('<button>', {
          type: 'button',
          id: 'dz-open',
          'aria-describedby': 'dz-instruction',
          text: text,
        })
      );
    });
  });

  //h1 수정
  $('.kfsi-contents-title h1').each(function () {
    // h1의 내용과 속성을 그대로 가져와서 h3로 교체
    var $h1 = $(this);
    var $h3 = $('<h3>').html($h1.html());

    // h1에 있던 속성이 있다면 복사
    $.each(this.attributes, function () {
      if (this.specified) {
        $h3.attr(this.name, this.value);
      }
    });

    $h1.replaceWith($h3);
  });

  //
  $(function () {
    const setTitle = () => $('.dz-hidden-input').attr('title', '첨부파일');
    setTitle(); // 초기

    const obs = new MutationObserver(() => setTitle());
    obs.observe(document.body, { childList: true, subtree: true });
  });

  //ico-remove
  $(function () {
    setTimeout(() => {
      $('.ico-remove').attr('tabindex', '0');
    }, 500);
  });

  //교육
  $(function () {
    // .btn01 → .kfsi-lecture-menu-index로 포커스
    $(document).on('click', '.kfsi-lecture-menu-list .btn01', function () {
      $('.kfsi-lecture-menu-index').attr('tabindex', '-1').focus();
    });

    // .btn02 → .kfsi-lecture-menu-state로 포커스
    $(document).on('click', '.kfsi-lecture-menu-list .btn02', function () {
      $('.kfsi-lecture-menu-state').attr('tabindex', '-1').focus();
    });

    // .kfsi-lecture-menu-index__head button → .btn01로 포커스
    $(document).on(
      'click',
      '.kfsi-lecture-menu-index__head button',
      function () {
        $('.kfsi-lecture-menu-list .btn01').focus();
      }
    );

    // .kfsi-lecture-menu-state__head → .btn02로 포커스
    $(document).on('click', '.kfsi-lecture-menu-state__head', function () {
      $('.kfsi-lecture-menu-list .btn02').focus();
    });
  });

  //
  $(function () {
    function updateActiveButtonTitles() {
      // 모든 버튼에서 title 제거
      $('.kfsi-training-head-category-item-button-item button').removeAttr(
        'title'
      );

      // active 된 버튼-item 안의 버튼에 title="선택됨" 추가
      $('.kfsi-training-head-category-item-button-item.active button').attr(
        'title',
        '선택됨'
      );
    }

    // 초기 적용
    updateActiveButtonTitles();

    // DOM class 변경 감지 → 자동 반영
    const observer = new MutationObserver(updateActiveButtonTitles);
    observer.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeFilter: ['class'],
    });

    // 혹시 동적 추가 대비 이벤트 기반 갱신도 추가
    $(document).on(
      'click change',
      '.kfsi-training-head-category-item button, input[type=radio][name=radio1]',
      function () {
        updateActiveButtonTitles();
      }
    );
  });
  $(function () {
    function updateActiveTabTitles() {
      // 모든 탭의 title 제거
      $('.kfsi-training-head-tab a').removeAttr('title');
      // active 탭에만 title="선택됨"
      $('.kfsi-training-head-tab a.active').attr('title', '선택됨');
    }

    // 초기 1회 적용
    updateActiveTabTitles();

    // 탭 클릭/변경 시 갱신 (기존 코드와 독립적으로 동작)
    $(document).on('click', '.kfsi-training-head-tab a', function () {
      // 기존 코드에서 active 토글한 뒤 호출되도록 약간 지연
      setTimeout(updateActiveTabTitles, 0);
    });

    // class 변경 등으로 active가 바뀌는 경우 자동 감지
    const observer = new MutationObserver(function () {
      updateActiveTabTitles();
    });
    observer.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeFilter: ['class'],
    });
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

//dropzone
// dropzone.a11y.patch.js  —  코어 다음(그리고 인스턴스 생성 전에) 로드
(function () {
  if (!window.Dropzone) return;

  // 자동 초기화로 인한 중복 붙임 방지 (전역 기본값)
  //Dropzone.autoDiscover = false;

  // 전역 기본 옵션(원하시면 조정)
  // ※ 비즈니스 제약(파일 1개 제한/허용 확장자 등)은 여기서도 통일 가능
  Dropzone.prototype.defaultOptions = Object.assign(
    {},
    Dropzone.prototype.defaultOptions,
    {
      // 메시지 현지화
      dictDefaultMessage: '파일을 이곳에 드래그하세요.',
      dictFallbackMessage:
        '이 브라우저는 드래그 앤 드롭 파일 업로드를 지원하지 않습니다.',
      dictFileTooBig:
        '파일 크기가 너무 큽니다 ({{filesize}}MB). 최대 크기: {{maxFilesize}}MB.',
      dictInvalidFileType: '이 파일 형식은 업로드할 수 없습니다.',
      dictResponseError: '서버에서 {{statusCode}} 에러가 발생했습니다.',
      dictCancelUpload: '업로드 취소',
      dictCancelUploadConfirmation: '이 업로드를 정말 취소하시겠습니까?',
      dictRemoveFile: '파일 삭제',
      dictMaxFilesExceeded: '더 이상 파일을 업로드할 수 없습니다.',
    }
  );

  // --- A11y 보조 유틸 ---
  function ensureLiveRegion(el) {
    // 각 Dropzone 폼 옆에 aria-live 영역이 없으면 삽입
    let live = el.parentNode.querySelector('.dz-a11y-live');
    if (!live) {
      live = document.createElement('div');
      live.className = 'dz-a11y-live';
      live.setAttribute('aria-live', 'polite');
      live.style.position = 'absolute';
      live.style.width = '1px';
      live.style.height = '1px';
      live.style.overflow = 'hidden';
      live.style.clip = 'rect(1px, 1px, 1px, 1px)';
      live.style.whiteSpace = 'nowrap';
      live.style.border = '0';
      live.style.padding = '0';
      live.style.margin = '-1px';
      // 폼 바로 뒤에 삽입
      el.insertAdjacentElement('afterend', live);
    }
    return live;
  }

  function announce(dz, msg) {
    try {
      const live = ensureLiveRegion(dz.element);
      live.textContent = msg;
    } catch (_) {}
  }

  function setIfMissing(el, name, val) {
    if (!el.hasAttribute(name)) el.setAttribute(name, val);
  }

  // 미리보기 엘리먼트 접근성 보강
  function enhancePreview(file) {
    const previewEl = file && file.previewElement;
    if (!previewEl) return;

    previewEl.setAttribute('role', 'listitem');
    previewEl.setAttribute('tabindex', '0');

    // 진행바
    const prog = previewEl.querySelector('.dz-progress');
    if (prog) {
      setIfMissing(prog, 'role', 'progressbar');
      setIfMissing(prog, 'aria-valuemin', '0');
      setIfMissing(prog, 'aria-valuemax', '100');
      setIfMissing(prog, 'aria-valuenow', '0');
    }

    // 삭제 버튼
    const removeBtn = previewEl.querySelector('.dz-remove');
    if (removeBtn) {
      if (removeBtn.tagName !== 'BUTTON') {
        // a 태그일 경우 키보드 가능하게 보정
        removeBtn.setAttribute('role', 'button');
        removeBtn.setAttribute('tabindex', '0');
      }
      // 파일명 포함 라벨
      if (file.name) {
        const label = `${file.name} 제거`;
        setIfMissing(removeBtn, 'aria-label', label);
        // title도 함께
        setIfMissing(removeBtn, 'title', label);
      }
    }

    // 썸네일 대체텍스트
    const img = previewEl.querySelector('[data-dz-thumbnail]');
    if (img && file.name) {
      if (!img.getAttribute('alt') || img.getAttribute('alt') === '') {
        img.setAttribute('alt', `${file.name} 미리보기 이미지`);
      }
    }
  }

  // Dropzone.init 확장: 폼 역할/키보드/안내문 자동 적용
  const _origInit = Dropzone.prototype.init;
  Dropzone.prototype.init = function () {
    _origInit.call(this);

    const el = this.element;

    // 드롭 영역 자체를 키보드 포커스 가능 + 의미 부여
    setIfMissing(el, 'role', 'button');
    setIfMissing(el, 'tabindex', '0');
    setIfMissing(
      el,
      'aria-label',
      '파일 업로드 영역. 파일을 드래그하거나 Enter/Space 키로 파일 선택 대화상자를 열 수 있습니다.'
    );

    // aria-describedby 연결 (안내문 없으면 삽입)
    let descId = el.getAttribute('aria-describedby');
    if (!descId) {
      const hint = document.createElement('p');
      descId = 'dz-a11y-desc-' + Math.random().toString(36).slice(2);
      hint.id = descId;
      hint.textContent =
        '파일을 드래그 앤 드롭하거나 Enter 또는 Space 키를 눌러 파일을 선택하세요.';
      // 시각 숨김
      hint.style.position = 'absolute';
      hint.style.width = '1px';
      hint.style.height = '1px';
      hint.style.overflow = 'hidden';
      hint.style.clip = 'rect(1px, 1px, 1px, 1px)';
      hint.style.whiteSpace = 'nowrap';
      hint.style.border = '0';
      hint.style.padding = '0';
      hint.style.margin = '-1px';
      el.insertAdjacentElement('afterbegin', hint);
      el.setAttribute('aria-describedby', descId);
    }

    // 키보드로 파일 선택 열기
    el.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Spacebar' || e.key === 'Enter') {
        e.preventDefault();
        // Dropzone 내부 숨김 input 트리거
        const input =
          this.hiddenFileInput || el.querySelector('input[type=file]');
        if (input) input.click();
      }
    });

    // 포커스 가시화(간단 클래스 토글; CSS는 프로젝트 공통 CSS에서 처리)
    el.addEventListener('focus', () => el.classList.add('is-focused'));
    el.addEventListener('blur', () => el.classList.remove('is-focused'));

    // 미리보기 컨테이너가 <ul>이면 role=list 지정
    try {
      const previewsContainer = this.getExistingFallback()
        ? null
        : this.previewsContainer;
      if (previewsContainer && previewsContainer.tagName === 'UL') {
        setIfMissing(previewsContainer, 'role', 'list');
        setIfMissing(previewsContainer, 'aria-label', '업로드 파일 목록');
      }
    } catch (_) {}

    // 이벤트 훅으로 라이브 영역 안내 + aria 업데이트
    this.on('addedfile', (file) => {
      enhancePreview(file);
      announce(this, `파일 추가: ${file.name || '알 수 없는 파일'}`);
    });

    this.on('uploadprogress', (file, progress /*, bytesSent */) => {
      const previewEl = file.previewElement;
      const prog = previewEl && previewEl.querySelector('.dz-progress');
      if (prog) prog.setAttribute('aria-valuenow', Math.round(progress || 0));
      if (progress === 100) {
        announce(this, `${file.name} 업로드 처리 중`);
      }
    });

    this.on('success', (file) => {
      announce(this, `업로드 성공: ${file.name}`);
    });

    this.on('error', (file, msg) => {
      announce(
        this,
        `업로드 실패: ${file && file.name ? file.name + '. ' : ''}오류: ${msg}`
      );
    });

    this.on('removedfile', (file) => {
      announce(this, `파일 제거: ${file.name}`);
      // 제거 후 드롭영역으로 포커스 복귀(선호 시)
      try {
        el.focus();
      } catch (_) {}
    });

    // 미리보기 리스트에서 Delete/Backspace로 삭제
    if (this.previewsContainer) {
      this.previewsContainer.addEventListener('keydown', (e) => {
        const focused = document.activeElement;
        if (
          !focused ||
          !focused.classList ||
          !focused.classList.contains('dz-file-preview')
        )
          return;
        if (e.key === 'Delete' || e.key === 'Backspace') {
          e.preventDefault();
          const removeBtn = focused.querySelector('.dz-remove');
          if (removeBtn) removeBtn.click();
        }
        if (e.key === 'Escape') {
          e.preventDefault();
          try {
            el.focus();
          } catch (_) {}
        }
      });
    }
  };
})();
