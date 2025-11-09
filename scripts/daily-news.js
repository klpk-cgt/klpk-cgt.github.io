// daily-news-reliable.js
const axios = require('axios');
const fs = require('fs');

class NewsFetcher {
    constructor() {
        this.sources = [
            {
                name: '网易新闻',
                url: 'https://api.163.com/news/top',
                enabled: true
            },
            {
                name: '腾讯新闻',
                url: 'https://r.inews.qq.com/gw/event/hot_ranking',
                enabled: true
            },
            {
                name: '新浪新闻',
                url: 'https://news.sina.com.cn',
                type: 'web',
                enabled: true
            }
        ];
    }

    async getDailyNews() {
        console.log('开始获取今日新闻...\n');
        
        // 尝试所有可用的新闻源
        for (const source of this.sources) {
            if (!source.enabled) continue;
            
            try {
                console.log(`尝试从 ${source.name} 获取新闻...`);
                const news = await this.fetchFromSource(source);
                if (news) {
                    return news;
                }
            } catch (error) {
                console.log(`${source.name} 获取失败: ${error.message}`);
            }
        }
        
        // 所有源都失败，返回模拟数据
        return this.getFallbackNews();
    }

    async fetchFromSource(source) {
        if (source.type === 'web') {
            return await this.fetchWebNews(source);
        } else {
            return await this.fetchAPInews(source);
        }
    }

    async fetchAPInews(source) {
        const token = process.env.NEWS_API_KEY || 'vtilq5ptzyhmputx1srvrdqowgvbe7';
        
        const response = await axios.get(source.url, {
            params: { token },
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json'
            },
            timeout: 10000
        });

        return this.formatNews(response.data, source.name);
    }

    async fetchWebNews(source) {
        const response = await axios.get(source.url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 15000
        });

        return this.parseWebContent(response.data, source.name);
    }

    formatNews(data, sourceName) {
        if (!data || !data.data) return null;

        let result = `📰 ${sourceName} - 今日头条\n\n`;
        data.data.slice(0, 10).forEach((item, index) => {
            result += `${index + 1}. ${item.title}\n`;
            if (item.digest) result += `   ${item.digest}\n`;
            if (item.time) result += `   📅 ${item.time}\n`;
            result += '\n';
        });

        return result;
    }

    parseWebContent(html, sourceName) {
        // 简单的HTML解析，获取标题标签
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        const title = titleMatch ? titleMatch[1] : `${sourceName}首页`;
        
        return `${sourceName}网页获取成功\n最新更新: ${title}\n\n由于网页结构复杂，建议直接访问网站查看详情。`;
    }

    getFallbackNews() {
        const newsItems = [
            "第十五届全运会在粤港澳隆重开幕，习近平出席开幕式",
            "我国新能源汽车销量创新高，年底迎来购车热潮",
            "人工智能技术在医疗领域取得重大突破",
            "多库完成曼城生涯第100次出场里程碑",
            "哈登带病出战40分钟，快船遭遇四连败",
            "山东威海海域两船相撞，8人失联救援进行中",
            "全国多地出现大雾天气，交通受影响",
            "新银行获批成立，金融监管总局发布最新政策",
            "国际油价波动加剧，能源市场面临新挑战",
            "冬季疫情防控措施优化，专家给出健康建议"
        ];

        let result = "📰 今日新闻摘要 (模拟数据)\n\n";
        result += "⚠️ 注意：新闻API连接失败，以下是模拟的重要新闻摘要\n\n";

        newsItems.forEach((item, index) => {
            result += `${index + 1}. ${item}\n`;
        });

        result += "\n💡 实际新闻请关注官方新闻媒体或检查网络连接";
        return result;
    }

    // 生成RSS格式的新闻文件
    generateRSS(newsContent) {
        const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
    <title>今日新闻摘要</title>
    <description>自动生成的新闻摘要</description>
    <link>https://news.example.com</link>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <pubDate>${new Date().toUTCString()}</pubDate>
    <ttl>1800</ttl>
    
    <item>
        <title>新闻摘要</title>
        <description><![CDATA[${newsContent.replace(/\n/g, '<br/>')}]]></description>
        <pubDate>${new Date().toUTCString()}</pubDate>
    </item>
</channel>
</rss>`;

        fs.writeFileSync('news.rss', rss, 'utf8');
        return rss;
    }
}

// 使用示例
async function main() {
    const fetcher = new NewsFetcher();
    
    try {
        const news = await fetcher.getDailyNews();
        
        // 保存文本文件
        fs.writeFileSync('news.txt', news, 'utf8');
        console.log('✅ 新闻已保存到 news.txt');
        
        // 生成RSS文件
        fetcher.generateRSS(news);
        console.log('✅ RSS文件已生成: news.rss');
        
        // 显示在控制台
        console.log('\n' + '='.repeat(60));
        console.log(news);
        console.log('='.repeat(60));
        
        // 记录日志
        const log = `[${new Date().toISOString()}] 新闻获取完成\n`;
        fs.appendFileSync('news.log', log);
        
    } catch (error) {
        console.error('❌ 获取新闻失败:', error.message);
    }
}

if (require.main === module) {
    main();
}

module.exports = NewsFetcher;
