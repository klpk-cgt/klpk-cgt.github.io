import os
import requests
import json
from datetime import datetime

# API配置
API_CONFIG = {
    "gold": {
        "url": "https://v3.alapi.cn/api/gold",
        "params": {"token": os.getenv('GOLD_API_TOKEN'), "market": "LF"}
    },
    "crypto": {
        "url": "https://v3.alapi.cn/api/crypto_currency",
        "params": {"token": os.getenv('CRYPTO_API_TOKEN')}
    },
    "oil": {
        "url": "https://v3.alapi.cn/api/oil",
        "params": {"token": os.getenv('OIL_API_TOKEN'), "province": "广东"}
    },
    "news": {
        "url": "https://v3.alapi.cn/api/new/toutiao",
        "params": {"token": os.getenv('NEWS_API_TOKEN')}
    }
}

def fetch_data(api_type):
    """获取API数据"""
    config = API_CONFIG[api_type]
    try:
        response = requests.post(config["url"], data=config["params"])
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"获取{api_type}数据失败: {e}")
        return None

def get_gold_price():
    """获取黄金价格"""
    data = fetch_data("gold")
    if data and data.get("code") == 200:
        for item in data.get("data", []):
            if item.get("symbol") == "Au":
                return f"{item.get('buy_price', '未知')}元/克"
    return "数据获取失败"

def get_crypto_prices():
    """获取虚拟货币价格"""
    data = fetch_data("crypto")
    if data and data.get("code") == 200:
        btc = eth = None
        for item in data.get("data", []):
            if item.get("symbol") == "BTC":
                btc = f"{item.get('price', '未知')}元 (24h: {item.get('change', '未知')})"
            elif item.get("symbol") == "ETH":
                eth = f"{item.get('price', '未知')}元 (24h: {item.get('change', '未知')})"
        return btc, eth
    return "数据获取失败", "数据获取失败"

def get_oil_price():
    """获取广东油价"""
    data = fetch_data("oil")
    if data and data.get("code") == 200:
        return data.get("data", {}).get("price", "未知")
    return "数据获取失败"

def get_news():
    """获取今日头条新闻（前三条）"""
    data = fetch_data("news")
    if data and data.get("code") == 200:
        return [item.get("title", "") for item in data.get("data", [])[:3]]
    return ["新闻数据获取失败"]

def generate_summary():
    """生成汇总文本"""
    current_date = datetime.now().strftime("%Y年%m月%d日")
    
    gold_price = get_gold_price()
    btc_price, eth_price = get_crypto_prices()
    oil_price = get_oil_price()
    news = get_news()
    
    summary = f"""每日信息汇总
日期：{current_date}

黄金价格：{gold_price}

虚拟货币价格：
比特币(BTC): {btc_price}
以太坊(ETH): {eth_price}

广东油价：{oil_price}

今日头条新闻：
"""
    
    for i, news_item in enumerate(news, 1):
        summary += f"{i}. {news_item}\n"
    
    return summary

if __name__ == "__main__":
    summary_text = generate_summary()
    
    # 保存到文件
    with open("summary.txt", "w", encoding="utf-8") as f:
        f.write(summary_text)
    
    print("每日信息汇总已生成:")
    print(summary_text)
