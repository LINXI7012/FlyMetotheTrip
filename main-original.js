// Main JavaScript file for DeepTrip

document.addEventListener('DOMContentLoaded', function() {
    // Determine which page we're on
    const body = document.body;
    const currentPage = body.classList[0];
    
    console.log('DOM loaded completely');
    console.log('Current page class:', currentPage);
    console.log('All body classes:', body.className);
    
    // Set up page transition events
    setupPageTransitions();
    
    // Initialize back button functionality
    initBackButtons();
    
    // Initialize cursor particle effect
    initCursorParticleEffect();
    
    // Initialize the appropriate page based on the body class
    if (currentPage === 'home') {
        console.log('Initializing home page');
        initHomePage();
    } else if (currentPage === 'create') {
        console.log('Initializing create page');
        initCreatePage();
    } else if (currentPage === 'explore-page' || body.classList.contains('explore-page')) {
        console.log('Initializing explore page');
        initExplorePage();
    } else if (currentPage === 'plans' || currentPage === 'plans-page' || body.classList.contains('plans-page')) {
        console.log('Initializing plans page');
        initPlansPage();
    } else if (currentPage === 'personal-page' || body.classList.contains('personal-page')) {
        console.log('Initializing personal page');
        initPersonalPage();
    } else {
        console.log('No specific page initialization for class:', currentPage);
    }
    
    // Initialize dynamic starry background for explore page
    initStarBackground();
    
    // Update background based on time of day
    updateBackgroundBasedOnTime();
    
    // Debug element presence
    debugElementPresence();
});

// Debug function to check if key elements exist
function debugElementPresence() {
    console.log('==== Debug Element Presence ====');
    
    // Check for map points
    const mapPoints = document.querySelectorAll('.map-point');
    console.log('Map points found:', mapPoints.length);
    
    // Check for destination modal
    const modal = document.querySelector('.destination-modal');
    console.log('Destination modal found:', !!modal);
    
    // Check for modal components
    if (modal) {
        console.log('Modal title found:', !!modal.querySelector('.modal-title'));
        console.log('Modal content found:', !!modal.querySelector('.modal-content'));
        console.log('Modal buttons found:', !!modal.querySelector('.modal-footer'));
    }
    
    // Check for overlay
    const overlay = document.querySelector('.modal-overlay');
    console.log('Modal overlay found:', !!overlay);
    
    console.log('================================');
}

// Initialize cursor particle effect
function initCursorParticleEffect() {
    const body = document.body;
    
    // Create a container for particles
    const particleContainer = document.createElement('div');
    particleContainer.className = 'cursor-particle-container';
    body.appendChild(particleContainer);
    
    // Throttle variables
    let lastParticleTime = 0;
    const throttleDelay = 20; // Only create particles every 50ms
    
    // Mouse move event listener with throttling
    document.addEventListener('mousemove', function(e) {
        const now = Date.now();
        if (now - lastParticleTime > throttleDelay) {
            lastParticleTime = now;
            createParticles(e.clientX, e.clientY);
        }
    });
    
    // Function to create particles
    function createParticles(x, y) {
        // Create multiple particles at once (1-3 particles)
        const particleCount = Math.floor(Math.random() * 2) + 1;
        
        for (let i = 0; i < particleCount; i++) {
            // Create a new particle element
            const particle = document.createElement('div');
            particle.className = 'cursor-particle';
            
            // Random size between 5-15px
            const size = Math.random() * 8 + 5;
            
            // Random color from a vibrant palette
            const colors = [
                '#FF5722', // Orange
                '#E91E63', // Pink
                '#9C27B0', // Purple
                '#3F51B5', // Indigo
                '#2196F3', // Blue
                '#4CAF50', // Green
                '#FFC107'  // Amber
            ];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            // Set particle styles
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.backgroundColor = color;
            
            // Position the particle at cursor position with slight randomness
            const posX = x + (Math.random() - 0.5) * 30;
            const posY = y + (Math.random() - 0.5) * 30;
            particle.style.left = `${posX}px`;
            particle.style.top = `${posY}px`;
            
            // Add particle to container
            particleContainer.appendChild(particle);
            
            // Animate and remove the particle after a delay
            setTimeout(() => {
                // Start fade out and movement animation
                particle.style.opacity = 0;
                
                // Random movement direction
                const randomX = (Math.random() - 0.5) * 80;
                const randomY = (Math.random() - 0.5) * 80;
                particle.style.transform = `translate(${randomX}px, ${randomY}px) scale(0.2)`;
                
                // Remove particle after animation completes
                setTimeout(() => {
                    if (particle.parentNode === particleContainer) {
                        particleContainer.removeChild(particle);
                    }
                }, 500); // Fade out animation duration
            }, 1000); // Stay visible for 1 seconds before starting to fade
        }
    }
}

// Set up home page scroll functionality
function initHomePage() {
    if (!document.body.classList.contains('home')) {
        return; // Only run on the home page
    }
    
    // Variables for scroll tracking
    let scrollAccumulator = 0;
    const scrollThreshold = 150; // Increased threshold for more intentional scrolls
    let isTransitioning = false;
    
    // Handle wheel events (mouse scroll)
    window.addEventListener('wheel', function(event) {
        if (isTransitioning) return;
        
        // Accumulate scroll distance
        scrollAccumulator += event.deltaY;
        
        // Trigger navigation when threshold is exceeded in downward direction
        if (scrollAccumulator > scrollThreshold) {
            triggerPageTransition();
        }
    });
    
    // Touch support for mobile devices
    let touchStartY = 0;
    
    window.addEventListener('touchstart', function(event) {
        if (isTransitioning) return;
        touchStartY = event.touches[0].clientY;
    });
    
    window.addEventListener('touchmove', function(event) {
        if (isTransitioning) return;
        
        const touchY = event.touches[0].clientY;
        const deltaY = touchStartY - touchY;
        
        // Add to accumulator only if swiping down
        if (deltaY > 0) {
            scrollAccumulator += deltaY * 2; // Amplify touch movement
        }
        
        touchStartY = touchY;
        
        // Check if threshold reached
        if (scrollAccumulator > scrollThreshold) {
            triggerPageTransition();
        }
    });
    
    // Handle click on scroll indicator for direct navigation
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', triggerPageTransition);
    }
    
    // Function to handle the transition to create page
    function triggerPageTransition() {
        if (isTransitioning) return;
        isTransitioning = true;
        
        // Add transition effect
        document.body.classList.add('page-transition');
        
        // Navigate after transition animation completes
        setTimeout(() => {
            window.location.href = 'create.html';
        }, 600);
    }
}

// Page transition effect
function setupPageTransitions() {
    const navLinks = document.querySelectorAll('.nav-item');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            
            // Add transition effect
            document.body.classList.add('page-transition');
            
            // Navigate after transition
            setTimeout(() => {
                window.location.href = target;
            }, 600);
        });
    });
    
    // Back button functionality
    const backButton = document.querySelector('.back-nav');
    if (backButton) {
        backButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add transition effect
            document.body.classList.add('page-transition-reverse');
            
            // Navigate back after transition
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 600);
        });
    }
}

// Update background based on time of day
function updateBackgroundBasedOnTime() {
    const hour = new Date().getHours();
    const body = document.body;
    
    // Morning: 5am - 11am
    if (hour >= 5 && hour < 11) {
        body.classList.add('time-morning');
    } 
    // Afternoon: 11am - 5pm
    else if (hour >= 11 && hour < 17) {
        body.classList.add('time-afternoon');
    } 
    // Evening: 5pm - 9pm
    else if (hour >= 17 && hour < 21) {
        body.classList.add('time-evening');
    } 
    // Night: 9pm - 5am
    else {
        body.classList.add('time-night');
    }
}

// Create page functionality
function initCreatePage() {
    if (!document.body.classList.contains('create-page')) {
        return; // Only run on the create page
    }
    
    console.log("Initializing create page...");
    
    // Core variables
    let currentQuestion = 1;
    const totalQuestions = 8;
    const answers = {};
    
    // Page elements
    const welcomeScreen = document.querySelector('.welcome-screen');
    const content = document.querySelector('.content');
    const body = document.body;
    const fullscreenBg = document.querySelector('.fullscreen-bg');
    const progressBar = document.querySelector('.progress-bar-fill');
    const progressText = document.querySelector('.progress-text');
    const questionContainer = document.querySelector('.question-container');
    const resultsContainer = document.querySelector('.results-container');
    const loadingAnimation = document.querySelector('.loading-animation');
    
    // 点击进入按钮
    const enterButton = document.getElementById('enter-questionnaire');
    if (enterButton) {
        enterButton.addEventListener('click', completeTransition);
    }
    
    // 使整个欢迎界面可点击
    if (welcomeScreen) {
        welcomeScreen.addEventListener('click', completeTransition);
    }
    
    // 保留原有的wheel事件处理（简化版，只处理必要的部分）
    window.addEventListener('wheel', function(e) {
        if (isTransitioning) return;
        
        // 只对向下滚动作出反应
        if (e.deltaY > 0) {
            completeTransition();
        }
    });
    
    // 滚动变量
    let isTransitioning = false;
    
    // 触控支持
    let touchStartY = 0;
    let touchMoveY = 0;
    let touchThreshold = 50; // 降低像素阈值，使触发更容易
    
    window.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
    });
    
    window.addEventListener('touchmove', function(e) {
        if (isTransitioning) return;
        touchMoveY = e.touches[0].clientY;
        const touchDiff = touchStartY - touchMoveY;
        
        // 只对向下滑动反应
        if (touchDiff > touchThreshold) {
            completeTransition();
        }
    });
    
    // Function to complete transition to questionnaire
    function completeTransition() {
        if (isTransitioning) return;
        isTransitioning = true;
        
        console.log("Completing transition to questionnaire");
        
        // Hide welcome screen
        if (welcomeScreen) {
            welcomeScreen.classList.add('hidden');
        }
        
        // Show content
        if (content) {
            content.classList.add('active');
            content.style.opacity = 1;
        }
        
        // Reset page layout after animation
        setTimeout(() => {
            // Reset body height and other properties
            body.style.height = 'auto';
            body.style.overflowY = 'auto';
            
            // Show first question
            showQuestion(currentQuestion);
            updateProgress(currentQuestion, totalQuestions);
            
            // Add click handlers for options
            setupQuestionOptions();
        }, 600);
    }
    
    // Set up question option handling
    function setupQuestionOptions() {
        const questionOptions = document.querySelectorAll('.question-option');
        questionOptions.forEach(option => {
            option.addEventListener('click', function() {
                const questionId = this.closest('.question').dataset.questionId;
                const selectedValue = this.dataset.value;
                
                // Clear previous selections
                document.querySelectorAll(`.question[data-question-id="${questionId}"] .question-option`).forEach(opt => {
                    opt.classList.remove('selected');
                    opt.classList.add('faded');
                });
                
                // Apply selected styling
                this.classList.add('selected');
                this.classList.remove('faded');
                
                // Store answer
                answers[questionId] = selectedValue;
                
                // Proceed to next question after delay
                setTimeout(() => {
                    if (currentQuestion < totalQuestions) {
                        currentQuestion++;
                        showQuestion(currentQuestion);
                        updateProgress(currentQuestion, totalQuestions);
                    } else {
                        // Show results when all questions answered
                        showResults(answers);
                    }
                }, 500);
            });
        });
    }
}

// Update progress bar
function updateProgress(current, total) {
    const progressBar = document.querySelector('.progress-bar-fill');
    if (progressBar) {
        const percentage = (current / total) * 100;
        progressBar.style.width = `${percentage}%`;
        
        // Update text indicator
        const progressText = document.querySelector('.progress-text');
        if (progressText) {
            progressText.textContent = `${current}/${total}`;
        }
    }
}

// Show specific question
function showQuestion(questionNumber) {
    const questions = document.querySelectorAll('.question');
    questions.forEach(question => {
        question.classList.remove('active');
    });
    
    const targetQuestion = document.querySelector(`.question[data-question-id="${questionNumber}"]`);
    if (targetQuestion) {
        targetQuestion.classList.add('active');
    }
}

// Show results
function showResults(answers) {
    // Hide questions
    const questionContainer = document.querySelector('.question-container');
    if (questionContainer) {
        questionContainer.style.display = 'none';
    }
    
    // Show loading animation
    const loadingAnimation = document.querySelector('.loading-animation');
    if (loadingAnimation) {
        loadingAnimation.style.display = 'flex';
        
        // Simulate API call with timeout
        setTimeout(() => {
            loadingAnimation.style.display = 'none';
            
            // Show results container
            const resultsContainer = document.querySelector('.results-container');
            if (resultsContainer) {
                resultsContainer.style.display = 'block';
                // 调用异步函数生成旅行攻略
                generateTravelGuide(answers, resultsContainer)
                    .then(travelGuide => {
                        console.log('旅行攻略生成成功:', travelGuide.destination);
                    })
                    .catch(error => {
                        console.error('旅行攻略生成失败:', error);
                    });
            }
        }, 3000);
    }
}

