// トランジションをページ別に分ける
var topTransition = Barba.BaseView.extend({
  namespace: 'top',
  onEnter: function() {
      // このページのcontainerが読み込みを開始した時。
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
  },
  onEnterCompleted: function() {
  },
  onLeave: function() {
    fullPage();
  },
  onLeaveCompleted: function() {
      // このページのcontainerが完全に削除された時。
      fullPage();
  }
});
underLayer.init();

// transition
var PageTransition = Barba.BaseTransition.extend({
    start: function() {
      this.shutter(500)
        .then(this.newContainerLoading)
        .then(this.finish.bind(this));
    },
    shutter: function(timer) {
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
        setTimeout(function () {
          resolve();
        }, timer);
      });
    },
    finish: function() {
      this.done();
    }
  });
  Barba.Pjax.getTransition = function() {
    return PageTransition;
  };
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