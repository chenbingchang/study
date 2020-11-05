let options = {
  // controls: true, // 确定播放器是否具有用户可以与之交互的控件。如果没有控件，则开始播放视频的唯一方法是使用autoplay属性或通过Player API。
  // autoplay: false, // 是否自动播放
  // preload: "auto", // 预加载
  // loop: false, // 视频在结束时是否重新开始。
  // children: {
  //   MediaLoader: true, // children数组必须包含'MediaLoader'。这不是可见元素，但是对于视频加载和播放来说是必需的。
  //   PosterImage: true, // 视频海报
  //   LoadingSpinner: true, // 加载中遮罩层
  //   // 控制条自己定义
  // }
}

let player = videojs("example_video_1", options, function() {
  this.poster(
    "https://goss.veer.com/creative/vcg/veer/800water/veer-305184498.jpg"
  )
  
  this.src(
    "https://blshe.oss-cn-hangzhou.aliyuncs.com/video/DEV/2020/04/01/4f8cb7a/91dd9bf.mp4"
  )

  // 结束
  this.on('ended', function () {
    console.log('-----------ended---------')
    console.log('-----------播放结束---------')
  })
  // 全屏
  this.on('fullscreenchange', function () {
    console.log('-----------fullscreenchange---------')
    console.log('-----------改变全屏---------')
  })
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
  const MouseTimeDisplay = videojs.getComponent('MouseTimeDisplay')

  let isShowPoster = true // 是否显示海报，默认是

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
    handleMouseMove(event) {
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
      // 由于MyPlayProgressBar里面的那个小球，会导致出现offsetX的结果为负值，导致计算出来的curTime为-0或者-1等情况，导致鼠标显示的时间不对，故要判断
      if(offsetX < 0) {
        offsetX = 0
      }

      
      let mouseTimeCmp = this.getChild('MySeekBar').getChild('MyMouseTimeDisplay')
      let el
      let percent = offsetX / totalX
      let curTime = Math.round(percent * player.duration()) // 四舍五入，要统一，不然出现的时间不一样

      if(mouseTimeCmp) {
        el = mouseTimeCmp.el()
      } else {
        el = document.querySelectorAll('.my-progress .my-progress__mouse-time')[0]
      }
      console.log('鼠标当前的时间：', curTime)
      el.innerText = this.secondFormat(curTime)

      let elHalfWidth = (el.offsetWidth / 2)
      let left = offsetX - elHalfWidth

      if(left < 0) {
        left = 0
      } else if(left > (totalX - el.offsetWidth)) {
        left = totalX - el.offsetWidth
      }
      
      el.style.left = `${left}px`
    },
    
    /**
     * 把秒格式化成 hh:mm:ss
     * @param {*} second 
     * @returns {string} 格式化后的字符串
     */
    secondFormat(second) {
      let h = Math.floor(second / 3600)
      let m = Math.floor((second % 3600) / 60)
      let s = Math.floor(second % 60)
      let result = ''

      // if(h < 0) {
      //   h = 0
      // }
      // if(m < 0) {
      //   m = 0
      // }
      // if(s < 0) {
      //   s = 0
      // }

      if(h > 0) {
        result += (h < 10 ? `0${h}` : h) + ':'
      }
      result += (m < 10 ? `0${m}` : m) + ':'
      result += s < 10 ? `0${s}` : s

      return result
    }
  })
  videojs.registerComponent('MyProgressControl', MyProgressControl);

  // 自定义SeekBar
  const MySeekBar = videojs.extend(SeekBar, {
    constructor: function(player, options) {
      options.children = ['MyLoadProgressBar', 'MyPlayProgressBar', 'MyMouseTimeDisplay']
      SeekBar.apply(this, arguments);
      this.isPause = false
    },
    createEl: function() {
      return videojs.dom.createEl('div', {
        className: 'my-progress',
      }, {

      });
    },
    handleClick(event) {
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
      if(offsetX < 0) {
        offsetX = 0
      }

      let percent = offsetX / totalX
      let playProgressEl = document.querySelectorAll('.my-progress .my-progress__play')[0]
      playProgressEl.style.width = `${percent * 100}%`
      
      let player = this.player()
      let curTime = Math.round(percent * player.duration()) // 四舍五入，要统一，不然出现的时间不一样

      console.log('自己计算的百分比', percent, curTime, this.isPause ? '暂停' : '播放')
      player.currentTime(curTime)
      if(!this.isPause) {
        player.play()
      }
      // 跳转时间大于0，并且还有海报，则隐藏海报
      if(isShowPoster && curTime > 0) {
        player.el().classList.add('vjs-has-started')
      }
    },
    handleMouseDown(event) {
      this.isPause = this.player().paused()
      console.log(event.target)
    },
    handleMouseMove(event) {
        // 清除进度条拖拽
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
      // console.log('已下载百分比', player.bufferedPercent())
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
          <div class="my-progress__play__point"></div>
        </div>
        `
      }, {

      });
    },
  })
  videojs.registerComponent('MyPlayProgressBar', MyPlayProgressBar);

  // 自定义MouseTimeDisplay
  const MyMouseTimeDisplay = videojs.extend(MouseTimeDisplay, {
    constructor: function(player, options) {
      options.children = []
      MouseTimeDisplay.apply(this, arguments);
    },
    createEl: function() {
      return videojs.dom.createEl('div', {
        className: 'my-progress__mouse-time',
        innerHTML: '00:00'
      }, {

      });
    },
  })
  videojs.registerComponent('MyMouseTimeDisplay', MyMouseTimeDisplay);

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

  // 自定义btn的wrap
  const MyButtonWrap = videojs.extend(Component, {
    constructor: function(player, options) {
      Component.apply(this, arguments);
    },
    createEl: function() {
      // <i class="iconfont icon-pause"></i>
      return videojs.dom.createEl('div', {
        className: 'my-button-wrap',
      }, {

      });
    },
  })
  videojs.registerComponent('MyButtonWrap', MyButtonWrap);

  // 自定义控制条
  const MyControlBar = videojs.extend(ControlBar, {
    constructor: function(player, options) {
      options.children = ['MyProgressControl', 'MyButtonWrap']
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

  // player.addChild('MyControlBar')

  // player.on('timeupdate', function(e) {
  //   // 更新已播放进度条
  //   // console.log('已播放百分比', player.currentTime(), player.currentTime() / player.duration())
  //   document.querySelectorAll('.my-control-bar .my-progress__play')[0].style.width = `${(player.currentTime() / player.duration()) * 100}%`
  // })

  // player.on('play', function(event) {
  //   this.isShowPoster = false
  // })