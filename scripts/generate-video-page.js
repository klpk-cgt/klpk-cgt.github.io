const fs = require('fs');
const path = require('path');

function generateVideoPage() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const dateString = `日期：${year}年${month}月${day}日`;
    
    // 读取视频信息
    let videoInfo = '视频信息：数据获取中...';
    let videoFilename = '';
    
    try {
        if (fs.existsSync('video-info.txt')) {
            videoInfo = fs.readFileSync('video-info.txt', 'utf8');
        }
        
        if (fs.existsSync('current-video.txt')) {
            videoFilename = fs.readFileSync('current-video.txt', 'utf8').trim();
        }
    } catch (error) {
        console.error('读取视频文件信息失败:', error);
    }
    
    // 获取视频文件路径
    const videoPath = videoFilename ? path.join('videos', videoFilename) : '';
    
    // 生成HTML页面内容
    const htmlContent = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>随机视频播放器</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        body {
            background: linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d);
            color: #333;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px;
        }
        
        .container {
            max-width: 800px;
            width: 100%;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 15px;
            box-shadow: 0 15px 50px rgba(0, 0, 0, 0.3);
            overflow: hidden;
            margin-top: 20px;
        }
        
        header {
            background: linear-gradient(45deg, #1a2a6c, #b21f1f);
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
        }
        
        .subtitle {
            font-size: 1.1rem;
            opacity: 0.9;
        }
        
        .video-container {
            padding: 30px;
            text-align: center;
        }
        
        .video-player {
            width: 100%;
            max-width: 600px;
            margin: 0 auto 20px;
            background: #000;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        
        video {
            width: 100%;
            display: block;
        }
        
        .video-info {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
            margin-top: 20px;
            text-align: left;
            white-space: pre-line;
            line-height: 1.6;
        }
        
        .controls {
            margin-top: 20px;
            display: flex;
            justify-content: center;
            gap: 15px;
            flex-wrap: wrap;
        }
        
        .btn {
            padding: 10px 20px;
            background: #1a2a6c;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 1rem;
            text-decoration: none;
            display: inline-block;
            transition: background 0.3s;
        }
        
        .btn:hover {
            background: #0d1a4a;
        }
        
        .btn-secondary {
            background: #fdbb2d;
            color: #333;
        }
        
        .btn-secondary:hover {
            background: #e6a41a;
        }
        
        footer {
            text-align: center;
            padding: 20px;
            color: rgba(255, 255, 255, 0.8);
            margin-top: 30px;
        }
        
        .history {
            margin-top: 30px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 10px;
        }
        
        .history-title {
            font-size: 1.2rem;
            color: #1a2a6c;
            margin-bottom: 15px;
            text-align: center;
        }
        
        .video-list {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 15px;
        }
        
        .video-item {
            background: white;
            border-radius: 5px;
            overflow: hidden;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s;
        }
        
        .video-item:hover {
            transform: translateY(-5px);
        }
        
        .video-thumb {
            width: 100%;
            height: 100px;
            background: #000;
            position: relative;
        }
        
        .video-thumb::after {
            content: '▶';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-size: 24px;
            opacity: 0.8;
        }
        
        .video-name {
            padding: 8px;
            font-size: 0.8rem;
            text-align: center;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        
        @media (max-width: 768px) {
            .container {
                margin: 10px;
            }
            
            header {
                padding: 20px;
            }
            
            h1 {
                font-size: 2rem;
            }
            
            .video-list {
                grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>🎬 随机视频播放器</h1>
            <p class="subtitle">${dateString}</p>
        </header>
        
        <div class="video-container">
            <div class="video-player">
                ${videoPath ? 
                    `<video controls autoplay muted>
                        <source src="${videoPath}" type="video/mp4">
                        您的浏览器不支持视频播放
                    </video>` : 
                    '<div style="padding: 50px; text-align: center; color: #666;">暂无视频文件</div>'
                }
            </div>
            
            <div class="video-info">
                ${videoInfo}
            </div>
            
            <div class="controls">
                <button class="btn" onclick="location.reload()">刷新页面</button>
                <a href="video-info.txt" class="btn btn-secondary" download>下载信息文件</a>
                ${videoPath ? `<a href="${videoPath}" class="btn" download>下载视频文件</a>` : ''}
            </div>
        </div>
        
        <div class="history">
            <div class="history-title">历史视频</div>
            <div class="video-list" id="videoList">
                <!-- 历史视频将动态加载 -->
            </div>
        </div>
    </div>
    
    <footer>
        <p>随机视频播放器 &copy; ${year} | 最后更新: ${now.toLocaleString('zh-CN')}</p>
    </footer>
    
    <script>
        // 加载历史视频列表
        function loadHistoryVideos() {
            const videoList = document.getElementById('videoList');
            videoList.innerHTML = '';
            
            // 获取所有视频文件
            fetch('videos/')
                .then(response => response.text())
                .then(text => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(text, 'text/html');
                    const links = Array.from(doc.querySelectorAll('a'));
                    
                    const videoFiles = links
                        .filter(link => link.href.endsWith('.mp4'))
                        .map(link => link.textContent);
                    
                    // 显示历史视频
                    videoFiles.forEach(file => {
                        const videoItem = document.createElement('div');
                        videoItem.className = 'video-item';
                        videoItem.innerHTML = `
                            <a href="videos/${file}" class="video-thumb"></a>
                            <div class="video-name">${file}</div>
                        `;
                        videoList.appendChild(videoItem);
                    });
                    
                    if (videoFiles.length === 0) {
                        videoList.innerHTML = '<div style="text-align: center; padding: 20px;">暂无历史视频</div>';
                    }
                })
                .catch(error => {
                    console.error('加载历史视频失败:', error);
                    videoList.innerHTML = '<div style="text-align: center; padding: 20px; color: #721c24;">加载历史视频失败</div>';
                });
        }
        
        // 页面加载完成后执行
        document.addEventListener('DOMContentLoaded', () => {
            loadHistoryVideos();
        });
    </script>
</body>
</html>`;
    
    // 写入HTML文件
    fs.writeFileSync('index.html', htmlContent, 'utf8');
    console.log('视频播放页面已生成: index.html');
}

// 如果直接运行此文件
if (require.main === module) {
    generateVideoPage();
}

module.exports = generateVideoPage;