// Generate travel guide based on answers
async function generateTravelGuide(answers, container) {
    // Show loading animation
    const loadingAnimation = document.querySelector('.loading-animation');
    const resultsContainer = document.querySelector('.results-container');
    
    if (loadingAnimation) {
        loadingAnimation.style.display = 'flex';
    }
    
    if (resultsContainer) {
        resultsContainer.style.display = 'none';
    }

    try {
        // Format answers for display
        const formattedAnswers = {};
        for (const questionId in answers) {
            formattedAnswers[questionId] = getTextForValue(questionId, answers[questionId]);
        }
        
        // API parameters
        const apiKey = 'sk-717e6d20ffce4e49b6746dc981a426c6';
        const apiUrl = 'https://api.deepseek.com/v1/chat/completions';
        
        // Create a formatted prompt for the DeepSeek API
        const userSelections = [
            `地区: ${formattedAnswers[1] || '不限'}`,
            `地理特征: ${formattedAnswers[2] || '不限'}`,
            `气候: ${formattedAnswers[3] || '不限'}`,
            `城市类型: ${formattedAnswers[4] || '不限'}`,
            `旅行风格: ${formattedAnswers[5] || '不限'}`,
            `旅行时长: ${formattedAnswers[6] || '周末两天'}`,
            `预算: ${formattedAnswers[7] || '中等'}`,
            `旅行人数: ${formattedAnswers[8] || '两人'}`
        ];
        
        const prompt = createTravelPrompt(answers);

        console.log("正在调用DeepSeek API生成旅行攻略...");
        
        let travelGuidesData = null;
        
        try {
            // Make API request
            console.log("发送API请求...");
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a professional travel planner. Create detailed, personalized travel guides based on user preferences.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 4000
                })
            });
            
            if (!response.ok) {
                console.error(`API错误: ${response.status}`, await response.text());
                throw new Error(`API error: ${response.status}`);
            }
            
            const data = await response.json();
            console.log("API响应成功:", data);
            
            const aiResponse = data.choices[0].message.content;
            console.log("AI响应内容:", aiResponse);
            
            // Parse the AI response
            const parsedGuideData = parseAIResponseToTravelGuide(aiResponse, answers);
            console.log("解析后的旅行攻略数据:", parsedGuideData);
            
            // 直接显示攻略模态框
            showTravelGuideDetails(parsedGuideData);
            
            // 隐藏加载动画，显示结果容器
            if (loadingAnimation) {
                loadingAnimation.style.display = 'none';
            }
            
            if (resultsContainer) {
                resultsContainer.style.display = 'block';
                
                // 在容器中显示简洁的预览内容
                const previewHTML = `
                    <div class="results-preview">
                        <h2>您的专属旅行攻略已生成</h2>
                        <p>目的地: ${parsedGuideData.destination}</p>
                        <p>已生成 ${parsedGuideData.dailyPlan.length} 天的详细行程计划</p>
                        <button class="btn btn-primary view-details-btn">查看详细攻略</button>
                    </div>
                `;
                
                container.innerHTML = previewHTML;
                
                // 添加按钮点击事件
                const viewDetailsBtn = container.querySelector('.view-details-btn');
                if (viewDetailsBtn) {
                    viewDetailsBtn.addEventListener('click', function() {
                        showTravelGuideDetails(parsedGuideData);
                    });
                }
            }
        } catch (error) {
            console.error("API调用失败:", error);
            
            // Get fallback travel guide
            const fallbackGuide = getFallbackTravelGuide();
            
            // Still show details with fallback data
            showTravelGuideDetails(fallbackGuide);
            
            if (loadingAnimation) {
                loadingAnimation.style.display = 'none';
            }
            
            if (resultsContainer) {
                resultsContainer.style.display = 'block';
                
                // 在容器中显示简洁的预览内容 (使用回退数据)
                const previewHTML = `
                    <div class="results-preview">
                        <h2>您的专属旅行攻略已生成</h2>
                        <p>目的地: ${fallbackGuide.destination}</p>
                        <p>已生成 ${fallbackGuide.dailyPlan.length} 天的详细行程计划</p>
                        <button class="btn btn-primary view-details-btn">查看详细攻略</button>
                        <p class="fallback-notice">（由于网络原因，显示的是备用攻略数据）</p>
                    </div>
                `;
                
                container.innerHTML = previewHTML;
        
                // 添加按钮点击事件 (使用回退数据)
                const viewDetailsBtn = container.querySelector('.view-details-btn');
                if (viewDetailsBtn) {
                    viewDetailsBtn.addEventListener('click', function() {
                        showTravelGuideDetails(fallbackGuide);
                    });
                }
            }
        }
    } catch (error) {
        console.error("生成旅行攻略时出错:", error);
        
        if (loadingAnimation) {
            loadingAnimation.style.display = 'none';
        }
        
        if (container) {
        container.innerHTML = `
            <div class="error-container">
                    <h2>生成攻略失败</h2>
                    <p>无法连接到旅行规划服务，请稍后再试</p>
                    <p>错误信息: ${error.message}</p>
            </div>
        `;
        }
    }
}

// Parse the AI response into structured travel guides
function parseAIResponseToTravelGuides(response, answers) {
    try {
        console.log("开始解析AI响应...");
        
        // 尝试直接解析JSON
        try {
            const parsedData = JSON.parse(response);
            console.log("成功解析JSON数据:", parsedData);
            return parsedData;
        } catch (jsonError) {
            console.error("直接JSON解析失败:", jsonError);
            
            // 尝试从文本中提取JSON
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const jsonString = jsonMatch[0];
                console.log("从文本中提取的JSON:", jsonString);
                try {
                    const parsedData = JSON.parse(jsonString);
                    console.log("成功解析提取的JSON数据:", parsedData);
                    return parsedData;
                } catch (extractError) {
                    console.error("解析提取的JSON失败:", extractError);
                }
            }
        }
        
        // 如果所有JSON解析尝试都失败，尝试从文本中手动构建数据
        console.log("尝试从文本手动构建数据...");
        const lines = response.split('\n');
        
        // 提取目的地和概述
        let destination = "";
        let overview = "";
        let uniqueFeatures = [];
        let dailyPlan = [];
        let food = "";
        let accommodation = "";
        let transportation = "";
        let planName = "";
        let duration = "0";
        
        // 扫描文本找关键信息
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            if (line.includes("目的地") || line.toLowerCase().includes("destination")) {
                destination = line.split(/[:：]/)[1]?.trim() || "";
            } else if (line.includes("计划名称") || line.toLowerCase().includes("plan name")) {
                planName = line.split(/[:：]/)[1]?.trim() || "";
            } else if (line.includes("概览") || line.toLowerCase().includes("overview")) {
                overview = line.split(/[:：]/)[1]?.trim() || "";
                if (!overview && i+1 < lines.length) overview = lines[i+1].trim();
            } else if (line.includes("特色") || line.toLowerCase().includes("features")) {
                let j = i + 1;
                while (j < lines.length && (lines[j].trim().startsWith('-') || lines[j].trim().startsWith('*'))) {
                    uniqueFeatures.push(lines[j].trim().replace(/^[-*]\s*/, ''));
                    j++;
                }
            } else if (line.includes("天数") || line.toLowerCase().includes("duration")) {
                const match = line.match(/\d+/);
                if (match) duration = match[0];
            } else if (line.match(/第\s*\d+\s*天/) || line.match(/Day\s*\d+/i)) {
                const dayMatch = line.match(/\d+/);
                if (dayMatch) {
                    const day = parseInt(dayMatch[0]);
                    let activities = "";
                    let location = "";
                    let description = "";
                    let budget = "";
                    
                    // 提取活动等信息
                    for (let j = i + 1; j < lines.length && j < i + 10; j++) {
                        const subline = lines[j].trim();
                        if (subline.includes("活动") || subline.toLowerCase().includes("activities")) {
                            activities = subline.split(/[:：]/)[1]?.trim() || "";
                        } else if (subline.includes("地点") || subline.toLowerCase().includes("location")) {
                            location = subline.split(/[:：]/)[1]?.trim() || "";
                        } else if (subline.includes("描述") || subline.toLowerCase().includes("description")) {
                            description = subline.split(/[:：]/)[1]?.trim() || "";
                        } else if (subline.includes("预算") || subline.toLowerCase().includes("budget")) {
                            budget = subline.split(/[:：]/)[1]?.trim() || "";
                        }
                    }
                    
                    dailyPlan.push({ day, activities, location, description, budget });
                }
            } else if (line.includes("美食") || line.toLowerCase().includes("food")) {
                food = line.split(/[:：]/)[1]?.trim() || "";
            } else if (line.includes("住宿") || line.toLowerCase().includes("accommodation")) {
                accommodation = line.split(/[:：]/)[1]?.trim() || "";
            } else if (line.includes("交通") || line.toLowerCase().includes("transportation")) {
                transportation = line.split(/[:：]/)[1]?.trim() || "";
            }
        }
        
        // 如果没有提取到关键数据，使用备用数据
        if (!destination || dailyPlan.length === 0) {
            console.error('从文本提取数据失败，使用备用数据');
            return getFallbackTravelGuides();
        }
        
        // 构建单一计划数据
        const plan = {
            planName: planName || `${destination}旅行攻略`,
            destination,
            overview,
            uniqueFeatures: uniqueFeatures.length > 0 ? uniqueFeatures : ["自然风光", "文化体验", "当地美食"],
            duration,
            dailyPlan,
            food: food || "当地特色美食",
            accommodation: accommodation || "根据预算选择合适住宿",
            transportation: transportation || "当地公共交通或出租车"
        };
        
        return { plan };
    } catch (error) {
        console.error('Error parsing AI response:', error);
        return getFallbackTravelGuides();
    }
}

// Create HTML for displaying the travel guides
function createTravelGuidesHTML(guidesData) {
    // Return an error message if guidesData is null
    if (!guidesData || !guidesData.plan || !guidesData.plan.dailyPlan || guidesData.plan.dailyPlan.length === 0) {
        return `
            <div class="error-container">
                <h2>生成攻略时出现错误</h2>
                <p>抱歉，无法生成旅行攻略。请稍后再试。</p>
                <button class="btn btn-primary" id="retryButton">重试</button>
            </div>
        `;
    }
    
    let planHTML = '';
    
    // Generate HTML for the plan
    planHTML += `
        <div class="plan-card">
            <div class="plan-header">
                <h3>${guidesData.plan.planName}</h3>
                <h4>${guidesData.plan.destination}</h4>
            </div>
            
            <div class="plan-overview">
                <p>${guidesData.plan.overview}</p>
            </div>
            
            <div class="plan-highlights">
                <h4>行程特色</h4>
                <ul>
        `;
        
        guidesData.plan.uniqueFeatures.forEach(highlight => {
            planHTML += `<li>${highlight}</li>`;
        });
        
        planHTML += `
                </ul>
            </div>
            <div class="plan-daily">
                <h4>日程安排 (${guidesData.plan.duration}天)</h4>
                <div class="guide-daily-plan-container">
        `;
        
        guidesData.plan.dailyPlan.forEach(day => {
            planHTML += `
                <div class="guide-day-card">
                    <div class="guide-day-number">Day ${day.day}</div>
                    <div class="guide-day-details">
                        <h5>${day.activities}</h5>
                        <p class="day-location">${day.location}</p>
                        <p>${day.description}</p>
                        <p class="day-budget"><strong>预算：</strong>${day.budget}</p>
                    </div>
                </div>
            `;
        });
        
        planHTML += `
                </div>
            </div>
            <div class="plan-notes">
                <h4>其他信息</h4>
                <p><strong>美食推荐：</strong> ${guidesData.plan.food}</p>
                <p><strong>住宿：</strong> ${guidesData.plan.accommodation}</p>
                <p><strong>交通：</strong> ${guidesData.plan.transportation}</p>
            </div>
            
            <div class="plan-actions">
                <button class="btn btn-primary btn-save-plan">保存此行程</button>
            </div>
        </div>
    `;
    
    return `
        <div class="results-container">
            <div class="result-title">您的专属旅行攻略已生成</div>
            <div class="result-subtitle">我们为您定制了三个不同的旅行计划，请选择一个保存</div>
            
            <div class="plans-container">
                ${planHTML}
            </div>
        </div>
    `;
}

