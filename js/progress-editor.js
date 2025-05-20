/**
 * Progress Editor Functionality
 * Allows users to manually edit the progress of their travel plans
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the progress editor functionality
    initProgressEditor();
});

/**
 * Initializes the progress editor functionality
 */
function initProgressEditor() {
    console.log('Initializing progress editor functionality');
    
    // First load saved progress values from localStorage
    loadSavedProgressValues();
    
    // Add progress editor button to each plan details
    addProgressEditorButtons();
    
    // Add event listener for dynamically loaded plan details
    document.addEventListener('planDetailsLoaded', function(e) {
        addProgressEditorButtons();
    });
    
    // Add event listener for when plan cards are created/updated
    document.addEventListener('plansDisplayed', function() {
        syncAllPlanProgress();
    });
}

/**
 * Loads saved progress values from localStorage and applies them to UI
 */
function loadSavedProgressValues() {
    console.log('Loading saved progress values from localStorage');
    
    // Get saved guides from localStorage
    let savedGuides = JSON.parse(localStorage.getItem('savedGuides') || '[]');
    
    // Iterate through each guide to apply saved progress
    savedGuides.forEach(guide => {
        if (guide.customProgress !== undefined) {
            console.log(`Found saved progress for plan ${guide.id}: ${guide.customProgress}%`);
            updateAllProgressInstances(guide.id, guide.customProgress);
        }
    });
}

/**
 * Synchronizes progress values between all plan instances
 */
function syncAllPlanProgress() {
    console.log('Synchronizing all plan progress values');
    
    // Get saved guides from localStorage
    let savedGuides = JSON.parse(localStorage.getItem('savedGuides') || '[]');
    
    // Loop through all plan cards to ensure they have correct progress values
    const planCards = document.querySelectorAll('.plan-card');
    planCards.forEach(card => {
        const planId = card.dataset.planId;
        if (!planId) return;
        
        const guide = savedGuides.find(g => g.id == planId);
        if (guide && guide.customProgress !== undefined) {
            // Use saved custom progress
            updatePlanCardProgress(card, guide.customProgress);
        } else {
            // Get progress from details if this is the active card
            if (card.classList.contains('active')) {
                const detailsProgress = document.querySelector('.plan-details .progress-fill');
                if (detailsProgress) {
                    const progressValue = parseInt(detailsProgress.style.width) || 0;
                    updatePlanCardProgress(card, progressValue);
                    
                    // Save this progress value
                    if (!guide || guide.customProgress === undefined) {
                        saveProgressToStorage(planId, progressValue);
                    }
                }
            }
        }
    });
}

/**
 * Updates progress display for a plan card
 * @param {Element} card - The plan card element
 * @param {Number} progressValue - The progress value to display
 */
function updatePlanCardProgress(card, progressValue) {
    const progressFill = card.querySelector('.progress-fill');
    const progressText = card.querySelector('.progress-text');
    
    if (progressFill) {
        progressFill.style.width = progressValue + '%';
    }
    
    if (progressText) {
        // Remove existing edit button if present
        const editBtn = progressText.querySelector('.progress-edit-btn-card');
        if (editBtn) editBtn.remove();
        
        // Update text
        progressText.textContent = progressValue + '% ready';
    }
}

/**
 * Adds progress editor buttons to plan details
 */
function addProgressEditorButtons() {
    // Find all progress bars in plan details
    const progressBars = document.querySelectorAll('.plan-details .progress-bar');
    const progressTexts = document.querySelectorAll('.plan-details .progress-text');
    
    // Loop through each progress bar
    progressBars.forEach((progressBar, index) => {
        // Get the corresponding progress text
        const progressText = progressTexts[index];
        if (!progressText) return;
        
        // Check if edit button already exists
        if (progressText.querySelector('.progress-edit-btn')) return;
        
        // Create edit button
        const editButton = document.createElement('button');
        editButton.className = 'progress-edit-btn';
        editButton.innerHTML = '✏️';
        editButton.title = '编辑进度';
        editButton.style.marginLeft = '10px';
        editButton.style.background = 'transparent';
        editButton.style.border = 'none';
        editButton.style.fontSize = '14px';
        editButton.style.cursor = 'pointer';
        
        // Add click event to edit button
        editButton.addEventListener('click', function() {
            // Get the current progress value from text
            const currentText = progressText.textContent;
            const currentValue = parseInt(currentText) || 0;
            
            // Get the plan ID from the details container
            const detailsContainer = progressBar.closest('.plan-details');
            const planId = detailsContainer ? detailsContainer.dataset.planId : null;
            
            // Show progress edit modal
            showProgressEditModal(progressBar, progressText, currentValue, planId);
        });
        
        // Append edit button to progress text
        progressText.appendChild(editButton);
    });
}

