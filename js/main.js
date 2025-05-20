// Main JavaScript file for DeepTrip

// 页面加载完成后初始化功能
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
    if (body.classList.contains('home')) {
        console.log('Initializing home page');
        initHomePage();
    } else if (body.classList.contains('create-page')) {
        console.log('Initializing create page');
        initCreatePage();
    } else if (body.classList.contains('explore-page')) {
        console.log('Initializing explore page');
        initExplorePage();
    } else if (body.classList.contains('plans-page')) {
        console.log('Initializing plans page');
        initPlansPage();
    } else if (body.classList.contains('personal-page')) {
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
    if (typeof debugElementPresence === 'function') {
        debugElementPresence();
    }
    
    // 如果在显示旅行攻略时设置折叠功能
    const travelGuideModal = document.querySelector('.travel-guide-modal');
    if (travelGuideModal) {
        travelGuideModal.addEventListener('click', function(e) {
            // 避免触发折叠功能的点击事件冒泡
            if (e.target.closest('.travel-guide-close')) return;
            
            // 设置折叠式日程
            setupCollapsibleItinerary();
        });
    }
    
    // 在生成旅行攻略后也需要设置折叠功能
    const generateGuideBtn = document.getElementById('generate-guide-btn');
    if (generateGuideBtn) {
        generateGuideBtn.addEventListener('click', function() {
            // 等待攻略生成后设置折叠式日程
            setTimeout(setupCollapsibleItinerary, 1000);
        });
    }
    
    // 调用地图交互增强函数
    enhanceMobileMapInteractions();
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
        console.log("Not on create page, skipping initCreatePage");
        return; // Only run on the create page
    }
    
    console.log("Initializing create page...");
    
    // Core variables
    let currentQuestion = 1;
    const totalQuestions = 8;
    window.answers = {}; // 将answers设为全局变量以便在showQuestion中访问
    let hasSelectedDestination = false; // 新增: 跟踪用户是否选择了具体目的地
    let userDestination = ""; // 新增: 存储用户输入的目的地
    let isTransitioning = false; // 添加过渡状态控制变量
    
    // Page elements
    const welcomeScreen = document.querySelector('.welcome-screen');
    console.log("Welcome screen element found:", !!welcomeScreen);
    
    const destinationSelectionStep = document.querySelector('.destination-selection-step');
    console.log("Destination selection step element found:", !!destinationSelectionStep);
    
    const content = document.querySelector('.content');
    const body = document.body;
    const fullscreenBg = document.querySelector('.fullscreen-bg');
    const progressBar = document.querySelector('.progress-bar-fill');
    const progressText = document.querySelector('.progress-text');
    const questionContainer = document.querySelector('.question-container');
    const resultsContainer = document.querySelector('.results-container');
    const loadingAnimation = document.querySelector('.loading-animation');
    
    // 新增: 目的地选择相关元素
    const hasDestinationBtn = document.getElementById('has-destination');
    console.log("Has destination button found:", !!hasDestinationBtn);
    
    const noDestinationBtn = document.getElementById('no-destination');
    console.log("No destination button found:", !!noDestinationBtn);
    
    const destinationInputContainer = document.querySelector('.destination-input-container');
    console.log("Destination input container found:", !!destinationInputContainer);
    
    const destinationInput = document.getElementById('destination-input');
    const destinationSubmitBtn = document.getElementById('destination-submit');
    
    // 点击进入按钮 - 从欢迎页面进入目的地选择步骤
    const enterButton = document.getElementById('enter-questionnaire');
    console.log("Enter button found:", !!enterButton);
    
    if (enterButton) {
        console.log("设置入口按钮点击事件");
        enterButton.addEventListener('click', function() {
            console.log("入口按钮被点击");
            // 隐藏欢迎屏幕
            welcomeScreen.classList.add('hidden');
            // 显示目的地选择步骤
            destinationSelectionStep.style.display = 'flex';
        });
    }
    
    // 使整个欢迎界面可点击
    if (welcomeScreen) {
        welcomeScreen.addEventListener('click', function(e) {
            // 如果点击的不是按钮本身，也触发相同效果
            if (e.target !== enterButton) {
                console.log("欢迎屏幕被点击");
                welcomeScreen.classList.add('hidden');
                destinationSelectionStep.style.display = 'flex';
            }
        });
    }
    
    // 新增: 目的地选择按钮事件
    if (hasDestinationBtn) {
        hasDestinationBtn.addEventListener('click', function() {
            console.log("已确定目的地按钮被点击");
            // 显示目的地输入框
            destinationInputContainer.style.display = 'flex';
            // 添加动画效果和样式
            this.style.backgroundColor = 'rgba(255, 182, 245, 0.4)';
            noDestinationBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        });
    }
    
    if (noDestinationBtn) {
        noDestinationBtn.addEventListener('click', function() {
            console.log("不确定目的地按钮被点击");
            // 正常流程，从第一题开始
            hasSelectedDestination = false;
            userDestination = "未指定目的地"; // 添加未指定目的地标记
            
            // 将此信息存储在answers中，以便在生成旅行攻略时使用
            window.answers.isUncertainDestination = true;
            window.answers.needsDestinationRecommendation = true;
            
            console.log("用户选择不确定目的地，设置 hasSelectedDestination =", hasSelectedDestination);
            destinationSelectionStep.style.display = 'none';
            completeTransition();
            // 添加动画效果和样式
            this.style.backgroundColor = 'rgba(255, 182, 245, 0.4)';
            hasDestinationBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            
            // 显示推荐目的地提示
            const loadingMessage = document.getElementById('loading-message');
            if (loadingMessage) {
                loadingMessage.innerHTML = '我们将根据您的偏好为您推荐最适合的旅行目的地...';
            }
        });
    }
    
    if (destinationSubmitBtn) {
        destinationSubmitBtn.addEventListener('click', function() {
            console.log("目的地提交按钮被点击");
            const destination = destinationInput.value.trim();
            if (destination) {
                userDestination = destination;
                hasSelectedDestination = true;
                
                // 将用户选择的目的地存储在answers中
                window.answers.specifiedDestination = destination;
                window.answers.isUncertainDestination = false;
                
                // 自动填充前4个问题的"特定目的地"标记
                window.answers["1"] = "specific_destination";
                window.answers["2"] = "specific_destination";
                window.answers["3"] = "specific_destination";
                window.answers["4"] = "specific_destination";
                
                console.log("用户指定的目的地:", destination);
                console.log("更新后的window.answers:", JSON.stringify(window.answers));
                
                destinationSelectionStep.style.display = 'none';
                completeTransition();
            } else {
                // 输入框闪烁提示
                destinationInput.style.borderColor = 'red';
                setTimeout(() => {
                    destinationInput.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }, 800);
            }
        });
    }
    
    // 目的地输入框回车确认
    if (destinationInput) {
        destinationInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                destinationSubmitBtn.click();
            }
        });
    }
    
    // 保留原有的wheel事件处理，但只在欢迎屏幕阶段有效
    window.addEventListener('wheel', function(e) {
        // 只在欢迎屏幕可见时处理
        if (welcomeScreen.style.display !== 'none' && !welcomeScreen.classList.contains('hidden') && 
            destinationSelectionStep.style.display === 'none') {
            // 只对向下滚动作出反应
            if (e.deltaY > 0) {
                console.log("检测到向下滚动");
                welcomeScreen.classList.add('hidden');
                destinationSelectionStep.style.display = 'flex';
            }
        }
    });
    
    // 触控支持，同样只在欢迎屏幕阶段有效
    let touchStartY = 0;
    let touchMoveY = 0;
    let touchThreshold = 50;
    
    window.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
    });
    
    window.addEventListener('touchmove', function(e) {
        // 只在欢迎屏幕可见且目的地选择步骤不可见时处理
        if (welcomeScreen.style.display !== 'none' && !welcomeScreen.classList.contains('hidden') && 
            destinationSelectionStep.style.display === 'none') {
            touchMoveY = e.touches[0].clientY;
            const touchDiff = touchStartY - touchMoveY;
            
            // 只对向下滑动反应
            if (touchDiff > touchThreshold) {
                console.log("检测到向下滑动");
                welcomeScreen.classList.add('hidden');
                destinationSelectionStep.style.display = 'flex';
            }
        }
    });
    
    // Function to complete transition to questionnaire
    function completeTransition() {
        if (isTransitioning) return;
        isTransitioning = true;
        
        console.log("Completing transition to questionnaire");
        
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
            
            // 如果用户选择了具体目的地，跳过前4个问题
            if (hasSelectedDestination) {
                console.log("User selected destination:", userDestination);
                // 自动填充前4个问题的答案
                window.answers["1"] = "specific_destination";
                window.answers["2"] = "specific_destination";
                window.answers["3"] = "specific_destination";
                window.answers["4"] = "specific_destination";
                // 从第5题开始
                currentQuestion = 5;
            }
            
            showQuestion(currentQuestion);
            updateProgress(currentQuestion, totalQuestions);
            
            // Add click handlers for options
            setupQuestionOptions();
            
            // 如果有具体目的地，显示在页面上
            if (hasSelectedDestination) {
                const progressContainer = document.querySelector('.progress-container');
                if (progressContainer) {
                    const destinationDisplay = document.createElement('div');
                    destinationDisplay.className = 'selected-destination-display';
                    destinationDisplay.innerHTML = `<span>您选择的目的地: </span><strong>${userDestination}</strong>`;
                    progressContainer.appendChild(destinationDisplay);
                }
            }
        }, 600);
    }
    
    // Set up question option handling
    function setupQuestionOptions() {
        const questionOptions = document.querySelectorAll('.question-option');
        questionOptions.forEach(option => {
            option.addEventListener('click', function() {
                const questionId = this.closest('.question').dataset.questionId;
                const selectedValue = this.dataset.value;
                
                // 确保window.answers已初始化为对象
                if (!window.answers || typeof window.answers !== 'object') {
                    window.answers = {};
                }
                
                // Clear previous selections
                document.querySelectorAll(`.question[data-question-id="${questionId}"] .question-option`).forEach(opt => {
                    opt.classList.remove('selected');
                    opt.classList.add('faded');
                });
                
                // Apply selected styling
                this.classList.add('selected');
                this.classList.remove('faded');
                
                // Store answer
                window.answers[questionId] = selectedValue;
                
                // 调试: 显示当前选择
                console.log(`用户选择了问题${questionId}的选项:`, selectedValue);
                console.log("当前所有选择:", JSON.stringify(window.answers));
                
                // 尝试获取选项的文本显示值
                const textValue = getTextForValue(questionId, selectedValue);
                console.log(`问题${questionId}的选项文本值:`, textValue);
                
                // Proceed to next question after delay
                setTimeout(() => {
                    if (currentQuestion < totalQuestions) {
                        currentQuestion++;
                        showQuestion(currentQuestion);
                        updateProgress(currentQuestion, totalQuestions);
                    } else {
                        // 最后一题
                        console.log("所有问题已回答完毕，最终选择:", JSON.stringify(window.answers));
                        // Show results when all questions answered
                        showResults(window.answers);
                    }
                }, 500);
            });
        });
        
        // 添加返回上一题的功能
        const prevButtons = document.querySelectorAll('.prev-button');
        prevButtons.forEach(button => {
            button.addEventListener('click', function() {
                // 第一题的返回按钮已禁用，无需处理
                if (currentQuestion > 1) {
                    currentQuestion--;
                    showQuestion(currentQuestion);
                    updateProgress(currentQuestion, totalQuestions);
                    
                    // 如果用户选择了具体目的地，且尝试返回到前4题，不允许
                    if (hasSelectedDestination && currentQuestion < 5) {
                        currentQuestion = 5;
                        showQuestion(currentQuestion);
                        updateProgress(currentQuestion, totalQuestions);
                    }
                }
            });
        });
        
        // 启用下一题按钮功能
        const nextButtons = document.querySelectorAll('.next-button');
        nextButtons.forEach(button => {
            // 只处理当前可见问题的下一题按钮
            const questionElement = button.closest('.question');
            if (questionElement) {
                const questionId = questionElement.dataset.questionId;
                
                // 当问题有选项被选中时，启用下一题按钮
                questionElement.addEventListener('click', function(e) {
                    if (e.target.closest('.question-option')) {
                        button.disabled = false;
                    }
                });
                
                // 点击下一题按钮时的行为
                button.addEventListener('click', function() {
                    if (!this.disabled && currentQuestion < totalQuestions) {
                        currentQuestion++;
                        showQuestion(currentQuestion);
                        updateProgress(currentQuestion, totalQuestions);
                        
                        // 如果用户选择了具体目的地，且尝试返回到前4题，不允许
                        if (hasSelectedDestination && currentQuestion < 5) {
                            currentQuestion = 5;
                            showQuestion(currentQuestion);
                            updateProgress(currentQuestion, totalQuestions);
                        }
                    } else if (!this.disabled && currentQuestion === totalQuestions) {
                        // 最后一题，打印最终选择并显示结果
                        console.log("所有问题已回答完毕，最终选择:", JSON.stringify(window.answers));
                        // 最后一题，显示结果
                        showResults(window.answers);
                    }
                });
            }
        });
    }

    // 检查是否从explore页面带有目的地参数
    const checkForSelectedDestination = () => {
        const selectedDestination = sessionStorage.getItem('selectedDestination');
        if (selectedDestination) {
            userDestination = selectedDestination;
            hasSelectedDestination = true;
            
            // 将用户选择的目的地存储在answers中
            window.answers = window.answers || {};
            window.answers.specifiedDestination = selectedDestination;
            window.answers.isUncertainDestination = false;
            
            // 自动填充前4个问题的"特定目的地"标记
            window.answers["1"] = "specific_destination";
            window.answers["2"] = "specific_destination";
            window.answers["3"] = "specific_destination";
            window.answers["4"] = "specific_destination";
            
            console.log("从探索页面获取的目的地:", selectedDestination);
            console.log("设置的window.answers:", JSON.stringify(window.answers));
            
            welcomeScreen.classList.add('hidden');
            // 跳过目的地选择步骤，直接进入问卷
            completeTransition();
            // 清除会话存储中的目的地
            sessionStorage.removeItem('selectedDestination');
        }
    };
    
    // 页面初始化时检查
    checkForSelectedDestination();
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
        
        // 处理上一题/下一题按钮状态
        const prevButton = targetQuestion.querySelector('.prev-button');
        const nextButton = targetQuestion.querySelector('.next-button');
        
        // 第一题禁用上一题按钮
        if (prevButton) {
            prevButton.disabled = (questionNumber === 1);
        }
        
        // 设置下一题按钮状态 - 检查是否有答案
        if (nextButton) {
            const questionId = targetQuestion.dataset.questionId;
            
            // 更新: 两种方式检查是否有答案 - window.answers或已选中选项
            const hasAnswer = window.answers && window.answers[questionId];
            const hasSelectedOption = targetQuestion.querySelector('.question-option.selected') !== null;
            
            nextButton.disabled = !(hasAnswer || hasSelectedOption);
            
            // 如果有已存储的答案，恢复选中状态
            if (hasAnswer && !hasSelectedOption) {
                const selectedOption = targetQuestion.querySelector(`.question-option[data-value="${window.answers[questionId]}"]`);
                if (selectedOption) {
                    // 清除其他选中状态
                    targetQuestion.querySelectorAll('.question-option').forEach(opt => {
                        opt.classList.remove('selected');
                        opt.classList.add('faded');
                    });
                    
                    // 应用选中样式
                    selectedOption.classList.add('selected');
                    selectedOption.classList.remove('faded');
                }
            }
            
            // 最后一题的下一步按钮文字改为"完成"
            if (parseInt(questionId) === 8) {
                nextButton.textContent = "完成";
            } else {
                nextButton.textContent = "下一题";
            }
        }
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
        
        // Optimize async handling
        setTimeout(async () => {
            try {
            loadingAnimation.style.display = 'none';
            
            // Show results container
            const resultsContainer = document.querySelector('.results-container');
            if (resultsContainer) {
                resultsContainer.style.display = 'block';
                    
                    // 异步调用生成旅行攻略并等待结果
                    const travelGuide = await generateTravelGuide(answers, resultsContainer);
                    
                    // 成功获取旅行攻略后处理
                    if (travelGuide && travelGuide.destination) {
                        console.log('旅行攻略生成成功:', travelGuide.destination);
                    } else {
                        console.error('旅行攻略数据无效');
                    }
                }
            } catch (error) {
                        console.error('旅行攻略生成失败:', error);
                
                // 显示错误信息
                const resultsContainer = document.querySelector('.results-container');
                if (resultsContainer) {
                    resultsContainer.style.display = 'block';
                    resultsContainer.innerHTML = `
                        <div class="error-container">
                            <h2>生成攻略失败</h2>
                            <p>无法连接到旅行规划服务，请稍后再试</p>
                            <p>错误信息: ${error.message}</p>
                            <button class="btn btn-primary" onclick="location.reload()">重试</button>
                        </div>
                    `;
                }
                
                // 隐藏加载动画
                if (loadingAnimation) {
                    loadingAnimation.style.display = 'none';
                }
            }
        }, 1500); // 减少等待时间以提高用户体验
    }
}

