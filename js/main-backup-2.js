// Main JavaScript file for DeepTrip

document.addEventListener('DOMContentLoaded', function() {
    // Determine which page we're on
    const body = document.body;
    const currentPage = body.classList[0];
    
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
        initHomePage();
    } else if (currentPage === 'create') {
        initCreatePage();
    } else if (currentPage === 'explore') {
        initExplorePage();
    } else if (currentPage === 'plans') {
        initPlansPage();
    } else if (currentPage === 'personal-page' || body.classList.contains('personal-page')) {
        console.log('Initializing personal page');
        initPersonalPage();
    }
    
    // Update background based on time of day
    updateBackgroundBasedOnTime();
});

// Initialize cursor particle effect
function initCursorParticleEffect() {}
// 初始化自定义光标（小飞机）
function initCustomCursor() {
    // 创建自定义光标元素
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 15L21 21L18 12L12 9L3 12L9 21L12 15Z" fill="#4dabf7" stroke="white" stroke-width="1"/>
        </svg>`;
    document.body.appendChild(cursor);
    
    // 添加自定义光标激活类
    document.body.classList.add('custom-cursor-active');
    
    // 更新光标位置
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        // 添加轻微的跟随延迟效果
        setTimeout(() => {
            cursor.style.transform = 'translate(-50%, -50%) rotate(-45deg)';
        }, 50);
    });
}



    
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
// REMOVED:             triggerPageTransition();
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
// REMOVED:             triggerPageTransition();
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
    
    // Scroll variables
    let isTransitioning = false;
    const scrollThreshold = 0.75; // Changed from 0.3 to 0.75 to require more scrolling
    
    // Setup for scrolling behavior
    body.style.height = '200vh';
    body.style.overflowY = 'auto';
    window.scrollTo(0, 0);
    
    // Listen for scroll events
    window.addEventListener('scroll', handleScroll);
    
    // Initial call to set up visual states
    handleScroll();
    
    // Scroll indicator click
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', completeTransition);
    }
    
    // Handle scroll events
    function handleScroll() {
        if (isTransitioning) return;
        
        // Calculate scroll percentage
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = Math.min(1, Math.max(0, window.scrollY / maxScroll));
        
        console.log("Scroll percent:", scrollPercent);
        
        // Apply visual effects based on scroll
        if (fullscreenBg) {
            fullscreenBg.style.transform = `translateY(${-scrollPercent * 20}px)`;
        }
        
        // Fade effects
        if (welcomeScreen) {
            welcomeScreen.style.opacity = Math.max(0, 1 - scrollPercent * 2);
        }
        
        if (content) {
            content.style.opacity = Math.min(1, scrollPercent * 2);
        }

// REMOVED:         if (scrollPercent > 0.75 && !isTransitioning) {
// REMOVED:             // 触发页面过渡，这里沿用您原有的triggerPageTransition函数
// REMOVED:             triggerPageTransition();
        }
        
        // If we've scrolled past threshold, trigger transition
        if (scrollPercent >= scrollThreshold) {
            completeTransition();
        }
    }
    
    // Also support touch events for mobile
    let touchStartY = 0;
    let touchMoveY = 0;
    let touchThreshold = 100; // pixels to trigger transition
    
    window.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
    });
    
    window.addEventListener('touchmove', function(e) {
        if (isTransitioning) return;
        touchMoveY = e.touches[0].clientY;
        const touchDiff = touchStartY - touchMoveY;
        
        // Only trigger on downward swipe
        if (touchDiff > touchThreshold) {
            completeTransition();
        }
    });
    
    // Function to complete transition to questionnaire
    function completeTransition() {
        if (isTransitioning) return;
        isTransitioning = true;
        
        console.log("Completing transition to questionnaire");
        
        // Remove scroll events
        window.removeEventListener('scroll', handleScroll);
        
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
            // Reset body height
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
    container.innerHTML = `
        <div class="generating-container">
            <h2>AI正在为您生成个性化旅行攻略</h2>
            <div class="particle-container">
                <div class="particle"></div>
                <div class="particle"></div>
                <div class="particle"></div>
                <div class="particle"></div>
                <div class="particle"></div>
                <div class="particle"></div>
                <div class="particle"></div>
                <div class="particle"></div>
                <div class="particle"></div>
                <div class="particle"></div>
                <div class="particle"></div>
                <div class="particle"></div>
            </div>
            <div class="generating-loader">
                <div class="loader-dot"></div>
                <div class="loader-dot"></div>
                <div class="loader-dot"></div>
            </div>
        </div>
    `;

    try {
        // Create a formatted prompt for the DeepSeek API
        const prompt = createTravelPrompt(answers);
        
        // API parameters
        const apiKey = 'sk-717e6d20ffce4e49b6746dc981a426c6';
        const apiUrl = 'https://api.deepseek.com/v1/chat/completions';
        
        // Format answers for display
        const formattedAnswers = {};
        for (const questionId in answers) {
            formattedAnswers[questionId] = getTextForValue(questionId, answers[questionId]);
        }
        
        let travelGuideData = null;
        
        try {
            // Make API request
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
                    max_tokens: 2000
                })
            });
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            
            const data = await response.json();
            const aiResponse = data.choices[0].message.content;
            
            // Parse the AI response to create a structured travel guide
            travelGuideData = parseAIResponseToTravelGuide(aiResponse, formattedAnswers);
        } catch (error) {
            console.error('Error calling DeepSeek API:', error);
            // Fall back to predefined guide on error
            travelGuideData = getFallbackTravelGuide();
        }
        
        // Generate HTML for the travel guide
        const travelGuideHTML = createTravelGuideHTML(travelGuideData);
        
        // Display the travel guide
        container.innerHTML = travelGuideHTML;
        
        // Add save button event listener
        const saveButton = container.querySelector('.btn-primary');
        if (saveButton) {
            saveButton.addEventListener('click', function() {
                // Save the travel guide
                saveTravelGuide(travelGuideData, travelGuideData.destination, '');
                
                // Show success message
                showSuccessSavedMessage();
                
                // Redirect to plans page after a delay
                setTimeout(() => {
                    window.location.href = 'plans.html';
                }, 2000);
            });
        }
        
        return travelGuideData;
    } catch (error) {
        console.error('Error generating travel guide:', error);
        container.innerHTML = `
            <div class="error-container">
                <h2>生成攻略时出现错误</h2>
                <p>抱歉，生成旅行攻略时遇到了问题。请稍后再试。</p>
                <button class="btn btn-primary" id="retryButton">重试</button>
            </div>
        `;
        
        const retryButton = container.querySelector('#retryButton');
        if (retryButton) {
            retryButton.addEventListener('click', function() {
                generateTravelGuide(answers, container);
            });
        }
        
        return null;
    }
}

// Create a formatted prompt for the DeepSeek API
function createTravelPrompt(answers) {
    const region = getTextForValue(1, answers[1]);
    const geography = getTextForValue(2, answers[2]);
    const climate = getTextForValue(3, answers[3]);
    const cityType = getTextForValue(4, answers[4]);
    const travelStyle = getTextForValue(5, answers[5]);
    const duration = getTextForValue(6, answers[6]);
    const budget = getTextForValue(7, answers[7]);
    const people = getTextForValue(8, answers[8] || 'couple');
    
    return `创建一个详细的、个性化的旅行攻略，基于以下偏好：
- 地区：${region}
- 地理特征：${geography}
- 气候：${climate}
- 城市类型：${cityType}
- 旅行风格：${travelStyle}
- 旅行时长：${duration}
- 预算：${budget}
- 旅行人数：${people}

请提供：
1. 最适合的目的地名称
2. 目的地概述和推荐理由
3. 建议的行程安排（天数与用户选择匹配）
4. 每天的具体活动和地点
5. 饮食推荐
6. 交通建议
7. 住宿建议
8. 当地特色和文化体验

回复格式为JSON：
{
  "destination": "目的地名称",
  "overview": "目的地概述",
  "highlights": ["亮点1", "亮点2", "亮点3"],
  "duration": "旅行天数",
  "dailyPlan": [
    {
      "day": 1,
      "activities": "第一天活动",
      "location": "地点",
      "description": "详细描述"
    },
    {
      "day": 2,
      "activities": "第二天活动",
      "location": "地点",
      "description": "详细描述"
    }
  ],
  "food": "美食推荐",
  "transportation": "交通建议",
  "accommodation": "住宿建议",
  "culture": "文化体验"
}`;
}

// Parse the AI response into a structured travel guide
function parseAIResponseToTravelGuide(response, answers) {
    try {
        // Try to extract JSON from the response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const jsonString = jsonMatch[0];
            return JSON.parse(jsonString);
        }
        
        // If no valid JSON, create structured data from the text
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
                    activities: `第${day}天行程`,
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
                    activities: `第${i}天行程`,
                    location: destination,
                    description: `探索${destination}的第${i}天`
                });
            }
        }
        
        return {
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
    } catch (error) {
        console.error('Error parsing AI response:', error);
        return getFallbackTravelGuide();
    }
}

// Create HTML for displaying the travel guide
function createTravelGuideHTML(guideData) {
    // Return an error message if guideData is null
    if (!guideData) {
        return `
            <div class="error-container">
                <h2>生成攻略时出现错误</h2>
                <p>抱歉，无法生成旅行攻略。请稍后再试。</p>
                <button class="btn btn-primary" id="retryButton">重试</button>
            </div>
        `;
    }
    
    // Generate highlights HTML
    let highlightsHTML = '';
    if (guideData.highlights && guideData.highlights.length > 0) {
        highlightsHTML = '<ul>';
        guideData.highlights.forEach(highlight => {
            highlightsHTML += `<li>${highlight}</li>`;
        });
        highlightsHTML += '</ul>';
    }
    
    // Generate daily plan HTML
    let dailyPlanHTML = '';
    if (guideData.dailyPlan && guideData.dailyPlan.length > 0) {
        dailyPlanHTML = '<div class="daily-plan-container">';
        guideData.dailyPlan.forEach(day => {
            dailyPlanHTML += `
                <div class="day-card">
                    <div class="day-number">DAY ${day.day}</div>
                    <div class="day-details">
                        <h5>${day.activities}</h5>
                        <p class="day-location">${day.location}</p>
                        <p>${day.description}</p>
                    </div>
                </div>
            `;
        });
        dailyPlanHTML += '</div>';
    }
    
    // Combine all sections into the complete HTML
    return `
        <div class="results-container">
            <div class="result-title">您的专属旅行攻略已生成</div>
            
            <div class="result-destination">
                <h3>${guideData.destination}</h3>
                <p>${guideData.overview}</p>
            </div>
            
            <div class="result-highlights">
                <h4>行程亮点</h4>
                ${highlightsHTML}
            </div>
            
            <div class="result-daily-plan">
                <h4>日程安排</h4>
                ${dailyPlanHTML}
            </div>
            
            <div class="guide-notes">
                <h4>其他信息</h4>
                <p><strong>美食推荐：</strong> ${guideData.food}</p>
                <p><strong>交通：</strong> ${guideData.transportation}</p>
                <p><strong>住宿：</strong> ${guideData.accommodation}</p>
                <p><strong>文化体验：</strong> ${guideData.culture}</p>
            </div>
            
            <div class="result-actions">
                <button class="btn btn-primary">保存行程</button>
                <button class="btn btn-secondary">修改行程</button>
            </div>
        </div>
    `;
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
    // Initialize map (this would normally use a mapping library like Mapbox or Leaflet)
    console.log('Explore page initialized');
    
    // Simulate destinations data
    const destinations = [
        { id: 1, name: 'Paris', lat: 48.8566, lng: 2.3522, region: 'Europe' },
        { id: 2, name: 'Tokyo', lat: 35.6762, lng: 139.6503, region: 'Asia' },
        { id: 3, name: 'New York', lat: 40.7128, lng: -74.0060, region: 'North America' },
        { id: 4, name: 'Sydney', lat: -33.8688, lng: 151.2093, region: 'Australia' },
        { id: 5, name: 'Cairo', lat: 30.0444, lng: 31.2357, region: 'Africa' },
        { id: 6, name: 'Rio de Janeiro', lat: -22.9068, lng: -43.1729, region: 'South America' }
    ];
    
    // Simulate map point clicks
    const mapPoints = document.querySelectorAll('.map-point');
    if (mapPoints) {
        mapPoints.forEach(point => {
            point.addEventListener('click', function() {
                const destinationId = this.dataset.id;
                const destination = destinations.find(d => d.id == destinationId);
                
                if (destination) {
                    showDestinationDetails(destination);
                }
            });
            
            // Hover effect
            point.addEventListener('mouseenter', function() {
                this.classList.add('hover');
            });
            
            point.addEventListener('mouseleave', function() {
                this.classList.remove('hover');
            });
        });
    }
    
    // 添加社区攻略按钮点击事件
    const viewCommunityGuidesBtn = document.querySelector('.view-community-guides-btn');
    if (viewCommunityGuidesBtn) {
        viewCommunityGuidesBtn.addEventListener('click', function() {
            const destinationName = document.querySelector('.modal-title').textContent;
            showCommunityGuides(destinationName);
        });
    }
    
    // 添加社区攻略关闭按钮事件
    const communityGuidesCloseBtn = document.querySelector('.community-guides-close');
    if (communityGuidesCloseBtn) {
        communityGuidesCloseBtn.addEventListener('click', closeCommunityGuidesModal);
    }
    
    // 添加攻略详情关闭按钮事件
    const guideDetailCloseBtn = document.querySelector('.guide-detail-close');
    if (guideDetailCloseBtn) {
        guideDetailCloseBtn.addEventListener('click', closeGuideDetailModal);
    }
    
    // 添加社区攻略遮罩点击事件
    const communityGuidesOverlay = document.querySelector('.community-guides-overlay');
    if (communityGuidesOverlay) {
        communityGuidesOverlay.addEventListener('click', closeCommunityGuidesModal);
    }
    
    // 添加攻略详情遮罩点击事件
    const guideDetailOverlay = document.querySelector('.guide-detail-overlay');
    if (guideDetailOverlay) {
        guideDetailOverlay.addEventListener('click', closeGuideDetailModal);
    }
}

// Show destination details modal
function showDestinationDetails(destination) {
    const modal = document.querySelector('.destination-modal');
    if (modal) {
        const modalTitle = modal.querySelector('.modal-title');
        const modalContent = modal.querySelector('.modal-content');
        
        modalTitle.textContent = destination.name;
        
        // Simulate content fetching
        modalContent.innerHTML = `
            <div class="destination-image" style="background-image: url('images/${destination.name.toLowerCase()}.jpg')"></div>
            <div class="destination-info">
                <h4>About ${destination.name}</h4>
                <p>This is where detailed information about ${destination.name} would appear, including cultural highlights, best times to visit, and travel tips.</p>
                <div class="destination-facts">
                    <div class="fact">
                        <span class="fact-label">Region</span>
                        <span class="fact-value">${destination.region}</span>
                    </div>
                    <div class="fact">
                        <span class="fact-label">Language</span>
                        <span class="fact-value">Various</span>
                    </div>
                    <div class="fact">
                        <span class="fact-label">Currency</span>
                        <span class="fact-value">Various</span>
                    </div>
                </div>
            </div>
        `;
        
        modal.classList.add('active');
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
    
    // Get saved travel guides from localStorage
    const savedGuides = JSON.parse(localStorage.getItem('savedGuides')) || [];
    
    // Initialize upcomingPlans array
    let upcomingPlans = [];
    
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
    
    // Populate plans
    const plansContainer = document.querySelector('.plans-container');
    if (plansContainer && upcomingPlans.length > 0) {
        let plansHTML = '';
        
        upcomingPlans.forEach(plan => {
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
            
            // 添加备注信息（如果有）
            const hasNotes = plan.guideData && plan.guideData.notes ? 
                `<div class="plan-notes"><i>Note: ${plan.guideData.notes}</i></div>` : '';
            
            plansHTML += `
                <div class="plan-card" data-plan-id="${plan.id}">
                    <div class="plan-header">
                        <h3>${plan.destination} ${hasGuideData}</h3>
                        <div class="plan-dates">${formattedStartDate} - ${formattedEndDate}</div>
                        ${hasNotes}
                    </div>
                    <div class="plan-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${completionPercentage}%"></div>
                        </div>
                        <div class="progress-text">${completionPercentage}% ready</div>
                    </div>
                    <div class="plan-tasks">
                        <h4>Preparation tasks</h4>
                        <ul class="task-list">
            `;
            
            plan.tasks.forEach(task => {
                plansHTML += `
                    <li class="task-item ${task.completed ? 'completed' : ''}">
                        <label class="task-checkbox">
                            <input type="checkbox" ${task.completed ? 'checked' : ''} data-task-id="${task.id}">
                            <span class="checkmark"></span>
                        </label>
                        <span class="task-text">${task.text}</span>
                    </li>
                `;
            });
            
            plansHTML += `
                        </ul>
                    </div>
                    <div class="plan-actions">
                        <button class="btn btn-small btn-outline">Edit</button>
                        <button class="btn btn-small btn-highlight view-plan" data-plan-id="${plan.id}">View</button>
                    </div>
                </div>
            `;
        });
        
        plansContainer.innerHTML = plansHTML;
        
        // Add event listeners to checkboxes
        const checkboxes = document.querySelectorAll('.task-checkbox input');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const taskId = this.dataset.taskId;
                const planId = this.closest('.plan-card').dataset.planId;
                
                // Update task status (would normally be an API call)
                console.log(`Task ${taskId} in plan ${planId} set to ${this.checked}`);
                
                // Update UI
                if (this.checked) {
                    this.closest('.task-item').classList.add('completed');
                } else {
                    this.closest('.task-item').classList.remove('completed');
                }
                
                // Recalculate progress
                updatePlanProgress(planId);
            });
        });
        
        // Add event listeners to view buttons
        const viewButtons = document.querySelectorAll('.view-plan');
        viewButtons.forEach(button => {
            button.addEventListener('click', function() {
                const planId = this.dataset.planId;
                const plan = upcomingPlans.find(p => p.id == planId);
                
                if (plan && plan.guideData) {
                    // Show travel guide details
                    showTravelGuideDetails(plan.guideData);
                } else {
                    // Show regular trip details
                    showTripDetails(plan);
                }
            });
        });
        
        // Add event listeners to edit buttons
        const editButtons = document.querySelectorAll('.btn-small.btn-outline');
        editButtons.forEach(button => {
            button.addEventListener('click', function() {
                const planId = this.closest('.plan-card').dataset.planId;
                const plan = upcomingPlans.find(p => p.id == planId);
                
                if (plan) {
                    showEditGuideModal(plan);
                }
            });
        });
        
        // Add event listener to close travel guide modal
        const closeButton = document.querySelector('.travel-guide-close');
        if (closeButton) {
            closeButton.addEventListener('click', closeTravelGuideModal);
        }
        
        // Close modal when clicking overlay
        const overlay = document.querySelector('.travel-guide-overlay');
        if (overlay) {
            overlay.addEventListener('click', closeTravelGuideModal);
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
        const displayTitle = guideData.title || `Travel Guide: ${guideData.destination}`;
        
        // 设置标题
        title.textContent = displayTitle;
        
        // 生成HTML用于旅行攻略
        let guideHTML = `
            <div class="guide-destination">
                <h3>${guideData.destination}</h3>
                <p>${guideData.duration} in ${guideData.season}</p>
            </div>`;
            
        // 添加用户备注（如果有）
        if (guideData.notes && guideData.notes.trim().length > 0) {
            guideHTML += `
            <div class="guide-notes">
                <h4>Notes</h4>
                <p>${guideData.notes}</p>
            </div>`;
        }
        
        guideHTML += `
            <div class="guide-highlights">
                <h4>Highlights</h4>
                <ul>
        `;
        
        guideData.highlights.forEach(highlight => {
            guideHTML += `<li>${highlight}</li>`;
        });
        
        guideHTML += `
                </ul>
            </div>
            <div class="guide-daily-plan">
                <h4>Daily Plan</h4>
                <div class="guide-daily-plan-container">
        `;
        
        guideData.dailyPlan.forEach(day => {
            guideHTML += `
                <div class="guide-day-card">
                    <div class="guide-day-number">Day ${day.day}</div>
                    <div class="guide-day-details">
                        <h5>${day.activity}</h5>
                        <p>${day.location}</p>
                    </div>
                </div>
            `;
        });
        
        guideHTML += `
                </div>
            </div>
        `;
        
        // Insert content
        container.innerHTML = guideHTML;
        
        // Show modal and overlay
        modal.classList.add('active');
        overlay.classList.add('active');
    }
}

// Close travel guide modal
function closeTravelGuideModal() {
    const modal = document.querySelector('.travel-guide-modal');
    const overlay = document.querySelector('.travel-guide-overlay');
    
    if (modal && overlay) {
        modal.classList.remove('active');
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

// Update plan progress display
function updatePlanProgress(planId) {
    const planCard = document.querySelector(`.plan-card[data-plan-id="${planId}"]`);
    if (planCard) {
        const taskItems = planCard.querySelectorAll('.task-item');
        const totalTasks = taskItems.length;
        const completedTasks = planCard.querySelectorAll('.task-item.completed').length;
        
        const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        
        const progressFill = planCard.querySelector('.progress-fill');
        const progressText = planCard.querySelector('.progress-text');
        
        if (progressFill && progressText) {
            progressFill.style.width = `${completionPercentage}%`;
            progressText.textContent = `${completionPercentage}% ready`;
        }
    }
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
            image: `images/${destinationName.toLowerCase()}.jpg`,
            content: `这是一份为期7天的${destinationName}深度旅行攻略，包含当地特色美食、著名景点以及文化体验。`,
            days: 7
        },
        {
            id: 102,
            title: `${destinationName} 周末精华行程`,
            author: '背包客小明',
            rating: 4.5,
            tags: ['周末', '精华', '省钱'],
            image: `images/${destinationName.toLowerCase()}.jpg`,
            content: `这份攻略专为周末短途旅行设计，集中了${destinationName}的精华景点和体验，适合时间有限的游客。`,
            days: 3
        },
        {
            id: 103,
            title: `${destinationName} 美食探索之旅`,
            author: '吃货大王',
            rating: 4.9,
            tags: ['美食', '小吃', '餐厅'],
            image: `images/${destinationName.toLowerCase()}.jpg`,
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