/**
 * Shows the progress edit modal
 * @param {Element} progressBar - The progress bar element
 * @param {Element} progressText - The progress text element
 * @param {Number} currentValue - The current progress value
 * @param {String} planId - The plan ID
 */
function showProgressEditModal(progressBar, progressText, currentValue, planId) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('progressEditModal');
    let overlay = document.getElementById('progressEditOverlay');
    
    if (!modal) {
        // Create overlay
        overlay = document.createElement('div');
        overlay.id = 'progressEditOverlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlay.style.zIndex = '9998';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        
        // Create modal
        modal = document.createElement('div');
        modal.id = 'progressEditModal';
        modal.style.backgroundColor = '#f5f2e8';
        modal.style.borderRadius = '10px';
        modal.style.padding = '20px';
        modal.style.width = '300px';
        modal.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
        modal.style.zIndex = '9999';
        modal.style.position = 'relative';
        
        // Add modal content
        modal.innerHTML = `
            <h3 style="margin-top: 0; color: #5c5544; text-align: center; font-family: 'Poppins', sans-serif;">编辑计划进度</h3>
            <p style="text-align: center; margin-bottom: 20px; color: #777;">手动调整您的旅行计划准备进度</p>
            
            <div style="display: flex; align-items: center; margin-bottom: 20px;">
                <input type="range" id="progressSlider" min="0" max="100" value="${currentValue}" 
                    style="flex: 1; height: 10px; margin-right: 10px;" />
                <span id="progressValue" style="font-weight: bold; color: #5c5544; width: 40px; text-align: right;">${currentValue}%</span>
            </div>
            
            <div style="display: flex; justify-content: flex-end; gap: 10px;">
                <button id="cancelProgressEdit" style="padding: 8px 15px; background: #ccc; border: none; border-radius: 5px; cursor: pointer;">取消</button>
                <button id="saveProgressEdit" style="padding: 8px 15px; background: #a2977e; color: white; border: none; border-radius: 5px; cursor: pointer;">保存</button>
            </div>
        `;
        
        document.body.appendChild(overlay);
        overlay.appendChild(modal);
        
        // Update value when slider is moved
        const progressSlider = document.getElementById('progressSlider');
        const progressValue = document.getElementById('progressValue');
        
        progressSlider.addEventListener('input', function() {
            progressValue.textContent = this.value + '%';
        });
        
        // Add event listeners to buttons
        document.getElementById('cancelProgressEdit').addEventListener('click', function() {
            closeProgressEditModal();
        });
        
        document.getElementById('saveProgressEdit').addEventListener('click', function() {
            const newValue = parseInt(progressSlider.value);
            saveProgressValue(progressBar, progressText, newValue, planId);
            closeProgressEditModal();
        });
        
        // Close modal when clicking on overlay
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                closeProgressEditModal();
            }
        });
    } else {
        // Update slider value
        document.getElementById('progressSlider').value = currentValue;
        document.getElementById('progressValue').textContent = currentValue + '%';
        
        // Show existing modal
        overlay.style.display = 'flex';
    }
    
    // Store references to current elements for later use
    modal.dataset.progressBarId = progressBar ? progressBar.id || Date.now() : Date.now();
    modal.dataset.progressTextId = progressText ? progressText.id || Date.now() : Date.now();
    modal.dataset.planId = planId || '';
    
    // If progress bar doesn't have ID, give it one for reference
    if (progressBar && !progressBar.id) {
        progressBar.id = 'progressBar_' + Date.now();
    }
    
    // If progress text doesn't have ID, give it one for reference
    if (progressText && !progressText.id) {
        progressText.id = 'progressText_' + Date.now();
    }
}

