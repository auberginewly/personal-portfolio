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
                    
                    // 监听音频加载完成事件，然后恢复播放进度
                    this.audio.addEventListener('loadedmetadata', () => {
                        this.audio.currentTime = state.currentTime || 0;
                        
                        // 如果之前在播放，恢复播放
                        if (this.isPlaying) {
                            this.audio.play().catch(e => {
                                console.log('自动播放被阻止，需要用户交互');
                                this.isPlaying = false;
                            });
                        }
                    }, { once: true });
                    
                    // 立即加载音频元数据
                    this.audio.load();
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
            // 检查是否是相同音频文件的不同路径
            const currentFileName = this.currentTrack ? this.currentTrack.split('/').pop() : '';
            const newFileName = trackUrl.split('/').pop();
            
            if (currentFileName === newFileName && currentFileName !== '') {
                // 相同音频文件，只更新路径，保持播放状态
                console.log(`🔄 更新音频文件路径: ${this.currentTrack} -> ${trackUrl}`);
                const wasPlaying = this.isPlaying;
                const currentTime = this.audio ? this.audio.currentTime : 0;
                
                this.currentTrack = trackUrl;
                this.audio.src = trackUrl;
                
                // 如果正在播放，恢复播放状态
                if (wasPlaying) {
                    this.audio.addEventListener('loadedmetadata', () => {
                        this.audio.currentTime = currentTime;
                        this.audio.play().catch(e => {
                            console.warn('路径更新后恢复播放失败:', e);
                        });
                    }, { once: true });
                } else {
                    this.audio.addEventListener('loadedmetadata', () => {
                        this.audio.currentTime = currentTime;
                    }, { once: true });
                }
                
                this.audio.load();
            } else {
                // 完全不同的音频文件
                this.currentTrack = trackUrl;
                this.audio.src = trackUrl;
                console.log(`设置音乐轨道: ${trackName || trackUrl}`);
            }
            
            this.saveState();
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
            const progressSlider = document.querySelector('.progress-slider');
            const currentTimeEl = document.querySelector('.current-time');
            const totalTimeEl = document.querySelector('.total-time');
            
            if (progressSlider) {
                progressSlider.value = progress;
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
        console.log('🎵 PageMusicManager初始化开始');
        console.log('📍 当前页面:', this.currentPage);
        console.log('🎼 可用轨道:', Object.keys(this.musicTracks));
        
        try {
            this.createMusicControls();
            this.bindHoverEvents();
            this.loadPageMusic();
            console.log('✅ PageMusicManager初始化完成');
        } catch (error) {
            console.error('❌ PageMusicManager初始化失败:', error);
            throw error;
        }
    }
    
    // 获取当前页面类型
    getCurrentPage() {
        const path = window.location.pathname.toLowerCase();
        console.log('当前路径:', path);
        
        // 更健壮的页面检测逻辑，支持有无.html扩展名的情况
        if (path.includes('index') || path === '/' || path.endsWith('/') || path === '' || path === '/index') {
            return 'index';
        } else if (path.includes('skills')) {
            // 无论是skills.html还是skills/子页面，都返回skills
            console.log('检测到skills页面或子页面');
            return 'skills';
        } else if (path.includes('projects')) {
            return 'projects';
        } else if (path.includes('blog-list') || path.includes('blog_list')) {
            return 'blog-list';
        } else if (path.includes('todo')) {
            return 'todo';
        }
        
        // 如果没有匹配到具体页面，默认返回index
        console.log('未匹配到具体页面，默认使用index配置');
        return 'index';
    }
    
    // 创建音乐控制器UI
    createMusicControls() {
        // 检查是否已存在音乐控制器
        const existingControl = document.querySelector('.music-control');
        if (existingControl) {
            console.log('🔄 发现已存在的音乐控制器，移除旧的');
            existingControl.remove();
        }
        
        console.log('🎛️ 创建音乐控制器UI');
        const musicControl = document.createElement('div');
        musicControl.className = 'music-control';
        
        // 获取当前页面的歌曲名称
        const songName = this.currentPage && this.musicTracks[this.currentPage] 
            ? this.musicTracks[this.currentPage].name 
            : 'BABYMONSTER - Stuck In The Middle';
        
        musicControl.innerHTML = `
            <div class="music-icon" title="点击播放/暂停音乐">
                <i class="fas fa-${this.audioPlayer.isPlaying ? 'pause' : 'play'}"></i>
            </div>
            <div class="music-info">
                <div class="music-title-container">
                    <span class="music-title">${songName}</span>
                </div>
                <div class="music-progress-container">
                    <span class="current-time">0:00</span>
                    <input type="range" min="0" max="100" value="0" class="progress-slider">
                    <span class="total-time">0:00</span>
                </div>
            </div>
            <div class="music-volume">
                <i class="fas fa-volume-up"></i>
                <input type="range" min="0" max="100" value="${this.audioPlayer.volume * 100}" class="volume-slider">
            </div>
        `;
        
        document.body.appendChild(musicControl);
        console.log('✅ 音乐控制器UI已添加到页面');
        
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
        
        // 绑定进度滑块拖动
        const progressSlider = musicControl.querySelector('.progress-slider');
        progressSlider.addEventListener('input', (e) => {
            if (this.audioPlayer.audio && this.audioPlayer.audio.duration) {
                const percent = e.target.value / 100;
                const newTime = percent * this.audioPlayer.audio.duration;
                this.audioPlayer.setCurrentTime(newTime);
            }
        });
        
        // 延迟启动歌曲名称滚动效果，确保DOM完全渲染
        setTimeout(() => {
            this.startTitleScrolling();
        }, 100);
    }
    
    // 添加额外的JavaScript专用样式
    addScrollingStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* 覆盖部分音乐控制器样式以适配JavaScript版本 */
            .music-control {
                background: rgba(135, 206, 235, 0.95) !important;
                border-radius: 25px !important;
                min-width: 350px !important;
                max-width: 450px !important;
                z-index: 9999 !important;
            }
            
            .music-icon {
                background: linear-gradient(145deg, #ffffff, #e6e6e6) !important;
                color: #87CEEB !important;
                border: 2px solid rgba(255,255,255,0.8) !important;
                z-index: 10001 !important;
            }
            
            .music-icon:hover {
                background: linear-gradient(145deg, #f0f8ff, #e0f6ff) !important;
            }
            
            .music-icon.playing {
                color: #4CAF50 !important;
                border-color: #4CAF50 !important;
                animation: pulse 2s infinite !important;
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
            
            .music-title-container {
                background: rgba(255,255,255,0.2) !important;
                height: auto !important;
                border-radius: 8px !important;
                padding: 2px !important;
                margin-bottom: 6px !important;
                display: block !important;
                overflow: visible !important;
            }
            
            .music-title {
                color: white !important;
                display: block !important;
                font-size: 12px !important;
                font-weight: bold !important;
                text-align: center !important;
                padding: 2px 8px !important;
                margin: 0 !important;
                background: none !important;
                animation: none !important;
            }
            
            .current-time, .total-time {
                color: white !important;
            }
            
            .progress-slider {
                background: rgba(255,255,255,0.3) !important;
            }
            
            .progress-slider:hover {
                background: rgba(255,255,255,0.4) !important;
            }
            
            .progress-slider::-webkit-slider-thumb {
                background: linear-gradient(135deg, #87CEEB, #5F9EA0) !important;
            }
            
            .progress-slider::-moz-range-thumb {
                background: linear-gradient(135deg, #87CEEB, #5F9EA0) !important;
            }
            
            .music-volume i {
                color: white !important;
            }
            
            .volume-slider {
                background: rgba(255,255,255,0.3) !important;
            }
            
            .volume-slider::-webkit-slider-thumb {
                background: white !important;
            }
            
            .volume-slider::-moz-range-thumb {
                background: white !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // 启动歌曲名称滚动效果
    startTitleScrolling() {
        const titleElement = document.querySelector('.music-title');
        const containerElement = document.querySelector('.music-title-container');
        
        if (titleElement && this.currentPage && this.musicTracks[this.currentPage]) {
            // 设置歌曲名称
            const songName = this.musicTracks[this.currentPage].name;
            titleElement.textContent = songName;
            
            // 简单直接的样式设置 - 不要滚动
            titleElement.style.cssText = `
                display: block !important;
                color: white !important;
                font-size: 12px !important;
                font-weight: bold !important;
                text-align: center !important;
                padding: 2px 8px !important;
                margin: 0 !important;
                background: none !important;
                animation: none !important;
            `;
            
            // 简单的容器样式
            if (containerElement) {
                containerElement.style.cssText = `
                    height: auto !important;
                    background: rgba(255, 255, 255, 0.2) !important;
                    border-radius: 8px !important;
                    padding: 2px !important;
                    margin-bottom: 6px !important;
                    display: block !important;
                    overflow: visible !important;
                `;
            }
            
            console.log(`🎵 歌曲标题已设置: "${songName}"`);
            console.log('📱 标题元素:', titleElement);
            console.log('📦 容器元素:', containerElement);
        } else {
            console.warn('⚠️ 无法找到标题元素或页面信息');
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
            
            // 根据当前页面路径调整音乐文件路径
            let audioUrl = track.url;
            const path = window.location.pathname.toLowerCase();
            
            // 如果是skills子页面，需要修正路径
            if (path.includes('skills/')) {
                // 将 assets/audio/ 改为 ../assets/audio/
                audioUrl = track.url.replace('assets/', '../assets/');
                console.log('🔧 Skills子页面路径修正:', audioUrl);
            }
            
            // 检查当前轨道是否是同一首歌（忽略路径差异）
            const currentFileName = this.audioPlayer.currentTrack ? this.audioPlayer.currentTrack.split('/').pop() : '';
            const newFileName = audioUrl.split('/').pop();
            
            console.log('📀 比较音频文件:');
            console.log('  当前:', currentFileName);
            console.log('  新的:', newFileName);
            
            // 如果是相同的音频文件但路径不同，更新路径但保持播放状态
            if (currentFileName === newFileName && this.audioPlayer.currentTrack !== audioUrl) {
                console.log('🔄 相同音乐文件，更新路径但保持播放状态');
                const wasPlaying = this.audioPlayer.isPlaying;
                const currentTime = this.audioPlayer.audio ? this.audioPlayer.audio.currentTime : 0;
                
                // 更新音频源
                this.audioPlayer.currentTrack = audioUrl;
                this.audioPlayer.audio.src = audioUrl;
                
                // 如果正在播放，需要重新加载并恢复播放
                if (wasPlaying) {
                    this.audioPlayer.audio.addEventListener('loadedmetadata', () => {
                        this.audioPlayer.audio.currentTime = currentTime;
                        this.audioPlayer.audio.play().catch(e => {
                            console.warn('恢复播放失败:', e);
                        });
                    }, { once: true });
                } else {
                    // 如果未播放，只需恢复时间位置
                    this.audioPlayer.audio.addEventListener('loadedmetadata', () => {
                        this.audioPlayer.audio.currentTime = currentTime;
                    }, { once: true });
                }
                
                this.audioPlayer.audio.load();
                this.audioPlayer.saveState();
            }
            // 如果是完全不同的轨道，才设置新轨道
            else if (!this.audioPlayer.currentTrack || currentFileName !== newFileName) {
                console.log('🎵 设置新音乐轨道');
                this.audioPlayer.setTrack(audioUrl, track.name);
            }
            else {
                console.log('✅ 音乐轨道已正确设置，无需更改');
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
    // 更健壮的页面检测，与getCurrentPage()保持一致
    const path = window.location.pathname.toLowerCase();
    console.log('DOMContentLoaded - 检测路径:', path);
    
    // 支持的页面模式，不依赖具体扩展名
    const supportedPatterns = ['index', 'skills', 'projects', 'blog-list', 'blog_list', 'todo'];
    const isSupported = supportedPatterns.some(pattern => path.includes(pattern)) || 
                       path === '/' || path.endsWith('/') || path === '';
    
    // 总是初始化音乐播放器，增强兼容性
    try {
        pageMusicManager = new PageMusicManager();
        
        // 延迟更新按钮状态，确保DOM已加载
        setTimeout(() => {
            if (pageMusicManager) {
                pageMusicManager.updatePlayButton();
            }
        }, 100);
        
        console.log('音乐播放器已初始化 - 点击播放按钮开始播放');
        console.log('支持状态:', isSupported ? '支持' : '默认支持');
    } catch (error) {
        console.warn('音乐播放器初始化失败:', error);
    }
});

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AudioPlayer, PageMusicManager };
}

// 全局访问
window.AudioPlayer = AudioPlayer;
window.PageMusicManager = PageMusicManager; 