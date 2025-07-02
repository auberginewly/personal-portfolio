// audio-player.js - 音频播放器模块

class AudioPlayer {
    constructor() {
        this.audio = null;
        this.isPlaying = false;
        this.currentTrack = '';
        this.volume = 0.3; // 默认音量30%
        this.storageKey = 'music-player-state';
        
        this.init();
    }
    
    init() {
        this.createAudioElement();
        this.bindEvents();
        this.restoreState();
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
    
    // 保存播放状态
    saveState() {
        const state = {
            currentTrack: this.currentTrack,
            isPlaying: this.isPlaying,
            currentTime: this.audio ? this.audio.currentTime : 0,
            volume: this.volume
        };
        localStorage.setItem(this.storageKey, JSON.stringify(state));
    }
    
    // 恢复播放状态
    restoreState() {
        const saved = localStorage.getItem(this.storageKey);
        if (saved) {
            const state = JSON.parse(saved);
            this.currentTrack = state.currentTrack || '';
            this.volume = state.volume || 0.3;
            this.isPlaying = state.isPlaying || false;
            
            if (this.audio) {
                this.audio.volume = this.volume;
                if (this.currentTrack) {
                    this.audio.src = this.currentTrack;
                    this.audio.currentTime = state.currentTime || 0;
                    
                    // 如果之前在播放，恢复播放
                    if (this.isPlaying) {
                        this.audio.play().catch(e => {
                            console.log('自动播放被阻止，需要用户交互');
                            this.isPlaying = false;
                        });
                    }
                }
            }
        }
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
        
        // 音频结束（实际上因为loop=true不会触发）
        this.audio.addEventListener('ended', () => {
            this.isPlaying = false;
            this.saveState();
        });
        
        // 音频时间更新（每5秒保存一次状态，避免过度调用）
        let lastSaveTime = 0;
        this.audio.addEventListener('timeupdate', () => {
            this.updateProgress();
            
            // 每5秒保存一次状态
            const now = Date.now();
            if (now - lastSaveTime > 5000) {
                this.saveState();
                lastSaveTime = now;
            }
        });
        
        // 音频开始播放
        this.audio.addEventListener('play', () => {
            this.isPlaying = true;
            this.saveState();
        });
        
        // 音频暂停
        this.audio.addEventListener('pause', () => {
            this.isPlaying = false;
            this.saveState();
        });
        
        // 页面卸载时保存状态
        window.addEventListener('beforeunload', () => {
            this.saveState();
        });
        
        // 页面隐藏时保存状态
        document.addEventListener('visibilitychange', () => {
            this.saveState();
        });
    }
    
    // 设置音乐轨道
    setTrack(trackUrl, trackName = '') {
        if (this.currentTrack !== trackUrl) {
            this.currentTrack = trackUrl;
            this.audio.src = trackUrl;
            this.saveState();
            console.log(`设置音乐轨道: ${trackName || trackUrl}`);
        }
    }
    
        // 播放音乐（稳定音量）
    play() {
        if (!this.audio.src) return;
        
        // 如果已经在播放，不重复播放
        if (this.isPlaying) return;
        
        this.audio.volume = this.volume; // 直接设置到目标音量
        const playPromise = this.audio.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                this.isPlaying = true;
                console.log('音乐开始播放');
            }).catch((error) => {
                console.warn('音频播放失败:', error);
            });
        }
    }

    // 暂停音乐（稳定音量）
    pause() {
        if (this.isPlaying) {
            this.audio.pause();
            this.isPlaying = false;
            console.log('音乐暂停');
        }
    }
    
    // 停止音乐
    stop() {
        this.pause();
        this.audio.currentTime = 0;
    }
    
    // 淡入淡出功能已移除，改为稳定音量播放
    // 这样可以避免音量时大时小的问题
    
    // 设置音量
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        this.audio.volume = this.volume;
    }
    
    // 更新播放进度
    updateProgress() {
        if (this.audio.duration) {
            const progress = (this.audio.currentTime / this.audio.duration) * 100;
            const progressBar = document.querySelector('.progress-bar');
            const currentTimeEl = document.querySelector('.current-time');
            const totalTimeEl = document.querySelector('.total-time');
            
            if (progressBar) {
                progressBar.style.width = `${progress}%`;
            }
            
            if (currentTimeEl) {
                currentTimeEl.textContent = this.formatTime(this.audio.currentTime);
            }
            
            if (totalTimeEl) {
                totalTimeEl.textContent = this.formatTime(this.audio.duration);
            }
        }
    }
    
    // 格式化时间
    formatTime(seconds) {
        if (isNaN(seconds) || seconds < 0) return '0:00';
        
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    // 设置播放进度
    setCurrentTime(time) {
        if (this.audio && this.audio.duration) {
            this.audio.currentTime = Math.max(0, Math.min(time, this.audio.duration));
            this.saveState();
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
                url: 'assets/audio/keshiii - Stuck In The Middle-BABYMONSTER.mp3',
                name: 'BABYMONSTER - Stuck In The Middle',
                fallback: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3'
            },
            'skills': {
                url: 'assets/audio/keshiii - Stuck In The Middle-BABYMONSTER.mp3',
                name: 'BABYMONSTER - Stuck In The Middle',
                fallback: 'https://www.soundjay.com/misc/sounds/typing-1.mp3'
            },
            'projects': {
                url: 'assets/audio/keshiii - Stuck In The Middle-BABYMONSTER.mp3',
                name: 'BABYMONSTER - Stuck In The Middle',
                fallback: 'https://www.soundjay.com/misc/sounds/beep-ping.mp3'
            },
            'blog-list': {
                url: 'assets/audio/keshiii - Stuck In The Middle-BABYMONSTER.mp3',
                name: 'BABYMONSTER - Stuck In The Middle',
                fallback: 'https://www.soundjay.com/misc/sounds/page-flip-01a.mp3'
            },
            'todo': {
                url: 'assets/audio/keshiii - Stuck In The Middle-BABYMONSTER.mp3',
                name: 'BABYMONSTER - Stuck In The Middle',
                fallback: 'https://www.soundjay.com/misc/sounds/button-09.mp3'
            }
        };
        
        this.currentPage = this.getCurrentPage();
        
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
            <div class="music-icon" title="点击播放/暂停音乐">
                <i class="fas fa-${this.audioPlayer.isPlaying ? 'pause' : 'play'}"></i>
            </div>
            <div class="music-info">
                <div class="music-title-container">
                    <span class="music-title">BABYMONSTER - Stuck In The Middle</span>
                </div>
                <div class="music-progress-container">
                    <span class="current-time">0:00</span>
                    <div class="music-progress" title="点击控制播放进度">
                        <div class="progress-bar"></div>
                    </div>
                    <span class="total-time">0:00</span>
                </div>
            </div>
            <div class="music-volume">
                <i class="fas fa-volume-up"></i>
                <input type="range" min="0" max="100" value="${this.audioPlayer.volume * 100}" class="volume-slider">
            </div>
        `;
        
        document.body.appendChild(musicControl);
        
        // 添加滚动CSS样式
        this.addScrollingStyles();
        
        // 设置初始播放状态
        const musicIcon = musicControl.querySelector('.music-icon');
        if (this.audioPlayer.isPlaying) {
            musicIcon.classList.add('playing');
        }
        
        // 绑定音量控制
        const volumeSlider = musicControl.querySelector('.volume-slider');
        volumeSlider.addEventListener('input', (e) => {
            const volume = e.target.value / 100;
            this.audioPlayer.setVolume(volume);
        });
        
        // 绑定点击播放/暂停
        musicIcon.addEventListener('click', () => {
            if (this.audioPlayer.isPlaying) {
                this.audioPlayer.pause();
                musicIcon.innerHTML = '<i class="fas fa-play"></i>';
                musicIcon.classList.remove('playing');
            } else {
                this.audioPlayer.play();
                musicIcon.innerHTML = '<i class="fas fa-pause"></i>';
                musicIcon.classList.add('playing');
            }
        });
        
        // 绑定进度条点击
        const progressContainer = musicControl.querySelector('.music-progress');
        progressContainer.addEventListener('click', (e) => {
            const rect = progressContainer.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const width = rect.width;
            const clickPercent = clickX / width;
            
            if (this.audioPlayer.audio && this.audioPlayer.audio.duration) {
                const newTime = clickPercent * this.audioPlayer.audio.duration;
                this.audioPlayer.setCurrentTime(newTime);
            }
        });
        
        // 启动歌曲名称滚动效果
        this.startTitleScrolling();
    }
    
    // 添加滚动样式
    addScrollingStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .music-control {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: rgba(135, 206, 235, 0.95);
                border-radius: 25px;
                padding: 10px 15px;
                display: flex;
                align-items: center;
                gap: 15px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                backdrop-filter: blur(10px);
                z-index: 9999;
                min-width: 350px;
                max-width: 450px;
                pointer-events: auto;
            }
            
            .music-control * {
                pointer-events: auto;
            }
            
            .music-icon {
                width: 45px;
                height: 45px;
                border-radius: 50%;
                background: linear-gradient(145deg, #ffffff, #e6e6e6);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.2s ease;
                color: #87CEEB;
                font-size: 18px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                border: 2px solid rgba(255,255,255,0.8);
                position: relative;
                z-index: 10001;
                flex-shrink: 0;
            }
            
            .music-icon:hover {
                transform: scale(1.05);
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                background: linear-gradient(145deg, #f0f8ff, #e0f6ff);
            }
            
            .music-icon.playing {
                animation: pulse 2s infinite;
                color: #4CAF50;
                border-color: #4CAF50;
            }
            
            @keyframes pulse {
                0% { 
                    transform: scale(1); 
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                }
                50% { 
                    transform: scale(1.02); 
                    box-shadow: 0 5px 12px rgba(0,0,0,0.15);
                }
                100% { 
                    transform: scale(1);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                }
            }
            
            .music-info {
                flex: 1;
                min-width: 0;
                display: flex;
                flex-direction: column;
                justify-content: center;
            }
            
            .music-title-container {
                height: 20px;
                overflow: hidden;
                position: relative;
                background: rgba(255,255,255,0.2);
                border-radius: 10px;
                padding: 0;
                display: flex;
                align-items: center;
            }
            
            .music-title {
                display: inline-block;
                white-space: nowrap;
                color: white;
                font-size: 13px;
                font-weight: 500;
                line-height: 20px;
                height: 20px;
                padding-left: 100%;
                animation: scroll-title 18s linear infinite;
            }
            
            @keyframes scroll-title {
                0% { 
                    transform: translateX(0); 
                }
                100% { 
                    transform: translateX(-100%); 
                }
            }
            
            .music-progress-container {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-top: 8px;
            }
            
            .current-time, .total-time {
                color: white;
                font-size: 11px;
                font-weight: 500;
                min-width: 35px;
                text-align: center;
            }
            
            .music-progress {
                flex: 1;
                height: 6px;
                background: rgba(255,255,255,0.3);
                border-radius: 3px;
                cursor: pointer;
                overflow: hidden;
                position: relative;
                transition: all 0.2s ease;
            }
            
            .music-progress:hover {
                height: 8px;
                background: rgba(255,255,255,0.4);
                transform: none;
            }
            
            .progress-bar {
                height: 100%;
                background: linear-gradient(90deg, #4CAF50, #81C784);
                width: 0%;
                transition: width 0.1s ease;
                border-radius: 3px;
            }
            
            .music-volume {
                display: flex;
                align-items: center;
                gap: 8px;
                flex-shrink: 0;
                position: relative;
                z-index: 10000;
            }
            
            .music-volume i {
                color: white;
                font-size: 16px;
            }
            
            .volume-slider {
                width: 60px;
                height: 4px;
                background: rgba(255,255,255,0.3);
                border-radius: 2px;
                outline: none;
                cursor: pointer;
            }
            
            .volume-slider::-webkit-slider-thumb {
                appearance: none;
                width: 14px;
                height: 14px;
                border-radius: 50%;
                background: white;
                cursor: pointer;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                position: relative;
                z-index: 10002;
            }
            
            .volume-slider::-moz-range-thumb {
                width: 14px;
                height: 14px;
                border-radius: 50%;
                background: white;
                cursor: pointer;
                border: none;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                position: relative;
                z-index: 10002;
            }
        `;
        document.head.appendChild(style);
    }
    
    // 启动歌曲名称滚动效果
    startTitleScrolling() {
        const titleElement = document.querySelector('.music-title');
        if (titleElement && this.currentPage && this.musicTracks[this.currentPage]) {
            titleElement.textContent = this.musicTracks[this.currentPage].name;
        }
    }
    
    // 不再需要悬停事件，只保留手动控制
    bindHoverEvents() {
        // 移除所有自动播放逻辑，只保留手动控制
        console.log('音乐播放器已初始化，请点击播放按钮开始播放');
    }
    
    // 加载页面音乐
    loadPageMusic() {
        if (this.currentPage && this.musicTracks[this.currentPage]) {
            const track = this.musicTracks[this.currentPage];
            
            // 如果当前没有轨道或轨道不同，才设置新轨道
            if (!this.audioPlayer.currentTrack || this.audioPlayer.currentTrack !== track.url) {
                this.audioPlayer.setTrack(track.url, track.name);
            }
        }
    }
    
    // 手动播放音乐
    startMusic() {
        if (this.currentPage && this.musicTracks[this.currentPage]) {
            this.audioPlayer.play();
            this.updatePlayButton();
        }
    }
    
    // 手动停止音乐
    stopMusic() {
        this.audioPlayer.pause();
        this.updatePlayButton();
    }
    
    // 更新播放按钮状态
    updatePlayButton() {
        const musicIcon = document.querySelector('.music-icon');
        if (musicIcon) {
            if (this.audioPlayer.isPlaying) {
                musicIcon.innerHTML = '<i class="fas fa-pause"></i>';
                musicIcon.classList.add('playing');
            } else {
                musicIcon.innerHTML = '<i class="fas fa-play"></i>';
                musicIcon.classList.remove('playing');
            }
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
            
            // 延迟更新按钮状态，确保DOM已加载
            setTimeout(() => {
                if (pageMusicManager) {
                    pageMusicManager.updatePlayButton();
                }
            }, 100);
            
            console.log('音乐播放器已初始化 - 点击播放按钮开始播放');
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