// 新增函数：将用户答案格式化为偏好对象，并确保所有值都是文本格式
function formatAnswersToUserPreferences(answers) {
    if (!answers || typeof answers !== 'object') {
        console.warn("formatAnswersToUserPreferences收到无效的answers对象:", answers);
        return {
            region: "未指定",
            geography: "未指定",
            climate: "未指定",
            cityType: "未指定",
            travelStyle: "未指定",
            duration: "未指定",
            budget: "未指定",
            travelers: "未指定"
        };
    }
    
    console.log("格式化用户答案，原始answers对象:", JSON.stringify(answers));
    
    // 创建用户偏好对象
    const userPreferences = {
        region: "未指定",
        geography: "未指定",
        climate: "未指定",
        cityType: "未指定",
        travelStyle: "未指定",
        duration: "未指定",
        budget: "未指定",
        travelers: "未指定"
    };
    
    // 如果用户指定了目的地，获取该目的地
    const specifiedDestination = answers.specifiedDestination;
    
    // 遍历answers，提取有效的问题答案
    if (answers[1] !== undefined) {
        // 如果是指定目的地占位符，使用用户输入的目的地
        if (answers[1] === "specific_destination" && specifiedDestination) {
            userPreferences.region = specifiedDestination;
        } else {
            userPreferences.region = getTextForValue(1, answers[1]);
        }
    }
    
    if (answers[2] !== undefined) {
        if (answers[2] === "specific_destination" && specifiedDestination) {
            userPreferences.geography = `${specifiedDestination}的特色地理环境`;
        } else {
            userPreferences.geography = getTextForValue(2, answers[2]);
        }
    }
    
    if (answers[3] !== undefined) {
        if (answers[3] === "specific_destination" && specifiedDestination) {
            userPreferences.climate = `${specifiedDestination}的典型气候`;
        } else {
            userPreferences.climate = getTextForValue(3, answers[3]);
        }
    }
    
    if (answers[4] !== undefined) {
        if (answers[4] === "specific_destination" && specifiedDestination) {
            userPreferences.cityType = specifiedDestination;
        } else {
            userPreferences.cityType = getTextForValue(4, answers[4]);
        }
    }
    
    if (answers[5] !== undefined) userPreferences.travelStyle = getTextForValue(5, answers[5]);
    if (answers[6] !== undefined) userPreferences.duration = getTextForValue(6, answers[6]);
    if (answers[7] !== undefined) userPreferences.budget = getTextForValue(7, answers[7]);
    if (answers[8] !== undefined) userPreferences.travelers = getTextForValue(8, answers[8]);
    
    console.log("格式化后的用户偏好:", JSON.stringify(userPreferences));
    
    return userPreferences;
}

