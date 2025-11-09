const axios = require('axios');
const fs = require('fs');

async function updatePrice() {
    try {
        // 获取当前日期
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const dateString = `日期：${year}年${month}月${day}日`;
        
        // 调用黄金API
        const apiResponse = await axios.post('https://v3.alapi.cn/api/gold', {
            token: 'vtilq5ptzyhmputx1srvrdqowgvbe7',
            market: 'LF'
        });
        
        let priceString = "今日金价：数据获取失败";
        
        if (apiResponse.data && apiResponse.data.success) {
            const goldData = apiResponse.data.data.find(item => item.symbol === 'Au');
            if (goldData) {
                priceString = `今日金价：${goldData.buy_price.toFixed(2)}元/克`;
            }
        }
        
        // 写入文件
        const content = `${priceString}\n${dateString}`;
        fs.writeFileSync('price.txt', content, 'utf8');
        console.log('金价更新成功');
        
    } catch (error) {
        console.error('获取金价失败:', error);
        
        // 出错时使用静态数据
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const dateString = `日期：${year}年${month}月${day}日`;
        const priceString = "今日金价：数据获取失败";
        
        const content = `${priceString}\n${dateString}`;
        fs.writeFileSync('price.txt', content, 'utf8');
    }
}

updatePrice();
