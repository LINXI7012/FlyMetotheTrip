/**
 * Enhanced Travel Guide Display for Plans Page
 * This script ensures travel guides in the plans page match the detailed format from create page
 */

(function() {
    console.log('Plans Guide Enhancer initialized');
    
    // Wait for DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Further delay initialization to ensure other scripts have loaded first
        setTimeout(initGuidesEnhancer, 300);
    });
    
    // Initialize the guide enhancer
    function initGuidesEnhancer() {
        // 1. Fix existing "view-full-guide" buttons in the page
        setupViewGuideButtons();
        
        // 2. Ensure the script in plans.html uses our enhanced display
        enhanceExistingShowTravelGuideDetails();
    }
    
    // Set up event listeners for view guide buttons
    function setupViewGuideButtons() {
        const viewButtons = document.querySelectorAll('.view-full-guide');
        console.log('Found', viewButtons.length, 'view guide buttons');
        
        viewButtons.forEach(button => {
            // Replace existing click handlers
            button.removeEventListener('click', button.onclick);
            button.onclick = null;
            
            // Add our enhanced click handler
            button.addEventListener('click', function() {
                const planId = this.dataset.planId;
                console.log('Viewing detailed guide for planId:', planId);
                
                // First try to find the guide in savedGuides
                const guides = JSON.parse(localStorage.getItem('savedGuides') || '[]');
                let guide = guides.find(g => g.id == planId);
                
                // If not found, check realGuides (used in plans.html script)
                if (!guide && window.realGuides) {
                    guide = window.realGuides.find(g => g.id == planId);
                }
                
                if (guide) {
                    console.log('Found guide data', guide);
                    displayDetailedTravelGuide(guide);
                } else {
                    console.warn('Guide data not found for ID:', planId);
                }
            });
        });
    }
    
    // Enhance the existing showTravelGuideDetails function in the global scope
    function enhanceExistingShowTravelGuideDetails() {
        if (typeof window.showTravelGuideDetails === 'function') {
            console.log('Enhancing existing showTravelGuideDetails function');
            
            // Save original function reference (only if it's not already our enhanced version)
            const originalFn = window.showTravelGuideDetails;
            
            // Replace with enhanced version
            window.showTravelGuideDetails = function(guideData) {
                console.log('Enhanced showTravelGuideDetails called');
                displayDetailedTravelGuide(guideData);
            };
            
            // Also make our function available globally for direct calls
            window.displayDetailedTravelGuide = displayDetailedTravelGuide;
        } else {
            console.log('No existing showTravelGuideDetails function found, creating it');
            window.showTravelGuideDetails = displayDetailedTravelGuide;
            window.displayDetailedTravelGuide = displayDetailedTravelGuide;
        }
        
        // Also patch the script variables if they exist
        if (typeof window.realGuides === 'undefined') {
            // Create a shared reference to the guides
            window.realGuides = JSON.parse(localStorage.getItem('savedGuides') || '[]');
        }
    }
    
    // The detailed travel guide display function (based on the implementation in main.js)
    function displayDetailedTravelGuide(guideData) {
        console.log('Displaying detailed travel guide', guideData);
        
        // 立即添加必要的CSS样式，确保行程显示正确
        addDailyScheduleStyles();
        
        // DEBUG: Print out guide structure to check daily plan format
        console.log('GUIDE STRUCTURE:');
        console.log('- Daily plan items:', guideData.dailyPlan ? guideData.dailyPlan.length : 0);
        
        if (guideData.dailyPlan && guideData.dailyPlan.length > 0) {
            console.log('- Sample day format:', JSON.stringify(guideData.dailyPlan[0], null, 2));
            console.log('- All days:', JSON.stringify(guideData.dailyPlan, null, 2));
            
            // Check for different property naming patterns
            const firstDay = guideData.dailyPlan[0];
            console.log('Day has .activity?', 'activity' in firstDay);
            console.log('Day has .location?', 'location' in firstDay);
            console.log('Day has .morning?', 'morning' in firstDay);
            console.log('Day has .noon?', 'noon' in firstDay);
            console.log('Day has .evening?', 'evening' in firstDay);
            console.log('Day has .morningActivity?', 'morningActivity' in firstDay);
            console.log('Day has .afternoonActivity?', 'afternoonActivity' in firstDay);
            console.log('Day has .eveningActivity?', 'eveningActivity' in firstDay);
            
            // Check for nested activities structure
            if (firstDay.activities) {
                console.log('Day has NESTED activities:', firstDay.activities);
            }
            
            // Show all properties
            console.log('All day properties:', Object.keys(firstDay));
            }                const modal = document.querySelector('.travel-guide-modal');        const overlay = document.querySelector('.travel-guide-overlay');        const container = document.querySelector('.travel-guide-container');        const title = document.querySelector('.travel-guide-title');                if (!modal || !container) {
            console.error('Travel guide modal elements not found');
            return;
        }
        
        // 使用自定义标题（如果有）或默认使用目的地名称
        const displayTitle = guideData.title || `${guideData.destination}旅行攻略`;
        
        // 设置标题
        title.textContent = displayTitle;
        
        // 生成HTML用于旅行攻略
        let guideHTML = `
            <div class="guide-section guide-destination">
                <h3>${guideData.destination}</h3>
                <p>${guideData.overview || '为您定制的完美旅行体验'}</p>
                <div class="destination-badges">
                    <span class="badge badge-style"><i class="badge-icon">🌡️</i> ${guideData.climate || getClimateFromSeason(guideData.season)}</span>
                    <span class="badge badge-style"><i class="badge-icon">⏱️</i> ${guideData.duration || '理想行程'}</span>
                    <span class="badge badge-style"><i class="badge-icon">👥</i> ${guideData.travelers || '个性化体验'}</span>
                </div>
            </div>`;
            
        // 添加用户备注（如果有）
        if (guideData.notes && guideData.notes.trim().length > 0) {
            guideHTML += `
            <div class="guide-section guide-notes">
                <h4>旅行笔记</h4>
                <p>${guideData.notes}</p>
            </div>`;
        }
        
        // 确保highlights是一个数组
        const highlights = Array.isArray(guideData.highlights) ? guideData.highlights : 
                        (guideData.uniqueFeatures || ["当地文化", "美食体验", "自然风光"]);
        
        // 添加亮点部分
        guideHTML += `
            <div class="guide-section guide-highlights">
                <h4>行程亮点</h4>
                <ul>
        `;
        
        // 为每个亮点添加一个随机图标
        const highlightIcons = ['🏞️', '🗿', '🏛️', '🏖️', '🌄', '🌋', '🌉', '🏰', '⛩️', '🕌', '🏯', '🏟️', '🎭', '🍴', '🥂', '🎪'];
        highlights.forEach((highlight, index) => {
            const iconIndex = index % highlightIcons.length;
            const icon = highlightIcons[iconIndex];
            
            guideHTML += `
                <li>
                    <div class="highlight-icon">${icon}</div>
                    ${highlight}
                </li>
            `;
        });
        
        guideHTML += `
                </ul>
            </div>
        `;
        
        // 添加每日计划部分
        const dailyPlan = guideData.dailyPlan || [];
        if (dailyPlan.length > 0) {
            guideHTML += `
                <div class="guide-section guide-daily-plan">
                    <h4>每日行程</h4>
                    <div class="guide-daily-plan-container">
            `;
            
            dailyPlan.forEach((day, index) => {
                // Ensure we have valid day properties
                const dayNumber = day.day || (index + 1);
                const activity = day.activity || '探索目的地';
                const location = day.location || '当地景点';
                
                // Extract morning, noon, evening activities from different possible structures
                let morningActivity = '';
                let noonActivity = '';
                let eveningActivity = '';
                
                // Direct properties check
                if (day.morning) morningActivity = day.morning;
                if (day.noon) noonActivity = day.noon;
                if (day.evening) eveningActivity = day.evening;
                
                // Alternative property names check
                if (day.morningActivity) morningActivity = day.morningActivity;
                if (day.afternoonActivity) noonActivity = day.afternoonActivity;
                if (day.eveningActivity) eveningActivity = day.eveningActivity;
                
                // Check for activities array or object
                if (day.activities) {
                    // Could be an array
                    if (Array.isArray(day.activities)) {
                        day.activities.forEach(act => {
                            if (act.time === 'morning' || act.time === '上午') morningActivity = act.activity || act.description;
                            if (act.time === 'noon' || act.time === 'afternoon' || act.time === '中午' || act.time === '下午') noonActivity = act.activity || act.description;
                            if (act.time === 'evening' || act.time === '晚上') eveningActivity = act.activity || act.description;
                        });
                    } 
                    // Could be an object with time properties
                    else if (typeof day.activities === 'object') {
                        if (day.activities.morning) morningActivity = day.activities.morning;
                        if (day.activities.noon || day.activities.afternoon) noonActivity = day.activities.noon || day.activities.afternoon;
                        if (day.activities.evening) eveningActivity = day.activities.evening;
                    }
                    // Could be a JSON string
                    else if (typeof day.activities === 'string') {
                        try {
                            const activitiesObj = JSON.parse(day.activities);
                            if (activitiesObj.morning) morningActivity = activitiesObj.morning;
                            if (activitiesObj.noon || activitiesObj.afternoon) noonActivity = activitiesObj.noon || activitiesObj.afternoon;
                            if (activitiesObj.evening) eveningActivity = activitiesObj.evening;
                        } catch (e) {
                            // Not valid JSON, ignore
                        }
                    }
                }
                
                // Check for a timeTable or schedule property
                if (day.timeTable || day.schedule) {
                    const timeData = day.timeTable || day.schedule;
                    if (typeof timeData === 'object') {
                        if (timeData.morning) morningActivity = timeData.morning;
                        if (timeData.noon || timeData.afternoon) noonActivity = timeData.noon || timeData.afternoon;
                        if (timeData.evening) eveningActivity = timeData.evening;
                    }
                }
                
                // Check for Chinese property names
                if (day.上午) morningActivity = day.上午;
                if (day.中午 || day.下午) noonActivity = day.中午 || day.下午;
                if (day.晚上) eveningActivity = day.晚上;
                
                // 如果每日行程的内容是纯文本描述，尝试解析出上午/中午/晚上的活动
                if (typeof day.description === 'string' && day.description.length > 0) {
                    const desc = day.description;
                    
                    // 检查描述中是否包含时间指示词
                    if (!morningActivity && (desc.includes('上午') || desc.includes('早上') || desc.includes('Morning'))) {
                        const morningPart = desc.split(/[,，。；;]/g).find(part => 
                            part.includes('上午') || part.includes('早上') || part.includes('Morning'));
                        if (morningPart) morningActivity = morningPart.trim();
                    }
                    
                    if (!noonActivity && (desc.includes('中午') || desc.includes('下午') || desc.includes('Noon') || desc.includes('Afternoon'))) {
                        const noonPart = desc.split(/[,，。；;]/g).find(part => 
                            part.includes('中午') || part.includes('下午') || part.includes('Noon') || part.includes('Afternoon'));
                        if (noonPart) noonActivity = noonPart.trim();
                    }
                    
                    if (!eveningActivity && (desc.includes('晚上') || desc.includes('夜晚') || desc.includes('Evening'))) {
                        const eveningPart = desc.split(/[,，。；;]/g).find(part => 
                            part.includes('晚上') || part.includes('夜晚') || part.includes('Evening'));
                        if (eveningPart) eveningActivity = eveningPart.trim();
                    }
                    
                    // 如果仍然没有找到时间区分，就把整个描述放在上午部分
                    if (!morningActivity && !noonActivity && !eveningActivity) {
                        morningActivity = day.description;
                    }
                }
                
                // 确保至少显示一些内容
                if (!morningActivity && !noonActivity && !eveningActivity) {
                    // 如果找不到任何时段信息，但有activity属性，就显示在上午部分
                    if (day.activity) {
                        morningActivity = day.activity;
                    }
                }
                
                // 最后尝试 - 检查整个对象中是否有时间相关的字符串
                for (let key in day) {
                    const value = day[key];
                    if (typeof value === 'string') {
                        // 忽略已处理的属性
                        if (['day', 'activity', 'location', 'description', 'morning', 'noon', 'evening',
                             'morningActivity', 'afternoonActivity', 'eveningActivity', '上午', '中午', '下午', '晚上'].includes(key)) {
                            continue;
                        }
                        
                        // 根据字段名判断时间
                        if (key.toLowerCase().includes('morning') || key.includes('上午') || key.includes('早上')) {
                            morningActivity = value;
                        } else if (key.toLowerCase().includes('noon') || key.toLowerCase().includes('afternoon') || 
                                  key.includes('中午') || key.includes('下午')) {
                            noonActivity = value;
                        } else if (key.toLowerCase().includes('evening') || key.includes('晚上') || key.includes('夜晚')) {
                            eveningActivity = value;
                        }
                    }
                }
                
                // 强制处理：如果完全没有找到任何时段活动，就把目的地地点作为上午活动
                if (!morningActivity && !noonActivity && !eveningActivity) {
                    morningActivity = `参观${location}`;
                    noonActivity = `在${location}享用午餐`;
                    eveningActivity = `返回酒店休息`;
                }
                
                // Check if we have any detailed schedule to display - 这里不再检查，总是显示时间段
                const hasDetailedSchedule = true; // 始终显示上午/中午/晚上时间段
                
                guideHTML += `
                    <div class="guide-day-card">
                        <div class="guide-day-number">第 ${dayNumber} 天</div>
                        <div class="guide-day-details">
                            <h5>${activity}</h5>
                            <p class="day-location">${location}</p>
                            
                            ${hasDetailedSchedule ? `
                            <div class="day-detailed-schedule">
                                <div class="time-slot">
                                    <span class="time-icon">🌅</span>
                                    <span class="time-label">上午:</span>
                                    <span class="time-activity">${morningActivity || '探索当地景点'}</span>
                                </div>
                                
                                <div class="time-slot">
                                    <span class="time-icon">☀️</span>
                                    <span class="time-label">中午:</span>
                                    <span class="time-activity">${noonActivity || '享用当地美食'}</span>
                                </div>
                                
                                <div class="time-slot">
                                    <span class="time-icon">🌃</span>
                                    <span class="time-label">晚上:</span>
                                    <span class="time-activity">${eveningActivity || '自由活动'}</span>
                                </div>
                            </div>` : ''}
                        </div>
                    </div>
                `;
            });
            
            guideHTML += `
                    </div>
                </div>
            `;
        }
        
        // 添加其他信息部分
        guideHTML += `
            <div class="guide-section guide-notes">
                <h4>旅行信息</h4>
                <div class="travel-info-grid">
                    <div class="travel-info-item">
                        <div class="info-icon">🍽️</div>
                        <div class="info-content">
                            <h5>美食推荐</h5>
                            <p>${guideData.food || '当地特色美食'}</p>
                        </div>
                    </div>
                    <div class="travel-info-item">
                        <div class="info-icon">🚆</div>
                        <div class="info-content">
                            <h5>交通方式</h5>
                            <p>${guideData.transportation || '推荐多种交通选择'}</p>
                        </div>
                    </div>
                    <div class="travel-info-item">
                        <div class="info-icon">🏨</div>
                        <div class="info-content">
                            <h5>住宿建议</h5>
                            <p>${guideData.accommodation || '舒适住宿选择'}</p>
                        </div>
                    </div>
                    ${guideData.culture ? `
                    <div class="travel-info-item">
                        <div class="info-icon">🎭</div>
                        <div class="info-content">
                            <h5>文化体验</h5>
                            <p>${guideData.culture}</p>
                        </div>
                    </div>` : ''}
                </div>
            </div>
        `

        // 添加删除按钮（替换原来的保存按钮）
        guideHTML += `
            <div class="travel-guide-save-btn">
                <button id="delete-travel-guide-btn" class="btn-danger">删除攻略</button>
            </div>
        `

        // Insert content
        container.innerHTML = guideHTML;

        // 添加删除按钮点击事件
        const deleteButton = document.getElementById('delete-travel-guide-btn');
        if (deleteButton) {
            deleteButton.addEventListener('click', function() {
                // 确认是否删除
                if (confirm(`确定要删除"${displayTitle}"攻略吗？此操作不可撤销。`)) {
                    // 从localStorage中删除攻略
                    deleteGuideFromStorage(guideData.id);
                    
                    // 显示成功消息
                    alert('攻略已成功删除！');
                    
                    // 关闭模态框
                    closeTravelGuideModal();
                    
                    // 刷新页面以更新列表
                    window.location.reload();
                }
            });
        }

        

        // Show modal and overlay
        modal.classList.add('active');
        if (overlay) overlay.classList.add('active');

        // 添加关闭按钮事件
        const closeButton = document.querySelector('.travel-guide-close');
        if (closeButton) {
            closeButton.addEventListener('click', closeTravelGuideModal);
        }

        // 添加背景点击关闭事件
        if (overlay) {
            overlay.addEventListener('click', closeTravelGuideModal);
        }
    }
    
    // Helper function to add required CSS styles for daily schedule
    function addDailyScheduleStyles() {
        const styleId = 'detailed-schedule-styles';
        if (!document.getElementById(styleId)) {
            console.log('Adding daily schedule styles');
            const styleElement = document.createElement('style');
            styleElement.id = styleId;
            styleElement.textContent = `
                .day-detailed-schedule {
                    margin-top: 15px;
                    border-top: 1px dashed #e0e0e0;
                    padding-top: 12px;
                }
                .time-slot {
                    margin-bottom: 8px;
                    display: flex;
                    align-items: flex-start;
                }
                .time-icon {
                    margin-right: 8px;
                    font-size: 16px;
                    line-height: 20px;
                }
                .time-label {
                    font-weight: bold;
                    margin-right: 6px;
                    color: var(--journal-ink);
                    min-width: 40px;
                }
                .time-activity {
                    flex: 1;
                    color: var(--journal-text);
                    font-family: 'Georgia', serif;
                    line-height: 1.5;
                }
                .guide-day-card {
                    min-width: 280px;
                    max-width: 340px;
                    padding-bottom: 10px !important;
                }
            `;
            document.head.appendChild(styleElement);
        }
    }
    
    // Helper function to close the travel guide modal
    function closeTravelGuideModal() {
        const modal = document.querySelector('.travel-guide-modal');
        const overlay = document.querySelector('.travel-guide-overlay');
        
        if (modal) {
            modal.classList.remove('active');
        }
        
        if (overlay) {
            overlay.classList.remove('active');
        }
        
        // Handle mobile UI reset directly, don't call window.closeTravelGuideModal
        // to avoid circular reference with global function
        if (window.innerWidth <= 768) {
            const journalLeft = document.querySelector('.journal-left');
            const journalRight = document.querySelector('.journal-right');
            
            if (journalLeft && journalRight) {
                journalLeft.style.display = 'none';
                journalRight.style.display = 'block';
                
                // Clear active states on cards
                const activeCards = document.querySelectorAll('.plan-card.active');
                activeCards.forEach(card => card.classList.remove('active'));
                
                // Reset URL hash if needed
                if (window.location.hash) {
                    history.pushState("", document.title, window.location.pathname);
                }
            }
        }
    }
    
    // Helper function to delete a guide from localStorage
    function deleteGuideFromStorage(guideId) {
        if (!guideId) return false;
        
        console.log(`Deleting guide with ID: ${guideId}`);
        
        // 1. Remove from savedGuides
        let savedGuides = JSON.parse(localStorage.getItem('savedGuides') || '[]');
        const originalLength = savedGuides.length;
        savedGuides = savedGuides.filter(guide => guide.id != guideId);
        
        if (savedGuides.length !== originalLength) {
            localStorage.setItem('savedGuides', JSON.stringify(savedGuides));
            console.log(`Removed guide from savedGuides`);
        }
        
        // 2. Remove from window.realGuides if exists
        if (window.realGuides) {
            const originalRealLength = window.realGuides.length;
            window.realGuides = window.realGuides.filter(guide => guide.id != guideId);
            
            if (window.realGuides.length !== originalRealLength) {
                console.log(`Removed guide from window.realGuides`);
            }
        }
        
        // 3. Check all other localStorage items for this guide
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key === 'savedGuides') continue; // Already handled
            
            try {
                const value = localStorage.getItem(key);
                if (!value) continue;
                
                // Check if this item contains our guide ID
                if (value.includes(`"id":${guideId}`) || value.includes(`"id": ${guideId}`)) {
                    try {
                        const data = JSON.parse(value);
                        
                        // If it's an array, filter out our guide
                        if (Array.isArray(data)) {
                            const filteredData = data.filter(item => item.id != guideId);
                            if (filteredData.length !== data.length) {
                                localStorage.setItem(key, JSON.stringify(filteredData));
                                console.log(`Removed guide from localStorage key: ${key}`);
                            }
                        }
                        // If it's an object that matches our guide, remove the whole item
                        else if (data.id == guideId) {
                            localStorage.removeItem(key);
                            console.log(`Removed entire localStorage item: ${key}`);
                        }
                    } catch (err) {
                        // Not valid JSON, skip
                    }
                }
            } catch (err) {
                console.error(`Error checking localStorage key ${key}:`, err);
            }
        }
        
        return true;
    }
    
    // Helper function to get climate description from season
    function getClimateFromSeason(season) {
        if (!season) return '四季皆宜';
        
        const seasons = {
            'spring': '春季宜人',
            'summer': '夏季温暖',
            'fall': '秋季凉爽',
            'winter': '冬季寒冷',
            '春季': '春季宜人',
            '夏季': '夏季温暖',
            '秋季': '秋季凉爽',
            '冬季': '冬季寒冷'
        };
        
        return seasons[season.toLowerCase()] || '四季皆宜';
    }
    
    // Add a custom event handler to refresh view buttons when plans are displayed
    document.addEventListener('plansDisplayed', function() {
        console.log('Plans displayed event detected, refreshing view buttons');
        setTimeout(setupViewGuideButtons, 100);
    });
    
    // Additional initialization to handle the plans page's custom script
    if (document.querySelector('.view-full-guide')) {
        console.log('Found view guide buttons on initial load');
        setupViewGuideButtons();
    }
})(); 