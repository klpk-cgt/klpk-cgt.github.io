// 黄金价格API配置
const API_URL = "https://v3.alapi.cn/api/gold";
// 请替换为您自己的token
const TOKEN = "vtilq5ptzyhmputx1srvrdqowgvbe7";

// DOM元素
const elements = {
    priceBuy: document.getElementById('price-buy'),
    priceSell: document.getElementById('price-sell'),
    lowPrice: document.getElementById('low-price'),
    highPrice: document.getElementById('high-price'),
    lastUpdate: document.getElementById('last-update'),
    currentDate: document.getElementById('current-date'),
    refreshBtn: document.getElementById('refresh-btn'),
    otherMetals: document.getElementById('other-metals')
};

// 初始化页面
function init() {
    // 设置当前日期
    const now = new Date();
    elements.currentDate.textContent = now.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    });
    
    // 加载黄金价格
    loadGoldPrice();
    
    // 绑定刷新按钮事件
    elements.refreshBtn.addEventListener('click', loadGoldPrice);
}

// 加载黄金价格
async function loadGoldPrice() {
    try {
        // 显示加载状态
        setLoadingState(true);
        
        // 调用API
        const data = await fetchGoldPrice();
        
        if (data && data.success) {
            // 更新黄金价格显示
            updateGoldPriceDisplay(data.data);
            // 更新其他金属价格
            updateOtherMetals(data.data);
        } else {
            showError('获取价格失败，请稍后重试');
        }
        
    } catch (error) {
        console.error('加载黄金价格失败:', error);
        showError('网络请求失败');
    } finally {
        setLoadingState(false);
    }
}

// 调用API获取黄金价格
async function fetchGoldPrice() {
    const url = `${API_URL}?token=${TOKEN}`;
    
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error('API请求失败:', error);
        return null;
    }
}

// 更新黄金价格显示
function updateGoldPriceDisplay(metals) {
    // 找到黄金（Au）的数据
    const gold = metals.find(metal => metal.symbol === 'Au');
    
    if (gold) {
        elements.priceBuy.textContent = `￥${gold.buy_price.toFixed(2)}`;
        elements.priceSell.textContent = `￥${gold.sell_price.toFixed(2)}`;
        elements.lowPrice.textContent = `最低价: ￥${gold.low_price.toFixed(2)}`;
        elements.highPrice.textContent = `最高价: ￥${gold.high_price.toFixed(2)}`;
        
        // 更新时间（使用当前时间，因为API返回的时间戳是time字段，但注意单位是秒）
        const updateTime = new Date();
        elements.lastUpdate.textContent = updateTime.toLocaleString('zh-CN');
    } else {
        showError('未找到黄金价格数据');
    }
}

// 更新其他金属价格
function updateOtherMetals(metals) {
    // 过滤掉黄金（Au），因为已经单独显示
    const otherMetals = metals.filter(metal => metal.symbol !== 'Au');
    
    // 清空容器
    elements.otherMetals.innerHTML = '';
    
    // 添加其他金属
    otherMetals.forEach(metal => {
        const metalElement = document.createElement('div');
        metalElement.className = 'metal-item';
        metalElement.innerHTML = `
            <div class="metal-name">${metal.name}</div>
            <div class="metal-price">买入: ￥${metal.buy_price.toFixed(2)}</div>
            ${metal.sell_price ? `<div class="metal-price">卖出: ￥${metal.sell_price.toFixed(2)}</div>` : ''}
        `;
        elements.otherMetals.appendChild(metalElement);
    });
}

// 设置加载状态
function setLoadingState(isLoading) {
    if (isLoading) {
        document.body.classList.add('loading');
        elements.refreshBtn.classList.add('pulse');
        elements.refreshBtn.disabled = true;
    } else {
        document.body.classList.remove('loading');
        elements.refreshBtn.classList.remove('pulse');
        elements.refreshBtn.disabled = false;
    }
}

// 显示错误信息
function showError(message) {
    // 在实际应用中，您可以添加更复杂的错误处理UI
    alert(message);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);