// Get fallback travel guides
function getFallbackTravelGuides() {
    return {
        plan: {
            planName: "贵州东部户外探险",
            destination: "贵州省黔东南苗族侗族自治州",
            overview: "这条路线将带您探索贵州东部丰富的自然风光和少数民族文化，体验当地的独特风情和自然景观。",
            uniqueFeatures: ["梯田景观", "少数民族村寨", "喀斯特地貌"],
            duration: "3",
            dailyPlan: [
                {
                    day: 1,
                    activities: "凯里市文化体验",
                    location: "凯里市",
                    description: "抵达凯里市，参观苗族博物馆，了解当地文化历史，品尝地道苗族美食。",
                    budget: "约300元"
                },
                {
                    day: 2,
                    activities: "西江千户苗寨探访",
                    location: "西江千户苗寨",
                    description: "游览中国最大的苗族聚居村寨，欣赏苗族歌舞表演，体验当地传统工艺。",
                    budget: "约400元"
                },
                {
                    day: 3,
                    activities: "黄平梯田徒步",
                    location: "黄平县",
                    description: "徒步探索黄平梯田，拍摄壮观的梯田景观，探访当地农家。",
                    budget: "约350元"
                }
            ],
            food: "苗族酸汤鱼、糯米饭、腊肉等当地特色美食",
            accommodation: "西江千户苗寨民宿，每晚约200-300元",
            transportation: "建议包车或拼车，凯里至各景点约1-2小时车程"
        }
    };
}

// Create a formatted prompt for the DeepSeek API (legacy function kept for compatibility)
function createTravelPrompt(answers) {
    const region = getTextForValue(1, answers[1]);
    const geography = getTextForValue(2, answers[2]);
    const climate = getTextForValue(3, answers[3]);
    const cityType = getTextForValue(4, answers[4]);
    const travelStyle = getTextForValue(5, answers[5]);
    const duration = getTextForValue(6, answers[6]);
    const budget = getTextForValue(7, answers[7]);
    const people = getTextForValue(8, answers[8] || 'couple');
    
    return `你是一名资深旅行规划专家，请根据用户提供的选择，生成一个完全匹配用户需求的私人订制旅行攻略。

# 用户需求
- 地区：${region}
- 地理特征：${geography}
- 气候：${climate}
- 城市类型：${cityType}
- 旅行风格：${travelStyle}
- 旅行时长：${duration}
- 预算：${budget}
- 旅行人数：${people}

# 生成要求
1. **完全匹配用户偏好**：你生成的旅行攻略必须严格遵循所有用户选择的条件，不要生成多余的攻略
2. **内容要素**：
   - 详细的目的地选择理由
   - 每日分时段行程（早/午/晚）
   - 标注关键花费项及预算控制提示
   - 推荐符合住宿偏好的具体酒店/民宿
   - 注明交通方式及建议

请使用以下JSON格式返回结果:

{
  "plan": {
    "planName": "个性化旅行计划名称",
    "destination": "目的地名称",
    "overview": "概览描述（100字左右）",
    "uniqueFeatures": ["特色1", "特色2", "特色3"],
    "duration": "天数",
    "dailyPlan": [
      {
        "day": 1,
        "activities": "第一天活动主题",
        "location": "地点",
        "description": "详细描述，包括景点、体验和特色",
        "budget": "预算估计"
      },
      {
        "day": 2,
        "activities": "第二天活动主题",
        "location": "地点",
        "description": "详细描述",
        "budget": "预算估计"
      }
    ],
    "food": "美食推荐",
    "accommodation": "住宿建议",
    "transportation": "交通方案"
  }
}

请确保响应为纯JSON格式。dailyPlan数组中的天数应根据用户选择的旅行时长进行相应调整。每项建议必须完全匹配用户的选择，不要提供一个固定模板，应该是完全个性化的推荐。`;
}

// Parse the AI response into a structured travel guide (legacy function kept for compatibility)
function parseAIResponseToTravelGuide(response, answers) {
    try {
        // Try to extract JSON from the response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const jsonString = jsonMatch[0];
            try {
                const jsonData = JSON.parse(jsonString);
                // Check if the response has the new format with "plan" property
                if (jsonData.plan) {
                    // Convert the new format to the expected format
                    console.log("检测到新格式JSON，进行转换", jsonData.plan);
                    return {
                        destination: jsonData.plan.destination,
                        overview: jsonData.plan.overview,
                        highlights: jsonData.plan.uniqueFeatures || [],
                        duration: jsonData.plan.duration,
                        dailyPlan: jsonData.plan.dailyPlan.map(day => ({
                            day: day.day,
                            activity: day.activities,
                            location: day.location,
                            description: day.description,
                            budget: day.budget
                        })),
                        food: jsonData.plan.food,
                        transportation: jsonData.plan.transportation,
                        accommodation: jsonData.plan.accommodation,
                        culture: "体验当地文化和传统"
                    };
                }
                console.log("检测到旧格式JSON", jsonData);
                return jsonData;
            } catch (jsonError) {
                console.error('解析JSON时出错:', jsonError);
            }
        }
        
        // If no valid JSON, create structured data from the text
        console.log("未检测到有效JSON，尝试从文本解析数据");
        const lines = response.split('\n');
        let destination = '';
        let overview = '';
        let highlights = [];
        let dailyPlan = [];
        
        // Try to extract information from text format
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.startsWith('目的地') || line.includes('推荐目的地')) {
                destination = line.split('：')[1] || line.split(':')[1] || '';
            } else if (line.includes('概述') || line.includes('简介')) {
                overview = lines[i+1] || '';
            } else if (line.includes('亮点') || line.includes('特色')) {
                let j = i + 1;
                while (j < lines.length && lines[j].trim().startsWith('-')) {
                    highlights.push(lines[j].trim().substring(1).trim());
                    j++;
                }
            } else if (line.match(/第\s*\d+\s*天/) || line.match(/Day\s*\d+/i)) {
                const dayMatch = line.match(/\d+/);
                const day = dayMatch ? parseInt(dayMatch[0]) : dailyPlan.length + 1;
                let description = '';
                let j = i + 1;
                while (j < lines.length && !lines[j].match(/第\s*\d+\s*天/) && !lines[j].match(/Day\s*\d+/i)) {
                    description += lines[j] + ' ';
                    j++;
                }
                
                dailyPlan.push({
                    day,
                    activity: `第${day}天行程`,
                    location: destination,
                    description: description.trim()
                });
            }
        }
        
        // Create a fallback structure if parsing fails
        if (!destination) destination = "根据您的偏好推荐的目的地";
        if (highlights.length === 0) highlights = ["当地文化", "美食体验", "自然风光"];
        if (dailyPlan.length === 0) {
            // Create basic daily plan based on answers duration
            const durationText = answers[6];
            let days = 3; // default
            
            if (durationText.includes('周末')) days = 3;
            else if (durationText.includes('一周')) days = 7;
            else if (durationText.includes('两周')) days = 14;
            else if (durationText.includes('一个月')) days = 30;
            
            for (let i = 1; i <= Math.min(days, 7); i++) {
                dailyPlan.push({
                    day: i,
                    activity: `第${i}天行程`,
                    location: destination,
                    description: `探索${destination}的第${i}天`
                });
            }
        }
        
        const result = {
            destination,
            overview,
            highlights,
            duration: dailyPlan.length,
            dailyPlan,
            food: "当地特色美食",
            transportation: "公共交通和步行",
            accommodation: "适合您预算的舒适住宿",
            culture: "体验当地文化和传统"
        };
        
        console.log("从文本构建数据结构:", result);
        return result;
    } catch (error) {
        console.error('解析AI响应时出错:', error);
        return getFallbackTravelGuide();
    }
}

// Show success message when travel guide is saved
function showSuccessSavedMessage() {
    // Create success overlay
    const overlay = document.createElement('div');
    overlay.className = 'success-overlay';
    overlay.style.opacity = '1';
    overlay.style.pointerEvents = 'auto';
    
    // Create success message container
    const messageContainer = document.createElement('div');
    messageContainer.className = 'success-message';
    
    // Create success icon
    const icon = document.createElement('div');
    icon.className = 'success-icon';
    icon.innerHTML = '✓'; // Checkmark
    
    // Create title
    const title = document.createElement('h3');
    title.textContent = '旅行攻略已保存';
    
    // Create message
    const message = document.createElement('p');
    message.textContent = '您的旅行攻略已成功保存到"我的旅行"页面。';
    
    // Assemble message container
    messageContainer.appendChild(icon);
    messageContainer.appendChild(title);
    messageContainer.appendChild(message);
    
    // Add to overlay
    overlay.appendChild(messageContainer);
    
    // Add to body
    document.body.appendChild(overlay);
    
    // Add animation to the checkmark
    const style = document.createElement('style');
    style.textContent = `
        @keyframes checkmark {
            0% { transform: scale(0); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
        .success-icon {
            animation: checkmark 0.5s ease-in-out forwards;
        }
    `;
    document.head.appendChild(style);
    
    // Automatically redirect to plans page after delay
    setTimeout(() => {
        window.location.href = 'plans.html';
    }, 2500);
}

// 保存旅行攻略到localStorage
function saveTravelGuide(travelGuideData, title, notes) {
    // 获取现有攻略或初始化空数组
    let savedGuides = JSON.parse(localStorage.getItem('savedGuides')) || [];
    
    // 添加新攻略，带有唯一ID、当前日期和用户输入的标题与备注
    const newGuide = {
        id: Date.now(), // 使用时间戳作为唯一ID
        createdAt: new Date().toISOString(),
        title: title || `${travelGuideData.destination}之旅`, // 使用用户提供的标题或默认标题
        notes: notes || "", // 用户提供的备注
        ...travelGuideData
    };
    
    // 添加到数组开头（最新的优先）
    savedGuides.unshift(newGuide);
    
    // 保存回localStorage
    localStorage.setItem('savedGuides', JSON.stringify(savedGuides));
    
    console.log('旅行攻略已保存:', newGuide);
    return newGuide.id;
}

// 将选项值转换为文本描述
function getTextForValue(questionId, value) {
    const descriptions = {
        1: { // 旅行地点范围
            domestic: "国内",
            asia: "亚洲",
            europe: "欧洲",
            america: "美洲"
        },
        2: { // 地理特征
            beach: "海滩",
            mountain: "山脉",
            city: "城市",
            countryside: "乡村"
        },
        3: { // 气候类型
            tropical: "热带气候",
            temperate: "温带气候",
            cold: "寒冷气候",
            any: "不限气候"
        },
        4: { // 城市规模
            metropolis: "大都市",
            midsize: "中等城市",
            town: "小镇",
            rural: "乡村地区"
        },
        5: { // 旅行风格
            adventure: "冒险体验",
            cultural: "文化探索",
            relaxation: "放松休闲",
            foodie: "美食之旅"
        },
        6: { // 旅行时长
            weekend: "周末短途 (2-3天)",
            week: "一周左右 (5-7天)",
            twoweeks: "两周左右 (10-14天)",
            month: "长期旅行 (30天以上)"
        },
        7: { // 预算水平
            budget: "经济实惠",
            moderate: "中等预算",
            luxury: "豪华体验",
            unlimited: "不限预算"
        },
        8: { // 旅伴
            solo: "独自旅行",
            couple: "情侣出游",
            friends: "朋友结伴",
            family: "家庭旅行"
        }
    };
    
    return descriptions[questionId]?.[value] || "未指定";
}

// 获取备用旅行攻略数据
function getFallbackTravelGuide() {
    return {
        destination: "京都，日本",
        duration: "7天",
        season: "秋季",
        highlights: [
            "伏见稻荷大社",
            "岚山竹林",
            "金阁寺",
            "祗园区"
        ],
        dailyPlan: [
            { day: 1, activity: "抵达并安顿", location: "京都站" },
            { day: 2, activity: "寺庙之旅", location: "东京都" },
            { day: 3, activity: "文化探索", location: "祗园和市中心" },
            { day: 4, activity: "自然之日", location: "岚山" },
            { day: 5, activity: "历史探索", location: "北京都" },
            { day: 6, activity: "美食之旅", location: "锦市场及周边" },
            { day: 7, activity: "最终观光和离开", location: "南京都" }
        ]
    };
}

