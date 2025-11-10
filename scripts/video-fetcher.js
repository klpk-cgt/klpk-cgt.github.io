const axios = require('axios');
const fs = require('fs');
const path = require('path');

// 配置
const API_URL = 'https://cn.apihz.cn/api/fun/girl.php?id=10009714&key=dad93199ae1931cb95113604767f4618'; // 请替换为您的实际API地址
const OUTPUT_DIR = 'videos';
const MAX_VIDEOS = 5; // 最多保存的视频数量

// 确保输出目录存在
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
}

async function getRandomVideo() {
    try {
        console.log('正在调用视频API...');
        const response = await axios.get(API_URL, {
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        
        console.log('API响应状态:', response.status);
        
        if (response.status === 200 && response.data && response.data.code === 200) {
            const videoData = response.data;
            
            // 格式化视频信息
            const formattedData = {
                nickname: videoData.nickname || '未知',
                type: videoData.type || '未知类型',
                desc: videoData.desc || '无描述',
                size: formatFileSize(videoData.size || '0'),
                videoUrl: videoData.video,
                createTime: new Date(parseInt(videoData.create_time) * 1000).toLocaleString('zh-CN')
            };
            
            return formattedData;
        }
        
        throw new Error('API返回数据无效');
        
    } catch (error) {
        console.error('获取视频数据失败:', error.message);
        
        // 使用备用数据
        return {
            nickname: '备用视频',
            type: '示例视频',
            desc: '这是一个备用视频示例',
            size: '28.5 MB',
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            createTime: new Date().toLocaleString('zh-CN')
        };
    }
}

function formatFileSize(bytes) {
    if (!bytes) return '未知大小';
    const size = parseInt(bytes);
    if (size < 1024) return size + ' B';
    if (size < 1024 * 1024) return (size / 1024).toFixed(2) + ' KB';
    return (size / (1024 * 1024)).toFixed(2) + ' MB';
}

async function downloadVideo(videoUrl, outputPath) {
    try {
        if (!videoUrl) {
            throw new Error('视频URL为空');
        }
        
        const response = await axios({
            method: 'GET',
            url: videoUrl,
            responseType: 'stream',
            timeout: 30000
        });
        
        const writer = fs.createWriteStream(outputPath);
        response.data.pipe(writer);
        
        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
        
    } catch (error) {
        console.error('下载视频失败:', error);
        throw error;
    }
}

async function saveVideoInfo(videoData) {
    const infoContent = `昵称: ${videoData.nickname}\n类型: ${videoData.type}\n描述: ${videoData.desc}\n大小: ${videoData.size}\n创建时间: ${videoData.createTime}\n更新时间: ${new Date().toLocaleString('zh-CN')}`;
    fs.writeFileSync('video-info.txt', infoContent, 'utf8');
    console.log('视频信息已保存');
}

async function manageVideos() {
    // 清理旧视频，只保留最新的MAX_VIDEOS个
    const files = fs.readdirSync(OUTPUT_DIR)
        .filter(file => file.endsWith('.mp4'))
        .map(file => ({
            name: file,
            time: fs.statSync(path.join(OUTPUT_DIR, file)).mtime.getTime()
        }))
        .sort((a, b) => b.time - a.time);
    
    if (files.length > MAX_VIDEOS) {
        const toDelete = files.slice(MAX_VIDEOS);
        toDelete.forEach(file => {
            fs.unlinkSync(path.join(OUTPUT_DIR, file.name));
            console.log(`删除旧视频: ${file.name}`);
        });
    }
}

async function main() {
    try {
        console.log('开始获取随机视频...');
        
        // 获取视频信息
        const videoData = await getRandomVideo();
        
        // 保存视频信息
        await saveVideoInfo(videoData);
        
        // 下载视频
        if (videoData.videoUrl) {
            try {
                const videoFilename = `video-${Date.now()}.mp4`;
                const videoPath = path.join(OUTPUT_DIR, videoFilename);
                
                console.log('开始下载视频...');
                await downloadVideo(videoData.videoUrl, videoPath);
                console.log(`视频已下载: ${videoFilename}`);
                
                // 记录下载的视频文件名
                fs.writeFileSync('current-video.txt', videoFilename, 'utf8');
                
                // 管理视频文件
                await manageVideos();
            } catch (downloadError) {
                console.log('视频下载失败，仅保存信息文件');
            }
        }
        
    } catch (error) {
        console.error('主程序错误:', error);
    }
}

// 如果直接运行此文件
if (require.main === module) {
    main();
}

module.exports = {
    getRandomVideo,
    downloadVideo
};
