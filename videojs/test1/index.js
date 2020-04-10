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
  // let tech = this.getChild('Tech')
  // console.log(tech)
  
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



  // 自定义播放按钮
  let myPlayToggle = videojs.extend(PlayToggle, {
    constructor: function(player, options) {
      PlayToggle.apply(this, arguments);
    },
    createEl: function() {
      return videojs.createEl('div', {
        className: 'my-play-toggle',
        innerHTML: '播放按钮'
      }, {

      });
    },
  })

  videojs.registerComponent('myPlayToggle', myPlayToggle);

  // 自定义控制条
  let myControlBar = videojs.extend(ControlBar, {
    constructor: function(player, options) {
      options.children = ['myPlayToggle']
      // options.children = []
      ControlBar.apply(this, arguments);
    },
    createEl: function() {
      return videojs.createEl('div', {
        className: 'my-control-bar',
      }, {
        
      });
    },
  })

  

  videojs.registerComponent('myControlBar', myControlBar);
  player.addChild('myControlBar')