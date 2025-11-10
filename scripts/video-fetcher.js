const axios = require('axios');
const fs = require('fs');

async function getVideoData() {
    try {
        const token = process.env.VIDEO_API_TOKEN || '您的视频API token';
        
        // 调用视频API获取随机视频
        const response = await axios.post('https://cn.apihz.cn/api/fun/girl.php?id=10009714&key=dad93199ae1931cb95113604767f4618', {
            token: token,
            type: 'mp4' // 指定获取MP4格式视频
        });
        
        if (response.data && response.data.success) {
            const videoData = response.data.data;
            
            // 返回视频信息
            return {
                title: videoData.title || '随机视频',
                url: videoData.url,
                duration: videoData.duration || '未知',
                size: videoData.size || '未知',
                source: videoData.source || 'API生成'
            };
        }
        return {
            title: '视频数据获取失败',
            url: '',
            duration: '未知',
            size: '未知',
            source: 'API错误'
        };
    } catch (error) {
        console.error('获取视频数据失败:', error);
        return {
            title: '视频数据获取失败',
            url: '',
            duration: '未知',
            size: '未知',
            source: '网络错误'
        };
    }
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

async function main() {
    try {
        console.log('开始获取视频数据...');
        
        // 获取视频信息
        const videoInfo = await getVideoData();
        
        // 保存视频信息到文本文件
        const infoContent = `视频标题：${videoInfo.title}\n视频时长：${videoInfo.duration}\n视频大小：${videoInfo.size}\n视频来源：${videoInfo.source}\n获取时间：${new Date().toLocaleString('zh-CN')}`;
        fs.writeFileSync('video-info.txt', infoContent, 'utf8');
        console.log('视频信息已保存到 video-info.txt');
        
        // 如果有视频URL，尝试下载视频
        if (videoInfo.url) {
            try {
                const outputFilename = `video-${Date.now()}.mp4`;
                await downloadVideo(videoInfo.url, outputFilename);
                console.log(`视频已下载: ${outputFilename}`);
                
                // 记录下载的视频文件名
                fs.writeFileSync('video-filename.txt', outputFilename, 'utf8');
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
    getVideoData,
    downloadVideo
};
