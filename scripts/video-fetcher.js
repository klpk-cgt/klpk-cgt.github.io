const axios = require('axios');
const fs = require('fs');

async function getVideoData() {
    try {
        // 直接使用您的API接口，无需TOKEN
        const apiUrl = 'https://cn.apihz.cn/api/fun/girl.php?id=10009714&key=dad93199ae1931cb95113604767f4618'; // 请替换为您的实际API地址
        
        console.log('正在调用视频API...');
        const response = await axios.get(apiUrl, {
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        
        console.log('API响应状态:', response.status);
        
        if (response.data) {
            // 根据您的API返回格式调整这里
            // 假设API返回 { title: string, url: string, duration: string, size: string }
            const videoData = response.data;
            
            return {
                title: videoData.title || '随机视频',
                url: videoData.url,
                duration: videoData.duration || '未知',
                size: videoData.size || '未知',
                source: videoData.source || 'API'
            };
        }
        
        throw new Error('API返回数据为空');
        
    } catch (error) {
        console.error('获取视频数据失败:', error.message);
        
        // 使用备用数据
        return {
            title: `备用视频 - ${new Date().toLocaleString('zh-CN')}`,
            url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            duration: "10:53",
            size: "28.5 MB",
            source: "Google示例视频库"
        };
    }
}

async function main() {
    try {
        console.log('开始获取视频数据...');
        
        // 获取视频信息
        const videoInfo = await getVideoData();
        
        // 保存视频信息到文本文件
        const infoContent = `视频标题：${videoInfo.title}\n视频时长：${videoInfo.duration}\n视频大小：${videoInfo.size}\n视频来源：${videoInfo.source}\n获取时间：${new Date().toLocaleString('zh-CN')}`;
        fs.writeFileSync('video-info.txt', infoContent, 'utf8');
        console.log('视频信息已保存到 video-info.txt');
        
        // 保存视频URL到单独文件
        if (videoInfo.url) {
            fs.writeFileSync('video-url.txt', videoInfo.url, 'utf8');
            console.log('视频URL已保存到 video-url.txt');
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
    getVideoData
};
