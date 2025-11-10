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
    let videoFilename = null;
    
    try {
        if (fs.existsSync('video-info.txt')) {
            videoInfo = fs.readFileSync('video-info.txt', 'utf8');
        }
        
        if (fs.existsSync('video-filename.txt')) {
            videoFilename = fs.readFileSync('video-filename.txt', 'utf8').trim();
        }
    } catch (error) {
        console.error('读取视频文件信息失败:', error);
    }
    
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
        }
        
        .btn {
            padding: 10px 20px;
            background: #1a2a6c;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 1rem;
            margin: 0 10px;
            text-decoration: none;
            display: inline-block;
        }
        
        .btn:hover {
            background: #0d1a4a;
        }
        
        footer {
            text-align: center;
            padding: 20px;
            color: rgba(255, 255, 255, 0.8);
            margin-top: 30px;
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
                ${videoFilename ? 
                    `<video controls autoplay muted>
                        <source src="${videoFilename}" type="video/mp4">
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
                <a href="video-info.txt" class="btn" download>下载信息文件</a>
                ${videoFilename ? `<a href="${videoFilename}" class="btn" download>下载视频文件</a>` : ''}
            </div>
        </div>
    </div>
    
    <footer>
        <p>随机视频播放器 &copy; ${year} | 最后更新: ${now.toLocaleString('zh-CN')}</p>
    </footer>
</body>
</html>`;
    
    // 写入HTML文件
    fs.writeFileSync('video-player.html', htmlContent, 'utf8');
    console.log('视频播放页面已生成: video-player.html');
    
    // 生成简单的文本汇总（可选）
    const summaryContent = `随机视频汇总\n${dateString}\n\n${videoInfo}\n\n生成时间: ${now.toLocaleString('zh-CN')}`;
    fs.writeFileSync('video-summary.txt', summaryContent, 'utf8');
    console.log('视频汇总文件已生成: video-summary.txt');
}

// 如果直接运行此文件
if (require.main === module) {
    generateVideoPage();
}

module.exports = generateVideoPage;