// Initialize Explore page with world map
function initExplorePage() {
    console.log('Explore page initialized');
    
    // 定义所有目的地数据
    const destinations = [
        { id: 1, name: 'Paris', region: 'Europe' },
        { id: 2, name: 'Tokyo', region: 'Asia' },
        { id: 3, name: 'New York', region: 'North America' },
        { id: 4, name: 'Sydney', region: 'Oceania' },
        { id: 5, name: 'Cairo', region: 'Africa' },
        { id: 6, name: 'Rio', region: 'South America' },
        { id: 7, name: 'Rome', region: 'Europe' },
        { id: 8, name: 'London', region: 'Europe' },
        { id: 9, name: 'Bangkok', region: 'Asia' },
        { id: 10, name: 'Los Angeles', region: 'North America' }
    ];
    
    // 记录当前选择的目的地
    let currentDestination = null;
    
    // 为地图点添加点击事件
    const mapPoints = document.querySelectorAll('.map-point');
    
    if (mapPoints && mapPoints.length > 0) {
        console.log('Map points found:', mapPoints.length);
        
        mapPoints.forEach(point => {
            // 添加点击事件
            point.addEventListener('click', function(e) {
                console.log('Map point clicked:', this.dataset.id);
                e.stopPropagation(); // 阻止事件冒泡
                
                try {
                    const destinationId = parseInt(this.dataset.id);
                    const destination = destinations.find(d => d.id === destinationId);
                    
                    if (destination) {
                        console.log('Found destination:', destination);
                        currentDestination = destination;
                        showDestinationDetails(destination);
                    } else {
                        console.error('No destination found with ID:', destinationId);
                    }
                } catch (error) {
                    console.error('Error handling map point click:', error);
                }
            });
            
            // 悬停效果
            point.addEventListener('mouseenter', function() {
                this.classList.add('hover');
            });
            
            point.addEventListener('mouseleave', function() {
                this.classList.remove('hover');
            });
        });
    } else {
        console.error('No map points found on the page');
    }
    
    // 添加关闭按钮点击事件
    const modalCloseBtn = document.querySelector('.modal-close');
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', function() {
            const modal = document.querySelector('.destination-modal');
            const overlay = document.querySelector('.modal-overlay');
            
            if (modal) modal.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
        });
    } else {
        console.error('没有找到模态窗口关闭按钮!');
    }
    
    // 添加遮罩点击事件
    const modalOverlay = document.querySelector('.modal-overlay');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function() {
            console.log('遮罩点击');
            const modal = document.querySelector('.destination-modal');
            
            if (modal) modal.classList.remove('active');
            this.classList.remove('active');
        });
    } else {
        console.error('没有找到模态窗口遮罩!');
    }
    
    // 添加按钮事件处理
    const viewGuidesBtn = document.querySelector('.view-guides-btn');
    const viewCommunityGuidesBtn = document.querySelector('.view-community-guides-btn');
    const createTripBtn = document.querySelector('.btn-secondary.create-trip-btn');
    
    if (viewGuidesBtn) {
        viewGuidesBtn.addEventListener('click', function() {
            console.log('View Travel Guides button clicked');
            if (currentDestination) {
                // 查看当前目的地的旅行攻略
                showOfficialGuides(currentDestination.name);
            }
        });
    }
    
    if (viewCommunityGuidesBtn) {
        viewCommunityGuidesBtn.addEventListener('click', function() {
            console.log('View Community Guides button clicked');
            if (currentDestination) {
                // 查看社区分享的攻略
                showCommunityGuides(currentDestination.name);
            }
        });
    }
    
    if (createTripBtn) {
        createTripBtn.addEventListener('click', function() {
            console.log('Create Custom Trip button clicked');
            if (currentDestination) {
                // 保存当前目的地到会话存储
                sessionStorage.setItem('selectedDestination', currentDestination.name);
                // 跳转到创建页面
                window.location.href = 'create.html';
            }
        });
    }
    
    console.log('=== Explore page 初始化完成 ===');
}

// 显示官方旅行攻略
function showOfficialGuides(destinationName) {
    console.log('Showing official guides for:', destinationName);
    
    // 检查社区攻略模态框是否存在，如果存在则复用
    let communityModal = document.querySelector('.community-guides-modal');
    let communityOverlay = document.querySelector('.community-guides-overlay');
    
    if (!communityModal || !communityOverlay) {
        console.error('Community guides modal not found');
        return;
    }
    
    // 更新模态框标题
    const modalTitle = communityModal.querySelector('.community-guides-title');
    if (modalTitle) {
        modalTitle.textContent = `${destinationName} 官方攻略`;
    }
    
    // 获取内容容器
    const guidesList = communityModal.querySelector('.community-guides-list');
    if (!guidesList) {
        console.error('Guides list container not found');
        return;
    }
    
    // 清空现有内容
    guidesList.innerHTML = '';
    
    // 添加官方攻略内容
    const officialGuides = [
        {
            id: 1,
            title: `${destinationName} 3日游`,
            author: 'DeepTrip 官方',
            image: `img/${destinationName.toLowerCase().replace(/ /g, '')}.png`,
            rating: 4.8,
            days: 3,
            tags: ['精选', '短途', '热门'],
            content: `这是一份为期3天的${destinationName}行程，覆盖了所有必去景点和体验。`
        },
        {
            id: 2,
            title: `${destinationName} 文化探索`,
            author: 'DeepTrip 官方',
            image: `img/${destinationName.toLowerCase().replace(/ /g, '')}.png`,
            rating: 4.6,
            days: 5,
            tags: ['文化', '深度', '历史'],
            content: `深入了解${destinationName}的文化底蕴和历史背景，体验当地人的生活方式。`
        },
        {
            id: 3,
            title: `${destinationName} 美食之旅`,
            author: 'DeepTrip 官方',
            image: `img/${destinationName.toLowerCase().replace(/ /g, '')}.png`,
            rating: 4.9,
            days: 4,
            tags: ['美食', '休闲', '体验'],
            content: `品尝${destinationName}的各种特色美食，从高档餐厅到街头小吃，满足你的味蕾。`
        }
    ];
    
    // 生成攻略卡片
    officialGuides.forEach(guide => {
        const card = document.createElement('div');
        card.className = 'community-guide-card';
        
        // 避免图片加载错误
        let imagePath;
        const cityName = destinationName.toLowerCase();
        if (cityName === 'paris') {
            imagePath = 'img/paris.png';
        } else if (cityName === 'tokyo') {
            imagePath = 'img/tokyo.png';
        } else if (cityName === 'new york') {
            imagePath = 'img/New York.png';
        } else if (cityName === 'sydney') {
            imagePath = 'img/Sydney.png';
        } else if (cityName === 'rome') {
            imagePath = 'img/rome.png';
        } else if (cityName === 'bangkok') {
            imagePath = 'img/bangkok.png';
        } else if (cityName === 'cairo') {
            imagePath = 'img/cairo.png';
        } else if (cityName === 'rio') {
            imagePath = 'img/rio.png';
        } else if (cityName === 'london') {
            imagePath = 'img/lundon.png';
        } else if (cityName === 'los angeles') {
            imagePath = 'img/los Angeles.png';
        } else if (cityName === 'bali') {
            imagePath = 'img/bali.png';
        } else {
            imagePath = 'img/world map.png';
        }
        
        card.innerHTML = `
            <div class="guide-card-image" style="background-image: url('${imagePath}')"></div>
            <div class="guide-card-content">
                <h3 class="guide-card-title">${guide.title}</h3>
                <div class="guide-card-author">作者: ${guide.author}</div>
                <div class="guide-card-rating">
                    评分: ${guide.rating} 
                    <span class="rating-star">★</span>
                </div>
                <div class="guide-card-tags">
                    ${guide.tags.map(tag => `<span class="guide-tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;
        
        card.addEventListener('click', function() {
            showGuideDetail(guide, destinationName);
        });
        
        guidesList.appendChild(card);
    });
    
    // 显示模态框
    communityModal.classList.add('active');
    communityOverlay.classList.add('active');
    
    // 添加关闭按钮事件
    const closeBtn = communityModal.querySelector('.community-guides-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeCommunityGuidesModal);
    }
    
    communityOverlay.addEventListener('click', closeCommunityGuidesModal);
}

