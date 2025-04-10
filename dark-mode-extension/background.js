/*
 * @Author: Elaine
 * @Date: 2025-04-09 22:57:56
 * @LastEditors: Elaine
 * @LastEditTime: 2025-04-10 16:45:34
 * @FilePath: /dark-mode-extension/background.js
 * @Description: 
 * 
 */
// 初始化夜间模式状态
let isDarkMode = false;

// 从存储中加载状态
chrome.storage.local.get(['isDarkMode'], (result) => {
  isDarkMode = result.isDarkMode || false;
  updateIcon();
});

// 插件安装或更新时初始化
chrome.runtime.onInstalled.addListener(() => {
  // 获取所有现有标签页并应用设置
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach(tab => {
      if (isDarkMode) {
        applyDarkMode(tab.id);
      }
    });
  });
});

// 监听插件图标点击
chrome.action.onClicked.addListener((tab) => {
  isDarkMode = !isDarkMode;
  // 保存状态到存储
  chrome.storage.local.set({ isDarkMode: isDarkMode });
  updateIcon();
  // 获取所有标签页并应用设置
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach(tab => {
      applyDarkMode(tab.id);
    });
  });
});

// 监听标签页更新
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // 检查是否是有效的网页URL
  if (tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('edge://') && !tab.url.startsWith('about:')) {
    // 在页面开始加载时就应用样式
    if (changeInfo.status === 'loading') {
      chrome.storage.local.get(['isDarkMode'], (result) => {
        isDarkMode = result.isDarkMode || false;
        applyDarkMode(tabId);
      });
    }
    // 在页面加载完成时再次应用样式（以防万一）
    if (changeInfo.status === 'complete') {
      chrome.storage.local.get(['isDarkMode'], (result) => {
        isDarkMode = result.isDarkMode || false;
        applyDarkMode(tabId);
      });
    }
  }
});

// 更新插件图标
function updateIcon() {
  const iconPath = isDarkMode ? {
    16: "images/icon16.png",
    48: "images/icon48.png",
    128: "images/icon128.png"
  } : {
    16: "images/icon16.png",
    48: "images/icon48.png",
    128: "images/icon128.png"
  };
  
  chrome.action.setIcon({ path: iconPath });
}

// 应用夜间模式
function applyDarkMode(tabId) {
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    function: (isDark) => {
      const darkModeStyles = `
        html {
          filter: invert(90%) hue-rotate(180deg) !important;
        }
        img, video, picture {
          filter: invert(100%) hue-rotate(180deg) !important;
        }
      `;

      let styleElement = document.getElementById('dark-mode-style');
      
      if (isDark) {
        if (!styleElement) {
          styleElement = document.createElement('style');
          styleElement.id = 'dark-mode-style';
          styleElement.textContent = darkModeStyles;
          document.head.appendChild(styleElement);
        }
      } else {
        if (styleElement) {
          styleElement.remove();
        }
      }
    },
    args: [isDarkMode]
  }).catch(err => {
    // 忽略在chrome://页面上执行脚本的错误
    console.log('无法在此页面应用夜间模式:', err);
  });
} 