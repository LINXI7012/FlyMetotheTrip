/**
 * 飞机光标效果
 * 创建一个跟随鼠标移动的小飞机光标
 */
document.addEventListener('DOMContentLoaded', function() {
    // 创建飞机光标元素
    const cursor = document.createElement('div');
    cursor.id = 'airplane-cursor';
    document.body.appendChild(cursor);
    
    // 光标位置变量
    let cursorX = 0;
    let cursorY = 0;
    let targetX = 0;
    let targetY = 0;
    
    // 跟踪鼠标位置
    document.addEventListener('mousemove', function(e) {
        targetX = e.clientX;
        targetY = e.clientY;
        
        // 创建拖尾效果
        createTrail(e.clientX, e.clientY);
    });
    
    // 处理鼠标点击
    document.addEventListener('mousedown', function() {
        document.body.classList.add('cursor-clicking');
    });
    
    document.addEventListener('mouseup', function() {
        document.body.classList.remove('cursor-clicking');
    });
    
    // 创建拖尾效果
    function createTrail(x, y) {
        // 控制拖尾生成频率
        if (Math.random() > 0.3) return;
        
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.left = x + 'px';
        trail.style.top = y + 'px';
        document.body.appendChild(trail);
        
        // 移除拖尾元素
        setTimeout(function() {
            if (trail.parentNode === document.body) {
                document.body.removeChild(trail);
            }
        }, 1000);
    }
    
    // 平滑移动光标
    function updateCursorPosition() {
        // 计算当前位置与目标位置之间的差值
        const dx = targetX - cursorX;
        const dy = targetY - cursorY;
        
        // 根据差值计算新位置（平滑过渡）
        cursorX += dx * 0.2;
        cursorY += dy * 0.2;
        
        // 计算飞机的倾斜角度
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        
        // 更新光标位置和旋转
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        // 只有在移动时才应用旋转，避免静止时的抖动
        if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
            cursor.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
        }
        
        // 循环更新位置
        requestAnimationFrame(updateCursorPosition);
    }
    
    // 启动光标动画
    updateCursorPosition();
    
    // 确保光标在窗口大小改变时仍然可见
    window.addEventListener('resize', function() {
        if (targetX > window.innerWidth) {
            targetX = window.innerWidth / 2;
        }
        if (targetY > window.innerHeight) {
            targetY = window.innerHeight / 2;
        }
    });
    
    // 确保不干扰滚轮事件，添加被动事件监听
    document.addEventListener('wheel', function(e) {
        // 仅传递滚轮事件，不做任何处理
    }, { passive: true });
}); 