// 显示目的地详情模态窗口
function showDestinationDetails(destination) {
    console.log('Showing destination details for:', destination.name);
    
    const modal = document.querySelector('.destination-modal');
    const modalOverlay = document.querySelector('.modal-overlay');
    
    if (!modal || !modalOverlay) {
        console.error('Modal or overlay elements not found!');
        return;
    }
    
    const modalTitle = modal.querySelector('.modal-title');
    const modalContent = modal.querySelector('.modal-content');
    
    if (!modalTitle || !modalContent) {
        console.error('Modal title or content elements not found!');
        return;
    }
    
    // 设置模态窗口标题
    modalTitle.textContent = destination.name;
    
    // 获取目的地详细信息
    const destinationDetails = getDestinationDetails(destination.name);
    
    // 图片文件名处理
    let imagePath;
    const cityName = destination.name.toLowerCase();
    
    // 为不同城市指定正确的图片路径
    if (cityName === 'paris') {
        imagePath = 'img/paris.png';
    } else if (cityName === 'tokyo') {
        imagePath = 'img/tokyo.png';
    } else if (cityName === 'new york') {
        imagePath = 'img/New York.png';
    } else if (cityName === 'sydney') {
        imagePath = 'img/Sydney.png';
    } else if (cityName === 'rome') {
        imagePath = 'img/rome.png';
    } else if (cityName === 'bangkok') {
        imagePath = 'img/bangkok.png';
    } else if (cityName === 'cairo') {
        imagePath = 'img/cairo.png';
    } else if (cityName === 'rio') {
        imagePath = 'img/rio.png';
    } else if (cityName === 'london') {
        imagePath = 'img/lundon.png';
    } else if (cityName === 'los angeles') {
        imagePath = 'img/los Angeles.png';
    } else if (cityName === 'bali') {
        imagePath = 'img/bali.png';
    } else {
        // 如果没有对应图片，使用默认背景
        imagePath = 'img/world map.png';
    }
    
    // 构建详细内容HTML
    try {
        modalContent.innerHTML = `
            <div class="destination-image" style="background-image: url('${imagePath}')"></div>
            <div class="destination-info">
                <h4>关于 ${destination.name}</h4>
                <p>${destinationDetails.description}</p>
                
                <h4>最佳游览时间</h4>
                <p>${destinationDetails.bestTimeToVisit}</p>
                
                <h4>必去景点</h4>
                <ul class="highlights-list">
                    ${destinationDetails.highlights.map(highlight => `<li>${highlight}</li>`).join('')}
                </ul>
                
                <div class="destination-facts">
                    <div class="fact">
                        <span class="fact-label">地区</span>
                        <span class="fact-value">${destination.region}</span>
                    </div>
                    <div class="fact">
                        <span class="fact-label">语言</span>
                        <span class="fact-value">${destinationDetails.language}</span>
                    </div>
                    <div class="fact">
                        <span class="fact-label">货币</span>
                        <span class="fact-value">${destinationDetails.currency}</span>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error building modal content:', error);
        return;
    }
    
    // 显示模态窗口和遮罩
    modal.classList.add('active');
    modalOverlay.classList.add('active');
    
    console.log('Modal activated - classes:', modal.className);
    
    // 确保按钮事件处理已设置
    setupModalButtons(destination);
}

// 设置模态窗口按钮事件
function setupModalButtons(destination) {
    const viewGuidesBtn = document.querySelector('.view-guides-btn');
    const viewCommunityGuidesBtn = document.querySelector('.view-community-guides-btn');
    const createTripBtn = document.querySelector('.btn-secondary.create-trip-btn');
    
    if (viewGuidesBtn) {
        // 移除已有的事件监听器，避免重复添加
        const clonedBtn = viewGuidesBtn.cloneNode(true);
        viewGuidesBtn.parentNode.replaceChild(clonedBtn, viewGuidesBtn);
        
        clonedBtn.addEventListener('click', function() {
            console.log('View guides clicked for:', destination.name);
            showOfficialGuides(destination.name);
        });
    }
    
    if (viewCommunityGuidesBtn) {
        // 移除已有的事件监听器，避免重复添加
        const clonedBtn = viewCommunityGuidesBtn.cloneNode(true);
        viewCommunityGuidesBtn.parentNode.replaceChild(clonedBtn, viewCommunityGuidesBtn);
        
        clonedBtn.addEventListener('click', function() {
            console.log('View community guides clicked for:', destination.name);
            showCommunityGuides(destination.name);
        });
    }
    
    if (createTripBtn) {
        // 移除已有的事件监听器，避免重复添加
        const clonedBtn = createTripBtn.cloneNode(true);
        createTripBtn.parentNode.replaceChild(clonedBtn, createTripBtn);
        
        clonedBtn.addEventListener('click', function() {
            console.log('Create trip clicked for:', destination.name);
            // 保存当前目的地到会话存储
            sessionStorage.setItem('selectedDestination', destination.name);
            // 跳转到创建页面
            window.location.href = 'create.html';
        });
    }
}

// Initialize Personal page
function initPersonalPage() {
    console.log('Personal page initialized');
    console.log('Body class:', document.body.className);
    
    // 获取DOM元素
    const mapContainer = document.querySelector('#map');
    console.log('Map container found:', mapContainer);
    
    const timelineContainer = document.getElementById('timelineContainer');
    console.log('Timeline container found:', timelineContainer);
    
    const timelineItems = document.querySelectorAll('.timeline-item');
    console.log('Timeline items found:', timelineItems.length, timelineItems);
    
    const mapMarkers = document.querySelectorAll('.map-location-marker');
    console.log('Map markers found:', mapMarkers.length, mapMarkers);
    
    const resetButton = document.getElementById('mapReset');
    console.log('Reset button found:', resetButton);
    
    // 左右导航按钮
    const leftNavBtn = document.getElementById('timelineLeft');
    console.log('Left nav button found:', leftNavBtn);
    
    const rightNavBtn = document.getElementById('timelineRight');
    console.log('Right nav button found:', rightNavBtn);
    
    let activeIndex = 0; // 跟踪当前激活项的索引
    
    // 初始化第一个项目为激活状态
    if(timelineItems.length > 0 && mapMarkers.length > 0) {
        console.log('Both timeline items and map markers exist, initializing interactions');
        
        // 检查所有的时间线项的data-id属性
        timelineItems.forEach((item, idx) => {
            console.log(`Timeline item ${idx} data-id:`, item.getAttribute('data-id'));
        });
        
        // 检查所有的地图标记的data-location-id属性
        mapMarkers.forEach((marker, idx) => {
            console.log(`Map marker ${idx} data-location-id:`, marker.getAttribute('data-location-id'));
        });
        
        // 初始设置第一个项目为激活状态
        console.log('Activating initial location (index 0)');
        activateLocation(0);
        
        // 为时间线项添加点击事件监听器
        timelineItems.forEach((item, index) => {
            console.log(`Adding click listener to timeline item ${index}`);
            item.addEventListener('click', function() {
                console.log('Timeline item clicked:', index);
                activateLocation(index);
            });
        });
        
        // 为地图标记添加点击事件监听器
        mapMarkers.forEach((marker) => {
            const locationId = marker.getAttribute('data-location-id');
            console.log(`Adding click listener to map marker with location ID: ${locationId}`);
            marker.addEventListener('click', function() {
                console.log('Map marker clicked with location ID:', locationId);
                
                // 查找匹配的时间线项索引
                const index = Array.from(timelineItems).findIndex(
                    item => item.getAttribute('data-id') === locationId
                );
                
                console.log('Found matching timeline item index:', index);
                
                if (index !== -1) {
                    console.log('Activating location with index:', index);
                    activateLocation(index);
                } else {
                    console.error('No matching timeline item found for locationId:', locationId);
                }
            });
        });
        
        // 添加导航按钮功能
        if (leftNavBtn) {
            console.log('Adding click listener to left nav button');
            leftNavBtn.addEventListener('click', function() {
                console.log('Left nav button clicked, current index:', activeIndex);
                if (activeIndex > 0) {
                    activateLocation(activeIndex - 1);
                }
            });
        }
        
        if (rightNavBtn) {
            console.log('Adding click listener to right nav button');
            rightNavBtn.addEventListener('click', function() {
                console.log('Right nav button clicked, current index:', activeIndex);
                if (activeIndex < timelineItems.length - 1) {
                    activateLocation(activeIndex + 1);
                }
            });
        }
        
        // 重置地图和时间线
        if (resetButton) {
            console.log('Adding click listener to reset button');
            resetButton.addEventListener('click', resetView);
        }
    } else {
        console.error('Timeline items or map markers not found');
    }
    
    // 激活指定索引的位置
    function activateLocation(index) {
        console.log('activateLocation called with index:', index);
        
        if (index < 0 || index >= timelineItems.length) {
            console.error('Invalid index:', index);
            return;
        }
        
        activeIndex = index;
        console.log('Setting activeIndex to:', activeIndex);
        
        // 停用所有时间线项和地图标记
        console.log('Removing active class from all timeline items and map markers');
        timelineItems.forEach(item => {
            item.classList.remove('active');
            item.classList.add('inactive');
        });
        
        mapMarkers.forEach(marker => {
            marker.classList.remove('active');
        });
        
        // 激活选定的时间线项
        const activeItem = timelineItems[index];
        console.log('Activating timeline item:', activeItem);
        activeItem.classList.remove('inactive');
        activeItem.classList.add('active');
        
        // 激活相应的地图标记
        const locationId = activeItem.getAttribute('data-id');
        console.log('Looking for map marker with location ID:', locationId);
        const activeMarker = document.querySelector(`.map-location-marker[data-location-id="${locationId}"]`);
        console.log('Found active marker:', activeMarker);
        
        if (activeMarker) {
            console.log('Adding active class to map marker');
            activeMarker.classList.add('active');
        } else {
            console.error('No matching map marker found for locationId:', locationId);
        }
        
        // 滚动时间线以居中显示活动项
        if (timelineContainer) {
            console.log('Scrolling timeline to center active item');
            const itemLeft = activeItem.offsetLeft;
            const itemWidth = activeItem.offsetWidth;
            const containerWidth = timelineContainer.offsetWidth;
            
            timelineContainer.scrollTo({
                left: itemLeft - (containerWidth / 2) + (itemWidth / 2),
                behavior: 'smooth'
            });
        }
        
        // 更新导航按钮状态
        updateNavButtonsState();
    }
    
    // 更新导航按钮状态
    function updateNavButtonsState() {
        console.log('Updating nav button states, activeIndex:', activeIndex);
        if (leftNavBtn) {
            leftNavBtn.classList.toggle('disabled', activeIndex === 0);
        }
        
        if (rightNavBtn) {
            rightNavBtn.classList.toggle('disabled', activeIndex === timelineItems.length - 1);
        }
    }
    
    // 重置视图
    function resetView() {
        console.log('Resetting view');
        
        // 重置缩放/平移效果
        if (mapContainer) {
            mapContainer.style.transform = 'scale(1) translate(0, 0)';
        }
        
        // 将所有时间线项和地图标记重置为默认状态
        timelineItems.forEach(item => {
            item.classList.remove('active', 'inactive');
        });
        
        mapMarkers.forEach(marker => {
            marker.classList.remove('active');
        });
        
        // 重置活动索引
        activeIndex = -1;
        
        // 更新导航按钮
        updateNavButtonsState();
    }
    
    // 检查时间线容器滚动以更新按钮
    if (timelineContainer) {
        timelineContainer.addEventListener('scroll', () => {
            // 计算是否在滚动的开始或结束位置
            const scrollLeft = timelineContainer.scrollLeft;
            const maxScrollLeft = timelineContainer.scrollWidth - timelineContainer.clientWidth;
            
            // 根据需要更新滚动位置的UI
            if (leftNavBtn) {
                leftNavBtn.classList.toggle('scroll-disabled', scrollLeft <= 0);
            }
            
            if (rightNavBtn) {
                rightNavBtn.classList.toggle('scroll-disabled', scrollLeft >= maxScrollLeft - 10);
            }
        });
    }
}

// Initialize Plans page
function initPlansPage() {
    console.log('Plans page initialized');
    console.log('initPlansPage function executing...');
    
    // Get saved travel guides from localStorage
    const savedGuides = JSON.parse(localStorage.getItem('savedGuides')) || [];
    console.log('Saved guides retrieved from localStorage:', savedGuides.length);
    
    // Initialize upcomingPlans array
    let upcomingPlans = [];
    
    // Initialize pagination variables
    let currentPage = 1;
    let plansPerPage = 3;
    let selectedPlanId = null;
    
    // First add saved guides to plans with default tasks
    savedGuides.forEach(guide => {
        // Extract destination and create start/end dates
        const destination = guide.destination.split(',')[0]; // Just take the city part
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(today.getDate() + 30); // Set departure to 30 days from now
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + parseInt(guide.duration)); // Add duration
        
        // Create plan object
        upcomingPlans.push({
            id: guide.id,
            destination: guide.title || destination, // 使用自定义标题或默认目的地
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
            tasks: [
                { id: guide.id + 1, text: 'Book flight', completed: false },
                { id: guide.id + 2, text: 'Reserve accommodation', completed: false },
                { id: guide.id + 3, text: 'Plan daily activities', completed: true },
                { id: guide.id + 4, text: 'Pack luggage', completed: false }
            ],
            // Store the full guide data for viewing details
            guideData: guide
        });
    });
    
    // Then add simulated upcoming plans data
    upcomingPlans = upcomingPlans.concat([
        { 
            id: 1,
            destination: 'Kyoto', 
            startDate: '2024-11-10', 
            endDate: '2024-11-17',
            tasks: [
                { id: 101, text: 'Book flight', completed: true },
                { id: 102, text: 'Reserve hotel', completed: true },
                { id: 103, text: 'Research temples', completed: false },
                { id: 104, text: 'Pack luggage', completed: false }
            ]
        },
        { 
            id: 2,
            destination: 'Iceland', 
            startDate: '2025-02-15', 
            endDate: '2025-02-22',
            tasks: [
                { id: 201, text: 'Book northern lights tour', completed: true },
                { id: 202, text: 'Rent car', completed: false },
                { id: 203, text: 'Pack winter clothes', completed: false }
            ]
        }
    ]);
    
    // Update total pages
    const totalPages = Math.ceil(upcomingPlans.length / plansPerPage);
    updatePaginationDisplay(totalPages);
    
    // Populate plans initially for page 1
    populatePlans(1);
    
    // Add event listener to pagination buttons
    const prevBtn = document.querySelector('.pagination-btn.prev');
    const nextBtn = document.querySelector('.pagination-btn.next');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            if (currentPage > 1) {
                // Add page turning animation
                animatePageTurn('prev');
                
                setTimeout(() => {
                    currentPage--;
                    populatePlans(currentPage);
                    updatePaginationDisplay(totalPages);
                }, 500); // Delay population until animation finishes
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            if (currentPage < totalPages) {
                // Add page turning animation
                animatePageTurn('next');
                
                setTimeout(() => {
                    currentPage++;
                    populatePlans(currentPage);
                    updatePaginationDisplay(totalPages);
                }, 500); // Delay population until animation finishes
            }
        });
    }
    
    // Function to update pagination display
    function updatePaginationDisplay(totalPages) {
        // Update page numbers display
        document.querySelector('.current-page').textContent = currentPage;
        document.querySelector('.total-pages').textContent = totalPages;
        
        // Enable/disable prev button
        if (prevBtn) {
            prevBtn.disabled = currentPage === 1;
        }
        
        // Enable/disable next button
        if (nextBtn) {
            nextBtn.disabled = currentPage === totalPages || totalPages === 0;
        }
    }
    
    // Function to populate plans for a specific page
    function populatePlans(page) {
        const plansContainer = document.querySelector('.plans-container');
        if (!plansContainer) return;
        
        // Calculate start and end indices
        const startIndex = (page - 1) * plansPerPage;
        const endIndex = Math.min(startIndex + plansPerPage, upcomingPlans.length);
        
        // Get plans for current page
        const currentPagePlans = upcomingPlans.slice(startIndex, endIndex);
        
        if (currentPagePlans.length > 0) {
            let plansHTML = '';
            
            currentPagePlans.forEach(plan => {
                const startDate = new Date(plan.startDate);
                const endDate = new Date(plan.endDate);
                const formattedStartDate = startDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
                const formattedEndDate = endDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
                
                // Calculate completion percentage
                const totalTasks = plan.tasks.length;
                const completedTasks = plan.tasks.filter(task => task.completed).length;
                const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
                
                // Add a badge for guides that came from the creator
                const hasGuideData = plan.guideData ? '<span class="plan-badge">My Guide</span>' : '';
                
                // Check if this plan is the selected one
                const isActive = plan.id === selectedPlanId ? 'active' : '';
                
                plansHTML += `
                    <div class="plan-card ${isActive}" data-plan-id="${plan.id}">
                        <div class="plan-header">
                            <h3>${plan.destination} ${hasGuideData}</h3>
                            <div class="plan-dates">${formattedStartDate} - ${formattedEndDate}</div>
                        </div>
                        <div class="plan-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${completionPercentage}%"></div>
                            </div>
                            <div class="progress-text">${completionPercentage}% ready</div>
                        </div>
                    </div>
                `;
            });
            
            plansContainer.innerHTML = plansHTML;
            console.log('Plans populated in container:', currentPagePlans.length, 'plans displayed');
            
            // Add click event listeners to plan cards
            const planCards = document.querySelectorAll('.plan-card');
            planCards.forEach(card => {
                card.addEventListener('click', function() {
                    const planId = parseInt(this.dataset.planId);
                    
                    // Remove active class from all cards
                    planCards.forEach(c => c.classList.remove('active'));
                    
                    // Add active class to clicked card
                    this.classList.add('active');
                    
                    // Set selected plan ID
                    selectedPlanId = planId;
                    
                    // Show plan details
                    const plan = upcomingPlans.find(p => p.id === planId);
                    if (plan) {
                        showPlanDetails(plan);
                    }
                });
            });
            
            // If there's a selected plan, highlight it
            if (selectedPlanId) {
                const selectedCard = document.querySelector(`.plan-card[data-plan-id="${selectedPlanId}"]`);
                if (selectedCard) {
                    selectedCard.classList.add('active');
                } else {
                    // If the selected plan is not on the current page, clear the selection
                    selectedPlanId = null;
                    clearPlanDetails();
                }
            }
            
            // If no plan is selected yet and there are plans, select the first one
            if (!selectedPlanId && currentPagePlans.length > 0) {
                selectedPlanId = currentPagePlans[0].id;
                const firstCard = document.querySelector('.plan-card');
                if (firstCard) {
                    firstCard.classList.add('active');
                    const plan = upcomingPlans.find(p => p.id === selectedPlanId);
                    if (plan) {
                        showPlanDetails(plan);
                    }
                }
            }
        } else {
            // No plans to display
            plansContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">✈️</div>
                    <h3>暂无旅行计划</h3>
                    <p>通过问卷生成或从探索界面收藏的攻略将显示在这里</p>
                </div>
            `;
            // Clear plan details
            clearPlanDetails();
        }
    }
    
    // Function to show plan details in the left panel
    function showPlanDetails(plan) {
        const detailsContainer = document.querySelector('.plan-details-content');
        if (!detailsContainer) return;
        
        const startDate = new Date(plan.startDate);
        const endDate = new Date(plan.endDate);
        const formattedStartDate = startDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        const formattedEndDate = endDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        
        // Calculate days until the trip
        const today = new Date();
        const daysUntil = Math.ceil((startDate - today) / (1000 * 60 * 60 * 24));
        const daysUntilText = daysUntil > 0 ? `${daysUntil} days until your trip` : 'Trip in progress';
        
        // Calculate completion percentage
        const totalTasks = plan.tasks.length;
        const completedTasks = plan.tasks.filter(task => task.completed).length;
        const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        
        let detailsHTML = `
            <div class="plan-details">
                <div class="plan-details-header">
                    <h2>${plan.destination}</h2>
                    <div class="plan-details-dates">${formattedStartDate} - ${formattedEndDate}</div>
                    <div class="plan-details-countdown">${daysUntilText}</div>
                </div>
                <div class="plan-details-body">
                    <div class="plan-details-section">
                        <h3>准备进度</h3>
                        <div class="plan-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${completionPercentage}%"></div>
                            </div>
                            <div class="progress-text">${completionPercentage}% complete</div>
                        </div>
                    </div>
                    <div class="plan-details-section">
                        <h3>准备任务</h3>
                        <ul class="task-list">
        `;
        
        plan.tasks.forEach(task => {
            detailsHTML += `
                <li class="task-item ${task.completed ? 'completed' : ''}">
                    <label class="task-checkbox">
                        <input type="checkbox" ${task.completed ? 'checked' : ''} data-task-id="${task.id}">
                        <span class="checkmark"></span>
                    </label>
                    <span class="task-text">${task.text}</span>
                </li>
            `;
        });
        
        detailsHTML += `
                        </ul>
                    </div>
        `;
        
        // Add travel guide information if available
        if (plan.guideData) {
            detailsHTML += `
                <div class="plan-details-section">
                    <h3>旅行指南</h3>
                    <div class="guide-overview">
                        <p>${plan.guideData.overview || '为您定制的专属旅行计划'}</p>
                    </div>
            `;
            
            if (plan.guideData.highlights && plan.guideData.highlights.length > 0) {
                detailsHTML += `
                    <div class="guide-highlights">
                        <h4>行程亮点</h4>
                        <ul>
                `;
                
                plan.guideData.highlights.forEach(highlight => {
                    detailsHTML += `<li>${highlight}</li>`;
                });
                
                detailsHTML += `
                        </ul>
                    </div>
                `;
            }
            
            detailsHTML += `
                    <button class="btn btn-small btn-highlight view-full-guide" data-plan-id="${plan.id}">查看完整攻略</button>
                </div>
            `;
        }
        
        detailsHTML += `
                </div>
                <div class="plan-details-footer">
                    <button class="btn btn-small btn-outline edit-plan" data-plan-id="${plan.id}">编辑计划</button>
                    <button class="btn btn-small btn-primary">添加任务</button>
                </div>
            </div>
        `;
        
        detailsContainer.innerHTML = detailsHTML;
        
        // Add event listeners to checkboxes
        const checkboxes = detailsContainer.querySelectorAll('.task-checkbox input');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const taskId = this.dataset.taskId;
                
                // Find the plan and task
                const plan = upcomingPlans.find(p => p.id === selectedPlanId);
                if (!plan) return;
                
                const task = plan.tasks.find(t => t.id == taskId);
                if (!task) return;
                
                // Update task status
                task.completed = this.checked;
                
                // Update UI
                if (this.checked) {
                    this.closest('.task-item').classList.add('completed');
                } else {
                    this.closest('.task-item').classList.remove('completed');
                }
                
                // Recalculate progress for both panels
                updatePlanProgress(selectedPlanId);
                
                // Refresh the plans display
                populatePlans(currentPage);
            });
        });
        
        // Add event listener to view full guide button
        const viewGuideBtn = detailsContainer.querySelector('.view-full-guide');
        if (viewGuideBtn) {
            viewGuideBtn.addEventListener('click', function() {
                const planId = parseInt(this.dataset.planId);
                const plan = upcomingPlans.find(p => p.id === planId);
                
                if (plan && plan.guideData) {
                    showTravelGuideDetails(plan.guideData);
                }
            });
        }
        
        // Add event listener to edit plan button
        const editPlanBtn = detailsContainer.querySelector('.edit-plan');
        if (editPlanBtn) {
            editPlanBtn.addEventListener('click', function() {
                const planId = parseInt(this.dataset.planId);
                const plan = upcomingPlans.find(p => p.id === planId);
                
                if (plan) {
                    showEditGuideModal(plan);
                }
            });
        }
    }
    
    // Function to clear plan details panel
    function clearPlanDetails() {
        const detailsContainer = document.querySelector('.plan-details-content');
        if (!detailsContainer) return;
        
        detailsContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">✈️</div>
                <h3>选择一个旅行计划</h3>
                <p>请在右侧列表中选择一个旅行计划查看详情</p>
            </div>
        `;
    }
    
    // Update plan progress display
    function updatePlanProgress(planId) {
        // Find the plan
        const plan = upcomingPlans.find(p => p.id === planId);
        if (!plan) return;
        
        // Calculate completion percentage
        const totalTasks = plan.tasks.length;
        const completedTasks = plan.tasks.filter(task => task.completed).length;
        const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        
        // Update progress in the right panel plan card
        const planCard = document.querySelector(`.plan-card[data-plan-id="${planId}"]`);
        if (planCard) {
            const progressFill = planCard.querySelector('.progress-fill');
            const progressText = planCard.querySelector('.progress-text');
            
            if (progressFill && progressText) {
                progressFill.style.width = `${completionPercentage}%`;
                progressText.textContent = `${completionPercentage}% ready`;
            }
        }
        
        // Update progress in the left panel details
        const detailsProgress = document.querySelector('.plan-details .progress-fill');
        const detailsProgressText = document.querySelector('.plan-details .progress-text');
        
        if (detailsProgress && detailsProgressText) {
            detailsProgress.style.width = `${completionPercentage}%`;
            detailsProgressText.textContent = `${completionPercentage}% complete`;
        }
    }
}

// Show travel guide details in modal
function showTravelGuideDetails(guideData) {
    const modal = document.querySelector('.travel-guide-modal');
    const overlay = document.querySelector('.travel-guide-overlay');
    const container = document.querySelector('.travel-guide-container');
    const title = document.querySelector('.travel-guide-title');
    
    if (modal && container) {
        // 使用自定义标题（如果有）或默认使用目的地名称
        const displayTitle = guideData.title || `${guideData.destination}旅行攻略`;
        
        // 设置标题
        title.textContent = displayTitle;
        
        // 生成HTML用于旅行攻略
        let guideHTML = `
            <div class="guide-section guide-destination">
                <h3>${guideData.destination}</h3>
                <p>${guideData.overview || ''}</p>
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
        
        // 亮点部分
        guideHTML += `
            <div class="guide-section guide-highlights">
                <h4>行程亮点</h4>
                <ul>
        `;
        
        highlights.forEach(highlight => {
            guideHTML += `<li>${highlight}</li>`;
        });
        
        // 每日计划部分
        guideHTML += `
                </ul>
            </div>
            <div class="guide-section guide-daily-plan">
                <h4>每日行程</h4>
                <div class="guide-daily-plan-container">
        `;
        
        guideData.dailyPlan.forEach(day => {
            guideHTML += `
                <div class="guide-day-card">
                    <div class="guide-day-number">Day ${day.day}</div>
                    <div class="guide-day-details">
                        <h5>${day.activities}</h5>
                        <p class="day-location">${day.location}</p>
                        ${day.description ? `<p class="day-description">${day.description}</p>` : ''}
                        ${day.budget ? `<p class="day-budget"><strong>预算：</strong>${day.budget}</p>` : ''}
                    </div>
                </div>
            `;
        });
        
        // 其他信息部分
        guideHTML += `
                </div>
            </div>
            <div class="guide-section guide-notes">
                <h4>旅行信息</h4>
                <p><strong>美食推荐：</strong> ${guideData.food}</p>
                <p><strong>交通：</strong> ${guideData.transportation}</p>
                <p><strong>住宿：</strong> ${guideData.accommodation}</p>
                ${guideData.culture ? `<p><strong>文化体验：</strong> ${guideData.culture}</p>` : ''}
            </div>
        `;
        
        // 添加底部保存按钮
        guideHTML += `
            <div class="travel-guide-save-btn">
                <button id="save-travel-guide-btn">保存到我的旅行</button>
            </div>
        `;
        
        // Insert content
        container.innerHTML = guideHTML;
        
        // 添加保存按钮点击事件
        const saveButton = document.getElementById('save-travel-guide-btn');
        if (saveButton) {
            saveButton.addEventListener('click', function() {
                // 保存旅行攻略到localStorage
                saveTravelGuide(guideData, displayTitle, guideData.notes || '');
                
                // 显示成功消息
                showSuccessSavedMessage();
                
                // 关闭模态框
                closeTravelGuideModal();
            });
        }
        
        // Show modal and overlay
        modal.classList.add('active');
        overlay.classList.add('active');
        
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
}

