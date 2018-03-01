// responsive config
var $win = $(window);
var fpnav = {};
$win.on('load resize', function() {  
  fpnav = {
    y: 0,
    x: -100 + '%'
  };
  if (window.matchMedia('(max-width: 800px)').matches) {
    fpnav = {
      y: 100 + '%',
      x: 0
    };
  } else {

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
    animateAnchor: false,
    onLeave: function(index, nextIndex, direction) {
      if(index == 1) {
        var scrollBarHidden = anime({
          targets: '.scrollDown',
          translateY: 180 + '%',
          duration: 500,
          easing: 'easeInOutCubic',
        });
      }
    },
    afterLoad: function(anchorLink, index) {
      if(index == 1) {
        var scrollBarVisible = anime({
          targets: '.scrollDown',
          translateY: [180 + '%', 0],
          duration: 500,
          easing: 'easeInOutCubic',
        });
      }
    }
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

console.log('aaa');
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
    var btnVisible = anime.timeline({
      duration: 500,
      easing: 'easeInOutCubic',
    })
    .add({
      targets: '.btn-wrap',
      translateY: [110 + '%', 0],
    })
    .add({
      targets: '.back-arrow img',
      translateX: [100 + '%', 0],
      offset: '-=500'
    })
    .add({
      targets: '.scrollDown',
      translateY: [180 + '%', 0],
      offset: '-=500'
    });
  },
  onLeave: function() {
    var btnHidden = anime.timeline({
      duration: 500,
      easing: 'easeInOutCubic',
    })
    .add({
      targets: '.btn-wrap',
      translateY: [0, 110 + '%'],
    })
    .add({
      targets: '.back-arrow img',
      translateX: [0, -100 + '%'],
      offset: '-=500'
    });
  },
  onLeaveCompleted: function() {
      // このページのcontainerが完全に削除された時。
      fullPage();
      var visible = anime.timeline({
        duration: 500,
        easing: 'easeInOutCubic'
      })
      .add({
        targets: '.page-num p',
        translateY: [100 + '%', 0],
        translateZ: 0,
      })
      .add({
        targets: '#fp-nav ul',
        translateY: [fpnav.y, 0],
        translateX: [fpnav.x, 0],
        translateZ: 0,
        offset: '-=500'
      })
      .add({
        targets: '.fullpage__slide',
        background: ['#020b16', 'rgba(0,0,0,0)'],
        offset: '-=500'
      })
      .add({
        targets: '.active .btn-wrap',
        translateY: [110 + '%', 0],
        translateZ: 0,
        offset: '-=500',
      });
  }
});
underLayer.init();

// transition
var PageTransitionTop = Barba.BaseTransition.extend({
  start: function() {
    this.open()
      .then(this.newContainerLoading)
      .then(this.finish.bind(this));
  },
  open: function() {
    return new Promise( function (resolve) {
      var openAnime = anime.timeline({
        duration: 500,
        easing: 'easeInOutCubic',
        complete: function() {
          resolve();
        }
      })
      .add({
        targets: '.active .image',
        width: [53.125 + '%', 60.677 + '%'],
        height: [74.81 + '%', 100 + 'vh'],
        marginRight: [8 + '%', 0],
      }).add({
        targets: '.fullpage__slide',
        background: '#020b16',
        offset: '-=500'
      }).add({
        targets: '.page-num p',
        translateY: [0,100 + '%'],
        translateZ: 0,
        offset: '-=500'
      }).add({
        targets: '#fp-nav ul',
        translateY: [0,fpnav.y],
        translateX: [0,fpnav.x],
        translateZ: 0,
        offset: '-=500'
      })
      .add({
        targets: '.active .btn-wrap',
        translateY: [0, 110 + '%'],
        translateZ: 0,
        offset: '-=500',
      });
      openAnime.play;
    });
  },
  finish: function() {
    this.done();
  }
});
  
var PageTransitionUnder = Barba.BaseTransition.extend({
  start: function() {
    this.close()
      .then(this.newContainerLoading)
      .then(this.finish.bind(this));
  },
  close: function() {
    return new Promise( function (resolve) {
      var closeAnime = anime.timeline({
        duration: 500,
        easing: 'easeInOutCubic',
        complete: function() {
          resolve();
        }
      }).add({
        targets: '.page-top .image',
        width: [60.677 + '%', 53.125 + '%'],
        height: [100 + 'vh', 74.81 + '%'],
        marginRight: [0, 8 + '%']
      });
      closeAnime.pause;
      if($(window).scrollTop() !== 0) {
        timer = 1000;
        $('body,html').animate({
          scrollTop: 0
        }, 500, 'swing', closeAnime.play);
      } else {
        closeAnime.play;
      }
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