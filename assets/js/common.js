// responsive config
var $win = $(window);

$win.on('load resize', function() {  
  if (window.matchMedia('(max-width: 1250px)').matches) {
    // SPの処理
  } else if (window.matchMedia('(max-width: 800px)').matches) {
    // TABの処理
  } else {
    // PCの処理
  }
});

// fullpage.js
function fullPage() {
  var $target = $('#js-fullpage');
  $target.fullpage({
    easing: 'easeOut',
    scrollingSpeed: 500,
    anchors: ['top', 'reile', 'about', 'contact'],
    navigation: true,
    navigationPosition: 'left',
    animateAnchor: false
  });
}
$(function() {
  fullPage();
});
$(function menu(){
  $('.js-menuBtn').on('click', function() {
    $('.menuIcon').toggleClass('js-open');
    $('.global-nav').toggleClass('js-open');
  });
});

// トランジションをページ別に分ける
var topTransition = Barba.BaseView.extend({
  namespace: 'top',
  onEnter: function() {
    Barba.Pjax.getTransition = function() {
      return PageTransitionTop;
    };
  },
  onEnterCompleted: function() {
      // このページのトランジションが完了した時。
  },
  onLeave: function() {
      // 次のページへのトランジションが始まった時。
  },
  onLeaveCompleted: function() {
      // このページのcontainerが完全に削除された時。
    $.fn.fullpage.destroy('all');
  }
});
topTransition.init();

// 下層ページ
var underLayer = Barba.BaseView.extend({
  namespace: 'underlayer',
  onEnter: function() {
    Barba.Pjax.getTransition = function() {
      return PageTransitionUnder;
    };
  },
  onEnterCompleted: function() {
  },
  onLeave: function() {
  },
  onLeaveCompleted: function() {
      // このページのcontainerが完全に削除された時。
      // var indicatorVisible = anime.timeline({
      //   duration: 500,
      //   easing: 'easeInOutCubic'
      // }).add({
      //   targets: '.section',
      //   background: 'none',
      //   offset: '-=500'
      // }).add({
      //   targets: '.page-num p',
      //   translateY: [100 + '%', 0],
      //   translateZ: 0,
      //   offset: '-=500'
      // }).add({
      //   targets: '#fp-nav ul',
      //   translateY: [100 + '%', 0],
      //   translateZ: 0,
      //   offset: '-=500'
      // });
      // indicatorVisible.play();
      var test = anime({
        targets: '#fp-nav',
        opacity: [0,1],
        duration: 500,
        delay: 1000
      });
      test.play();
      fullPage();
  }
});
underLayer.init();

// transition
var PageTransitionTop = Barba.BaseTransition.extend({
  start: function() {
    this.open(500)
      .then(this.newContainerLoading)
      .then(this.finish.bind(this));
  },
  open: function(timer) {
    return new Promise( function (resolve) {
      var openAnime = anime.timeline({
        duration: 500,
        easing: 'easeInOutCubic'
      })
      .add({
        targets: '.active .image',
        width: [53.125 + '%', 60.677 + '%'],
        height: [74.81 + '%', 100 + 'vh'],
        marginRight: [8 + '%', 0],
      }).add({
        targets: '.section',
        background: '#020b16',
        offset: '-=500'
      }).add({
        targets: '.page-num p',
        translateY: [0,100 + '%'],
        translateZ: 0,
        offset: '-=500'
      }).add({
        targets: '#fp-nav ul',
        translateY: [0,100 + '%'],
        translateZ: 0,
        offset: '-=500'
      });
      openAnime.play();
      console.log('top');
      setTimeout(function () {
        resolve();
      }, timer);
    });
  },
  finish: function() {
    this.done();
  }
});
  
var PageTransitionUnder = Barba.BaseTransition.extend({
  start: function() {
    this.close(500)
      .then(this.newContainerLoading)
      .then(this.finish.bind(this));
  },
  close: function(timer) {
    return new Promise( function (resolve) {
      var closeAnime = anime.timeline({
        duration: 500,
        easing: 'easeInOutCubic'
      }).add({
        targets: '.page-top .image',
        width: [60.677 + '%', 53.125 + '%'],
        height: [100 + 'vh', 74.81 + '%'],
        marginRight: [0, 8 + '%']
      });
      closeAnime.play();
      console.log('under');
      setTimeout(function () {
        resolve();
      }, timer);
    });
  },
  finish: function() {
    this.done();
  }
});



// アンカーリンク対応
Barba.Pjax.originalPreventCheck = Barba.Pjax.preventCheck;
Barba.Pjax.preventCheck = function(evt, element) {
    if ($(element).attr('href') && $(element).attr('href').indexOf('#') > -1)
        return true;
    else
        return Barba.Pjax.originalPreventCheck(evt, element)
};
// リンクがクリックされた時
Barba.Dispatcher.on('linkClicked', function() {
  // if($('#js-fullpage').length){
  //   setTimeout(function(){
  //       $.fn.fullpage.destroy('all');
  //   },550);
  // }
});
// TOPに戻る時
Barba.Dispatcher.on('transitionCompleted', function() {
  // if ($('#js-fullpage').length) {
  //     fullPage();
  // }
});

$(function(){
  Barba.Prefetch.init();
  Barba.Pjax.start();
});