// Close travel guide modal
function closeTravelGuideModal() {
    const modal = document.querySelector('.travel-guide-modal');
    const overlay = document.querySelector('.travel-guide-overlay');
    
    if (modal) {
        modal.classList.remove('active');
    }
    
    if (overlay) {
        overlay.classList.remove('active');
    }
}

// Show regular trip details
function showTripDetails(plan) {
    // This would normally show the existing trip details modal
    console.log('Show trip details for', plan.destination);
    
    // For now, just show an alert
    alert(`Trip details for ${plan.destination} will be shown here`);
}

/**
 * 显示编辑攻略模态窗口
 * @param {Object} plan - 旅行计划对象
 */
function showEditGuideModal(plan) {
    const modal = document.querySelector('.edit-guide-modal');
    const overlay = document.querySelector('.edit-guide-overlay');
    
    modal.setAttribute('data-plan-id', plan.id);

    // Show the first section and hide others
    document.querySelector('.edit-section').style.display = 'block';
    document.querySelector('.day-edit-section').style.display = 'none';
    document.querySelector('.day-edit-form').style.display = 'none';
    document.querySelector('.delete-confirm-section').style.display = 'none';
    
    // 获取旅行攻略数据
    const guideData = plan.guideData || {};
    
    // 添加标题和备注编辑区域（如果不存在）
    let titleNotesSection = document.querySelector('.title-notes-section');
    if (!titleNotesSection) {
        titleNotesSection = document.createElement('div');
        titleNotesSection.className = 'title-notes-section';
        titleNotesSection.innerHTML = `
            <h4>旅行攻略信息</h4>
            <div class="form-group">
                <label for="guideTitleInput">标题</label>
                <input type="text" id="guideTitleInput" class="form-control" value="">
            </div>
            <div class="form-group">
                <label for="guideNotesInput">备注</label>
                <textarea id="guideNotesInput" class="form-control" rows="3"></textarea>
            </div>
            <button id="saveTitleNotesBtn" class="btn btn-primary">保存信息</button>
        `;
        
        // 添加到编辑区域的开头
        const editSection = document.querySelector('.edit-section');
        editSection.insertBefore(titleNotesSection, editSection.firstChild);
    }
    
    // 填充标题和备注字段
    document.getElementById('guideTitleInput').value = guideData.title || '';
    document.getElementById('guideNotesInput').value = guideData.notes || '';
    
    // 添加保存标题和备注的点击事件
    document.getElementById('saveTitleNotesBtn').addEventListener('click', function() {
        const planId = modal.getAttribute('data-plan-id');
        const title = document.getElementById('guideTitleInput').value;
        const notes = document.getElementById('guideNotesInput').value;
        saveTitleNotes(planId, title, notes);
    });

    // Add event listeners
    document.querySelector('.edit-guide-close').addEventListener('click', closeEditModal);
    document.getElementById('deleteGuideBtn').addEventListener('click', () => showDeleteConfirmation(plan));
    document.getElementById('modifyItineraryBtn').addEventListener('click', () => showDaySelection(plan));
    document.getElementById('backToEditBtn').addEventListener('click', () => {
        document.querySelector('.edit-section').style.display = 'block';
        document.querySelector('.day-edit-section').style.display = 'none';
    });
    document.getElementById('backToDaysBtn').addEventListener('click', () => {
        document.querySelector('.day-edit-section').style.display = 'block';
        document.querySelector('.day-edit-form').style.display = 'none';
    });
    document.getElementById('saveDayBtn').addEventListener('click', function() {
        const planId = modal.getAttribute('data-plan-id');
        const dayIndex = document.querySelector('.day-edit-form').getAttribute('data-day-index');
        const activity = document.getElementById('dayActivityInput').value;
        const location = document.getElementById('dayLocationInput').value;
        saveDayEdit(planId, dayIndex, activity, location);
    });

    // Add event listeners for delete confirmation
    document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
        document.querySelector('.edit-section').style.display = 'block';
        document.querySelector('.delete-confirm-section').style.display = 'none';
    });
    document.getElementById('confirmDeleteBtn').addEventListener('click', function() {
        const planId = modal.getAttribute('data-plan-id');
        deleteGuide(planId);
    });

    // Add click event to overlay to close modal
    overlay.addEventListener('click', closeEditModal);

    // Show modal and overlay
    modal.classList.add('active');
    overlay.classList.add('active');
}

