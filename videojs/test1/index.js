let options = {
  controls: true, // 确定播放器是否具有用户可以与之交互的控件。如果没有控件，则开始播放视频的唯一方法是使用autoplay属性或通过Player API。
  autoplay: false, // 是否自动播放
  preload: "auto", // 预加载
  loop: false, // 视频在结束时是否重新开始。
  children: {
    MediaLoader: true, // children数组必须包含'MediaLoader'。这不是可见元素，但是对于视频加载和播放来说是必需的。
    PosterImage: true, // 视频海报
    LoadingSpinner: true, // 加载中遮罩层
    // 控制条自己定义
  }
}

let player = videojs("example_video_1", options, function() {
  this.poster(
    "https://goss.veer.com/creative/vcg/veer/800water/veer-305184498.jpg"
  )
  
  this.src(
    "https://blshe.oss-cn-hangzhou.aliyuncs.com/video/DEV/2020/04/01/4f8cb7a/91dd9bf.mp4"
  )
})

// let PosterImage = videojs.getComponent('PosterImage')
// let posterImage = new PosterImage(player, {
//   name: 'my-posterImage'
// })
// posterImage.setSrc("https://goss.veer.com/creative/vcg/veer/800water/veer-305184498.jpg")
// posterImage.show() // 海报默认隐藏，这里立即显示

// player.addChild(posterImage)



  const ControlBar = videojs.getComponent('ControlBar')
  const PlayToggle = videojs.getComponent('PlayToggle')
  const Component = videojs.getComponent('Component')
  const ProgressControl = videojs.getComponent('ProgressControl')
  const SeekBar = videojs.getComponent('SeekBar')
  const LoadProgressBar = videojs.getComponent('LoadProgressBar')
  const PlayProgressBar = videojs.getComponent('PlayProgressBar')

  // 自定义进度条
  const MyProgressControl = videojs.extend(ProgressControl, {
    constructor: function(player, options) {
      options.children = ['MySeekBar']
      // ProgressControl.apply(this, player, options);和下面的写法效果一样
      ProgressControl.apply(this, arguments);
    },
    createEl: function() {
      return videojs.dom.createEl('div', {
        className: 'my-progress-wrap',
      }, {

      });
    },
  })
  videojs.registerComponent('MyProgressControl', MyProgressControl);

  // 自定义SeekBar
  const MySeekBar = videojs.extend(SeekBar, {
    constructor: function(player, options) {
      options.children = ['MyLoadProgressBar', 'MyPlayProgressBar']
      SeekBar.apply(this, arguments);
    },
    createEl: function() {
      return videojs.dom.createEl('div', {
        className: 'my-progress',
      }, {

      });
    },
    handleClick(event) {
      // @todo: 这里的计算不准确，有好多情况会有问题，待优化
      // debugger
      // let curTime = parseInt((event.offsetX / event.currentTarget.offsetWidth) * player.duration())
      // console.log(event.offsetX, event.currentTarget.offsetWidth, event.offsetX / event.currentTarget.offsetWidth, curTime, event.target)
      // player.currentTime(curTime)

      let target = event.target
      let curTarget = event.currentTarget
      let offsetX // 偏移的距离
      let totalX = curTarget.clientWidth // 总的宽度
      
      if(target === curTarget) {
        offsetX = event.offsetX
      } else {
        // 相对于文档的左边距离
        let targetOfPageX = target.getBoundingClientRect().left + window.pageXOffset
        let curTargetOfPageX = curTarget.getBoundingClientRect().left + window.pageXOffset

        offsetX = targetOfPageX - curTargetOfPageX + event.offsetX
      }

      let percent = (offsetX / totalX) * 100
      let playProgressEl = document.querySelectorAll('.my-progress .my-progress__play')[0]
      playProgressEl.style.width = `${percent}%`
      
      console.log('自己计算的百分比', percent)
    }
  })
  videojs.registerComponent('MySeekBar', MySeekBar);

  // 自定义my-progress__load
  const MyLoadProgressBar = videojs.extend(LoadProgressBar, {
    constructor: function(player, options) {
      options.children = []
      LoadProgressBar.apply(this, arguments);
    },
    createEl: function() {
      return videojs.dom.createEl('div', {
        className: 'my-progress__load',
      }, {

      });
    },
    update(event) {
      console.log('已下载百分比', player.bufferedPercent())
      // 更新已下载进度条
      this.el().style.width = `${player.bufferedPercent() * 100}%`
    }
  })
  videojs.registerComponent('MyLoadProgressBar', MyLoadProgressBar);

  // 自定义my-progress__play
  const MyPlayProgressBar = videojs.extend(PlayProgressBar, {
    constructor: function(player, options) {
      options.children = []
      PlayProgressBar.apply(this, arguments);
    },
    createEl: function() {
      return videojs.dom.createEl('div', {
        className: 'my-progress__play',
        innerHTML: `
        <div class="my-progress__play__point-wrap">
          <span class="my-progress__play__point"></span>
        </div>
        `
      }, {

      });
    },
  })
  videojs.registerComponent('MyPlayProgressBar', MyPlayProgressBar);



  // 自定义播放按钮
  const MyPlayToggle = videojs.extend(PlayToggle, {
    constructor: function(player, options) {
      PlayToggle.apply(this, arguments);
    },
    createEl: function() {
      // <i class="iconfont icon-pause"></i>
      return videojs.dom.createEl('div', {
        className: 'my-play-toggle',
        innerHTML: `</i><i class="iconfont icon-play is-active"></i><i class="iconfont icon-pause">`
      }, {

      });
    },
  })

  videojs.registerComponent('MyPlayToggle', MyPlayToggle);

  // 自定义控制条
  const MyControlBar = videojs.extend(ControlBar, {
    constructor: function(player, options) {
      options.children = ['MyProgressControl']
      ControlBar.apply(this, arguments);
    },
    createEl: function() {
      return videojs.dom.createEl('div', {
        className: 'my-control-bar',
      }, {
        
      });
    },
  })

  

  videojs.registerComponent('MyControlBar', MyControlBar);
  player.addChild('MyControlBar')

  player.on('timeupdate', function(e) {
    // 更新已播放进度条
    console.log('已播放百分比', player.currentTime(), player.currentTime() / player.duration())
    document.querySelectorAll('.my-control-bar .my-progress__play')[0].style.width = `${(player.currentTime() / player.duration()) * 100}%`
  })