// 检查网络连接
async function checkInternetConnection() {
    try {
        // 尝试获取一个小文件来确认网络连接
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5秒超时
        
        const response = await fetch('https://www.gstatic.com/generate_effect/generate_effect_tiny.min.js', {
            method: 'HEAD',
            mode: 'no-cors',
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        return true; // 成功连接
    } catch (error) {
        console.log("网络连接检测失败:", error);
        return false; // 连接失败
    }
}

// 显示网络错误提示
function showOfflineMessage(container) {
    if (container) {
        container.innerHTML = `
        <div class="offline-container">
            <div class="offline-icon">📶</div>
            <h2>啊哦，网络走丢了！</h2>
            <p>似乎您的网络连接已断开</p>
            <p class="offline-description">不用担心！我们已经为您准备了离线旅行攻略</p>
            <div class="offline-animals">
                <span class="offline-animal">🐢</span>
                <span class="offline-animal">🦊</span>
                <span class="offline-animal">🦁</span>
                <span class="offline-animal">🐘</span>
            </div>
            <button class="btn btn-primary retry-connection">重试连接</button>
            <button class="btn btn-secondary use-offline">使用离线攻略</button>
        </div>
        `;
        
        // 为按钮添加事件监听器
        const retryButton = container.querySelector('.retry-connection');
        if (retryButton) {
            retryButton.addEventListener('click', async function() {
                // 检查是否已恢复连接
                const isOnline = await checkInternetConnection();
                if (isOnline) {
                    // 重新生成攻略
                    generateTravelGuide(window.answers || {}, container);
                } else {
                    // 显示仍然离线的消息
                    showMessage("仍然无法连接网络，请稍后再试");
                }
            });
        }
        
        const offlineButton = container.querySelector('.use-offline');
        if (offlineButton) {
            offlineButton.addEventListener('click', function() {
                // 使用备用攻略
                const fallbackGuide = getFallbackTravelGuide();
                showTravelGuideDetails(fallbackGuide);
                
                // 隐藏离线消息
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
                            <p class="fallback-notice">（目前处于离线模式，显示的是备用攻略数据）</p>
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
            });
        }
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
        // 检查网络连接
        const isOnline = await checkInternetConnection();
        if (!isOnline) {
            console.warn("检测到网络离线状态，显示离线提示");
            
            // 隐藏加载动画
            if (loadingAnimation) {
                loadingAnimation.style.display = 'none';
            }
            
            // 显示离线提示
            if (resultsContainer) {
                resultsContainer.style.display = 'block';
                showOfflineMessage(container);
            }
            
            return;
        }
        
        // 调试输出用户选择的所有选项
        console.log("生成旅行攻略 - 用户原始选择:", answers);
        
        // 验证答案对象格式
        if (!answers || typeof answers !== 'object' || Object.keys(answers).length === 0) {
            console.warn("警告: 收到空的用户选择或格式不正确", answers);
            // 创建默认空答案以防止错误
            answers = { isUncertainDestination: true };
        }
        
        // Format answers for display
        const formattedAnswers = {};
        for (const questionId in answers) {
            if (!isNaN(parseInt(questionId))) { // 只格式化数字问题ID
                const formattedValue = getTextForValue(questionId, answers[questionId]);
                formattedAnswers[questionId] = formattedValue;
                // 调试每个问题的用户选择与格式化值
                console.log(`问题${questionId} - 原始值: ${answers[questionId]} 格式化值: ${formattedValue}`);
            }
        }
        
        // 获取格式化后的用户偏好
        const userPreferences = formatAnswersToUserPreferences(answers);
        console.log("用户旅行偏好:", userPreferences);
        
        // API parameters
        const apiKey = 'sk-632cae39bfa046ada3c21174a42528c2';
        const apiUrl = 'https://api.deepseek.com/v1/chat/completions';
        
        // 创建更详细的提示，确保所有用户偏好被包含
        // 重要：保留原始answers对象，不要尝试替换为formattedAnswers
        const prompt = createTravelPrompt(answers);
        
        console.log("正在调用DeepSeek API生成旅行攻略...");
        
        let travelGuidesData = null;
        let parsedGuideData = null;
        
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
                            content: '您是一位专业的旅行规划师。请使用中文为用户创建详细的、个性化的旅行攻略，内容必须是中文，不要使用英文。您的回复应该符合JSON格式，并满足用户的所有偏好需求。'
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
            parsedGuideData = parseAIResponseToTravelGuide(aiResponse, answers);
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
            
            // 返回生成的旅行攻略数据
            return parsedGuideData;
            
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
            
            // 返回备用旅行攻略数据
            return fallbackGuide;
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
        
        // 出错时返回一个基本的旅行攻略对象，以防止调用者报错
        return {
            destination: "生成失败",
            title: "旅行攻略生成失败",
            overview: "无法连接到旅行规划服务，请稍后再试",
            highlights: ["请重试"],
            duration: "0天",
            dailyPlan: []
        };
    }
}

// 创建一个基于用户选择的简单旅行攻略
function createSimpleGuideFromAnswers(answers) {
    console.log("创建基于用户选择的简单攻略，答案:", answers);
    
    // 选择合适的目的地
    let destination = "东京，日本"; // 默认目的地
    let overview = "这座城市融合了现代与传统，拥有丰富的文化体验、美食和景点。";
    
    // 根据用户地区选择合适的目的地
    if (answers[1]) {
        console.log("基于用户选择地区创建攻略:", answers[1]);
        
        if (answers[1] === 'domestic') {
            destination = "丽江，云南";
            overview = "丽江是中国云南省的一座历史文化名城，以其独特的纳西族文化和壮丽的自然风光而闻名。古城区是联合国教科文组织世界文化遗产，拥有保存完好的古建筑和水道系统。";
        } 
        else if (answers[1] === 'europe') {
            destination = "巴塞罗那，西班牙";
            overview = "巴塞罗那是西班牙加泰罗尼亚地区的首府，以其独特的建筑、艺术氛围和海滨风光而闻名。这座城市融合了现代与传统，高迪的建筑作品为城市增添了不可思议的魅力。";
        } 
        else if (answers[1] === 'america') {
            destination = "旧金山，美国";
            overview = "旧金山是美国加利福尼亚州的一座风景如画的城市，以其起伏的山丘、维多利亚式房屋、缆车和金门大桥而闻名。这座城市拥有丰富的文化多样性、创新精神和绝佳的美食体验。";
        } 
        else if (answers[1] === 'asia') {
            destination = "东京，日本";
            overview = "东京是日本的首都，也是一座融合了现代与传统的大都市。这里有繁华的商业区、历史悠久的寺庙神社、丰富多样的美食和独特的流行文化，为旅行者提供了丰富多彩的体验。";
        }
    }
    
    // 如果用户指定了目的地，使用指定的目的地
    if (answers.specifiedDestination) {
        destination = answers.specifiedDestination;
        overview = `${destination}是一个令人难忘的旅行目的地，为您定制的旅行计划将让您充分体验当地的文化、美食和风景。`;
    }
    
    // 根据用户选择的旅行时长设置行程天数
    let duration = 5; // 默认值
    if (answers[6]) {
        if (answers[6] === 'weekend') {
            duration = 2; // 周末2-3天
        }
        else if (answers[6] === 'week') {
            duration = 5; // 一周左右
        }
        else if (answers[6] === 'twoweeks') {
            duration = 10; // 两周左右
        }
        else if (answers[6] === 'month') {
            duration = 14; // 长期旅行
        }
    }
    
    console.log(`创建 ${destination} 的 ${duration} 天行程`);
    
    // 创建每日行程计划
    const dailyPlan = [];
    
    // 基于目的地的典型景点
    const attractions = {
        "丽江，云南": ["古城", "玉龙雪山", "拉市海", "大研古镇", "束河古镇", "黑龙潭公园", "木府", "狮子山", "万古楼"],
        "巴塞罗那，西班牙": ["圣家堂", "巴特罗之家", "米拉之家", "古埃尔公园", "加泰罗尼亚广场", "兰布拉大道", "巴塞罗那大教堂", "毕加索博物馆", "诺坎普球场"],
        "旧金山，美国": ["金门大桥", "恶魔岛", "渔人码头", "九曲花街", "联合广场", "加利福尼亚科学院", "旧金山现代艺术博物馆", "金门公园", "市政厅"],
        "东京，日本": ["东京塔", "浅草寺", "明治神宫", "涩谷十字路口", "秋叶原", "上野公园", "新宿御苑", "六本木", "台场"]
    };
    
    // 获取当前目的地的景点列表，如果没有特定景点，使用通用景点
    const destinationAttractions = attractions[destination] || ["当地博物馆", "自然景观", "特色街区", "历史古迹", "购物中心", "文化体验", "主题公园", "城市公园", "当地集市"];
    
    // 通用活动类型
    const morningActivities = ["参观博物馆", "游览自然景观", "探索历史古迹", "早晨城市散步", "参加当地导览"];
    const noonActivities = ["品尝当地特色美食", "休闲购物", "参观艺术展览", "文化体验活动", "户外野餐"];
    const eveningActivities = ["欣赏夜景", "体验当地夜生活", "享用特色晚餐", "观看文化表演", "夜游特色街区"];
    
    // 创建每日行程
    for (let i = 1; i <= duration; i++) {
        // 随机选择几个景点
        const dayAttractions = [];
        for (let j = 0; j < 3; j++) {
            const randomIndex = Math.floor(Math.random() * destinationAttractions.length);
            if (!dayAttractions.includes(destinationAttractions[randomIndex])) {
                dayAttractions.push(destinationAttractions[randomIndex]);
            }
        }
        
        // 随机选择活动
        const morningActivity = morningActivities[Math.floor(Math.random() * morningActivities.length)];
        const noonActivity = noonActivities[Math.floor(Math.random() * noonActivities.length)];
        const eveningActivity = eveningActivities[Math.floor(Math.random() * eveningActivities.length)];
        
        // 创建当天行程
        dailyPlan.push({
            day: i,
            activities: `第${i}天：探索${dayAttractions.join('、')}`,
            location: destination,
            description: `第${i}天您将探索${destination}的精彩景点，包括${dayAttractions.join('、')}，体验当地文化与风景。`,
            budget: "约¥600-1000",
            morning: `早上${morningActivity}，体验${destination}的早晨氛围。参观${dayAttractions[0]}。`,
            noon: `中午${noonActivity}，然后前往${dayAttractions[1]}继续您的探索之旅。`,
            evening: `晚上${eveningActivity}，在${dayAttractions[2] || destination+"市中心"}结束充实的一天。`
        });
    }
    
    // 根据旅行风格调整亮点
    let highlights = [
        "探索历史文化景点",
        "品尝当地特色美食",
        "体验传统文化活动",
        "观赏自然风光"
    ];
    
    if (answers[5]) {
        if (answers[5] === 'adventure') {
            highlights = ["刺激的户外活动", "自然探险体验", "独特的冒险路线", "当地特色体验"];
        } else if (answers[5] === 'cultural') {
            highlights = ["历史文化遗迹", "博物馆和艺术馆", "传统工艺体验", "当地文化活动"];
        } else if (answers[5] === 'relaxation') {
            highlights = ["舒适的度假体验", "轻松的休闲活动", "放松身心的景点", "悠闲的城市漫步"];
        } else if (answers[5] === 'foodie') {
            highlights = ["当地特色美食", "美食市场和夜市", "烹饪课程体验", "知名餐厅品尝"];
        }
    }
    
    // 返回完整的旅行攻略对象
                            return {
        destination: destination,
        title: `${destination}${duration}天完美之旅`,
        overview: overview,
        highlights: highlights,
        duration: String(duration),
        dailyPlan: dailyPlan,
        food: "根据您的偏好，我们推荐品尝当地特色美食，包括传统小吃、季节性菜肴和知名餐厅。",
        transportation: "公共交通、步行和短途出租车相结合，方便且经济实惠。",
        accommodation: "位置便利的舒适酒店或特色民宿，提供良好的休息环境。",
        culture: `体验${destination}丰富的文化传统，包括历史遗迹、艺术表演和节庆活动。`,
        notes: "此旅行攻略根据您的偏好量身定制，可以根据实际情况和个人兴趣进行调整。"
    };
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
    // 输入验证
    if (!travelGuideData || !travelGuideData.destination) {
        console.error('无效的旅行攻略数据');
        return;
    }
    
    // 如果未提供title或notes，使用默认值或从travelGuideData提取
    const guideTitle = title || travelGuideData.title || `${travelGuideData.destination}之旅`;
    const guideNotes = notes || travelGuideData.notes || "";
    
    // 获取现有攻略或初始化空数组
    let savedGuides = JSON.parse(localStorage.getItem('savedGuides')) || [];
    
    // 添加新攻略，带有唯一ID、当前日期和用户输入的标题与备注
    const newGuide = {
        id: Date.now(), // 使用时间戳作为唯一ID
        createdAt: new Date().toISOString(),
        title: guideTitle,
        notes: guideNotes,
        ...travelGuideData
    };
    
    // 添加到数组开头（最新的优先）
    savedGuides.unshift(newGuide);
    
    // 保存回localStorage
    localStorage.setItem('savedGuides', JSON.stringify(savedGuides));
    
    console.log('旅行攻略已保存:', newGuide);
    
    // 显示保存成功消息
    showSuccessSavedMessage();
    
    return newGuide.id;
}

// 将选项值转换为文本描述
function getTextForValue(questionId, value) {
    // 如果值是特定目的地标记，返回空字符串（将在prompt中单独处理）
    if (value === 'specific_destination') {
        return '用户已指定目的地';
    }
    
    // 将questionId转换为字符串以确保兼容性
    const qId = String(questionId);
    
    switch (qId) {
        // 旅行地点范围
        case '1':
            switch (value) {
                case 'domestic': return '国内';
                case 'asia': return '亚洲';
                case 'africa': return '非洲';
                case 'europe': return '欧洲';
                case 'america': return '美洲';
                case 'oceania': return '大洋洲';
                default: return '不限';
            }
        // 地理特征
        case '2':
            switch (value) {
                case 'beach': return '海滩';
                case 'mountain': return '山脉';
                case 'city': return '城市';
                case 'countryside': return '乡村';
                default: return '不限';
            }
        // 气候类型
        case '3':
            switch (value) {
                case 'tropical': return '热带';
                case 'temperate': return '温带';
                case 'cold': return '寒冷';
                case 'any': return '不限';
                default: return '不限';
            }
        // 城市规模
        case '4':
            switch (value) {
                case 'metropolis': return '大都市';
                case 'midsize': return '中等城市';
                case 'town': return '小镇';
                case 'rural': return '乡村地区';
                default: return '不限';
            }
        // 旅行风格
        case '5':
            switch (value) {
                case 'adventure': return '冒险体验';
                case 'cultural': return '文化探索';
                case 'relaxation': return '放松休闲';
                case 'foodie': return '美食之旅';
                default: return '不限';
            }
        // 旅行时长
        case '6':
            switch (value) {
                case 'weekend': return '周末短途 (2-3天)';
                case 'week': return '一周左右 (5-7天)';
                case 'twoweeks': return '两周左右 (10-14天)';
                case 'month': return '长期旅行 (30天以上)';
                default: return '不限';
            }
        // 预算水平
        case '7':
            switch (value) {
                case 'budget': return '经济实惠';
                case 'moderate': return '中等预算';
                case 'luxury': return '豪华体验';
                case 'unlimited': return '不限预算';
                default: return '不限';
            }
        // 旅伴
        case '8':
            switch (value) {
                case 'solo': return '独自旅行';
                case 'couple': return '情侣出游';
                case 'friends': return '朋友结伴';
                case 'family': return '家庭旅行';
                default: return '不限';
            }
        default: return '未指定';
    }
}

// 获取备用旅行攻略数据
function getFallbackTravelGuide() {
    console.log("使用备用旅行攻略函数，当前window.answers:", window.answers);
    
    // 检查是否有未确定目的地的请求
    const needsRecommendation = window.answers && (window.answers.isUncertainDestination || window.answers.needsDestinationRecommendation);
    
    // 创建函数本地副本，避免修改全局window.answers
    const currentAnswers = window.answers ? JSON.parse(JSON.stringify(window.answers)) : {};
    
    console.log("备用攻略使用的答案:", currentAnswers);
    console.log("- 地区选择:", currentAnswers[1]);
    console.log("- 旅行时长:", currentAnswers[6]);
    
    // 默认目的地设置
    let destination = "京都，日本";
    let overview = "京都是日本传统文化的中心，拥有众多寺庙、神社和历史遗迹。这座城市完美地融合了传统与现代，提供了丰富的文化体验、美食和自然风景。";
    
    // 根据用户选择的地区选择不同的备用目的地
    if (currentAnswers && currentAnswers[1]) {
        const region = currentAnswers[1];
        console.log("备用攻略: 根据用户选择的地区生成目的地, 地区=", region);
        
        if (region === 'domestic') {
            destination = "丽江，云南";
            overview = "丽江是中国云南省的一座历史文化名城，以其独特的纳西族文化和壮丽的自然风光而闻名。古城区是联合国教科文组织世界文化遗产，拥有保存完好的古建筑和水道系统。";
            console.log("设置目的地为国内: 丽江");
        } 
        else if (region === 'europe') {
            destination = "巴塞罗那，西班牙";
            overview = "巴塞罗那是西班牙加泰罗尼亚地区的首府，以其独特的建筑、艺术氛围和海滨风光而闻名。这座城市融合了现代与传统，高迪的建筑作品为城市增添了不可思议的魅力。";
            console.log("设置目的地为欧洲: 巴塞罗那");
        } 
        else if (region === 'america') {
            destination = "旧金山，美国";
            overview = "旧金山是美国加利福尼亚州的一座风景如画的城市，以其起伏的山丘、维多利亚式房屋、缆车和金门大桥而闻名。这座城市拥有丰富的文化多样性、创新精神和绝佳的美食体验。";
            console.log("设置目的地为美洲: 旧金山");
        } 
        else if (region === 'asia') {
            destination = "东京，日本";
            overview = "东京是日本的首都，也是一座融合了现代与传统的大都市。这里有繁华的商业区、历史悠久的寺庙神社、丰富多样的美食和独特的流行文化，为旅行者提供了丰富多彩的体验。";
            console.log("设置目的地为亚洲: 东京");
        }
        else if (region === 'africa') {
            destination = "开普敦，南非";
            overview = "开普敦是南非最具标志性的城市之一，以其令人惊叹的自然美景、丰富的文化遗产和多样化的美食而闻名。这里有标志性的桌山、美丽的海滩和丰富的野生动物保护区，提供了独特的非洲体验。";
            console.log("设置目的地为非洲: 开普敦");
        }
        else if (region === 'oceania') {
            destination = "悉尼，澳大利亚";
            overview = "悉尼是澳大利亚最大的城市，以其标志性的悉尼歌剧院、壮观的港口和美丽的海滩而闻名。这座城市提供了丰富的户外活动、多元文化的美食体验和独特的澳洲野生动物接触机会。";
            console.log("设置目的地为大洋洲: 悉尼");
        }
        else {
            console.log("未识别的地区选择:", region, "使用默认目的地: 京都");
        }
        
        if (currentAnswers.specifiedDestination) {
            destination = currentAnswers.specifiedDestination;
            overview = `${destination}是一个令人难忘的旅行目的地，我们为您定制了完美的旅行计划，让您充分体验当地的文化、美食和风景。`;
            console.log("用户指定了目的地:", destination);
        }
    } else {
        console.warn("备用攻略: 无法访问用户答案或地区选择，使用默认目的地");
    }
    
    // 根据用户选择的旅行时长决定行程天数
    let duration = 5; // 默认值
    if (currentAnswers && currentAnswers[6]) {
        const travelDuration = currentAnswers[6];
        console.log("备用攻略: 根据用户选择的旅行时长设置天数, 选择=", travelDuration);
        
        if (travelDuration === 'weekend') {
            duration = 2; // 周末改为2天，符合用户期望
            console.log("设置为周末短途2天");
        }
        else if (travelDuration === 'week') {
            duration = 5; // 约一周
            console.log("设置为一周5天");
        }
        else if (travelDuration === 'twoweeks') {
            duration = 10; // 约两周
            console.log("设置为两周10天");
        }
        else if (travelDuration === 'month') {
            duration = 14; // 长期旅行
            console.log("设置为长期旅行14天");
        }
        else {
            console.log("未识别的旅行时长选择:", travelDuration, "使用默认天数: 5");
        }
    } else {
        console.warn("备用攻略: 无法访问用户答案或旅行时长，使用默认天数");
    }
    
    console.log("备用攻略最终设定: 目的地:", destination, "行程天数:", duration);
    
    // 创建每日行程计划
    const dailyPlan = [];
    for (let i = 1; i <= duration; i++) {
        dailyPlan.push({
            day: i,
            activities: `第${i}天精彩行程`,
            location: destination,
            description: `第${i}天将在${destination}的精彩景点中度过，体验当地文化与风景。`,
            budget: "约¥500-800",
            // 添加早中晚行程
            morning: `早上参观${destination}的著名景点，体验早晨的宁静氛围。`,
            noon: `午餐品尝当地特色美食，然后参观博物馆或文化场所。`,
            evening: `晚上欣赏${destination}的夜景，享用美味晚餐，感受当地夜生活。`
        });
    }
    
    // 根据旅行风格调整亮点
    let highlights = [
        "当地特色体验",
        "著名景点游览",
        "特色美食品尝",
        "文化探索活动"
    ];
    
    if (currentAnswers && currentAnswers[5]) {
        if (currentAnswers[5] === 'adventure') {
            highlights = ["刺激的户外活动", "自然探险体验", "独特的冒险路线", "当地特色体验"];
        } else if (currentAnswers[5] === 'cultural') {
            highlights = ["历史文化遗迹", "博物馆和艺术馆", "传统工艺体验", "当地文化活动"];
        } else if (currentAnswers[5] === 'relaxation') {
            highlights = ["舒适的度假体验", "轻松的休闲活动", "放松身心的景点", "悠闲的城市漫步"];
        } else if (currentAnswers[5] === 'foodie') {
            highlights = ["当地特色美食", "美食市场和夜市", "烹饪课程体验", "知名餐厅品尝"];
        }
    }
    
    const result = {
        destination: destination,
        overview: overview,
        highlights: highlights,
        duration: String(duration),
        dailyPlan: dailyPlan,
        food: "当地特色美食，包括传统小吃、季节性菜肴和知名餐厅",
        transportation: "公共交通、出租车和步行相结合",
        accommodation: "根据个人预算选择酒店、民宿或青旅",
        culture: "体验当地文化活动和传统习俗",
        notes: "这是一个自动生成的备用旅行攻略，可根据实际情况进行调整"
    };
    
    console.log("备用攻略生成完成:", result.destination, "天数:", result.duration);
    return result;
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
        { id: 10, name: 'Los Angeles', region: 'North America' },
        { id: 11, name: 'Mumbai', region: 'Asia' },
        { id: 12, name: 'Moscow', region: 'Europe' },
        { id: 13, name: 'Cape Town', region: 'Africa' },
        { id: 14, name: 'Seoul', region: 'Asia' },
        { id: 15, name: 'São Paulo', region: 'South America' },
        { id: 16, name: 'Dubai', region: 'Asia' },
        { id: 17, name: 'Toronto', region: 'North America' },
        { id: 18, name: 'Shanghai', region: 'Asia' },
        { id: 19, name: 'McMurdo Station', region: 'Antarctica' }
    ];
    
    // 记录当前选择的目的地
    let currentDestination = null;
    
    // 初始化地图缩放和平移功能
    initMapZoom();
    
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
    
    // 初始化区域筛选功能
    initRegionFilter(destinations);
    
    console.log('=== Explore page 初始化完成 ===');
}

// 初始化地图缩放和平移功能
function initMapZoom() {
    const worldMap = document.querySelector('.world-map');
    const mapContainer = document.querySelector('.world-map-container');
    const zoomInBtn = document.querySelector('.map-zoom-in');
    const zoomOutBtn = document.querySelector('.map-zoom-out');
    const resetBtn = document.querySelector('.map-reset');
    
    if (!worldMap || !mapContainer || !zoomInBtn || !zoomOutBtn || !resetBtn) {
        console.error('Map zoom elements not found');
        return;
    }
    
    // 缩放状态变量
    let scale = 1;
    let translateX = 0;
    let translateY = 0;
    let isDragging = false;
    let startX, startY;
    let currentX, currentY;
    const maxScale = 3;
    const minScale = 0.8;
    const scaleStep = 0.2;
    
    // 缩放步长变量
    const zoomSpeeds = {
        0.8: 50,   // 缩小视图状态下，移动较大距离
        1: 40,     // 默认视图状态
        1.2: 35,
        1.4: 30,
        1.6: 25,
        1.8: 20,
        2: 15,
        2.2: 12,
        2.4: 10,
        2.6: 8,
        2.8: 6,
        3: 5      // 最大缩放状态下，移动很小距离
    };
    
    // 应用变换
    function applyTransform() {
        worldMap.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
    }
    
    // 放大按钮点击事件
    zoomInBtn.addEventListener('click', function() {
        if (scale < maxScale) {
            scale += scaleStep;
            applyTransform();
        }
    });
    
    // 缩小按钮点击事件
    zoomOutBtn.addEventListener('click', function() {
        if (scale > minScale) {
            scale -= scaleStep;
            translateX = translateX / (scale + scaleStep) * scale;
            translateY = translateY / (scale + scaleStep) * scale;
            applyTransform();
        }
    });
    
    // 重置按钮点击事件
    resetBtn.addEventListener('click', function() {
        scale = 1;
        translateX = 0;
        translateY = 0;
        applyTransform();
    });
    
    // 鼠标滚轮缩放事件
    worldMap.addEventListener('wheel', function(e) {
        e.preventDefault();
        
        // 计算鼠标在地图上的位置（相对于地图原点）
        const rect = worldMap.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left) / scale;
        const mouseY = (e.clientY - rect.top) / scale;
        
        // 降低滚轮缩放敏感度
        const wheelScaleStep = scaleStep * 0.5; // 滚轮缩放步长为按钮的一半
        
        // 根据滚轮方向确定缩放操作
        if (e.deltaY < 0 && scale < maxScale) {
            // 放大
            scale += wheelScaleStep;
        } else if (e.deltaY > 0 && scale > minScale) {
            // 缩小
            scale -= wheelScaleStep;
        } else {
            return; // 超出缩放范围，不执行
        }
        
        // 调整平移值，保持鼠标位置相对于地图内容的不变
        const newMouseX = (e.clientX - rect.left) / scale;
        const newMouseY = (e.clientY - rect.top) / scale;
        
        translateX += (newMouseX - mouseX) * scale;
        translateY += (newMouseY - mouseY) * scale;
        
        applyTransform();
    });
    
    // 添加拖动功能
    worldMap.addEventListener('mousedown', function(e) {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        currentX = translateX;
        currentY = translateY;
        worldMap.style.cursor = 'grabbing';
    });
    
    window.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        
        // 获取当前缩放级别的移动速度
        const moveSpeed = zoomSpeeds[scale.toFixed(1)] || zoomSpeeds[Math.round(scale)];
        
        // 计算移动距离，根据缩放等级调整移动速度
        const dx = (e.clientX - startX) / moveSpeed;
        const dy = (e.clientY - startY) / moveSpeed;
        
        translateX = currentX + dx;
        translateY = currentY + dy;
        
        applyTransform();
    });
    
    window.addEventListener('mouseup', function() {
        isDragging = false;
        worldMap.style.cursor = 'grab';
    });
    
    // 阻止默认的拖动行为
    worldMap.addEventListener('dragstart', function(e) {
        e.preventDefault();
    });
    
    // 初始设置grab光标
    worldMap.style.cursor = 'grab';
    
    // 添加触摸支持
    worldMap.addEventListener('touchstart', function(e) {
        if (e.touches.length === 1) {
            // 单指拖动
            isDragging = true;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            currentX = translateX;
            currentY = translateY;
        }
        // 阻止页面滚动
        e.preventDefault();
    });
    
    worldMap.addEventListener('touchmove', function(e) {
        if (isDragging && e.touches.length === 1) {
            // 获取当前缩放级别的移动速度
            const moveSpeed = zoomSpeeds[scale.toFixed(1)] || zoomSpeeds[Math.round(scale)];
            
            // 计算移动距离
            const dx = (e.touches[0].clientX - startX) / moveSpeed;
            const dy = (e.touches[0].clientY - startY) / moveSpeed;
            
            translateX = currentX + dx;
            translateY = currentY + dy;
            
            applyTransform();
        }
        // 阻止页面滚动
        e.preventDefault();
    });
    
    worldMap.addEventListener('touchend', function() {
        isDragging = false;
    });
}