/**
 * 显示日期选择部分
 * @param {Object} plan - 旅行计划对象
 */
function showDaySelection(plan) {
    // Hide edit section, show day selection section
    document.querySelector('.edit-section').style.display = 'none';
    document.querySelector('.day-edit-section').style.display = 'block';
    
    // Get day selection container
    const daySelectContainer = document.querySelector('.day-select-container');
    if (!daySelectContainer) return;
    
    // Clear container
    daySelectContainer.innerHTML = '';
    
    // Get the correct daily plan array (either from guideData or directly)
    const dailyPlan = plan.guideData ? plan.guideData.dailyPlan : plan.dailyPlan;
    
    // Check if we have daily plan data
    if (!dailyPlan || !dailyPlan.length) {
        daySelectContainer.innerHTML = '<p>No itinerary data available for this plan.</p>';
        return;
    }
    
    // Fill with day selection buttons
    dailyPlan.forEach((day, index) => {
        const dayBtn = document.createElement('div');
        dayBtn.className = 'day-select-btn';
        dayBtn.textContent = `Day ${day.day || (index + 1)}`;
        dayBtn.setAttribute('data-day-index', index);
        
        dayBtn.onclick = function() {
            const dayIndex = this.getAttribute('data-day-index');
            showDayEditForm(plan, parseInt(dayIndex));
        };
        
        daySelectContainer.appendChild(dayBtn);
    });
}

/**
 * 显示日程编辑表单
 * @param {Object} plan - 旅行计划对象
 * @param {Number} dayIndex - 日期索引
 */
function showDayEditForm(plan, dayIndex) {
    document.querySelector('.day-edit-section').style.display = 'none';
    document.querySelector('.day-edit-form').style.display = 'block';
    
    // Set day index attribute
    document.querySelector('.day-edit-form').setAttribute('data-day-index', dayIndex);
    
    // Get the correct daily plan array (either from guideData or directly)
    const dailyPlan = plan.guideData ? plan.guideData.dailyPlan : plan.dailyPlan;
    
    // Pre-fill form with existing data
    const day = dailyPlan[dayIndex];
    document.getElementById('dayActivityInput').value = day.activity;
    document.getElementById('dayLocationInput').value = day.location;
}

/**
 * 保存日程编辑
 * @param {String} planId - 计划ID
 * @param {Number} dayIndex - 日期索引
 * @param {String} activity - 活动内容
 * @param {String} location - 地点
 */
function saveDayEdit(planId, dayIndex, activity, location) {
    // Get saved guides
    let savedGuides = JSON.parse(localStorage.getItem('savedGuides') || '[]');
    
    // Find the guide to edit
    const guideIndex = savedGuides.findIndex(guide => guide.id == planId);
    
    if (guideIndex !== -1) {
        // Update the day's data
        savedGuides[guideIndex].dailyPlan[dayIndex].activity = activity;
        savedGuides[guideIndex].dailyPlan[dayIndex].location = location;
        
        // Save updated guides
        localStorage.setItem('savedGuides', JSON.stringify(savedGuides));
        
        // Show success message
        showMessage('行程已成功更新');
        
        // Close modal and refresh plans display
        closeEditModal();
        initPlansPage();
    }
}

/**
 * 显示删除确认部分
 * @param {Object} plan - 旅行计划对象
 */
function showDeleteConfirmation(plan) {
    document.querySelector('.edit-section').style.display = 'none';
    document.querySelector('.delete-confirm-section').style.display = 'block';
}

/**
 * 删除旅行攻略
 * @param {String} planId - 计划ID
 */
function deleteGuide(planId) {
    // Get saved guides
    let savedGuides = JSON.parse(localStorage.getItem('savedGuides') || '[]');
    
    // Convert planId to a number if it's stored as a string
    const numericPlanId = Number(planId);
    
    // Find and remove the guide
    const guideIndex = savedGuides.findIndex(guide => Number(guide.id) === numericPlanId);
    if (guideIndex !== -1) {
        savedGuides.splice(guideIndex, 1);
        
        // Save updated guides
        localStorage.setItem('savedGuides', JSON.stringify(savedGuides));
        
        // Show success message
        showMessage('攻略已成功删除');
        
        // Close modal and refresh plans display
        closeEditModal();
        initPlansPage();
    } else {
        console.error('未找到ID为', planId, '的攻略');
        showMessage('删除失败：未找到攻略');
    }
}

/**
 * 关闭编辑攻略模态窗口
 */
function closeEditModal() {
    const modal = document.querySelector('.edit-guide-modal');
    const overlay = document.querySelector('.edit-guide-overlay');
    
    if (modal) {
        modal.classList.remove('active');
    }
    
    if (overlay) {
        overlay.classList.remove('active');
    }
}

/**
 * 保存攻略标题和备注
 * @param {String} planId - 计划ID
 * @param {String} title - 标题
 * @param {String} notes - 备注
 */
function saveTitleNotes(planId, title, notes) {
    // 获取保存的攻略
    let savedGuides = JSON.parse(localStorage.getItem('savedGuides') || '[]');
    
    // 找到要编辑的攻略
    const guideIndex = savedGuides.findIndex(guide => guide.id == planId);
    
    if (guideIndex !== -1) {
        // 更新标题和备注
        savedGuides[guideIndex].title = title;
        savedGuides[guideIndex].notes = notes;
        
        // 保存更新后的攻略
        localStorage.setItem('savedGuides', JSON.stringify(savedGuides));
        
        // 显示成功消息
        showMessage('攻略信息已成功更新');
        
        // 刷新计划显示
        initPlansPage();
    }
}

/**
 * 显示消息
 * @param {String} message - 消息内容
 */
function showMessage(message) {
    // 创建消息元素
    const messageEl = document.createElement('div');
    messageEl.className = 'message-overlay';
    messageEl.innerHTML = `
        <div class="message-box">
            <div class="message-content">${message}</div>
        </div>
    `;
    
    // 添加到文档中
    document.body.appendChild(messageEl);
    
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .message-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        }
        .message-box {
            background: var(--main-color);
            border-radius: 10px;
            padding: 20px 30px;
            text-align: center;
            animation: fadeIn 0.3s ease;
        }
        .message-content {
            font-size: 1.2rem;
            color: var(--text-light);
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
    
    // 3秒后移除消息
    setTimeout(() => {
        messageEl.remove();
        style.remove();
    }, 3000);
}

// 显示社区攻略列表
function showCommunityGuides(destinationName) {
    // 关闭目的地详情模态框
    const destinationModal = document.querySelector('.destination-modal');
    const destinationOverlay = document.querySelector('.modal-overlay');
    destinationModal.classList.remove('active');
    destinationOverlay.classList.remove('active');
    
    // 打开社区攻略模态框
    const communityGuidesModal = document.querySelector('.community-guides-modal');
    const communityGuidesOverlay = document.querySelector('.community-guides-overlay');
    const communityGuidesList = document.querySelector('.community-guides-list');
    const communityGuidesTitle = document.querySelector('.community-guides-title');
    
    communityGuidesTitle.textContent = `${destinationName} 社区分享的攻略`;
    
    // 模拟社区攻略数据
    const communityGuides = [
        {
            id: 101,
            title: `${destinationName} 深度7日游`,
            author: '旅行达人001',
            rating: 4.8,
            tags: ['美食', '文化', '景点'],
            image: `images/${destinationName.toLowerCase()}.png`,
            content: `这是一份为期7天的${destinationName}深度旅行攻略，包含当地特色美食、著名景点以及文化体验。`,
            days: 7
        },
        {
            id: 102,
            title: `${destinationName} 周末精华行程`,
            author: '背包客小明',
            rating: 4.5,
            tags: ['周末', '精华', '省钱'],
            image: `images/${destinationName.toLowerCase()}.png`,
            content: `这份攻略专为周末短途旅行设计，集中了${destinationName}的精华景点和体验，适合时间有限的游客。`,
            days: 3
        },
        {
            id: 103,
            title: `${destinationName} 美食探索之旅`,
            author: '吃货大王',
            rating: 4.9,
            tags: ['美食', '小吃', '餐厅'],
            image: `images/${destinationName.toLowerCase()}.png`,
            content: `专注于${destinationName}的特色美食，包含当地著名餐厅、街头小吃以及美食节，让你的味蕾享受一场盛宴。`,
            days: 5
        }
    ];
    
    // 生成社区攻略列表
    let guidesHTML = '';
    communityGuides.forEach(guide => {
        guidesHTML += `
            <div class="community-guide-card" data-guide-id="${guide.id}">
                <div class="guide-card-image" style="background-image: url('${guide.image}');"></div>
                <div class="guide-card-content">
                    <h3 class="guide-card-title">${guide.title}</h3>
                    <div class="guide-card-author">
                        <span>作者: ${guide.author}</span>
                    </div>
                    <div class="guide-card-rating">
                        <span class="rating-star">★</span>
                        <span>${guide.rating}</span>
                    </div>
                    <div class="guide-card-tags">
                        ${guide.tags.map(tag => `<div class="guide-tag">${tag}</div>`).join('')}
                    </div>
                </div>
            </div>
        `;
    });
    
    communityGuidesList.innerHTML = guidesHTML;
    
    // 显示社区攻略模态框
    communityGuidesModal.classList.add('active');
    communityGuidesOverlay.classList.add('active');
    
    // 添加攻略卡片点击事件
    const guideCards = document.querySelectorAll('.community-guide-card');
    guideCards.forEach(card => {
        card.addEventListener('click', function() {
            const guideId = this.dataset.guideId;
            const guide = communityGuides.find(g => g.id == guideId);
            
            if (guide) {
                showGuideDetail(guide, destinationName);
            }
        });
    });
}

// 关闭社区攻略模态框
function closeCommunityGuidesModal() {
    const communityGuidesModal = document.querySelector('.community-guides-modal');
    const communityGuidesOverlay = document.querySelector('.community-guides-overlay');
    
    communityGuidesModal.classList.remove('active');
    communityGuidesOverlay.classList.remove('active');
}

// 显示攻略详情
function showGuideDetail(guide, destinationName) {
    // 关闭社区攻略模态框
    closeCommunityGuidesModal();
    
    // 打开攻略详情模态框
    const guideDetailModal = document.querySelector('.guide-detail-modal');
    const guideDetailOverlay = document.querySelector('.guide-detail-overlay');
    const guideDetailContent = document.querySelector('.guide-detail-content');
    const guideDetailTitle = document.querySelector('.guide-detail-title');
    
    guideDetailTitle.textContent = guide.title;
    
    // 模拟攻略详情内容
    const itinerary = [];
    for (let i = 1; i <= guide.days; i++) {
        itinerary.push({
            day: i,
            activities: [
                {
                    time: '9:00',
                    title: `参观${destinationName}景点${i}`,
                    description: '这里是活动详细描述...'
                },
                {
                    time: '12:30',
                    title: `品尝${destinationName}美食`,
                    description: '这里是美食推荐详细描述...'
                },
                {
                    time: '15:00',
                    title: '文化体验活动',
                    description: '这里是文化体验详细描述...'
                }
            ]
        });
    }
    
    // 生成攻略详情HTML
    let detailHTML = `
        <div class="guide-header">
            <div class="guide-image" style="background-image: url('${guide.image}'); height: 200px; background-size: cover; background-position: center; border-radius: 10px; margin-bottom: 20px;"></div>
            <div class="guide-info">
                <div class="guide-author">作者: ${guide.author}</div>
                <div class="guide-rating">评分: ${guide.rating} ★</div>
                <div class="guide-duration">行程天数: ${guide.days}天</div>
                <div class="guide-tags">
                    ${guide.tags.map(tag => `<span class="guide-tag">${tag}</span>`).join('')}
                </div>
            </div>
        </div>
        <div class="guide-description">
            <h3>攻略简介</h3>
            <p>${guide.content}</p>
        </div>
        <div class="guide-itinerary">
            <h3>行程安排</h3>
            <div class="itinerary-days">
    `;
    
    itinerary.forEach(day => {
        detailHTML += `
            <div class="itinerary-day">
                <div class="day-header">
                    <h4>第 ${day.day} 天</h4>
                </div>
                <div class="day-activities">
        `;
        
        day.activities.forEach(activity => {
            detailHTML += `
                <div class="activity-item">
                    <div class="activity-time">${activity.time}</div>
                    <div class="activity-content">
                        <div class="activity-title">${activity.title}</div>
                        <div class="activity-description">${activity.description}</div>
                    </div>
                </div>
            `;
        });
        
        detailHTML += `
                </div>
            </div>
        `;
    });
    
    detailHTML += `
        </div>
    </div>`;
    
    return detailHTML;
}

