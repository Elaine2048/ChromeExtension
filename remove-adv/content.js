/*
 * @Author: Elaine
 * @Date: 2025-04-10 16:56:44
 * @LastEditors: Elaine
 * @LastEditTime: 2025-04-10 17:18:20
 * @FilePath: /remove-adv/content.js
 * @Description: 百度搜索广告移除插件
 */

// 立即执行函数，不等待DOMContentLoaded
(function() {
    // 移除广告的函数
    function removeAds() {
        console.log('正在移除百度搜索广告...');
        
        // 移除顶部广告
        const topAds = document.querySelectorAll('.ec_tuiguang_pp, .ec_tuiguang_pp_new, .ec_tuiguang_pp_new_style');
        topAds.forEach(ad => {
            console.log('移除顶部广告');
            ad.remove();
        });

        // 移除右侧广告
        const rightAds = document.querySelectorAll('.ec_tuiguang, .ec_tuiguang_new, .ec_tuiguang_new_style');
        rightAds.forEach(ad => {
            console.log('移除右侧广告');
            ad.remove();
        });

        // 移除搜索结果中的广告链接
        const searchAds = document.querySelectorAll('.ec_tuiguang_link, .ec_tuiguang_link_new, .ec_tuiguang_link_new_style');
        searchAds.forEach(ad => {
            console.log('移除搜索结果中的广告链接');
            const adContainer = ad.closest('.result, .c-container, .c-container-new');
            if (adContainer) {
                adContainer.remove();
            }
        });

        // 移除"推广"标记的搜索结果
        const promotedResults = document.querySelectorAll('.result.c-container.new-pmd, .c-container.new-pmd, .c-container-new');
        promotedResults.forEach(result => {
            if (result.querySelector('.ec_tuiguang_link') || 
                result.querySelector('.ec_tuiguang_pp') || 
                result.querySelector('.ec_tuiguang_link_new') || 
                result.querySelector('.ec_tuiguang_pp_new') ||
                result.querySelector('.ec_tuiguang_link_new_style') ||
                result.querySelector('.ec_tuiguang_pp_new_style')) {
                console.log('移除推广标记的搜索结果');
                result.remove();
            }
        });
        
        // 移除带有"广告"标记的搜索结果
        const adLabels = document.querySelectorAll('.ec_tuiguang_pp, .ec_tuiguang_pp_new, .ec_tuiguang_link, .ec_tuiguang_link_new, .ec_tuiguang_pp_new_style, .ec_tuiguang_link_new_style');
        adLabels.forEach(label => {
            const resultItem = label.closest('.result, .c-container, .c-container-new');
            if (resultItem) {
                console.log('移除带有广告标记的搜索结果');
                resultItem.remove();
            }
        });
        
        // 移除百度搜索中的商业推广结果
        const commercialResults = document.querySelectorAll('.c-container[data-click], .c-container-new[data-click]');
        commercialResults.forEach(result => {
            const adText = result.textContent || '';
            if (adText.includes('推广') || adText.includes('广告') || adText.includes('商业推广')) {
                console.log('移除商业推广结果');
                result.remove();
            }
        });

        // 移除新的广告容器
        const newAdContainers = document.querySelectorAll('.c-container-new[data-click], .c-container-new .ec_tuiguang_link_new_style');
        newAdContainers.forEach(container => {
            console.log('移除新的广告容器');
            container.remove();
        });
    }

    // 初始移除广告
    removeAds();

    // 创建观察器来监听DOM变化
    const observer = new MutationObserver(function(mutations) {
        // 使用防抖函数，避免频繁执行
        clearTimeout(window.removeAdsTimeout);
        window.removeAdsTimeout = setTimeout(removeAds, 300);
    });

    // 配置观察器
    const config = {
        childList: true,
        subtree: true
    };

    // 开始观察整个文档
    observer.observe(document.body, config);
    
    // 定期检查并移除广告（以防某些动态加载的广告）
    setInterval(removeAds, 2000);
})(); 