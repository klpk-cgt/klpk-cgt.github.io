const axios = require('axios');
const fs = require('fs');

class NewsAPI {
    constructor() {
        this.apiUrl = 'https://v3.alapi.cn/api/new/toutiao'; // 请替换为您的实际API端点
        this.token = process.env.NEWS_API_TOKEN || 'vtilq5ptzyhmputx1srvrdqowgvbe7';
    }

    async getTop3News() {
        try {
            console.log('正在获取网易新闻头条...');
            
            const response = await axios.get(this.apiUrl, {
                params: {
                    token: this.token
                },
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                },
                timeout: 10000
            });

            const result = response.data;
            
            // 验证API响应
            if (!result.success || result.code !== 200) {
                throw new Error(`API返回错误: ${result.message}`);
            }

            if (!result.data || !Array.isArray(result.data)) {
                throw new Error('API返回数据格式异常');
            }

            // 只取前3条新闻
            const top3News = result.data.slice(0, 3);
            
            return this.formatNews(top3News);
            
        } catch (error) {
            console.error('获取新闻失败:', error.message);
            return this.getFallbackNews();
        }
    }

    formatNews(newsArray) {
        let formatted = `📰 今日新闻头条\n\n`;
        formatted += `更新时间: ${new Date().toLocaleString('zh-CN')}\n\n`;

        newsArray.forEach((news, index) => {
            formatted += `🔥 ${index + 1}. ${news.title}\n`;
            
            if (news.digest && news.digest.trim()) {
                formatted += `   摘要: ${news.digest}\n`;
            }
            
            if (news.source) {
                formatted += `   来源: ${news.source}`;
            }
            
            if (news.time) {
                formatted += ` | 时间: ${news.time}`;
            }
            
            formatted += '\n\n';
        });

        return formatted;
    }

    getFallbackNews() {
        // 备用新闻数据
        const fallbackNews = [
            {
                title: "第十五届全运会在粤港澳隆重开幕",
                digest: "习近平宣布第十五届全运会开幕，粤港澳三地首次同步举办",
                source: "央视新闻",
                time: new Date().toLocaleString('zh-CN')
            },
            {
                title: "多库迎来曼城生涯第100次出场",
                digest: "英超第11轮，曼城主场对阵利物浦，多库首发出战迎来里程碑",
                source: "懂球帝",
                time: new Date().toLocaleString('zh-CN')
            },
            {
                title: "哈登带病出场40分钟，快船遭遇四连败",
                digest: "转战洛杉矶的菲尼克斯太阳以114比103再次战胜了洛杉矶快船",
                source: "稻谷与小麦",
                time: new Date().toLocaleString('zh-CN')
            }
        ];

        let result = `📰 今日新闻头条 (备用数据)\n\n`;
        result += `⚠️ 注意: API连接失败，使用备用数据\n\n`;

        fallbackNews.forEach((news, index) => {
            result += `🔥 ${index + 1}. ${news.title}\n`;
            result += `   摘要: ${news.digest}\n`;
            result += `   来源: ${news.source} | 时间: ${news.time}\n\n`;
        });

        return result;
    }

    async saveToFile(content, filename = 'news.txt') {
        try {
            fs.writeFileSync(filename, content, 'utf8');
            console.log(`✅ 新闻已保存到: ${filename}`);
            return true;
        } catch (error) {
            console.error('保存文件失败:', error.message);
            return false;
        }
    }
}

// 使用示例
async function main() {
    const newsAPI = new NewsAPI();
    
    try {
        // 获取前3条新闻
        const newsContent = await newsAPI.getTop3News();
        
        // 显示在控制台
        console.log('\n' + '='.repeat(60));
        console.log(newsContent);
        console.log('='.repeat(60));
        
        // 保存到文件
        await newsAPI.saveToFile(newsContent);
        
    } catch (error) {
        console.error('程序执行失败:', error.message);
    }
}

// 如果直接运行此文件
if (require.main === module) {
    main();
}

module.exports = NewsAPI;
