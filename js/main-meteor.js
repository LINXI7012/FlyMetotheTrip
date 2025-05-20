// 反向流星轨迹效果
function initStarBackground() {
    if (!document.body.classList.contains('explore-page')) return;
    
    // 隐藏原来的背景
    const fullscreenBg = document.querySelector('.fullscreen-bg');
    if (fullscreenBg) {
        fullscreenBg.style.opacity = '0';
        fullscreenBg.style.display = 'none';
    }
    
    // 让世界地图容器完全透明，移除其背景色
    const worldMapContainer = document.querySelector('.world-map-container');
    if (worldMapContainer) {
        worldMapContainer.style.background = 'transparent';
        worldMapContainer.style.backdropFilter = 'none';
    }
    
    // 添加内联样式到body
    document.body.style.backgroundColor = 'rgb(20, 30, 48)';
    
    // Create and insert canvas
    let canvas = document.getElementById('star-canvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'star-canvas';
        document.body.insertBefore(canvas, document.body.firstChild); // 插入到最底层
    }
    
    // 设置canvas样式，覆盖整个屏幕作为背景
    canvas.style.position = 'fixed';
    canvas.style.top = '0';  // 从页面顶部开始
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100vh'; // 全屏高度
    canvas.style.zIndex = '-10'; // 确保在所有内容后面
    canvas.style.pointerEvents = 'none';
    
    const ctx = canvas.getContext('2d', { alpha: false }); // 性能优化：不需要alpha通道
    if (!ctx) {
        console.error('无法获取渲染上下文');
        return;
    }
    
    let width = window.innerWidth;
    let height = window.innerHeight;
    const stars = [];
    const meteors = [];
    
    // 添加鼠标位置追踪（确保在width和height初始化后）
    let mouseX = width / 2;
    let mouseY = height / 2;
    const mouseFactor = 0.08; // 减小响应强度，避免过度移动
    
    // 监听鼠标移动事件
    window.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // 优化星星数量，平衡性能和视觉效果
    const starCount = Math.min(200, Math.floor((window.innerWidth * window.innerHeight) / 5000));
    
    console.log('Initializing star background with', starCount, 'stars');
    
    // 创建不同大小的星星类型，添加深度属性
    const starTypes = [
        { minRadius: 0.3, maxRadius: 1.8, count: Math.floor(starCount * 0.6), alpha: 0.4, depth: 0.1 }, // 小星星（远景）
        { minRadius: 1.8, maxRadius: 2.8, count: Math.floor(starCount * 0.25), alpha: 0.5, depth: 0.2 }, // 中等星星（中景）
        { minRadius: 2.9, maxRadius: 3.9, count: Math.floor(starCount * 0.10), alpha: 0.7, depth: 0.5 },  // 大星星（近景）
        { minRadius: 3.9, maxRadius: 6.2, count: Math.floor(starCount * 0.05), alpha: 1.2, depth: 0.7 }  // 大星星（近景）
    ];
    
    // 预先计算一些属性来减少每帧的计算量
    let lastFrameTime = 0;
    let targetFPS = 30; // 使用let而不是const，使其可变
    let frameThreshold = 1000 / targetFPS;
    let meteorTimer = 0;
    const meteorInterval = 3000; // 每3秒一颗流星
    
    // 添加低性能设备检测
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) {
        console.log('检测到低性能设备，减少动画效果');
        // 降低更新频率，减少星星数量
        targetFPS = 10;
        frameThreshold = 10000 / targetFPS;
    }
    
    function resizeCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;  // 全屏高度
        stars.length = 0;
        
        // 更新鼠标初始位置为屏幕中心
        mouseX = width / 2;
        mouseY = height / 2;
        
        // 按不同类型创建星星
        starTypes.forEach(type => {
            for (let i = 0; i < type.count; i++) {
                const x = Math.random() * width;
                const y = Math.random() * height;
                
                stars.push({
                    x: x,
                    y: y,
                    origX: x, // 记录原始位置用于计算位移
                    origY: y,
                    radius: Math.random() * (type.maxRadius - type.minRadius) + type.minRadius,
                    alpha: Math.random() * 0.5 + type.alpha,
                    delta: (Math.random() * 0.01 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
                    twinkleSpeed: Math.random() * 0.03 + 0.01,
                    depth: type.depth // 使用类型定义的固定深度值，避免随机深度导致的问题
                });
            }
        });
        
        // 绘制静态背景
        drawStaticBackground();
    }
    
    // 创建一个性能优化的背景层
    function drawStaticBackground() {
        // 绘制背景渐变
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, 'rgb(159, 204, 202)');  // 略微降低顶部粉色的饱和度和亮度
        gradient.addColorStop(0.3, 'rgb(206, 159, 198)'); // 降低中上部粉色的饱和度和亮度
        gradient.addColorStop(0.6, 'rgb(197, 128, 197)'); // 降低中下部紫粉色的饱和度和亮度
        gradient.addColorStop(1, 'rgb(92, 86, 200)');    // 轻微降低底部紫色的饱和度和亮度
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
    }
    
    function createMeteor() {
        // 流星总数限制，防止性能问题
        if (meteors.length >= 5) return;
        
        // 在屏幕左侧或底部随机生成流星
        const useLeftSide = Math.random() > 0.5;
        let startX, startY;
        
        if (useLeftSide) {
            // 左侧边界生成
            startX = Math.random() * width * 0.2; // 左侧20%区域
            startY = height - Math.random() * height * 0.5; // 下半部分
        } else {
            // 底部边界生成
            startX = Math.random() * width * 0.7; // 左侧70%区域
            startY = height - Math.random() * height * 0.5; // 底部50%区域
        }
        
        meteors.push({
            x: startX,
            y: startY,
            length: Math.random() * 80 + 60, // 流星轨迹长度
            speed: Math.random() * 4 + 4, // 速度
            alpha: 1,
            width: Math.random() * 1.5 + 0.8, // 随机宽度
            depth: 0.4 // 流星深度固定值，避免随机深度问题
        });
    }
    
    function animateStars(timestamp) {
        // 帧率控制
        if (timestamp - lastFrameTime < frameThreshold) {
            requestAnimationFrame(animateStars);
            return;
        }
        
        const deltaTime = timestamp - lastFrameTime;
        lastFrameTime = timestamp;
        
        // 清除整个画布
        ctx.clearRect(0, 0, width, height);
        
        // 重新绘制背景
        drawStaticBackground();
        
        // 更新流星计时器
        meteorTimer += deltaTime;
        if (meteorTimer >= meteorInterval) {
            createMeteor();
            meteorTimer = 0;
        }
        
        // 计算鼠标位置相对于屏幕中心的偏移比例
        const centerX = width / 2;
        const centerY = height / 2;
        const offsetX = (mouseX - centerX) / centerX; // 范围 -1 到 1
        const offsetY = (mouseY - centerY) / centerY; // 范围 -1 到 1
        
        // 绘制星星
        for (const star of stars) {
            // 更自然的闪烁效果
            star.alpha += star.delta * star.twinkleSpeed * (deltaTime / 16.67); // 按照60FPS校准
            
            if (star.alpha <= 0.1 || star.alpha >= 1) {
                star.delta *= -1;
            }
            
            // 根据鼠标位置和星星深度计算位移
            const parallaxX = offsetX * mouseFactor * width * star.depth;
            const parallaxY = offsetY * mouseFactor * height * star.depth;
            
            // 更新星星位置
            const displayX = star.origX + parallaxX;
            const displayY = star.origY + parallaxY;
            
            // 绘制星星
            ctx.beginPath();
            ctx.arc(displayX, displayY, star.radius, 0, 2 * Math.PI);
            
            // 只为大星星添加光晕效果以提高性能
            if (star.radius > 1.5) {
                const glow = ctx.createRadialGradient(
                    displayX, displayY, 0,
                    displayX, displayY, star.radius * 3
                );
                glow.addColorStop(0, `rgba(255, 255, 255, ${star.alpha * 0.4})`);
                glow.addColorStop(1, 'rgba(255, 255, 255, 0)');
                
                ctx.fillStyle = glow;
                ctx.fill();
            }
            
            ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
            ctx.fill();
        }
        
        // 绘制流星
        for (let i = meteors.length - 1; i >= 0; i--) {
            const m = meteors[i];
            
            // 根据鼠标位置和流星深度计算位移
            const parallaxX = offsetX * mouseFactor * width * m.depth * 0.5; // 流星的视差效果弱一些
            const parallaxY = offsetY * mouseFactor * height * m.depth * 0.5;
            
            ctx.save();
            ctx.globalAlpha = m.alpha;
            ctx.translate(m.x + parallaxX, m.y + parallaxY); // 应用视差效果
            
            // 固定角度 - 拖影朝左下方（约135度角）
            const angle = Math.PI * 0.75; // 135度，指向左下方
            ctx.rotate(angle);
            
            // 绘制流星尾迹，朝左下方
            const grad = ctx.createLinearGradient(0, 0, m.length, 0);
            grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
            grad.addColorStop(0.1, 'rgba(255, 255, 255, 0.8)');
            grad.addColorStop(0.3, 'rgba(200, 220, 255, 0.6)');
            grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            ctx.strokeStyle = grad;
            ctx.lineWidth = m.width;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(m.length, 0); // 沿着旋转后的坐标轴画线
            ctx.stroke();
            
            // 流星头部添加亮点
            ctx.beginPath();
            ctx.arc(0, 0, m.width + 1, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, ' + m.alpha + ')';
            ctx.fill();
            
            ctx.restore();
            
            // 更新流星位置 - 从左下向右上移动
            const moveDistance = m.speed * (deltaTime / 16.67);
            m.x += moveDistance * 0.7; // 向右移动
            m.y -= moveDistance * 0.7; // 向上移动
            m.alpha -= 0.003 * (deltaTime / 16.67);
            
            // 当流星飞出屏幕或透明度低于0时移除
            if (m.alpha <= 0 || m.x < -m.length || m.x > width + m.length ||
                m.y < -m.length || m.y > height + m.length) {
                meteors.splice(i, 1);
            }
        }
        
        requestAnimationFrame(animateStars);
    }
    
    // 添加resize事件监听
    window.addEventListener('resize', resizeCanvas);
    
    // 初始化
    resizeCanvas();
    
    // 开始动画
    requestAnimationFrame(animateStars);
    
    // 调试信息
    console.log("星空背景已初始化", stars.length, "颗星星", width, "x", height);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 检查是否需要替换原有的星空背景函数
    if (document.body.classList.contains('explore-page')) {
        console.log('启用反向流星轨迹效果');
        
        // 覆盖原函数
        if (typeof window.originalInitStarBackground === 'undefined') {
            window.originalInitStarBackground = window.initStarBackground;
            window.initStarBackground = initStarBackground;
        }
        
        // 初始化新的星空背景
        initStarBackground();
    }
}); 