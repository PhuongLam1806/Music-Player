const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'F8_PLAYER'

const player = $('.player')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $("#audio");
const playBtn = $('.btn-toggle-play')
const progressBar = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')


const app ={
currentIndex: 0,
isPlaying: false,
isRandom: false,
isRepeat: false,
config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
songs: [
  {
      name: "one call away",
      singer: "Charlie Puth",
      path: "../assets/music/song1.mp3",
      image: "https://i.ytimg.com/an/3AtDnEC4zak/fd1a8d6f-80e0-4b35-8393-3cdd77cbfdbd_mq.jpg?v=5afca9b0"
      
      
  },

  {
      name: "see you again",
      singer: "Charlie Puth",
      path: "../assets/music/song2.mp3",
      image: "https://i.ytimg.com/an/3AtDnEC4zak/fd1a8d6f-80e0-4b35-8393-3cdd77cbfdbd_mq.jpg?v=5afca9b0"
  },
  {
      name: "Làm người yêu anh nhé baby",
      singer: "3 chú bộ đội",
      path: "../assets/music/song3.mp3",
      image: "https://image.thanhnien.vn/w1024/Uploaded/2022/ubcbvun/2018_01_25/tks_7344-edit_ymot.jpg"
  },
  {
      name: "Phố không em",
      singer: "Thái Đinh",
      path: "../assets/music/song4.mp3",
      image: "https://trixie.com.vn/media/images/article/76382490/unnamed%20(1).jpg"
  },
  {
      name: "Mình chia tay đi",
      singer: "Lou Hoàng",
      path: "../assets/music/song5.mp3",
      image: "https://nguoi-noi-tieng.com/photo/tieu-su-ca-si-lou-hoang-6969.jpg"
  },
  {
      name: "Em không là duy nhất",
      singer: "Tóc Tiên",
      path: "../assets/music/song6.mp3",
      image: "https://ruthamcauquan2.info/wp-content/uploads/2021/06/tieu-su-ca-si-toc-tien-la-ai.jpg"
  },
  {
      name: "Ngày lang thang",
      singer: "Đen",
      path: "../assets/music/song7.mp3",
      image: "https://cdn.baogiaothong.vn/upload/images/2021-1/article_img/2021-02-11/img-bgt-2021-avatar-den-1613039093-width1280height852.jpg"
  },
  
],

setConfig: function(key,value){
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
},
render: function(){
 const html = this.songs.map((song, index) => {
     return `
  <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
      <div 
          class="thumb" style="background-image: url('${song.image}')">
      </div>
      <div class="body">
          <h3 class="title">${song.name}</h3>
           <p class="author">${song.singer}</p>
      </div>
      <div class="option">
          <i class="fas fa-ellipsis-h"></i>
      </div>
  </div>
     `
 })
playlist.innerHTML =html.join('')

},

defineProperties: function(){
  Object.defineProperty(this, 'currentSong',{
    get: function(){
      return this.songs[this.currentIndex]
    }
  })
},

handleEvent: function(){
    const _this = this
    const cdWidth = cd.offsetWidth

   //xử lý CD quay / dừng

   const cdThumbAnimate = cdThumb.animate([
       {transform: 'rotate(360deg)'}
   ],
    {
        duration: 10000, //10seconds
        iterations: Infinity
    }
   )
   cdThumbAnimate.pause()

  // xử lý phóng to/thu nhỏ CD
  document.onscroll = function(){
     const scrollTop =  window.scrollY || document.documentElement.scrollTop
     const newCdWidth = cdWidth - scrollTop

     cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
     cd.style.opacity = newCdWidth / cdWidth
  }

 

  //xử lý khi click play
  playBtn.onclick = function(){

    if(_this.isPlaying){
        audio.pause()
    }else{
        audio.play()
    }
  }

  //khi song được play 
  audio.onplay = function(){
      _this.isPlaying = true
      player.classList.add('playing')
        cdThumbAnimate.play()
  }

  //khi song bị pause
  audio.onpause = function(){
    _this.isPlaying = false
    player.classList.remove('playing')
    cdThumbAnimate.pause()
}

//khi tiến độ bài hát thay đổi
audio.ontimeupdate = function(){
    if(audio.duration){ // vì lần đầu tiên là NaN
        const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
        progress.value = progressPercent
    }
}

//xử lý khi tua song 
progress.onchange = function(e){
    const seekTime = audio.duration / 100 * e.target.value
    audio.currentTime = seekTime
}

//khi next song 
nextBtn.onclick = function(){
    if(_this.isRandom){
        _this.playRandomSong()
    }else{
        _this.nextSong()

    }
    audio.play()
    _this.render()
    _this.scrollToActiveSong()
}

//khi prev song 
prevBtn.onclick = function(){
    if(_this.isRandom){
        _this.playRandomSong()
    }else{
        _this.prevSong()

    }
    audio.play()
    _this.render()
    _this.scrollToActiveSong()


}

// xử lý bật / tắt random song
randomBtn.onclick = function(e){
    _this.isRandom = !_this.isRandom
    _this.setConfig('isRandom', _this.isRandom)
    randomBtn.classList.toggle('active',_this.isRandom)
   
}

//xử lý lặp lại 1 song 
repeatBtn.onclick = function(e){
    _this.isRepeat = !_this.isRepeat
    _this.setConfig('isRepeat', _this.isRepeat)
    repeatBtn.classList.toggle('active',_this.isRepeat)

}

// xử lý next song khi audio ended
audio.onended = function(){
    if(_this.isRepeat){
        audio.play()
    }else{

        nextBtn.click() // tự bấm vào nút click
    }
}

//lắng nghr hành vi click vào playlist
playlist.onclick = function(e){
    const songNode = e.target.closest('.song:not(.active)')
    //xử lý khi click vào song
     if( songNode || e.target.closest('.option')){
         if(songNode){
            _this.currentIndex = Number(songNode.dataset.index)
            _this.loadCurrentSong()
            _this.render()
            audio.play()
         }
           //xử lý khi click vào song option
         if (e.target.closest('.option')){

         }
     }

   
}
},

scrollToActiveSong: function(){
    setTimeout(() => {
        $('.song.active').scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        })
    }, 500)
},

loadCurrentSong: function(){


heading.textContent = this.currentSong.name
cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
audio.src = this.currentSong.path

},

loadConfig: function(){
    this.isRandom = this.config.isRandom
    this.isRepeat = this.config.isRepeat

},

nextSong: function(){
    this.currentIndex++
    if(this.currentIndex >= this.songs.length){
        this.currentIndex = 0
    }
    this.loadCurrentSong()
},
prevSong: function(){
    this.currentIndex--
    if(this.currentIndex <0){
        this.currentIndex = this.songs.length -1
    }
    this.loadCurrentSong()
},

playRandomSong: function(){
    let newIndex
    do{
        newIndex = Math.floor(Math.random() * this.songs.length)
        
    }while(newIndex  === this.currentIndex )
    this.currentIndex = newIndex
    this.loadCurrentSong()
},

start: function(){

    // gán cấu hình từ config vào ứng dụng
    this.loadConfig()

  // định nghĩa các thuộc tính cho object
  this.defineProperties()

  //lắng nghe xử lý các sự kiện (DOM EVENT  )
  this.handleEvent()

  //tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng 
  this.loadCurrentSong()

  //Render pllaylist
   this.render()

   //hiện thị trạng thái ban đầu của button repeat & random number
   randomBtn.classList.toggle('active',_this.isRandom)
   repeatBtn.classList.toggle('active',_this.isRepeat)

}
}

app.start()