/**
 * 问卷背景动态元素下坠效果
 * 
 * 这个脚本为问卷填写界面添加了动态下坠元素的背景效果
 * 元素包括旅行相关的图标，如行李箱、飞机、照相机等
 */

document.addEventListener('DOMContentLoaded', function() {
    // 只在问卷页面添加效果
    if (!document.body.classList.contains('create-page')) return;
    
    // 创建背景容器
    const container = document.createElement('div');
    container.className = 'falling-elements-container';
    document.body.appendChild(container);
    
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .falling-elements-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 2;
            overflow: hidden;
        }
        
        .falling-element {
            position: absolute;
            color: rgba(255, 255, 255, 0.4);
            top: -50px;
            user-select: none;
            opacity: 0;
            animation-name: falling;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
            pointer-events: auto;
            transition: transform 0.3s ease;
            text-shadow: 0 0 5px rgba(255, 255, 255, 0.2);
        }
        
        .falling-element:hover {
            color: rgba(255, 255, 255, 0.8) !important;
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.5), 0 0 20px rgba(255, 255, 255, 0.3);
        }
        
        @keyframes falling {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 0.8;
            }
            90% {
                opacity: 0.6;
            }
            100% {
                transform: translateY(calc(100vh + 50px)) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // 旅行相关的图标和元素
    const travelIcons = [
        '✈️', '🧳', '🏖️', '🗺️', '🏞️', '📸', 
        '🌍', '🏔️', '🚂', '🏰', '⛺', '🚗',
        '🌴', '🏝️', '🗿', '🏙️', '🎒', '🧭',
        '🛩️', '🛫', '🛬', '🚤', '⚓', '🚢',
        '🌋', '🌇', '🏝️', '🌃', '🚶‍♂️', '🧗‍♀️'
    ];
    
    // 鼠标位置跟踪
    let mouseX = 0;
    let mouseY = 0;
    
    // 监听鼠标移动
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // 创建初始元素
    createInitialElements();
    
    // 在问卷激活时增加动画密度
    document.getElementById('enter-questionnaire').addEventListener('click', function() {
        // 问卷激活后增加更多元素
        setTimeout(function() {
            createMoreElements();
        }, 1000);
    });
    
    /**
     * 创建初始的下坠元素
     */
    function createInitialElements() {
        // 初始创建10个元素
        for (let i = 0; i < 10; i++) {
            createFallingElement();
        }
    }
    
    /**
     * 问卷激活后创建更多下坠元素
     */
    function createMoreElements() {
        // 额外创建15个元素
        for (let i = 0; i < 15; i++) {
            createFallingElement(true);
        }
    }
    
    /**
     * 创建单个下坠元素
     * @param {boolean} isActive - 是否在问卷激活状态下创建
     */
    function createFallingElement(isActive = false) {
        const element = document.createElement('div');
        element.className = 'falling-element';
        
        // 随机选择图标
        const icon = travelIcons[Math.floor(Math.random() * travelIcons.length)];
        element.textContent = icon;
        
        // 随机大小
        const size = isActive ? 
            Math.random() * 40 + 35 : // 激活后更大的元素
            Math.random() * 15 + 15;  // 初始较小的元素
        element.style.fontSize = `${size}px`;
        
        // 随机位置
        const left = Math.random() * 100;
        element.style.left = `${left}%`;
        
        // 随机透明度
        const baseOpacity = isActive ? 0.5 : 0.3;
        element.style.opacity = baseOpacity + Math.random() * 0.3;
        
        // 随机动画时长（落下速度）
        const duration = isActive ?
            Math.random() * 8 + 5 : // 激活后较快的速度
            Math.random() * 12 + 8;  // 初始较慢的速度
        element.style.animationDuration = `${duration}s`;
        
        // 随机延迟开始
        const delay = Math.random() * 15;
        element.style.animationDelay = `${delay}s`;
        
        // 添加到容器
        container.appendChild(element);
        
        // 鼠标交互效果
        element.addEventListener('mouseover', function(e) {
            // 计算当前元素位置
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            // 计算鼠标与元素中心的相对位置
            const dx = e.clientX - centerX;
            const dy = e.clientY - centerY;
            
            // 根据鼠标位置偏移元素（反方向）
            const offsetX = -dx / 10; // 减小偏移幅度
            const offsetY = -dy / 10;
            
            // 应用变换
            element.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(1.1)`;
        });
        
        // 鼠标移出恢复原状
        element.addEventListener('mouseout', function() {
            element.style.transform = '';
        });
        
        // 动画结束后重新创建元素（循环）
        element.addEventListener('animationiteration', function() {
            // 重新设置位置
            element.style.left = `${Math.random() * 100}%`;
            
            // 在问卷最后一个问题时显示彩色元素以庆祝即将完成
            const activeQuestion = document.querySelector('.question.active');
            if (activeQuestion && activeQuestion.dataset.questionId === "8") {
                element.style.color = getRandomColor(0.5);
            } else {
                element.style.color = "rgba(255, 255, 255, 0.4)";
            }
        });
    }
    
    /**
     * 生成随机颜色
     * @param {number} opacity - 透明度
     * @returns {string} - RGBA颜色字符串
     */
    function getRandomColor(opacity = 0.6) {
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    
    // 添加全局风向效果
    let windDirection = 0;
    let windStrength = 0;
    
    // 定期更新风向
    setInterval(function() {
        // 随机风向变化 (-1 到 1)
        windDirection = Math.sin(Date.now() / 10000) * 0.5;
        // 随机风力变化 (0 到 0.5)
        windStrength = (Math.sin(Date.now() / 5000) + 1) * 0.25;
        
        // 应用风向效果到所有元素
        document.querySelectorAll('.falling-element').forEach(el => {
            const currentLeft = parseFloat(el.style.left) || 0;
            const newLeft = currentLeft + windDirection * windStrength;
            
            // 确保元素不会飘出屏幕
            if (newLeft > 0 && newLeft < 100) {
                el.style.left = `${newLeft}%`;
            }
        });
    }, 100);
}); 