// Initialize back buttons
function initBackButtons() {
    const backButtons = document.querySelectorAll('.back-nav');
    backButtons.forEach(button => {
        if (!button.hasEventListener) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Add transition effect
                document.body.classList.add('page-transition-reverse');
                
                // Navigate back after transition
                setTimeout(() => {
                    window.location.href = this.getAttribute('href') || 'index.html';
                }, 600);
            });
            button.hasEventListener = true;
        }
    });
}

// 目的地详细信息
function getDestinationDetails(name) {
    // 模拟数据 - 实际应用中应从API或数据库获取
    const details = {
        'Paris': {
            description: '巴黎是法国的首都和最大城市，也是欧洲主要的文化、艺术和时尚中心之一。这座城市以其历史建筑、艺术博物馆和独特的浪漫氛围而闻名于世。',
            bestTimeToVisit: '春季（4-6月）和秋季（9-10月）是游览巴黎的最佳时间，此时天气宜人，游客较少。',
            highlights: ['埃菲尔铁塔', '卢浮宫', '巴黎圣母院', '凯旋门', '蒙马特高地'],
            language: '法语',
            currency: '欧元 (EUR)'
        },
        'Tokyo': {
            description: '东京是日本的首都和最大城市，也是全球最大的城市之一。它是一个令人兴奋的城市，融合了先进科技与传统文化，同时拥有丰富的美食和娱乐选择。',
            bestTimeToVisit: '春季（3-5月）的樱花季节和秋季（9-11月）的红叶季节是游览东京的最佳时间。',
            highlights: ['新宿区', '秋叶原', '浅草寺', '东京塔', '皇居', '涩谷十字路口'],
            language: '日语',
            currency: '日元 (JPY)'
        },
        'New York': {
            description: '纽约市是美国最大的城市，也是全球金融、商业和文化的重要中心。它以其标志性的天际线、百老汇剧院和多元文化而著名。',
            bestTimeToVisit: '春季（4-6月）和秋季（9-11月）是游览纽约的最佳时间，天气温和舒适。',
            highlights: ['自由女神像', '中央公园', '帝国大厦', '时代广场', '大都会艺术博物馆'],
            language: '英语',
            currency: '美元 (USD)'
        },
        'Sydney': {
            description: '悉尼是澳大利亚最大的城市，以其壮观的悉尼歌剧院、美丽的海滩和宜人的气候而著名。这座城市提供了独特的城市体验与自然景观的完美结合。',
            bestTimeToVisit: '澳大利亚春季和秋季（9-11月和3-5月）气候宜人，是游览悉尼的理想时间。',
            highlights: ['悉尼歌剧院', '悉尼港大桥', '邦迪海滩', '皇家植物园', '塔隆加动物园'],
            language: '英语',
            currency: '澳大利亚元 (AUD)'
        },
        'Cairo': {
            description: '开罗是埃及的首都和最大城市，也是非洲最大的城市之一。它以金字塔和丰富的古埃及文明遗迹而闻名于世。',
            bestTimeToVisit: '10月到4月是游览开罗的最佳时间，此时气候凉爽，避开了炎热的夏季。',
            highlights: ['吉萨金字塔', '埃及博物馆', '萨拉丁城堡', '哈利利市场', '尼罗河'],
            language: '阿拉伯语',
            currency: '埃及镑 (EGP)'
        },
        'Rio': {
            description: '里约热内卢是巴西的第二大城市，以其壮观的自然风光、活力四射的文化和举世闻名的狂欢节而著名。',
            bestTimeToVisit: '5月至10月是游览里约的最佳时间，此时气候较为干燥，虽然这是冬季，但温度依然适宜。',
            highlights: ['基督救世主像', '科帕卡巴纳海滩', '糖面包山', '马拉卡纳体育场', '蒂茹卡国家公园'],
            language: '葡萄牙语',
            currency: '巴西雷亚尔 (BRL)'
        },
        'Rome': {
            description: '罗马是意大利的首都，这座永恒之城拥有近3000年的历史遗迹和艺术珍品，是世界上最令人印象深刻的文化目的地之一。',
            bestTimeToVisit: '4月至6月和9月至10月是游览罗马的最佳时间，天气温和，游客较少。',
            highlights: ['罗马斗兽场', '梵蒂冈', '特莱维喷泉', '西班牙广场', '万神殿'],
            language: '意大利语',
            currency: '欧元 (EUR)'
        },
        'London': {
            description: '伦敦是英国的首都和最大城市，是全球金融、艺术和娱乐的重要中心。这座城市拥有丰富的历史遗产和现代活力。',
            bestTimeToVisit: '春季（3-5月）和秋季（9-11月）是游览伦敦的理想时间，天气温和，游客相对较少。',
            highlights: ['大本钟', '伦敦塔', '大英博物馆', '伦敦眼', '白金汉宫'],
            language: '英语',
            currency: '英镑 (GBP)'
        },
        'Bangkok': {
            description: '曼谷是泰国的首都和最大城市，以其华丽的寺庙、繁忙的街道市场和令人难以置信的美食而闻名。这是一座充满活力和对比的城市。',
            bestTimeToVisit: '11月至2月是游览曼谷的最佳时间，此时气候较为凉爽干燥。',
            highlights: ['大皇宫', '卧佛寺', '暹罗广场', '湄南河', '周末市场'],
            language: '泰语',
            currency: '泰铢 (THB)'
        },
        'Los Angeles': {
            description: '洛杉矶是美国加利福尼亚州最大的城市，也是全球娱乐产业的中心。这座城市以其阳光明媚的天气、好莱坞、豪华海滩和多元文化而著名。',
            bestTimeToVisit: '3月至5月或9月至11月是游览洛杉矶的最佳时间，天气适宜且游客较少。',
            highlights: ['好莱坞标志', '环球影城', '威尼斯海滩', '格里菲斯天文台', '盖蒂中心'],
            language: '英语',
            currency: '美元 (USD)'
        }
    };
    
    // 如果没有找到，返回默认信息
    if (!details[name]) {
        console.warn('No details found for:', name);
        return {
            description: `关于${name}的详细信息。`,
            bestTimeToVisit: '全年皆宜。',
            highlights: ['景点1', '景点2', '景点3'],
            language: '当地语言',
            currency: '当地货币'
        };
    }
    
    return details[name];
}

// 关闭攻略详情模态框
function closeGuideDetailModal() {
    const guideDetailModal = document.querySelector('.guide-detail-modal');
    const guideDetailOverlay = document.querySelector('.guide-detail-overlay');
    
    if (guideDetailModal) guideDetailModal.classList.remove('active');
    if (guideDetailOverlay) guideDetailOverlay.classList.remove('active');
}

// Initialize dynamic starry sky background on explore page
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
    
    let width, height;
    const stars = [];
    const meteors = [];
    // 优化星星数量，平衡性能和视觉效果
    const starCount = Math.min(500, Math.floor((window.innerWidth * window.innerHeight) / 1000));
    
    console.log('Initializing star background with', starCount, 'stars');
    
    // 创建不同大小的星星类型
    const starTypes = [
        { minRadius: 0.3, maxRadius: 0.8, count: Math.floor(starCount * 0.7), alpha: 0.6 }, // 小星星
        { minRadius: 0.8, maxRadius: 1.5, count: Math.floor(starCount * 0.25), alpha: 0.8 }, // 中等星星
        { minRadius: 1.5, maxRadius: 2.2, count: Math.floor(starCount * 0.05), alpha: 1.0 }  // 大星星
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
        targetFPS = 20;
        frameThreshold = 1000 / targetFPS;
    }
    
    function resizeCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;  // 全屏高度
        stars.length = 0;
        
        // 按不同类型创建星星
        starTypes.forEach(type => {
            for (let i = 0; i < type.count; i++) {
                stars.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    radius: Math.random() * (type.maxRadius - type.minRadius) + type.minRadius,
                    alpha: Math.random() * 0.5 + type.alpha,
                    delta: (Math.random() * 0.01 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
                    twinkleSpeed: Math.random() * 0.03 + 0.01
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
        gradient.addColorStop(0, 'rgb(25, 35, 60)');
        gradient.addColorStop(1, 'rgb(10, 15, 30)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
    }
    
    function createMeteor() {
        // 流星总数限制，防止性能问题
        if (meteors.length >= 5) return;
        
        // 从屏幕的随机一侧生成流星
        const side = Math.floor(Math.random() * 2); // 0 - 左侧, 1 - 右侧
        const angle = side === 0 
            ? Math.PI / 4 + Math.random() * 0.2 // 从左侧生成的流星向右下方
            : Math.PI * 3/4 - Math.random() * 0.2; // 从右侧生成的流星向左下方
            
        const startX = side === 0 ? 0 : width;
        const startY = Math.random() * height * 0.4; // 在上方40%区域生成
        
        meteors.push({
            x: startX,
            y: startY,
            length: Math.random() * 100 + 80, // 更长的流星轨迹
            speed: Math.random() * 5 + 5, // 更快的速度
            angle: angle,
            alpha: 1,
            width: Math.random() * 1.5 + 1 // 随机宽度
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
        
        // 绘制星星
        for (const star of stars) {
            // 更自然的闪烁效果
            star.alpha += star.delta * star.twinkleSpeed * (deltaTime / 16.67); // 按照60FPS校准
            
            if (star.alpha <= 0.1 || star.alpha >= 1) {
                star.delta *= -1;
            }
            
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, 2 * Math.PI);
            
            // 只为大星星添加光晕效果以提高性能
            if (star.radius > 1.5) {
                const glow = ctx.createRadialGradient(
                    star.x, star.y, 0,
                    star.x, star.y, star.radius * 3
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
            ctx.save();
            ctx.globalAlpha = m.alpha;
            ctx.translate(m.x, m.y);
            ctx.rotate(-m.angle);
            
            // 更漂亮的流星渐变
            const grad = ctx.createLinearGradient(0, 0, -m.length, 0);
            grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
            grad.addColorStop(0.1, 'rgba(255, 255, 255, 0.8)');
            grad.addColorStop(0.2, 'rgba(200, 220, 255, 0.6)');
            grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            ctx.strokeStyle = grad;
            ctx.lineWidth = m.width;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(-m.length, 0);
            ctx.stroke();
            
            // 流星头部添加亮点
            ctx.beginPath();
            ctx.arc(0, 0, m.width + 1, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, ' + m.alpha + ')';
            ctx.fill();
            
            ctx.restore();
            
            // 更新流星位置，按照60FPS校准
            const moveDistance = m.speed * (deltaTime / 16.67);
            m.x += Math.cos(m.angle) * moveDistance;
            m.y += Math.sin(m.angle) * moveDistance;
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
}

// Function to animate page turns
function animatePageTurn(direction) {
    const journalLeft = document.querySelector('.journal-left');
    const journalRight = document.querySelector('.journal-right');
    
    if (!journalLeft || !journalRight) return;
    
    // Add turning page class based on direction
    if (direction === 'prev') {
        journalRight.style.transform = 'rotateY(-15deg)';
        journalRight.style.transformOrigin = 'left center';
        journalRight.style.zIndex = '5';
        journalLeft.style.transform = 'rotateY(0deg)';
        journalLeft.style.zIndex = '1';
        
        // Add page turning sound
        playPageSound();
        
        // Reset after animation
        setTimeout(() => {
            journalRight.style.transform = '';
            journalRight.style.zIndex = '';
        }, 500);
    } else {
        journalLeft.style.transform = 'rotateY(15deg)';
        journalLeft.style.transformOrigin = 'right center';
        journalLeft.style.zIndex = '5';
        journalRight.style.transform = 'rotateY(0deg)';
        journalRight.style.zIndex = '1';
        
        // Add page turning sound
        playPageSound();
        
        // Reset after animation
        setTimeout(() => {
            journalLeft.style.transform = '';
            journalLeft.style.zIndex = '';
        }, 500);
    }
}

// Function to play page turning sound
function playPageSound() {
    // Create audio element for page turning sound
    const audio = new Audio();
    audio.src = 'audio/page-flip.mp3'; // Make sure you have this audio file
    audio.volume = 0.2;
    
    // Try to play the sound (will fail silently if file not found)
    try {
        audio.play().catch(e => {
            console.log('Page sound could not be played:', e);
            // It's ok if this fails
        });
    } catch (e) {
        // Ignore errors since this is just a nice-to-have
    }
}
