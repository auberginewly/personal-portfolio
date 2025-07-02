// audio-player.js - 音频播放器模块

class AudioPlayer {
    constructor() {
        this.audio = null;
        this.isPlaying = false;
        this.currentTrack = '';
        this.volume = 0.3; // 默认音量30%
        this.fadeInterval = null;
        
        this.init();
    }
    
    init() {
        this.createAudioElement();
        this.bindEvents();
    }
    
    createAudioElement() {
        // 创建音频元素
        this.audio = document.createElement('audio');
        this.audio.loop = true;
        this.audio.volume = this.volume;
        this.audio.preload = 'metadata';
        
        // 添加到DOM
        document.body.appendChild(this.audio);
    }
    
    bindEvents() {
        // 音频加载完成
        this.audio.addEventListener('loadeddata', () => {
            console.log('音频加载完成');
        });
        
        // 音频播放错误
        this.audio.addEventListener('error', (e) => {
            console.warn('音频播放错误:', e);
        });
        
        // 音频结束
        this.audio.addEventListener('ended', () => {
            this.isPlaying = false;
        });
    }
    
    // 设置音乐轨道
    setTrack(trackUrl, trackName = '') {
        if (this.currentTrack !== trackUrl) {
            this.currentTrack = trackUrl;
            this.audio.src = trackUrl;
            console.log(`设置音乐轨道: ${trackName || trackUrl}`);
        }
    }
    
    // 播放音乐（带淡入效果）
    play() {
        if (!this.audio.src) return;
        
        this.audio.volume = 0;
        const playPromise = this.audio.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                this.isPlaying = true;
                this.fadeIn();
            }).catch((error) => {
                console.warn('音频播放失败:', error);
            });
        }
    }
    
    // 暂停音乐（带淡出效果）
    pause() {
        if (this.isPlaying) {
            this.fadeOut(() => {
                this.audio.pause();
                this.isPlaying = false;
            });
        }
    }
    
    // 停止音乐
    stop() {
        this.pause();
        this.audio.currentTime = 0;
    }
    
    // 音量淡入
    fadeIn(duration = 1000) {
        this.clearFadeInterval();
        const targetVolume = this.volume;
        const step = targetVolume / (duration / 50);
        let currentVolume = 0;
        
        this.fadeInterval = setInterval(() => {
            currentVolume += step;
            if (currentVolume >= targetVolume) {
                currentVolume = targetVolume;
                this.clearFadeInterval();
            }
            this.audio.volume = currentVolume;
        }, 50);
    }
    
    // 音量淡出
    fadeOut(callback, duration = 800) {
        this.clearFadeInterval();
        const step = this.audio.volume / (duration / 50);
        let currentVolume = this.audio.volume;
        
        this.fadeInterval = setInterval(() => {
            currentVolume -= step;
            if (currentVolume <= 0) {
                currentVolume = 0;
                this.clearFadeInterval();
                if (callback) callback();
            }
            this.audio.volume = currentVolume;
        }, 50);
    }
    
    // 清除淡入淡出定时器
    clearFadeInterval() {
        if (this.fadeInterval) {
            clearInterval(this.fadeInterval);
            this.fadeInterval = null;
        }
    }
    
    // 设置音量
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        if (!this.fadeInterval) {
            this.audio.volume = this.volume;
        }
    }
    
    // 获取当前播放状态
    getStatus() {
        return {
            isPlaying: this.isPlaying,
            currentTrack: this.currentTrack,
            volume: this.volume,
            currentTime: this.audio.currentTime,
            duration: this.audio.duration
        };
    }
}

// 页面音乐管理器
class PageMusicManager {
    constructor() {
        this.audioPlayer = new AudioPlayer();
        this.musicTracks = {
            'index': {
                url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3',
                name: '背景音乐',
                fallback: 'assets/audio/welcome.mp3'
            },
            'skills': {
                url: 'https://www.soundjay.com/misc/sounds/typing-1.mp3',
                name: '背景音乐',
                fallback: 'assets/audio/focus.mp3'
            },
            'projects': {
                url: 'https://www.soundjay.com/misc/sounds/beep-ping.mp3',
                name: '背景音乐',
                fallback: 'assets/audio/creative.mp3'
            },
            'blog-list': {
                url: 'https://www.soundjay.com/misc/sounds/page-flip-01a.mp3',
                name: '背景音乐',
                fallback: 'assets/audio/reading.mp3'
            },
            'todo': {
                url: 'https://www.soundjay.com/misc/sounds/button-09.mp3',
                name: '背景音乐',
                fallback: 'assets/audio/productive.mp3'
            }
        };
        
        this.currentPage = this.getCurrentPage();
        this.isHovering = false;
        this.hoverTimeout = null;
        
        this.init();
    }
    
    init() {
        this.createMusicControls();
        this.bindHoverEvents();
        this.loadPageMusic();
    }
    
