let videoEl = document.querySelectorAll('.video1')[0]

videoEl.addEventListener('loadstart', function() {
    console.log('loadstart')
})
videoEl.addEventListener('durationchange', function() {
    console.log('durationchange')
})
videoEl.addEventListener('loadedmetadata', function() {
    console.log('loadedmetadata')
})
videoEl.addEventListener('loadeddata', function() {
    console.log('loadeddata')
})
videoEl.addEventListener('progress', function() {
    console.log('progress')
    console.log(videoEl.buffered)
    console.log(videoEl.buffered.end(videoEl.buffered.length - 1 >= 0 ? videoEl.buffered.length - 1 : 0))
    console.log(videoEl.duration)
})
videoEl.addEventListener('canplay', function() {
    console.log('canplay')
})
videoEl.addEventListener('canplaythrough', function() {
    console.log('canplaythrough')
})
videoEl.addEventListener('timeupdate', function() {
    console.log(videoEl.currentTime, videoEl.duration, videoEl.currentTime / videoEl.duration)
})
