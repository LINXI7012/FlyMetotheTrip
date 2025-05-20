 /**
 * 首页过渡图片滚动效果
 * 使图片随着用户滚动而移动，创建视差效果
 */
document.addEventListener('DOMContentLoaded', function() {
    // 确保只在首页运行
    if (!document.body.classList.contains('home')) {
        return;
    }
    
    console.log('初始化过渡图片滚动效果');
    
    // 获取过渡图层元素
    const transitionOverlay = document.querySelector('.transition-overlay');
    
    // 如果找不到图层，则退出
    if (!transitionOverlay) {
        console.warn('未找到过渡图层元素');
        return;
    }
    
    // 修改过渡图层的样式，将position从fixed改为absolute以支持滚动
    transitionOverlay.style.position = 'absolute';
    
    // 设置body高度以启用滚动
    document.body.style.height = '200vh'; // 设置为两倍视口高度以允许滚动
    document.body.style.overflowY = 'auto'; // 确保可以滚动
    
    // 监听滚动事件
    window.addEventListener('scroll', handleScroll);
    
    // 初始调用一次处理函数
    handleScroll();
    
    // 滚动处理函数
    function handleScroll() {
        // 计算滚动百分比（0-1范围）
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = Math.min(1, Math.max(0, window.scrollY / maxScroll));
        
        // 根据滚动百分比移动过渡图层
        const translateY = scrollPercent * 100; // 滚动100px，可以根据需要调整
        transitionOverlay.style.transform = `translateY(${translateY}px)`;
    }
});