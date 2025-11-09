const axios = require('axios');
const fs = require('fs');

async function getGoldPrice() {
    try {
        const token = process.env.GOLD_API_TOKEN || 'vtilq5ptzyhmputx1srvrdqowgvbe7';
        
        const response = await axios.post('https://v3.alapi.cn/api/gold', {
            token: token,
            market: 'LF'
        });
        
        if (response.data && response.data.success) {
            const goldData = response.data.data.find(item => item.symbol === 'Au');
            if (goldData) {
                return `黄金价格：${goldData.buy_price.toFixed(2)}元/克`;
            }
        }
        return "黄金价格：数据获取失败";
    } catch (error) {
        console.error('获取金价失败:', error);
        return "黄金价格：数据获取失败";
    }
}

async function main() {
    const goldPrice = await getGoldPrice();
    fs.writeFileSync('gold.txt', goldPrice, 'utf8');
    console.log('金价信息已保存');
}

main();
