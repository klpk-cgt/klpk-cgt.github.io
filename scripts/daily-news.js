const axios = require('axios');
const fs = require('fs');

async function getDailyNews() {
    try {
        // 使用网易新闻API - 基于您提供的成功响应格式
        const token = process.env.NEWS_API_KEY || 'vtilq5ptzyhmputx1srvrdqowgvbe7';
        
        console.log('正在获取网易新闻...');
        
        // 使用您提供的成功API响应作为参考
        const apiUrl = 'https://api.163.com/news/top'; // 假设的API端点
        
        const response = await axios.get(apiUrl, {
            params: {
                token: token
            },
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Referer': 'https://www.163.com/'
            },
            timeout: 15000
        });
        
        console.log('API响应状态:', response.status);
        
        const resultData = response.data;
        
        // 检查API响应格式（基于您提供的链接3）
        if (resultData.success === true && resultData.code === 200 && resultData.data) {
            let result = `📰 今日新闻头条 (${new Date().toLocaleDateString('zh-CN')})\n\n`;
            
            resultData.data.slice(0, 15).forEach((article, index) => {
                result += `🔸 ${index + 1}. ${article.title}\n`;
                if (article.digest && article.digest.length > 0) {
                    result += `   摘要: ${article.digest}\n`;
                }
                if (article.source) {
                    result += `   来源: ${article.source} | ${article.time || ''}\n`;
                }
                result += '\n';
            });
            
            return result;
        } else {
            console.log('API响应格式不符，尝试备选方案...');
            return await getBackupNews();
        }
        
    } catch (error) {
        console.error('获取网易新闻失败:', error.message);
        return await getBackupNews();
    }
}

// 备选方案：使用静态数据或模拟数据
async function getBackupNews() {
    try {
        console.log('使用备选新闻源...');
        
        // 方案1：尝试其他新闻API
        const alternativeNews = await getAlternativeNewsSource();
        if (alternativeNews) return alternativeNews;
        
        // 方案2：使用模拟数据（基于您提供的成功响应格式）
        return getMockNewsData();
        
    } catch (error) {
        console.error('备选方案失败:', error.message);
        return getMockNewsData();
    }
}

// 尝试其他新闻源
async function getAlternativeNewsSource() {
    try {
        // 尝试腾讯新闻或其他开放API
        const response = await axios.get('https://r.inews.qq.com/gw/event/hot_ranking', {
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        
        if (response.data) {
            return "今日热点新闻（腾讯）：\n\n（由于API限制，建议直接访问新闻网站）";
        }
    } catch (error) {
        // 忽略错误，继续尝试其他方案
    }
    return null;
}

// 模拟新闻数据（基于您提供的链接3的成功格式）
function getMockNewsData() {
    const mockNews = {
        success: true,
        code: 200,
        data: [
            {
                title: "多库迎来曼城生涯第100次出场",
                digest: "里程碑，多库迎来曼城生涯第100次出场",
                source: "懂球帝",
                time: "2025-11-09 23:40:11"
            },
            {
                title: "哈登带病出场40分钟，快船遭遇四连败",
                digest: "带病出场的哈登状态如此离谱还要打40分钟？快船到底在想些什么？",
                source: "新浪体育",
                time: "2025-11-09 23:33:18"
            },
            {
                title: "第十五届全运会在粤港澳隆重开幕",
                digest: "习近平宣布第十五届全运会开幕，粤港澳三地首次同步举办",
                source: "央视新闻",
                time: "2025-11-09 22:15:00"
            },
            {
                title: "我国新能源汽车市场迎来年底消费高峰",
                digest: "从“卷价格”走向“优价值”，新能源车市场消费热情高涨",
                source: "财经网",
                time: "2025-11-09 21:30:45"
            },
            {
                title: "山东威海海域两船相撞，8人失联",
                digest: "救援工作正在进行中，相关部门已成立应急指挥部",
                source: "新华网",
                time: "2025-11-09 20:45:12"
            },
            {
                title: "人工智能助力医疗诊断取得新突破",
                digest: "AI技术在医学影像识别准确率提升至98%以上",
                source: "科技日报",
                time: "2025-11-09 19:20:33"
            }
        ]
    };
    
    let result = `📰 今日新闻摘要 (${new Date().toLocaleDateString('zh-CN')}) - 模拟数据\n\n`;
    result += "⚠️ 注意：当前为模拟数据，实际API连接失败\n\n";
    
    mockNews.data.forEach((article, index) => {
        result += `🔸 ${index + 1}. ${article.title}\n`;
        if (article.digest) {
            result += `   摘要: ${article.digest}\n`;
        }
        result += `   来源: ${article.source} | ${article.time}\n\n`;
    });
    
    result += "💡 提示：请检查网络连接或API配置\n";
    
    return result;
}

// 简单的网页爬取备选方案
async function getWebNews() {
    try {
        const response = await axios.get('https://www.163.com', {
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        
        // 简单的HTML解析（需要cheerio）
        try {
            const cheerio = require('cheerio');
            const $ = cheerio.load(response.data);
            let result = "网易首页新闻：\n\n";
            
            $('a').slice(0, 20).each((index, element) => {
                const title = $(element).text().trim();
                const href = $(element).attr('href');
                if (title && title.length > 10 && title.length < 100 && href && href.includes('news')) {
                    result += `${index + 1}. ${title}\n`;
                }
            });
            
            return result.substring(0, 1000); // 限制长度
        } catch (parseError) {
            return "网页获取成功但解析失败";
        }
    } catch (error) {
        throw new Error('网页爬取失败');
    }
}

async function main() {
    try {
        console.log('🚀 开始获取今日新闻...\n');
        
        const dailyNews = await getDailyNews();
        
        // 保存到文件
        fs.writeFileSync('news.txt', dailyNews, 'utf8');
        console.log('✅ 新闻信息已保存到 news.txt');
        
        // 在控制台显示
        console.log('\n' + '='.repeat(60));
        console.log(dailyNews);
        console.log('='.repeat(60));
        
        // 记录日志
        const logEntry = `[${new Date().toISOString()}] 新闻获取完成\n`;
        fs.appendFileSync('news.log', logEntry, 'utf8');
        
    } catch (error) {
        console.error('❌ 主程序错误:', error.message);
        
        // 最后的保底方案
        const emergencyNews = `紧急新闻快讯 (${new Date().toLocaleDateString('zh-CN')})\n\n`;
        const emergencyContent = emergencyNews + 
            "由于网络连接问题，无法获取实时新闻。\n" +
            "请检查：\n" +
            "1. 网络连接是否正常\n" +
            "2. API密钥配置是否正确\n" +
            "3. 防火墙设置\n\n" +
            "最后更新: " + new Date().toLocaleString();
        
        fs.writeFileSync('news.txt', emergencyContent, 'utf8');
        console.log('⚠️  已生成应急新闻文件');
    }
}

// 配置检查
function checkConfig() {
    const token = process.env.NEWS_API_KEY;
    if (!token) {
        console.log('⚠️  未检测到NEWS_API_KEY环境变量，将使用默认token');
        console.log('💡 设置方法: export NEWS_API_KEY="your_token_here"');
    }
    return !!token;
}

// 如果直接运行此文件
if (require.main === module) {
    checkConfig();
    main();
}

module.exports = {
    getDailyNews,
    getBackupNews,
    getMockNewsData
};
