const axios = require('axios');
const fs = require('fs');

async function getDailyNews() {
    try {
        // 使用NewsAPI（需要免费注册获取API密钥）
        const apiKey = process.env.NEWS_API_KEY;
        
        if (!apiKey) {
            // 如果没有API密钥，使用备选方案（爬取新浪新闻头条）
            return await getNewsFromSina();
        }
        
        const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=cn&pageSize=5&apiKey=${apiKey}`);
        
        if (response.data && response.data.articles) {
            let result = "今日头条新闻：\n";
            response.data.articles.forEach((article, index) => {
                result += `${index + 1}. ${article.title}\n`;
            });
            return result;
        }
        
        return "今日新闻：数据获取失败";
    } catch (error) {
        console.error('获取新闻失败:', error);
        // 如果NewsAPI失败，尝试备选方案
        return await getNewsFromSina();
    }
}

async function getNewsFromSina() {
    try {
        // 备选方案：爬取新浪新闻头条
        const axios = require('axios');
        const cheerio = require('cheerio');
        
        const response = await axios.get('https://news.sina.com.cn/', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        
        const $ = cheerio.load(response.data);
        let result = "今日新浪头条新闻：\n";
        
        $('.news-item').slice(0, 5).each((index, element) => {
            const title = $(element).find('h2 a').text().trim() || $(element).find('a').text().trim();
            if (title) {
                result += `${index + 1}. ${title}\n`;
            }
        });
        
        return result || "今日新闻：数据获取失败";
    } catch (error) {
        console.error('获取新浪新闻失败:', error);
        return "今日新闻：数据获取失败";
    }
}

async function main() {
    const dailyNews = await getDailyNews();
    fs.writeFileSync('news.txt', dailyNews, 'utf8');
    console.log('新闻信息已保存');
}

main();
