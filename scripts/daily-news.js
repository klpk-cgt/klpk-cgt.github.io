const axios = require('axios');
const fs = require('fs');

async function getDailyNews() {
    try {
        // 使用网易新闻API
        const token = process.env.NEWS_API_KEY || 'vtilq5ptzyhmputx1srvrdqowgvbe7';
        
        if (!token) {
            console.error('网易新闻API token不能为空');
            return await getNewsFromSina();
        }
        
        // 构建API请求URL - 根据您提供的链接2格式
        const apiUrl = `https://api.163.com/news?token=${token}`;
        
        const response = await axios.get(apiUrl, {
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 10000
        });
        
        const resultData = response.data;
        
        // 检查API响应是否成功
        if (resultData.success && resultData.code === 200 && resultData.data) {
            let result = "今日网易头条新闻：\n\n";
            
            resultData.data.slice(0, 10).forEach((article, index) => {
                result += `${index + 1}. ${article.title}\n`;
                if (article.digest) {
                    result += `   摘要: ${article.digest}\n`;
                }
                if (article.source) {
                    result += `   来源: ${article.source}\n`;
                }
                if (article.time) {
                    result += `   时间: ${article.time}\n`;
                }
                result += '\n';
            });
            
            return result;
        } else {
            console.error('网易新闻API返回错误:', resultData.message);
            return await getNewsFromSina();
        }
        
    } catch (error) {
        console.error('获取网易新闻失败:', error.message);
        // 如果网易API失败，尝试备选方案
        return await getNewsFromSina();
    }
}

async function getNewsFromSina() {
    try {
        // 备选方案：爬取新浪新闻头条
        const cheerio = require('cheerio');
        
        const response = await axios.get('https://news.sina.com.cn', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 10000
        });
        
        const $ = cheerio.load(response.data);
        let result = "今日新浪头条新闻：\n\n";
        
        // 尝试多种选择器来获取新闻标题
        const selectors = [
            '.news-item h2 a',
            '.news-item a',
            '.blk-top-news a',
            '.news-title a',
            'a[href*="news.sina.com.cn"]'
        ];
        
        let newsCount = 0;
        for (const selector of selectors) {
            $(selector).each((index, element) => {
                if (newsCount >= 10) return false;
                
                const title = $(element).text().trim();
                const href = $(element).attr('href');
                
                if (title && title.length > 5 && !title.includes('广告') && href) {
                    result += `${newsCount + 1}. ${title}\n`;
                    newsCount++;
                }
            });
            
            if (newsCount >= 10) break;
        }
        
        return result || "今日新闻：数据获取失败";
    } catch (error) {
        console.error('获取新浪新闻失败:', error.message);
        return "今日新闻：所有数据源获取失败，请检查网络连接或稍后重试";
    }
}

// 新增：使用unirest的替代方案（如果需要）
async function getNewsWithUnirest() {
    try {
        const unirest = require('unirest');
        const token = process.env.NEWS_API_KEY || 'vtilq5ptzyhmputx1srvrdqowgvbe7';
        
        const response = await unirest.get(`https://api.163.com/news?token=${token}`)
            .header('Content-Type', 'application/json')
            .timeout(10000);
        
        if (response.body && response.body.success) {
            let result = "今日网易新闻（Unirest）：\n\n";
            response.body.data.slice(0, 10).forEach((article, index) => {
                result += `${index + 1}. ${article.title}\n`;
            });
            return result;
        }
        
        return await getDailyNews(); // 回退到主方案
    } catch (error) {
        console.error('Unirest获取新闻失败:', error.message);
        return await getDailyNews();
    }
}

async function main() {
    try {
        console.log('开始获取今日新闻...');
        const dailyNews = await getDailyNews();
        
        // 保存到文件
        fs.writeFileSync('news.txt', dailyNews, 'utf8');
        console.log('新闻信息已保存到 news.txt');
        
        // 同时在控制台显示
        console.log('\n' + '='.repeat(50));
        console.log(dailyNews);
        console.log('='.repeat(50));
        
    } catch (error) {
        console.error('主程序错误:', error.message);
    }
}

// 如果直接运行此文件
if (require.main === module) {
    main();
}

module.exports = {
    getDailyNews,
    getNewsFromSina,
    getNewsWithUnirest
};