/**
 * Closes the progress edit modal
 */
function closeProgressEditModal() {
    const overlay = document.getElementById('progressEditOverlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

/**
 * Saves the progress value
 * @param {Element} progressBar - The progress bar element
 * @param {Element} progressText - The progress text element
 * @param {Number} newValue - The new progress value
 * @param {String} planId - The plan ID
 */
function saveProgressValue(progressBar, progressText, newValue, planId) {
    // Update visual elements
    if (progressBar) {
        progressBar.style.width = newValue + '%';
    }
    
    if (progressText) {
        // Determine if this is a plan card or details view based on classes
        const isDetails = progressText.closest('.plan-details') !== null;
        
        // Remove existing edit button if present
        const existingEditBtn = progressText.querySelector('.progress-edit-btn, .progress-edit-btn-card');
        if (existingEditBtn) existingEditBtn.remove();
        
        if (isDetails) {
            progressText.textContent = newValue + '% complete';
            
            // Re-add edit button
            const editButton = document.createElement('button');
            editButton.className = 'progress-edit-btn';
            editButton.innerHTML = '✏️';
            editButton.title = '编辑进度';
            editButton.style.marginLeft = '10px';
            editButton.style.background = 'transparent';
            editButton.style.border = 'none';
            editButton.style.fontSize = '14px';
            editButton.style.cursor = 'pointer';
            
            editButton.addEventListener('click', function() {
                showProgressEditModal(progressBar, progressText, newValue, planId);
            });
            
            progressText.appendChild(editButton);
        } else {
            progressText.textContent = newValue + '% ready';
        }
    }
    
    // If plan ID exists, update stored progress
    if (planId) {
        saveProgressToStorage(planId, newValue);
        
        // Update all instances of this plan in the UI
        updateAllProgressInstances(planId, newValue);
    } else {
        // If no plan ID, try to find it from the closest plan card or details container
        const container = progressText ? (progressText.closest('.plan-card') || progressText.closest('.plan-details')) : null;
        if (container && container.dataset.planId) {
            const foundPlanId = container.dataset.planId;
            saveProgressToStorage(foundPlanId, newValue);
            updateAllProgressInstances(foundPlanId, newValue);
        }
    }
}

/**
 * Saves the progress value to localStorage
 * @param {String} planId - The plan ID
 * @param {Number} progressValue - The progress value to save
 */
function saveProgressToStorage(planId, progressValue) {
    // Get saved guides from localStorage
    let savedGuides = JSON.parse(localStorage.getItem('savedGuides') || '[]');
    
    // Find the guide to update
    const guideIndex = savedGuides.findIndex(guide => guide.id == planId);
    
    if (guideIndex !== -1) {
        // Add or update custom progress
        savedGuides[guideIndex].customProgress = progressValue;
        
        // Save back to localStorage
        localStorage.setItem('savedGuides', JSON.stringify(savedGuides));
        console.log(`Progress for plan ${planId} saved: ${progressValue}%`);
        
        // Show success message
        showSuccessMessage(`进度已更新为 ${progressValue}%`);
    } else {
        console.log(`Guide not found for ID: ${planId}`);
    }
}

/**
 * Updates all instances of a plan in the UI with new progress value
 * @param {String} planId - The plan ID
 * @param {Number} progressValue - The progress value to apply
 */
function updateAllProgressInstances(planId, progressValue) {
    console.log(`Updating all instances of plan ${planId} with progress ${progressValue}%`);
    
    // Update all plan cards with this ID (both active and non-active)
    const planCards = document.querySelectorAll(`.plan-card[data-plan-id="${planId}"]`);
    
    planCards.forEach(card => {
        const progressFill = card.querySelector('.progress-fill');
        const progressText = card.querySelector('.progress-text');
        
        if (progressFill) {
            progressFill.style.width = progressValue + '%';
        }
        
        if (progressText) {
            // Remove edit button if present
            const editBtn = progressText.querySelector('.progress-edit-btn-card');
            if (editBtn) editBtn.remove();
            
            // Update text only, without adding edit button
            progressText.textContent = progressValue + '% ready';
        }
    });
    
    // Update the details view if it's showing this plan
    const detailsContainer = document.querySelector('.plan-details');
    if (detailsContainer) {
        const detailsPlanId = detailsContainer.dataset.planId || 
                             document.querySelector('.plan-card.active')?.dataset.planId;
                             
        // Only update if this details container shows the same plan
        if (detailsPlanId == planId) {
            const detailsProgressFill = detailsContainer.querySelector('.progress-fill');
            const detailsProgressText = detailsContainer.querySelector('.progress-text');
            
            if (detailsProgressFill) {
                detailsProgressFill.style.width = progressValue + '%';
            }
            
            if (detailsProgressText) {
                // Remove edit button if present
                const editBtn = detailsProgressText.querySelector('.progress-edit-btn');
                if (editBtn) editBtn.remove();
                
                // Update text
                detailsProgressText.textContent = progressValue + '% complete';
                
                // Re-add edit button
                const editButton = document.createElement('button');
                editButton.className = 'progress-edit-btn';
                editButton.innerHTML = '✏️';
                editButton.title = '编辑进度';
                editButton.style.marginLeft = '10px';
                editButton.style.background = 'transparent';
                editButton.style.border = 'none';
                editButton.style.fontSize = '14px';
                editButton.style.cursor = 'pointer';
                
                editButton.addEventListener('click', function() {
                    showProgressEditModal(detailsProgressFill, detailsProgressText, progressValue, planId);
                });
                
                detailsProgressText.appendChild(editButton);
            }
        }
    }
    
    // Also update the travel guide modal if it's showing this plan
    const travelGuideModal = document.querySelector('.travel-guide-modal.active');
    if (travelGuideModal) {
        const modalPlanId = travelGuideModal.dataset.planId;
        if (modalPlanId == planId) {
            const progressFill = travelGuideModal.querySelector('.progress-fill');
            const progressText = travelGuideModal.querySelector('.progress-text');
            
            if (progressFill) {
                progressFill.style.width = progressValue + '%';
            }
            
            if (progressText) {
                progressText.textContent = progressValue + '% complete';
            }
        }
    }
}

/**
 * Shows a success message
 * @param {String} message - The message to show
 */
function showSuccessMessage(message) {
    // Create message element if it doesn't exist
    let successMessage = document.getElementById('progressSuccessMessage');
    
    if (!successMessage) {
        successMessage = document.createElement('div');
        successMessage.id = 'progressSuccessMessage';
        successMessage.style.position = 'fixed';
        successMessage.style.top = '20px';
        successMessage.style.left = '50%';
        successMessage.style.transform = 'translateX(-50%)';
        successMessage.style.backgroundColor = 'rgba(162, 151, 126, 0.9)';
        successMessage.style.color = 'white';
        successMessage.style.padding = '10px 20px';
        successMessage.style.borderRadius = '5px';
        successMessage.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.2)';
        successMessage.style.zIndex = '9999';
        successMessage.style.fontFamily = "'Poppins', sans-serif";
        successMessage.style.fontSize = '14px';
        successMessage.style.transition = 'opacity 0.5s ease';
        
        document.body.appendChild(successMessage);
    }
    
    // Update message text
    successMessage.textContent = message;
    successMessage.style.opacity = '1';
    
    // Automatically hide message after 3 seconds
    setTimeout(() => {
        successMessage.style.opacity = '0';
        setTimeout(() => {
            successMessage.remove();
        }, 500);
    }, 3000);
}

// Export functions for external use
window.progressEditor = {
    init: initProgressEditor,
    showModal: showProgressEditModal,
    saveProgress: saveProgressValue,
    syncAllProgress: syncAllPlanProgress
}; 