    // 获取当前页面类型
    getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('index.html') || path === '/' || path.endsWith('/')) {
            return 'index';
        } else if (path.includes('skills.html')) {
            return 'skills';
        } else if (path.includes('projects.html')) {
            return 'projects';
        } else if (path.includes('blog-list.html')) {
            return 'blog-list';
        } else if (path.includes('todo.html')) {
            return 'todo';
        }
        return null;
    }
    
    // 创建音乐控制器UI
    createMusicControls() {
        const musicControl = document.createElement('div');
        musicControl.className = 'music-control';
        musicControl.innerHTML = `
            <div class="music-icon" title="悬停播放背景音乐">
                <i class="fas fa-music"></i>
            </div>
            <div class="music-info">
                <span class="music-title">背景音乐</span>
                <div class="music-progress">
                    <div class="progress-bar"></div>
                </div>
            </div>
            <div class="music-volume">
                <i class="fas fa-volume-up"></i>
                <input type="range" min="0" max="100" value="30" class="volume-slider">
            </div>
        `;
        
        document.body.appendChild(musicControl);
        
        // 绑定音量控制
        const volumeSlider = musicControl.querySelector('.volume-slider');
        volumeSlider.addEventListener('input', (e) => {
            const volume = e.target.value / 100;
            this.audioPlayer.setVolume(volume);
        });
        
        // 绑定点击播放/暂停
        const musicIcon = musicControl.querySelector('.music-icon');
        musicIcon.addEventListener('click', () => {
            if (this.audioPlayer.isPlaying) {
                this.audioPlayer.pause();
                musicIcon.innerHTML = '<i class="fas fa-play"></i>';
            } else {
                this.audioPlayer.play();
                musicIcon.innerHTML = '<i class="fas fa-pause"></i>';
            }
        });
    }
    
    // 绑定悬停事件
    bindHoverEvents() {
        // 为主要内容区域绑定悬停事件
        const mainContent = document.querySelector('main') || document.body;
        
        mainContent.addEventListener('mouseenter', () => {
            this.handleMouseEnter();
        });
        
        mainContent.addEventListener('mouseleave', () => {
            this.handleMouseLeave();
        });
        
        // 页面获得/失去焦点时的处理
        window.addEventListener('focus', () => {
            if (this.isHovering) {
                this.startMusic();
            }
        });
        
        window.addEventListener('blur', () => {
            this.stopMusic();
        });
    }
    
    // 鼠标进入处理
    handleMouseEnter() {
        this.isHovering = true;
        
        // 延迟播放，避免快速滑过时播放
        this.hoverTimeout = setTimeout(() => {
            if (this.isHovering) {
                this.startMusic();
            }
        }, 500);
    }
    
    // 鼠标离开处理
    handleMouseLeave() {
        this.isHovering = false;
        
        if (this.hoverTimeout) {
            clearTimeout(this.hoverTimeout);
            this.hoverTimeout = null;
        }
        
        // 延迟停止，避免短暂离开时停止
        setTimeout(() => {
            if (!this.isHovering) {
                this.stopMusic();
            }
        }, 1000);
    }
    
    // 加载页面音乐
    loadPageMusic() {
        if (this.currentPage && this.musicTracks[this.currentPage]) {
            const track = this.musicTracks[this.currentPage];
            this.audioPlayer.setTrack(track.url, track.name);
            
            // 保持统一的UI显示文字，不更改
            // const musicTitle = document.querySelector('.music-title');
            // if (musicTitle) {
            //     musicTitle.textContent = track.name;
            // }
        }
    }
    
    // 开始播放音乐
    startMusic() {
        if (this.currentPage && this.musicTracks[this.currentPage]) {
            this.audioPlayer.play();
            
            // 更新UI状态
            const musicIcon = document.querySelector('.music-icon');
            if (musicIcon) {
                musicIcon.innerHTML = '<i class="fas fa-pause"></i>';
                musicIcon.classList.add('playing');
            }
        }
    }
    
    // 停止播放音乐
    stopMusic() {
        this.audioPlayer.pause();
        
        // 更新UI状态
        const musicIcon = document.querySelector('.music-icon');
        if (musicIcon) {
            musicIcon.innerHTML = '<i class="fas fa-music"></i>';
            musicIcon.classList.remove('playing');
        }
    }
}

// 自动初始化
let pageMusicManager = null;

document.addEventListener('DOMContentLoaded', () => {
    // 检查是否在支持的页面
    const path = window.location.pathname;
    const supportedPages = ['index.html', 'skills.html', 'projects.html', 'blog-list.html', 'todo.html'];
    const isSupported = supportedPages.some(page => path.includes(page)) || 
                       path === '/' || path.endsWith('/');
    
    if (isSupported) {
        try {
            pageMusicManager = new PageMusicManager();
            console.log('音乐播放器已初始化');
        } catch (error) {
            console.warn('音乐播放器初始化失败:', error);
        }
    }
});

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AudioPlayer, PageMusicManager };
}

// 全局访问
window.AudioPlayer = AudioPlayer;
window.PageMusicManager = PageMusicManager; 