const fs = require('fs');

function generateSummary() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const dateString = `日期：${year}年${month}月${day}日`;
    
    let summary = `每日信息汇总\n${dateString}\n\n`;
    
    // 读取各个数据文件
    try {
        if (fs.existsSync('gold.txt')) {
            summary += fs.readFileSync('gold.txt', 'utf8') + '\n\n';
        }
        
        if (fs.existsSync('crypto.txt')) {
            summary += fs.readFileSync('crypto.txt', 'utf8') + '\n\n';
        }
        
        if (fs.existsSync('op3-news.txt')) {
            summary += fs.readFileSync('top3-news.txt', 'utf8') + '\n';
        }
    } catch (error) {
        console.error('生成汇总文件时出错:', error);
    }
    
    // 写入汇总文件
    fs.writeFileSync('summary.txt', summary, 'utf8');
    console.log('汇总文件已生成');
}

generateSummary();