// 初始化区域筛选功能
function initRegionFilter(destinations) {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const mapPoints = document.querySelectorAll('.map-point');
    
    // 创建ID到区域的映射
    const idToRegionMap = {};
    destinations.forEach(dest => {
        idToRegionMap[dest.id] = dest.region;
    });
    
    // 添加点击事件到过滤按钮
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // 移除所有按钮的active类
            filterButtons.forEach(b => b.classList.remove('active'));
            // 添加active类到当前按钮
            this.classList.add('active');
            
            const selectedRegion = this.dataset.region;
            
            // 根据选择的区域显示或隐藏地图点
            mapPoints.forEach(point => {
                const pointId = parseInt(point.dataset.id);
                const pointRegion = idToRegionMap[pointId];
                
                if (selectedRegion === 'all' || pointRegion === selectedRegion) {
                    point.style.display = 'block';
                } else {
                    point.style.display = 'none';
                }
            });
        });
    });
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
    
    // Get saved travel guides from localStorage
    let savedGuides = JSON.parse(localStorage.getItem('savedGuides')) || [];
    
    // Check if savedGuides is empty or not an array
    if (!Array.isArray(savedGuides) || savedGuides.length === 0) {
        console.log('No saved guides found or data corrupted. Initializing with default guides.');
        
        // Create default guides
        savedGuides = [
            {
                id: 1001,
                createdAt: new Date().toISOString(),
                title: "京都之旅",
                destination: "京都，日本",
                duration: "7天",
                season: "秋季",
                overview: "体验传统日本文化的完美之旅",
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
                ],
                notes: "这是一个自动创建的默认旅行计划"
            },
            {
                id: 1002,
                createdAt: new Date().toISOString(),
                title: "巴黎之旅",
                destination: "巴黎，法国",
                duration: "5天",
                season: "春季",
                overview: "浪漫之都的艺术与美食探索",
                highlights: [
                    "埃菲尔铁塔",
                    "卢浮宫",
                    "巴黎圣母院",
                    "蒙马特高地"
                ],
                dailyPlan: [
                    { day: 1, activity: "抵达并游览塞纳河", location: "市中心" },
                    { day: 2, activity: "艺术之旅", location: "卢浮宫" },
                    { day: 3, activity: "城市地标", location: "埃菲尔铁塔" },
                    { day: 4, activity: "历史探索", location: "巴黎圣母院" },
                    { day: 5, activity: "购物与离开", location: "香榭丽舍大街" }
                ],
                notes: "这是一个自动创建的默认旅行计划"
            }
        ];
        
        // Save to localStorage
        localStorage.setItem('savedGuides', JSON.stringify(savedGuides));
    }
    
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
            id: parseInt(guide.id),
            destination: guide.title || destination, // 使用自定义标题或默认目的地
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
            tasks: [
                { id: parseInt(guide.id) + 1, text: 'Book flight', completed: false },
                { id: parseInt(guide.id) + 2, text: 'Reserve accommodation', completed: false },
                { id: parseInt(guide.id) + 3, text: 'Plan daily activities', completed: true },
                { id: parseInt(guide.id) + 4, text: 'Pack luggage', completed: false }
            ],
            // Store the full guide data for viewing details
            guideData: guide
        });
    });
    
    // Always add demo plans if we don't have enough plans yet 
    // (will only show if there are no savedGuides)
    if (upcomingPlans.length < 3) {
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
    }
    
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
        
        // Check if we have any plans
        if (upcomingPlans.length === 0) {
            // Display empty state
            plansContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">✈️</div>
                    <h3>暂无旅行计划</h3>
                    <p>通过问卷生成或从探索界面收藏的攻略将显示在这里</p>
                </div>
            `;
            // Clear plan details
            clearPlanDetails();
            return;
        }
        
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
            // No plans to display for this page
            plansContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">✈️</div>
                    <h3>当前页无旅行计划</h3>
                    <p>请尝试前往其他页面查看更多旅行计划</p>
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

// Display travel guide details in the modal
function showTravelGuideDetails(guideData) {
    // 首先检查旅行攻略数据是否有效
    if (!guideData || !guideData.destination) {
        console.error('无效的旅行攻略数据:', guideData);
        alert('无法显示旅行攻略，数据无效');
        return;
    }
    
    console.log("显示旅行攻略详情:", guideData);
    console.log("- 目的地:", guideData.destination);
    console.log("- 天数:", guideData.duration);
    
    const modal = document.querySelector('.travel-guide-modal');
    const overlay = document.querySelector('.travel-guide-overlay');
    const container = document.querySelector('.travel-guide-container');
    const title = document.querySelector('.travel-guide-title');
    const closeBtn = document.querySelector('.travel-guide-close');
    
    // 如果元素不存在，无法显示
    if (!modal || !container) {
        console.error('Travel guide modal elements not found');
        console.log('Modal found:', !!modal);
        console.log('Container found:', !!container);
        console.log('Overlay found:', !!overlay);
        alert('旅行攻略模态框未找到，请刷新页面重试');
        return;
    }
    
    // 清空容器，确保没有旧内容
    container.innerHTML = '';
    
    // 设置标题
    if (title) {
        title.textContent = guideData.title || `${guideData.destination}旅行指南`;
    }
    
    let guideHTML = '';
    
    // 创建旅游指南标题和目的地信息
            guideHTML += `
        <div class="travel-guide-journal">
            <div class="guide-header">
                <h2 class="guide-title">${guideData.title || `${guideData.destination}旅行指南`}</h2>
                <h3 class="guide-destination">${guideData.destination}</h3>
            </div>
            
            <div class="guide-section guide-overview">
                <div class="overview-text">
                    <p>${guideData.overview}</p>
                </div>
            </div>
            
            <div class="guide-section guide-highlights">
                <h4 class="subtle-highlight-heading">旅行亮点</h4>
                <ul class="highlights-list">
    `;
    
    // 添加亮点列表
    if (guideData.highlights && guideData.highlights.length > 0) {
        guideData.highlights.forEach(highlight => {
            guideHTML += `<li>${highlight}</li>`;
        });
    } else {
        // 默认亮点
        guideHTML += `
            <li>探索当地文化</li>
            <li>品尝特色美食</li>
            <li>游览自然景观</li>
        `;
    }
    
        guideHTML += `
                </ul>
            </div>
            
            <div class="guide-section guide-daily-plan">
                <h4>行程安排 (${guideData.duration || guideData.dailyPlan.length}天)</h4>
                <div class="guide-daily-plan-container">
        `;
        
    // 每日行程卡片
    if (guideData.dailyPlan && guideData.dailyPlan.length > 0) {
        guideData.dailyPlan.forEach(day => {
            // 根据活动类型选择图标
            let activityIcon = "🧭";
            
            // Day activity icons mapping
        const dayActivityIcons = {
            "博物馆": "🏛️",
                "城市": "🏙️",
                "历史": "🏺",
            "海滩": "🏖️",
                "游览": "🚶",
                "公园": "🌳",
                "餐厅": "🍽️",
            "购物": "🛍️",
                "山": "⛰️",
                "湖": "🏞️",
                "徒步": "🥾",
                "行程": "📝",
                "旅行": "✈️",
                "活动": "🎯",
                "景点": "🏛️",
                "探索": "🔍",
                "出发": "🚀",
                "休息": "☕"
            };
            
            for (const [key, icon] of Object.entries(dayActivityIcons)) {
                if (day.activities && day.activities.includes(key)) {
                    activityIcon = icon;
                    break;
                }
            }
            
            // 高级天气标签 - 根据活动推测天气
            let weatherTag = "";
            if (day.activities && (day.activities.includes("海滩") || day.activities.includes("游泳"))) {
                weatherTag = `<span class="weather-tag">☀️ 晴天</span>`;
            } else if (day.activities && (day.activities.includes("博物馆") || day.activities.includes("室内"))) {
                weatherTag = `<span class="weather-tag">🏙️ 休闲</span>`;
            } else if (day.activities && (day.activities.includes("公园") || day.activities.includes("远足"))) {
                weatherTag = `<span class="weather-tag">🌤️ 舒适</span>`;
            }
            
            // 检查是否有分时段的行程安排
            const hasDayParts = day.morning || day.noon || day.evening;
            let dayActivitiesHTML = '';
            
            if (hasDayParts) {
                // 分时段显示行程
                dayActivitiesHTML = `
                    <div class="day-activities-timeline">
                        ${day.morning ? `
                        <div class="timeline-item">
                            <div class="timeline-time">🌅 早上</div>
                            <div class="timeline-content">${formatTravelText(day.morning)}</div>
                        </div>` : ''}
                        
                        ${day.noon ? `
                        <div class="timeline-item">
                            <div class="timeline-time">☀️ 中午</div>
                            <div class="timeline-content">${formatTravelText(day.noon)}</div>
                        </div>` : ''}
                        
                        ${day.evening ? `
                        <div class="timeline-item">
                            <div class="timeline-time">🌃 晚上</div>
                            <div class="timeline-content">${formatTravelText(day.evening)}</div>
                        </div>` : ''}
                    </div>
                `;
            } else if (day.description) {
                // 只显示描述
                dayActivitiesHTML = `<p class="day-description">${formatTravelText(day.description)}</p>`;
            }
            
            // 确保activities属性存在
            const activities = day.activities || `第${day.day}天行程`;
            
            guideHTML += `
                <div class="guide-day-card">
                    <div class="guide-day-number">Day ${day.day}</div>
                    <div class="guide-day-details">
                        <h5><span class="activity-icon">${activityIcon}</span> ${activities}</h5>
                        <p class="day-location">${day.location || guideData.destination}</p>
                        ${dayActivitiesHTML}
                        ${weatherTag}
                        ${day.budget ? `<p class="day-budget"><strong>预算：</strong>${day.budget}</p>` : ''}
                    </div>
                </div>
            `;
        });
    } else {
        // 默认显示，防止没有日程安排
        guideHTML += `
            <div class="guide-day-card">
                <div class="guide-day-number">Day 1</div>
                <div class="guide-day-details">
                    <h5><span class="activity-icon">🧭</span> 探索之旅</h5>
                    <p class="day-location">${guideData.destination}</p>
                    <p class="day-description">根据您的旅行偏好，探索${guideData.destination}的精彩景点和体验。</p>
                </div>
            </div>
        `;
    }
        
    // 处理并格式化旅行信息
    const formattedFood = formatTravelInfoSection(guideData.food);
    const formattedTransportation = formatTravelInfoSection(guideData.transportation);
    const formattedAccommodation = formatTravelInfoSection(guideData.accommodation);
    const formattedCulture = formatTravelInfoSection(guideData.culture);
        
        // 其他信息部分 - 添加更好的分类和图标
        guideHTML += `
                </div>
            </div>
            <div class="guide-section guide-notes">
                <h4 class="travel-info-title">旅行信息</h4>
                <div class="travel-info-grid">
                    <div class="travel-info-item">
                        <div class="info-icon">🍽️</div>
                        <div class="info-content">
                            <h5>美食推荐</h5>
                            <div class="formatted-travel-info">${formattedFood}</div>
                        </div>
                    </div>
                    <div class="travel-info-item">
                        <div class="info-icon">🚆</div>
                        <div class="info-content">
                            <h5>交通方式</h5>
                            <div class="formatted-travel-info">${formattedTransportation}</div>
                        </div>
                    </div>
                    <div class="travel-info-item">
                        <div class="info-icon">🏨</div>
                        <div class="info-content">
                            <h5>住宿建议</h5>
                            <div class="formatted-travel-info">${formattedAccommodation}</div>
                        </div>
                    </div>
                    <div class="travel-info-item">
                        <div class="info-icon">🏮</div>
                        <div class="info-content">
                            <h5>文化体验</h5>
                            <div class="formatted-travel-info">${formattedCulture}</div>
                        </div>
                </div>
            </div>
            </div>
            
            <div class="guide-section guide-actions">
                <div class="guide-action-buttons">
                    <button class="guide-btn save-guide-btn">保存攻略</button>
                    <button class="guide-btn export-image-btn">导出图片</button>
                </div>
            </div>
            </div>
        `;
        
    // 将内容添加到容器
        container.innerHTML = guideHTML;
        
    // 添加横向滚动提示
    const dailyPlanSection = container.querySelector('.guide-daily-plan');
    if (dailyPlanSection && guideData.dailyPlan && guideData.dailyPlan.length > 3) {
        const scrollIndicator = document.createElement('div');
        scrollIndicator.className = 'day-scroll-indicator';
        scrollIndicator.innerText = '滑动查看更多';
        dailyPlanSection.appendChild(scrollIndicator);
    }
        
    // 添加事件监听器
    const saveButton = container.querySelector('.save-guide-btn');
        if (saveButton) {
            saveButton.addEventListener('click', function() {
            saveTravelGuide(guideData);
        });
    }
    
    const exportButton = container.querySelector('.export-image-btn');
    if (exportButton) {
        exportButton.addEventListener('click', function() {
                generateTravelGuideImage();
            });
        }
        
    // 添加关闭按钮事件
    if (closeBtn) {
        closeBtn.addEventListener('click', closeTravelGuideModal);
    }
    
    // 添加遮罩点击事件
    if (overlay) {
        overlay.addEventListener('click', closeTravelGuideModal);
    }
    
    // 显示模态框
    if (modal) {
        console.log("显示旅行攻略模态框");
        modal.style.display = 'block';
        // 添加active类以触发CSS过渡动画
        setTimeout(() => {
        modal.classList.add('active');
        }, 10);
    }
    
    if (overlay) {
        overlay.style.display = 'block';
        setTimeout(() => {
        overlay.classList.add('active');
        }, 10);
    }
}

// 格式化旅行信息文本，添加适当的换行和分隔
function formatTravelText(text) {
    if (!text) return '';
    
    // 替换可能的分隔符为HTML
    return text
        .replace(/、/g, '、<br>')
        .replace(/；/g, '；<br>')
        .replace(/，(?=[^，]*景点)/g, '，<br>')
        .replace(/，(?=[^，]*餐厅)/g, '，<br>')
        .replace(/，(?=[^，]*酒店)/g, '，<br>')
        .replace(/，(?=[^，]*体验)/g, '，<br>');
}

// 将旅行信息部分格式化为更易读的结构，并限制为4-5个推荐项
function formatTravelInfoSection(text) {
    if (!text) return '暂无信息';
    
    // 如果文本包含分隔符
    if (text.includes('、') || text.includes('；') || text.includes('，')) {
        // 将文本拆分为项目列表
        let items = text
            .split(/[、；，]/)
            .filter(item => item.trim().length > 0)
            .map(item => item.trim());
            
        // 限制项目数量为5个
        if (items.length > 5) {
            items = items.slice(0, 5);
        }
            
        if (items.length > 1) {
            return items.map(item => `<p>${item}</p>`).join('');
        }
    }
    
    // 如果文本包含冒号，可能是多个描述
    if (text.includes('：') || text.includes(':')) {
        const sections = text.split(/[：:]/);
        if (sections.length > 1) {
            let result = '';
            let count = 0;
            
            for (let i = 0; i < sections.length; i += 2) {
                if (i + 1 < sections.length && count < 5) {
                    result += `<p><strong>${sections[i].trim()}</strong>：${sections[i+1].trim()}</p>`;
                    count++;
                } else if (count < 5) {
                    result += `<p>${sections[i].trim()}</p>`;
                    count++;
                } else {
                    break;
                }
            }
            return result;
        }
    }
    
    // 如果是普通长文本，按句子分段并限制
    if (text.length > 50) {
        let sentences = text
            .split(/(?<=。|！|\!|？|\?)/)
            .filter(sentence => sentence.trim().length > 0);
            
        // 限制句子数量为5个
        if (sentences.length > 5) {
            sentences = sentences.slice(0, 5);
        }
        
        return sentences
            .map(sentence => `<p>${sentence.trim()}</p>`)
            .join('');
    }
    
    // 默认返回原始文本
    return `<p>${text}</p>`;
}

// Close travel guide modal
function closeTravelGuideModal() {
    console.log("关闭旅行攻略模态框");
    const modal = document.querySelector('.travel-guide-modal');
    const overlay = document.querySelector('.travel-guide-overlay');
    
    if (modal) {
        // 移除active类以触发过渡动画
        modal.classList.remove('active');
        // 等待动画完成后隐藏
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
    
        if (overlay) {
        overlay.classList.remove('active');
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 300);
    }
}

// 生成旅行攻略图片
function generateTravelGuideImage() {
    console.log('正在生成旅行攻略图片...');
    
    // 显示加载消息
    showMessage('正在生成攻略图片，请稍候...');
    
    // 获取要截图的元素 - 直接使用旅行攻略内容元素，而不是容器
    const guideJournal = document.querySelector('.travel-guide-journal');
    const guideContainer = document.querySelector('.travel-guide-container');
    
    if (!guideJournal || !guideContainer) {
        console.error('找不到旅行攻略内容元素');
        showMessage('生成图片失败，请重试');
        return;
    }
    
    // 检测设备类型（移动设备或桌面设备）
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // 暂时隐藏按钮，以免它们出现在截图中
    const saveButtonContainer = guideJournal.querySelector('.guide-action-buttons');
    let originalButtonDisplay = 'flex';
    
    if (saveButtonContainer) {
        originalButtonDisplay = saveButtonContainer.style.display;
        saveButtonContainer.style.display = 'none';
    }
    
    // 记录旅行攻略容器的原始样式
    const originalContainerStyle = {
        maxHeight: guideContainer.style.maxHeight,
        overflow: guideContainer.style.overflow,
        overflowY: guideContainer.style.overflowY,
        padding: guideContainer.style.padding
    };
    
    // 记录旅行攻略日志的原始样式
    const originalJournalStyle = {
        maxHeight: guideJournal.style.maxHeight,
        overflow: guideJournal.style.overflow,
        overflowY: guideJournal.style.overflowY,
        position: guideJournal.style.position,
        width: guideJournal.style.width,
        height: guideJournal.style.height,
        padding: guideJournal.style.padding,
        boxSizing: guideJournal.style.boxSizing,
        backgroundColor: guideJournal.style.backgroundColor
    };
    
    // 修改容器样式以确保可以捕获完整内容
    guideContainer.style.maxHeight = 'none';
    guideContainer.style.overflow = 'visible';
    guideContainer.style.overflowY = 'visible';
    guideContainer.style.padding = '20px';
    
    // 修改旅行攻略日志样式以确保可以捕获完整内容
    guideJournal.style.maxHeight = 'none';
    guideJournal.style.overflow = 'visible';
    guideJournal.style.overflowY = 'visible';
    guideJournal.style.position = 'relative';
    guideJournal.style.width = '100%';
    guideJournal.style.height = 'auto';
    guideJournal.style.padding = '30px';
    guideJournal.style.boxSizing = 'border-box';
    guideJournal.style.backgroundColor = '#f8f5e9';
    
    // 添加装饰边框
    const decorativeBorder = document.createElement('div');
    decorativeBorder.classList.add('guide-image-border');
    decorativeBorder.style.position = 'absolute';
    decorativeBorder.style.top = '0';
    decorativeBorder.style.left = '0';
    decorativeBorder.style.width = '100%';
    decorativeBorder.style.height = '100%';
    decorativeBorder.style.border = '15px solid #f0e6d2';
    decorativeBorder.style.boxSizing = 'border-box';
    decorativeBorder.style.pointerEvents = 'none';
    decorativeBorder.style.zIndex = '1000';
    decorativeBorder.style.borderImage = 'linear-gradient(45deg, #f8d56b, #c99f4a, #f8d56b, #c99f4a) 1';
    guideJournal.appendChild(decorativeBorder);
    
    // 添加水印和标志
    const watermark = document.createElement('div');
    watermark.classList.add('guide-watermark');
    watermark.innerHTML = '<div style="display: flex; align-items: center; gap: 10px;"><span style="font-size: 30px;">✈️</span> DeepTrip - 您的专属旅行规划师</div>';
    watermark.style.position = 'absolute';
    watermark.style.bottom = '20px';
    watermark.style.right = '30px';
    watermark.style.fontFamily = 'Brush Script MT, cursive';
    watermark.style.color = 'rgba(0, 0, 0, 0.15)';
    watermark.style.fontSize = '20px';
    watermark.style.transform = 'rotate(-5deg)';
    watermark.style.zIndex = '1001';
    watermark.style.pointerEvents = 'none';
    watermark.style.whiteSpace = 'nowrap';
    guideJournal.appendChild(watermark);
    
    // 添加QR码装饰元素（如果有需要可以替换为实际的QR码）
    const qrCode = document.createElement('div');
    qrCode.classList.add('guide-qr-code');
    qrCode.style.position = 'absolute';
    qrCode.style.bottom = '20px';
    qrCode.style.left = '30px';
    qrCode.style.width = '60px';
    qrCode.style.height = '60px';
    qrCode.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
    qrCode.style.backgroundImage = 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect width=\'20\' height=\'20\' x=\'5\' y=\'5\' fill=\'%23333\'/%3E%3Crect width=\'20\' height=\'20\' x=\'35\' y=\'5\' fill=\'%23333\'/%3E%3Crect width=\'20\' height=\'20\' x=\'5\' y=\'35\' fill=\'%23333\'/%3E%3Crect width=\'10\' height=\'10\' x=\'10\' y=\'10\' fill=\'white\'/%3E%3Crect width=\'10\' height=\'10\' x=\'40\' y=\'10\' fill=\'white\'/%3E%3Crect width=\'10\' height=\'10\' x=\'10\' y=\'40\' fill=\'white\'/%3E%3C/svg%3E")';
    qrCode.style.backgroundSize = 'contain';
    qrCode.style.zIndex = '1001';
    qrCode.style.opacity = '0.7';
    qrCode.style.pointerEvents = 'none';
    guideJournal.appendChild(qrCode);
    
    // 修复横向滚动区域，确保所有卡片都显示
    const dayPlanContainer = guideJournal.querySelector('.guide-daily-plan-container');
    let originalDayPlanStyle = null;
    if (dayPlanContainer) {
        originalDayPlanStyle = {
            display: dayPlanContainer.style.display,
            flexWrap: dayPlanContainer.style.flexWrap,
            overflowX: dayPlanContainer.style.overflowX,
            scrollSnapType: dayPlanContainer.style.scrollSnapType
        };
        
        // 修改为网格布局，确保所有卡片在图片中可见
        dayPlanContainer.style.display = 'grid';
        dayPlanContainer.style.gridTemplateColumns = 'repeat(auto-fit, minmax(280px, 1fr))';
        dayPlanContainer.style.gap = '20px';
        dayPlanContainer.style.overflowX = 'visible';
        dayPlanContainer.style.scrollSnapType = 'none';
    }
    
    // 确保旅行信息网格显示所有内容
    const travelInfoGrid = guideJournal.querySelector('.travel-info-grid');
    let originalInfoGridStyle = null;
    if (travelInfoGrid) {
        originalInfoGridStyle = {
            display: travelInfoGrid.style.display,
            maxHeight: travelInfoGrid.style.maxHeight,
            overflowY: travelInfoGrid.style.overflowY
        };
        
        travelInfoGrid.style.display = 'grid';
        travelInfoGrid.style.maxHeight = 'none';
        travelInfoGrid.style.overflowY = 'visible';
    }
    
    // 使用html2canvas生成截图，目标是旅行攻略日志而不是容器
    html2canvas(guideJournal, {
        scale: 2, // 提高分辨率
        useCORS: true, // 允许加载跨域图片
        backgroundColor: '#f8f5e9', // 背景色
        logging: false, // 关闭日志
        allowTaint: true, // 允许污染画布
        letterRendering: true, // 提高文字渲染质量
        scrollX: 0,
        scrollY: 0,
        width: guideJournal.offsetWidth,
        height: guideJournal.scrollHeight, // 捕获完整高度
        windowWidth: document.documentElement.offsetWidth,
        windowHeight: document.documentElement.offsetHeight,
        onclone: function(clonedDoc) {
            // 对克隆的文档进行额外处理，确保所有内容都可见
            const clonedJournal = clonedDoc.querySelector('.travel-guide-journal');
            if (clonedJournal) {
                clonedJournal.style.maxHeight = 'none';
                clonedJournal.style.height = 'auto';
                
                // 确保所有子元素都可见
                const sections = clonedJournal.querySelectorAll('.guide-section');
                sections.forEach(section => {
                    section.style.maxHeight = 'none';
                    section.style.overflow = 'visible';
                });
            }
        }
    }).then(canvas => {
        // 恢复按钮显示
        if (saveButtonContainer) {
            saveButtonContainer.style.display = originalButtonDisplay;
        }
        
        // 恢复容器原始样式
        Object.assign(guideContainer.style, originalContainerStyle);
        
        // 恢复日志原始样式
        Object.assign(guideJournal.style, originalJournalStyle);
        
        // 恢复日程安排容器样式
        if (dayPlanContainer && originalDayPlanStyle) {
            Object.assign(dayPlanContainer.style, originalDayPlanStyle);
        }
        
        // 恢复旅行信息网格样式
        if (travelInfoGrid && originalInfoGridStyle) {
            Object.assign(travelInfoGrid.style, originalInfoGridStyle);
        }
        
        // 移除添加的装饰元素
        if (guideJournal.contains(decorativeBorder)) {
            guideJournal.removeChild(decorativeBorder);
        }
        if (guideJournal.contains(watermark)) {
            guideJournal.removeChild(watermark);
        }
        if (guideJournal.contains(qrCode)) {
            guideJournal.removeChild(qrCode);
        }
        
        // 将canvas转换为URL
        const imageUrl = canvas.toDataURL('image/png');
        
        // 获取旅行指南标题作为文件名
        let fileName = '我的旅行攻略';
        const titleElement = document.querySelector('.guide-title');
        if (titleElement && titleElement.textContent) {
            fileName = titleElement.textContent.replace(/[^\w\s\u4e00-\u9fa5]/g, '').trim() || fileName;
        }
        
        if (isMobile) {
            // 移动设备特殊处理
            // 创建一个图像预览模态窗口
            let mobilePreviewModal = document.getElementById('mobile-image-preview-modal');
            
            // 如果模态窗口不存在，则创建一个
            if (!mobilePreviewModal) {
                mobilePreviewModal = document.createElement('div');
                mobilePreviewModal.id = 'mobile-image-preview-modal';
                mobilePreviewModal.style.position = 'fixed';
                mobilePreviewModal.style.top = '0';
                mobilePreviewModal.style.left = '0';
                mobilePreviewModal.style.width = '100%';
                mobilePreviewModal.style.height = '100%';
                mobilePreviewModal.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
                mobilePreviewModal.style.zIndex = '9999';
                mobilePreviewModal.style.display = 'flex';
                mobilePreviewModal.style.flexDirection = 'column';
                mobilePreviewModal.style.alignItems = 'center';
                mobilePreviewModal.style.justifyContent = 'center';
                mobilePreviewModal.style.padding = '20px';
                mobilePreviewModal.style.boxSizing = 'border-box';
                mobilePreviewModal.style.overflow = 'auto';
                
                document.body.appendChild(mobilePreviewModal);
            } else {
                mobilePreviewModal.innerHTML = '';
                mobilePreviewModal.style.display = 'flex';
            }
            
            // 创建图片元素
            const previewImage = document.createElement('img');
            previewImage.src = imageUrl;
            previewImage.style.maxWidth = '100%';
            previewImage.style.maxHeight = '80%';
            previewImage.style.objectFit = 'contain';
            previewImage.style.borderRadius = '8px';
            previewImage.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
            mobilePreviewModal.appendChild(previewImage);
            
            // 创建操作按钮容器
            const buttonContainer = document.createElement('div');
            buttonContainer.style.display = 'flex';
            buttonContainer.style.justifyContent = 'center';
            buttonContainer.style.marginTop = '20px';
            buttonContainer.style.gap = '15px';
            buttonContainer.style.width = '100%';
            mobilePreviewModal.appendChild(buttonContainer);
            
            // 添加保存按钮
            const saveButton = document.createElement('button');
            saveButton.innerText = '保存图片';
            saveButton.style.padding = '12px 20px';
            saveButton.style.backgroundColor = '#3468c0';
            saveButton.style.color = 'white';
            saveButton.style.border = 'none';
            saveButton.style.borderRadius = '30px';
            saveButton.style.fontSize = '16px';
            saveButton.style.fontWeight = 'bold';
            saveButton.style.cursor = 'pointer';
            saveButton.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
            
            // 创建关闭按钮
            const closeButton = document.createElement('button');
            closeButton.innerText = '关闭';
            closeButton.style.padding = '12px 20px';
            closeButton.style.backgroundColor = '#888';
            closeButton.style.color = 'white';
            closeButton.style.border = 'none';
            closeButton.style.borderRadius = '30px';
            closeButton.style.fontSize = '16px';
            closeButton.style.fontWeight = 'bold';
            closeButton.style.cursor = 'pointer';
            closeButton.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
            
            // 添加按钮到容器
            buttonContainer.appendChild(saveButton);
            buttonContainer.appendChild(closeButton);
            
            // 添加关闭按钮事件
            closeButton.addEventListener('click', function() {
                mobilePreviewModal.style.display = 'none';
            });
            
            // 添加保存按钮事件
            saveButton.addEventListener('click', function() {
                // 向用户显示保存指南
                const instructions = document.createElement('div');
                instructions.innerHTML = `
                    <div style="background-color: rgba(255,255,255,0.9); padding: 20px; border-radius: 10px; margin-top: 20px; color: #333; text-align: left;">
                        <h3 style="margin-top: 0;">如何保存图片:</h3>
                        <ul style="padding-left: 20px; margin-bottom: 10px;">
                            <li>长按图片 → 选择"保存图片"或"添加到照片"</li>
                            <li>或截屏保存此页面</li>
                        </ul>
                        <p style="margin-bottom: 0; font-style: italic;">提示: 保存后请关闭此窗口</p>
                    </div>
                `;
                
                // 如果指南已存在，则替换它
                if (mobilePreviewModal.querySelector('.instructions')) {
                    mobilePreviewModal.replaceChild(instructions, mobilePreviewModal.querySelector('.instructions'));
                } else {
                    instructions.className = 'instructions';
                    mobilePreviewModal.appendChild(instructions);
                }
                
                // 修改按钮文本
                saveButton.innerText = '已准备好保存';
                saveButton.style.backgroundColor = '#4CAF50';
            });
            
            // 显示成功消息
            showMessage('攻略图片已生成，请长按图片保存');
        } else {
            // 桌面设备 - 使用常规下载方法
        const downloadLink = document.createElement('a');
        downloadLink.href = imageUrl;
        downloadLink.download = `${fileName}.png`;
        
        // 添加到DOM，点击，然后移除
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        // 显示成功消息
        showMessage('攻略图片已生成，正在下载...');
        }
    }).catch(error => {
        console.error('生成攻略图片时出错:', error);
        showMessage('生成图片失败，请重试');
        
        // 恢复按钮显示
        if (saveButtonContainer) {
            saveButtonContainer.style.display = originalButtonDisplay;
        }
        
        // 恢复容器原始样式
        Object.assign(guideContainer.style, originalContainerStyle);
        
        // 恢复日志原始样式
        Object.assign(guideJournal.style, originalJournalStyle);
        
        // 恢复日程安排容器样式
        if (dayPlanContainer && originalDayPlanStyle) {
            Object.assign(dayPlanContainer.style, originalDayPlanStyle);
        }
        
        // 恢复旅行信息网格样式
        if (travelInfoGrid && originalInfoGridStyle) {
            Object.assign(travelInfoGrid.style, originalInfoGridStyle);
        }
        
        // 移除添加的装饰元素
        if (guideJournal.contains(decorativeBorder)) {
            guideJournal.removeChild(decorativeBorder);
        }
        if (guideJournal.contains(watermark)) {
            guideJournal.removeChild(watermark);
        }
        if (guideJournal.contains(qrCode)) {
            guideJournal.removeChild(qrCode);
        }
    });
}

// 根据季节推测气候
function getClimateFromSeason(season) {
    if (!season) return "四季宜人";
    
    if (season.includes("夏") || season.includes("summer")) {
        return "夏季炎热";
    } else if (season.includes("冬") || season.includes("winter")) {
        return "冬季寒冷";
    } else if (season.includes("春") || season.includes("spring")) {
        return "春季温暖";
    } else if (season.includes("秋") || season.includes("fall") || season.includes("autumn")) {
        return "秋季凉爽";
    }
    
    return "四季宜人";
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
    
    // 添加内联样式到body - 使背景颜色更亮一些
    document.body.style.backgroundColor = 'rgb(40, 50, 70)';
    
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
    // 进一步减少星星数量
    const starCount = Math.min(20, Math.floor((window.innerWidth * window.innerHeight) / 20000));
    
    console.log('Initializing star background with', starCount, 'stars');
    
    // 创建不同大小的星星类型，整体更小更暗
    const starTypes = [
        { minRadius: 0.1, maxRadius: 0.2, count: Math.floor(starCount * 0.7), alpha: 0.15 }, // 小星星
        { minRadius: 0.2, maxRadius: 0.3, count: Math.floor(starCount * 0.25), alpha: 0.2 }, // 中等星星
        { minRadius: 0.3, maxRadius: 0.5, count: Math.floor(starCount * 0.05), alpha: 0.3 }  // 大星星
    ];
    
    // 预先计算一些属性来减少每帧的计算量
    let lastFrameTime = 0;
    let targetFPS = 30; // 使用let而不是const，使其可变
    let frameThreshold = 1000 / targetFPS;
    let meteorTimer = 0;
    const meteorInterval = 30000; // 大幅减少流星频率，每30秒一颗流星
    
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
                    alpha: Math.random() * 0.2 + type.alpha, // 降低整体亮度
                    delta: (Math.random() * 0.003 + 0.001) * (Math.random() > 0.5 ? 1 : -1), // 减缓闪烁速度
                    twinkleSpeed: Math.random() * 0.008 + 0.003
                });
            }
        });
        
        // 绘制静态背景
        drawStaticBackground();
    }
    
    // 创建一个性能优化的背景层，使用更亮的背景使星星不太显眼
    function drawStaticBackground() {
        // 绘制背景渐变
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, 'rgb(50, 92, 218)');
        gradient.addColorStop(1, 'rgb(45, 55, 75)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
    }
    
    function createMeteor() {
        // 流星总数限制，防止性能问题
        if (meteors.length >= 1) return; // 最多只有1颗流星同时出现
        
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
            length: Math.random() * 20 + 15, // 更短的流星轨迹
            speed: Math.random() * 2 + 1.5, // 降低速度
            angle: angle,
            alpha: 0.3, // 大幅降低透明度
            width: Math.random() * 0.5 + 0.2 // 更细的流星
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
            
            if (star.alpha <= 0.05 || star.alpha >= 0.4) { // 限制最高亮度
                star.delta *= -1;
            }
            
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, 2 * Math.PI);
            
            // 只为大星星添加非常微弱的光晕效果
            if (star.radius > 0.4) {
                const glow = ctx.createRadialGradient(
                    star.x, star.y, 0,
                    star.x, star.y, star.radius * 1.3
                );
                glow.addColorStop(0, `rgba(255, 255, 255, ${star.alpha * 0.05})`);
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
            
            // 更简单的流星渐变
            const grad = ctx.createLinearGradient(0, 0, -m.length, 0);
            grad.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
            grad.addColorStop(0.2, 'rgba(200, 220, 255, 0.15)');
            grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            ctx.strokeStyle = grad;
            ctx.lineWidth = m.width;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(-m.length, 0);
            ctx.stroke();
            
            // 流星头部添加亮点
            ctx.beginPath();
            ctx.arc(0, 0, m.width * 0.8, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, ' + m.alpha * 0.4 + ')';
            ctx.fill();
            
            ctx.restore();
            
            // 更新流星位置，按照60FPS校准
            const moveDistance = m.speed * (deltaTime / 16.67);
            m.x += Math.cos(m.angle) * moveDistance;
            m.y += Math.sin(m.angle) * moveDistance;
            m.alpha -= 0.005 * (deltaTime / 16.67);
            
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

// Parse the AI response into a structured travel guide (legacy function kept for compatibility)
function parseAIResponseToTravelGuide(response, answers) {
    try {
        console.log("开始解析AI响应和用户答案:", answers);
        console.log("AI响应内容类型:", typeof response);
        console.log("AI响应前100个字符:", response.substring(0, 100));
        
        // 先检查响应是否为空
        if (!response || response.trim().length === 0) {
            console.error("收到空的AI响应");
            return getFallbackTravelGuide();
        }

        // 如果用户指定了目的地，获取该目的地
        const specifiedDestination = answers.specifiedDestination;
        
        // Try to extract JSON from the response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            let jsonString = jsonMatch[0];
            console.log("提取的JSON字符串前100个字符:", jsonString.substring(0, 100));
            
            // 尝试修复常见的JSON格式问题
            try {
                // 1. 处理可能的注释，如//更多天...
                jsonString = jsonString.replace(/\/\/.*?(\r?\n|$)/g, '');
                
                // 2. 处理可能的JSON语法错误
                // 处理尾随逗号，如 [1, 2, 3,] -> [1, 2, 3]
                jsonString = jsonString.replace(/,\s*([}\]])/g, '$1');
                
                // 3. 处理未加引号的属性名
                jsonString = jsonString.replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3');
                
                // 4. 尝试解析或者使用更宽松的解析方法
                let jsonData;
                try {
                    jsonData = JSON.parse(jsonString);
                } catch (strictError) {
                    // 如果严格解析失败，采用直接评估方式（在受控环境中使用）
                    console.warn("严格JSON解析失败，尝试直接解析响应中的对象:", strictError);
                    
                    // 获取用户输入的目的地，用于构建基本数据
                    const rawDestination = answers.specifiedDestination || "推荐目的地";
                    
                    // 从AI响应中直接提取数据
                    // 尝试提取目的地
                    const destMatch = response.match(/"destination"\s*:\s*"([^"]*)"/);
                    const destination = destMatch ? destMatch[1] : rawDestination;
                    
                    // 尝试提取标题
                    const titleMatch = response.match(/"title"\s*:\s*"([^"]*)"/);
                    const title = titleMatch ? titleMatch[1] : `${destination}旅行攻略`;
                    
                    // 尝试提取概述
                    const overviewMatch = response.match(/"overview"\s*:\s*"([^"]*)"/);
                    const overview = overviewMatch ? overviewMatch[1] : "根据您的旅行偏好定制的旅行计划";
                    
                    // 尝试提取行程天数
                    const durationMatch = response.match(/"duration"\s*:\s*"([^"]*)"/);
                    const duration = durationMatch ? durationMatch[1] : extractDurationFromAnswers(answers);
                    
                    // 尝试提取美食推荐
                    const foodMatch = response.match(/"food"\s*:\s*"([^"]*)"/);
                    const food = foodMatch ? foodMatch[1] : "当地特色美食";
                    
                    // 尝试提取交通建议
                    const transportationMatch = response.match(/"transportation"\s*:\s*"([^"]*)"/);
                    const transportation = transportationMatch ? transportationMatch[1] : "公共交通和步行";
                    
                    // 尝试提取住宿推荐
                    const accommodationMatch = response.match(/"accommodation"\s*:\s*"([^"]*)"/);
                    const accommodation = accommodationMatch ? accommodationMatch[1] : "适合您预算的住宿";
                    
                    // 尝试提取文化体验
                    const cultureMatch = response.match(/"culture"\s*:\s*"([^"]*)"/);
                    const culture = cultureMatch ? cultureMatch[1] : "体验当地文化和传统";
                    
                    // 尝试提取亮点
                    const highlightsMatches = response.match(/"highlights"\s*:\s*\[(.*?)\]/s);
                    let highlights = ["当地文化", "美食体验", "自然风光", "特色活动"];
                    if (highlightsMatches && highlightsMatches[1]) {
                        const highlightItems = highlightsMatches[1].match(/"([^"]*)"/g);
                        if (highlightItems && highlightItems.length > 0) {
                            highlights = highlightItems.map(item => item.replace(/"/g, ''));
                        }
                    }
                    
                    // 构建基本的结构化数据
                    jsonData = {
                        destination: destination,
                        title: title,
                        overview: overview,
                        highlights: highlights,
                        duration: duration,
                        food: food,
                        transportation: transportation,
                        accommodation: accommodation,
                        culture: culture
                    };
                    
                    // 尝试提取每日行程
                    const dailyPlanMatch = response.match(/"dailyPlan"\s*:\s*\[(.*?)\]/s);
                    if (dailyPlanMatch && dailyPlanMatch[1]) {
                        try {
                            // 提取每天的行程数据，这很复杂，先尝试重新组装JSON
                            const dailyPlanJson = `[${dailyPlanMatch[1]}]`;
                            const cleanedDailyPlanJson = dailyPlanJson
                                .replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3')  // 属性名加引号
                                .replace(/,\s*([}\]])/g, '$1');  // 移除尾随逗号
                                
                            try {
                                jsonData.dailyPlan = JSON.parse(cleanedDailyPlanJson);
                            } catch (dailyPlanError) {
                                console.warn("无法解析每日行程JSON:", dailyPlanError);
                                // 使用正则表达式手动提取每天的信息
                                const dayMatches = dailyPlanMatch[1].match(/\{\s*"day"\s*:\s*(\d+)[^}]*\}/g);
                                if (dayMatches && dayMatches.length > 0) {
                                    jsonData.dailyPlan = [];
                                    for (const dayMatch of dayMatches) {
                                        const dayObj = {};
                                        
                                        // 提取日期
                                        const dayNumberMatch = dayMatch.match(/"day"\s*:\s*(\d+)/);
                                        if (dayNumberMatch) dayObj.day = parseInt(dayNumberMatch[1]);
                                        
                                        // 提取活动
                                        const activitiesMatch = dayMatch.match(/"activities"\s*:\s*"([^"]*)"/);
                                        if (activitiesMatch) dayObj.activities = activitiesMatch[1];
                                        
                                        // 提取位置
                                        const locationMatch = dayMatch.match(/"location"\s*:\s*"([^"]*)"/);
                                        if (locationMatch) dayObj.location = locationMatch[1];
                                        
                                        // 提取描述
                                        const descriptionMatch = dayMatch.match(/"description"\s*:\s*"([^"]*)"/);
                                        if (descriptionMatch) dayObj.description = descriptionMatch[1];
                                        
                                        // 提取预算
                                        const budgetMatch = dayMatch.match(/"budget"\s*:\s*"([^"]*)"/);
                                        if (budgetMatch) dayObj.budget = budgetMatch[1];
                                        
                                        // 提取早上行程
                                        const morningMatch = dayMatch.match(/"morning"\s*:\s*"([^"]*)"/);
                                        if (morningMatch) dayObj.morning = morningMatch[1];
                                        
                                        // 提取中午行程
                                        const noonMatch = dayMatch.match(/"noon"\s*:\s*"([^"]*)"/);
                                        if (noonMatch) dayObj.noon = noonMatch[1];
                                        
                                        // 提取晚上行程
                                        const eveningMatch = dayMatch.match(/"evening"\s*:\s*"([^"]*)"/);
                                        if (eveningMatch) dayObj.evening = eveningMatch[1];
                                        
                                        jsonData.dailyPlan.push(dayObj);
                                    }
                                }
                            }
                        } catch (error) {
                            console.error("提取每日行程时出错:", error);
                        }
                    }
                    
                    console.log("已创建基本数据结构:", jsonData);
                }
                
                console.log("JSON解析成功，数据类型:", typeof jsonData);
                console.log("JSON包含的字段:", Object.keys(jsonData).join(", "));
                
                // Check if the response has the new format with "plan" property
                if (jsonData.plan) {
                    // Convert the new format to the expected format
                    console.log("检测到新格式JSON，进行转换", jsonData.plan);
                    return {
                        destination: jsonData.plan.destination || specifiedDestination || "推荐目的地",
                        title: jsonData.plan.title || (jsonData.plan.destination ? `${jsonData.plan.destination}旅行攻略` : `${specifiedDestination || "推荐目的地"}旅行攻略`),
                        overview: jsonData.plan.overview || "根据您的旅行偏好定制的旅行计划",
                        highlights: jsonData.plan.uniqueFeatures || ["当地文化", "美食体验", "自然风光", "特色活动"],
                        duration: jsonData.plan.duration || "3天",
                        dailyPlan: jsonData.plan.dailyPlan && jsonData.plan.dailyPlan.length > 0 ? 
                            jsonData.plan.dailyPlan.map(day => ({
                                day: day.day || 1,
                                activities: day.activities || "探索行程",
                                location: day.location || jsonData.plan.destination || specifiedDestination || "推荐目的地",
                                description: day.description || "根据您的偏好安排的一天行程",
                                budget: day.budget || "根据预算",
                                morning: day.morning || "早餐后开始游览",
                                noon: day.noon || "享用当地午餐",
                                evening: day.evening || "晚餐和休闲活动"
                            })) : [
                                {
                                    day: 1,
                                    activities: "探索之旅",
                                    location: jsonData.plan.destination || specifiedDestination || "推荐目的地",
                                    description: "根据您的偏好安排的探索行程",
                                    budget: "根据预算",
                                    morning: "早餐后开始游览",
                                    noon: "享用当地午餐",
                                    evening: "晚餐和休闲活动"
                                }
                            ],
                        food: jsonData.plan.food || "当地特色美食",
                        transportation: jsonData.plan.transportation || "公共交通和步行",
                        accommodation: jsonData.plan.accommodation || "适合您预算的住宿",
                        culture: jsonData.plan.culture || "体验当地文化和传统"
                    };
                }
                
                // 确保返回的数据有所有必需字段
                const processedData = {
                    destination: jsonData.destination || specifiedDestination || "推荐目的地",
                    title: jsonData.title || (specifiedDestination ? `${specifiedDestination}旅行攻略` : "推荐旅行攻略"),
                    overview: jsonData.overview || "根据您的旅行偏好定制的旅行计划",
                    highlights: jsonData.highlights || ["当地文化", "美食体验", "自然风光", "特色活动"],
                    duration: jsonData.duration || extractDurationFromAnswers(answers),
                    dailyPlan: []
                };
                
                // 根据用户选择的行程时长调整天数
                const userDuration = extractDurationFromAnswers(answers);
                console.log("用户选择的行程时长:", userDuration);
                
                // 确保有日程计划，优先使用AI生成的详细计划
                if (jsonData.dailyPlan && jsonData.dailyPlan.length > 0) {
                    processedData.dailyPlan = jsonData.dailyPlan.map(day => ({
                        day: day.day || 1,
                        activities: day.activities || "探索行程",
                        location: day.location || jsonData.destination || specifiedDestination || "推荐目的地",
                        description: day.description || "根据您的偏好安排的一天行程",
                        budget: day.budget || "根据预算",
                        morning: day.morning || "早餐后开始游览",
                        noon: day.noon || "享用当地午餐",
                        evening: day.evening || "晚餐和休闲活动"
                    }));
                } else {
                    // 创建默认日程计划，根据用户的行程时长
                    const daysCount = getDaysCountFromDuration(userDuration);
                    console.log("根据用户时长创建", daysCount, "天的默认行程");
                    
                    for (let i = 1; i <= daysCount; i++) {
                        processedData.dailyPlan.push({
                            day: i,
                            activities: `第${i}天探索之旅`,
                            location: jsonData.destination || specifiedDestination || "推荐目的地",
                            description: `探索${jsonData.destination || specifiedDestination || "推荐目的地"}的第${i}天，体验当地文化和景点。`,
                            budget: "根据您的预算安排",
                            morning: `早餐后开始游览${jsonData.destination || specifiedDestination || "推荐目的地"}著名景点`,
                            noon: "享用当地特色午餐",
                            evening: "品尝当地美食，体验夜生活"
                        });
                    }
                }
                
                // 补充其他字段，保留原始详细信息
                processedData.food = jsonData.food || "当地特色美食";
                processedData.transportation = jsonData.transportation || "公共交通和步行";
                processedData.accommodation = jsonData.accommodation || "适合您预算的住宿";
                processedData.culture = jsonData.culture || "体验当地文化和传统";
                
                console.log("成功解析JSON数据:", processedData);
                return processedData;
            } catch (jsonError) {
                console.error('解析JSON时出错:', jsonError);
            }
        }
        
        // If no valid JSON, create structured data from the text
        console.log("未检测到有效JSON，尝试从文本解析数据");
        
        // 如果有用户指定的目的地，使用它
        if (specifiedDestination) {
            console.log("使用用户指定的目的地:", specifiedDestination);
            
            // 构建一个基于用户指定目的地的旅行攻略
            // 这是一个紧急备用方案，如果所有解析都失败
            const userDuration = extractDurationFromAnswers(answers);
            const daysCount = getDaysCountFromDuration(userDuration);
            
            const fallbackGuide = {
                destination: specifiedDestination,
                title: `${specifiedDestination}旅行攻略`,
                overview: `为您定制的${specifiedDestination}旅行计划，包含当地著名景点、美食和文化体验。`,
                highlights: ["当地文化", "美食体验", "自然风光", "特色活动"],
                duration: userDuration,
                dailyPlan: []
            };
            
            // 创建基本的每日计划
            for (let i = 1; i <= daysCount; i++) {
                fallbackGuide.dailyPlan.push({
                    day: i,
                    activities: `第${i}天 ${specifiedDestination}探索`,
                    location: specifiedDestination,
                    description: `探索${specifiedDestination}的第${i}天，体验当地文化和景点。`,
                    budget: "根据您的预算安排",
                    morning: `早餐后开始游览${specifiedDestination}著名景点`,
                    noon: "享用当地特色午餐",
                    evening: "品尝当地美食，体验夜生活"
                });
            }
            
            // 添加其他必要信息
            fallbackGuide.food = `${specifiedDestination}的特色美食`;
            fallbackGuide.transportation = "公共交通、出租车和步行";
            fallbackGuide.accommodation = "根据您的预算选择适合的住宿";
            fallbackGuide.culture = "体验当地文化活动和传统";
            
            console.log("创建了基于用户指定目的地的备用攻略:", fallbackGuide);
            return fallbackGuide;
        }
        
        // 如果仍然无法解析，使用从文本中提取的信息
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
                while (j < lines.length && !lines[j].match(/第\s*\d+\s*天/) && !lines[j].match(/Day\s*\d+/i) && j < i + 10) {
                    description += lines[j] + ' ';
                    j++;
                }
                
                dailyPlan.push({
                    day,
                    activities: `第${day}天行程`,
                    location: destination || specifiedDestination || "推荐目的地",
                    description: description.trim()
                });
            }
        }
        
        // Create a fallback structure if parsing fails
        if (!destination) destination = specifiedDestination || "根据您的偏好推荐的目的地";
        if (highlights.length === 0) highlights = ["当地文化", "美食体验", "自然风光"];
        if (dailyPlan.length === 0) {
            // Create basic daily plan based on answers duration
            const durationText = extractDurationFromAnswers(answers);
            let days = getDaysCountFromDuration(durationText);
            
            for (let i = 1; i <= Math.min(days, 7); i++) {
                dailyPlan.push({
                    day: i,
                    activities: `第${i}天行程`,
                    location: destination,
                    description: `探索${destination}的第${i}天，体验当地文化和景点`,
                    budget: "根据您的预算安排",
                    morning: `早餐后开始游览${destination}著名景点`,
                    noon: "享用当地特色午餐",
                    evening: "品尝当地美食，体验夜生活"
                });
            }
        }
        
        const result = {
            destination,
            title: `${destination}旅行攻略`,
            overview,
            highlights,
            duration: `${dailyPlan.length}天`,
            dailyPlan,
            food: `${destination}的特色美食`,
            transportation: "公共交通、出租车和步行",
            accommodation: "根据您的预算选择适合的住宿",
            culture: "体验当地文化活动和传统"
        };
        
        console.log("从文本构建数据结构:", result);
        return result;
    } catch (error) {
        console.error('解析AI响应时出错:', error);
        return getFallbackTravelGuide();
    }
}

// 从用户答案中提取行程时长信息
function extractDurationFromAnswers(answers) {
    console.log("提取行程时长，用户答案:", answers);
    
    // 默认返回值
    let duration = "未指定";
    
    if (answers && answers[6]) {
        duration = getTextForValue(6, answers[6]);
        console.log("从答案中提取的时长:", duration);
    } else {
        console.log("用户未指定行程时长，使用默认值");
    }
    
    return duration;
}

// 从行程时长文本转换为天数
function getDaysCountFromDuration(durationText) {
    console.log("转换行程文本为天数:", durationText);
    
    // 默认为3天
    let days = 3;
    
    if (durationText) {
        if (durationText.includes('周末') || durationText.includes('2-3天')) {
            days = 3;
        } else if (durationText.includes('一周') || durationText.includes('5-7天')) {
            days = 5;
        } else if (durationText.includes('两周') || durationText.includes('10-14天')) {
            days = 10;
        } else if (durationText.includes('长期') || durationText.includes('30天')) {
            days = 14;
        }
    }
    
    console.log("转换后的天数:", days);
    return days;
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

// 创建用于DeepSeek API的格式化提示
function createTravelPrompt(answers) {
    console.log("创建旅行提示 - 收到的原始answers对象:", JSON.stringify(answers));
    
    // 使用专门的函数处理答案格式化
    const preferences = formatAnswersToUserPreferences(answers);
    
    // 确定是否为未确定目的地的请求
    const isDestinationUnknown = answers && (answers.isUncertainDestination === true || 
                                 answers.needsDestinationRecommendation === true);
    
    // 是否有指定目的地
    const hasSpecificDestination = answers && answers.specifiedDestination;
    
    // 基本提示开头
    let promptStart = `请使用中文创建一个基于以下旅行偏好的个性化旅行攻略：`;
    
    // 如果用户未确定目的地，添加明确指示
    if (isDestinationUnknown) {
        promptStart = `请使用中文，根据以下旅行偏好，为用户推荐最适合的旅游目的地，并创建详细的个性化旅行攻略：`;
    } else if (hasSpecificDestination) {
        promptStart = `请使用中文，根据用户指定的目的地"${answers.specifiedDestination}"，创建一个详细的个性化旅行攻略：`;
    }
    
    // 基本提示内容
    let prompt = `${promptStart}

请注意：您必须使用中文回答，不要使用英文。

旅行偏好:`;
    
    // 收集用户的偏好数量
    let validPreferenceCount = 0;
    
    // 添加用户的所有有效偏好
    for (const key in preferences) {
        const value = preferences[key];
        if (value && value !== "未指定") {
            prompt += `\n- ${key}: ${value}`;
            validPreferenceCount++;
        }
    }
    
    console.log("用户提供了", validPreferenceCount, "个有效偏好");
    
    // 添加是否有指定目的地的提示
    if (hasSpecificDestination) {
        prompt += `\n\n\n用户已明确指定希望前往"${answers.specifiedDestination}"，请确保行程规划围绕此目的地。`;
    }
    
    // 添加要求
    prompt += `\n\n需求:
1. 请创建一个详细的旅行攻略，包括目的地简介、每日行程安排、交通建议、美食推荐、住宿选择和文化体验等方面
2. 请确保攻略完全符合用户的偏好需求
3. 提供的攻略应包含丰富的细节和实用信息
4. 必须提供一个合理的每日行程计划，包括景点游览、活动体验和用餐建议
5. 必须提供具体的地点名称，如特定的景点、餐厅、街道和地标，而不是模糊的区域描述
6. 景点和活动推荐应该参考小红书等平台上流行博主推荐的热门打卡地和隐藏景点
7. 您必须以标准JSON格式返回结果，所有内容必须是中文，格式如下:

{
  "destination": "${hasSpecificDestination ? answers.specifiedDestination : '推荐的目的地名称'}",
  "title": "旅行攻略标题",
  "overview": "目的地概述和旅行计划简介",
  "highlights": ["亮点1", "亮点2", "亮点3", "亮点4"],
  "duration": "旅行时长(天数)",
  "dailyPlan": [
    {
      "day": 1,
      "activities": "当天主要活动概述",
      "location": "当天主要位置（必须是具体的地点名称，如XX景区、XX街区等）",
      "description": "当天详细行程描述，包含具体地点名称",
      "budget": "当天预算估计",
      "morning": "早上行程（包含2-3个具体地点名称）",
      "noon": "中午行程（包含具体餐厅或美食街区名称）",
      "evening": "晚上行程（包含具体地点名称）"
    },
    // 更多天...
  ],
  "food": "美食推荐（列出4-5个具体的餐厅或小吃名称）",
  "transportation": "交通建议（包含主要的交通方式和路线）",
  "accommodation": "住宿推荐（包含3-4个不同价位的酒店或民宿名称）",
  "culture": "文化体验建议（包含3-4个具体的活动场所名称）"
}

请务必保持返回结果的完整JSON格式，不要添加额外的文本、解释或markdown代码块。所有内容必须是中文，不要使用英文。`;
    
    // 添加总结性的重要提示
    prompt += `\n\n重要提示：`;
    
    // 对每个偏好添加一条重要提示
    if (hasSpecificDestination) {
        prompt += `\n- 用户指定的目的地是"${answers.specifiedDestination}"，必须围绕此地点规划全部行程`;
    }
    
    if (preferences.region && preferences.region !== "未指定" && !hasSpecificDestination) {
        prompt += `\n- 用户想去"${preferences.region}"区域旅行`;
    }
    
    if (preferences.geography && preferences.geography !== "未指定") {
        prompt += `\n- 用户喜欢"${preferences.geography}"地理特征的地方`;
    }
    
    if (preferences.climate && preferences.climate !== "未指定") {
        prompt += `\n- 用户偏好"${preferences.climate}"气候`;
    }
    
    if (preferences.cityType && preferences.cityType !== "未指定" && !hasSpecificDestination) {
        prompt += `\n- 用户想去"${preferences.cityType}"类型的城市`;
    }
    
    if (preferences.travelStyle && preferences.travelStyle !== "未指定") {
        prompt += `\n- 用户的旅行风格是"${preferences.travelStyle}"`;
    }
    
    if (preferences.duration && preferences.duration !== "未指定") {
        prompt += `\n- 用户计划旅行时长为"${preferences.duration}"`;
    }
    
    if (preferences.budget && preferences.budget !== "未指定") {
        prompt += `\n- 用户的预算是"${preferences.budget}"`;
    }
    
    if (preferences.travelers && preferences.travelers !== "未指定") {
        prompt += `\n- 旅行者类型是"${preferences.travelers}"`;
    }
    
    // 添加一些常见情况的特别提示
    prompt += `\n\n请确保为每个景点和活动提供具体详细的地点名称，不要使用模糊的地区描述。例如，不要只写"参观XX区的景点"，而应该写"参观XX区的A景点、B公园和C博物馆"。

如果用户选择了"美洲"作为地区，请务必推荐美洲的目的地，例如美国、加拿大、墨西哥、巴西、阿根廷等国家的城市，而不是亚洲或欧洲的城市。
如果用户选择了"海滩"作为地理特征，请推荐有知名海滩的目的地。
如果用户选择了"热带"气候，请推荐热带气候的目的地。
如果用户选择了"冒险体验"作为旅行风格，请在行程中安排冒险活动。
如果用户选择了"周末短途"，请确保生成的攻略是2-3天的行程。

旅行指南应包含的具体细节：
- 每个位置的具体名称和简短描述
- 推荐的游览时间
- 小红书上流行的打卡点和拍照建议
- 当地交通方式（包括具体线路和站点名称）
- 推荐餐厅的具体名称和招牌菜
- 住宿的具体酒店或民宿名称和简介

再次强调：所有回复内容必须使用中文！`;

    console.log("生成的提示:", prompt);
    return prompt;
}

// 添加折叠式日程功能
function setupCollapsibleItinerary() {
  // 查找所有日程卡片
  const dayCards = document.querySelectorAll('.guide-day-card');
  
  if (dayCards.length === 0) return;
  
  // 为每个日程卡片设置折叠结构
  dayCards.forEach(card => {
    // 获取已有的内容
    const dayNumber = card.querySelector('.guide-day-number');
    const dayDetails = card.querySelector('.guide-day-details');
    
    if (!dayNumber || !dayDetails) return;
    
    // 获取或创建主要地点元素
    let mainLocations = card.querySelector('.day-main-locations');
    if (!mainLocations) {
      // 从详情中提取地点信息
      const dayLocation = card.querySelector('.day-location');
      const locationText = dayLocation ? dayLocation.textContent : '未指定地点';
      
      // 创建主要地点显示
      mainLocations = document.createElement('div');
      mainLocations.className = 'day-main-locations';
      mainLocations.textContent = locationText;
    }
    
    // 创建折叠图标
    const toggleIcon = document.createElement('div');
    toggleIcon.className = 'day-toggle-icon';
    toggleIcon.innerHTML = '▼';
    
    // 创建头部容器
    const headerLeft = document.createElement('div');
    headerLeft.className = 'day-header-left';
    
    // 如果dayNumber已经在DOM中，先移除它
    if (dayNumber.parentNode) {
      dayNumber.parentNode.removeChild(dayNumber);
    }
    
    headerLeft.appendChild(dayNumber);
    headerLeft.appendChild(mainLocations);
    
    const header = document.createElement('div');
    header.className = 'day-header';
    header.appendChild(headerLeft);
    header.appendChild(toggleIcon);
    
    // 创建详情内容容器
    const detailsContent = document.createElement('div');
    detailsContent.className = 'day-details-content';
    
    // 移动所有详情到详情容器中
    while (dayDetails.firstChild) {
      detailsContent.appendChild(dayDetails.firstChild);
    }
    
    // 清空卡片并添加新结构
    card.innerHTML = '';
    card.appendChild(header);
    card.appendChild(detailsContent);
    
    // 添加点击事件切换展开/折叠
    card.addEventListener('click', function() {
      this.classList.toggle('expanded');
    });
  });
}

// 在适当的地方调用这个函数
document.addEventListener('DOMContentLoaded', function() {
  // 如果在显示旅行攻略时设置折叠功能
  const travelGuideModal = document.querySelector('.travel-guide-modal');
  if (travelGuideModal) {
    travelGuideModal.addEventListener('click', function(e) {
      // 避免触发折叠功能的点击事件冒泡
      if (e.target.closest('.travel-guide-close')) return;
      
      // 设置折叠式日程
      setupCollapsibleItinerary();
    });
  }
  
  // 在生成旅行攻略后也需要设置折叠功能
  const generateGuideBtn = document.getElementById('generate-guide-btn');
  if (generateGuideBtn) {
    generateGuideBtn.addEventListener('click', function() {
      // 等待攻略生成后设置折叠式日程
      setTimeout(setupCollapsibleItinerary, 1000);
    });
  }
});

// 增强移动端地图点交互
function enhanceMobileMapInteractions() {
  // 检查是否在explore页面
  if (!document.querySelector('.explore-page')) return;
  
  // 获取所有地图点
  const mapPoints = document.querySelectorAll('.map-point');
  if (!mapPoints.length) return;
  
  // 为每个地图点添加触摸事件处理
  mapPoints.forEach(point => {
    // 添加触摸开始事件
    point.addEventListener('touchstart', function(e) {
      e.preventDefault(); // 防止页面滚动
      
      // 显示标签
      const label = this.querySelector('.point-label');
      if (label) label.style.opacity = '1';
      
      // 高亮点
      const dot = this.querySelector('.point-dot');
      if (dot) {
        dot.style.backgroundColor = '#FFF200';
        dot.style.boxShadow = '0 0 25px 12px rgba(255, 242, 0, 1)';
        dot.style.transform = 'scale(1.3)';
      }
    }, {passive: false});
    
    // 添加触摸结束事件，以模拟点击
    point.addEventListener('touchend', function(e) {
      // 获取地图点数据
      const id = this.getAttribute('data-id');
      
      // 构造一个点击事件来触发原有的点击处理逻辑
      if (id) {
        // 创建并分发点击事件
        const clickEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        });
        this.dispatchEvent(clickEvent);
      }
      
      // 恢复标签状态
      const label = this.querySelector('.point-label');
      if (label) label.style.opacity = '0';
    });
  });
}
