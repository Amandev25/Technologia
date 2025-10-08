// Essay Corrector App - Main JavaScript

// DOM Elements
const essayInput = document.getElementById('essayInput');
const wordCount = document.getElementById('wordCount');
const charCount = document.getElementById('charCount');
const correctBtn = document.getElementById('correctBtn');
const clearBtn = document.getElementById('clearBtn');
const sampleBtn = document.getElementById('sampleBtn');
const resultsPlaceholder = document.getElementById('resultsPlaceholder');
const resultsContainer = document.getElementById('resultsContainer');
const correctedEssay = document.getElementById('correctedEssay');
const analysisReport = document.getElementById('analysisReport');
const promptTokens = document.getElementById('promptTokens');
const completionTokens = document.getElementById('completionTokens');
const copyBtn = document.getElementById('copyBtn');
const loadingOverlay = document.getElementById('loadingOverlay');
const toast = document.getElementById('toast');

// Settings
const apiUrl = document.getElementById('apiUrl');
const jwtToken = document.getElementById('jwtToken');
const toggleToken = document.getElementById('toggleToken');
const healthCheckBtn = document.getElementById('healthCheckBtn');
const apiStatus = document.getElementById('apiStatus');
const settingsToggle = document.getElementById('settingsToggle');
const settingsContent = document.getElementById('settingsContent');

// Sample Essay
const SAMPLE_ESSAY = `Learning is reely importent for every one. You shud always tri to get nu knowledge, becaus it makes you smert. For exampel, I lerned how too bake a choklat kake last week. It was difikult at first, but know I practice every day! My teecher says that consistency helps. It is esential to keep your brane active, or it will become lazzy. We must nevver stop questing and exploring the world. Their is so much too see, and reading books is one way too sea it. This is why I think edjucashun is the best thing, for peeple. It gives oppertunities.`;

// Event Listeners
essayInput.addEventListener('input', updateStats);
correctBtn.addEventListener('click', correctEssay);
clearBtn.addEventListener('click', clearEssay);
sampleBtn.addEventListener('click', loadSample);
copyBtn.addEventListener('click', copyToClipboard);
healthCheckBtn.addEventListener('click', checkAPIHealth);
toggleToken.addEventListener('click', toggleTokenVisibility);
settingsToggle.addEventListener('click', toggleSettings);

// Initialize
updateStats();

// Functions

function updateStats() {
    const text = essayInput.value;
    const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    const chars = text.length;
    
    wordCount.textContent = `${words} word${words !== 1 ? 's' : ''}`;
    charCount.textContent = `${chars} character${chars !== 1 ? 's' : ''}`;
}

function loadSample() {
    essayInput.value = SAMPLE_ESSAY;
    updateStats();
    showToast('Sample essay loaded!', 'info');
}

function clearEssay() {
    essayInput.value = '';
    updateStats();
    resultsPlaceholder.style.display = 'block';
    resultsContainer.style.display = 'none';
    showToast('Essay cleared!', 'info');
}

async function correctEssay() {
    const essay = essayInput.value.trim();
    
    // Validation
    if (!essay) {
        showToast('Please enter an essay to correct.', 'error');
        return;
    }
    
    if (essay.length < 10) {
        showToast('Essay must be at least 10 characters long.', 'error');
        return;
    }
    
    if (essay.length > 10000) {
        showToast('Essay must be less than 10,000 characters.', 'error');
        return;
    }
    
    // Show loading
    showLoading(true);
    correctBtn.disabled = true;
    
    try {
        const response = await fetch(`${apiUrl.value}/correct-essay`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                essay: essay,
                jwt_token: jwtToken.value
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            displayResults(data);
            showToast('Essay correction completed!', 'success');
        } else {
            showToast(`Error: ${data.error || 'Unknown error occurred'}`, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        if (error.message.includes('Failed to fetch')) {
            showToast('Cannot connect to the API server. Make sure it\'s running.', 'error');
        } else {
            showToast(`Error: ${error.message}`, 'error');
        }
    } finally {
        showLoading(false);
        correctBtn.disabled = false;
    }
}

function displayResults(data) {
    // Hide placeholder, show results
    resultsPlaceholder.style.display = 'none';
    resultsContainer.style.display = 'block';
    
    // Display corrected essay
    correctedEssay.value = data.corrected_essay || '';
    
    // Display analysis report - handle both string and structured formats
    if (typeof data.essay_report === 'string') {
        // Legacy string format
        analysisReport.innerHTML = `<div class="legacy-report">${data.essay_report}</div>`;
    } else if (typeof data.essay_report === 'object' && data.essay_report !== null) {
        // New structured format
        analysisReport.innerHTML = generateStructuredReport(data.essay_report);
    } else {
        analysisReport.textContent = 'No report available';
    }
    
    // Display token usage
    if (data.token_usage) {
        promptTokens.textContent = data.token_usage.prompt_tokens || 0;
        completionTokens.textContent = data.token_usage.completion_tokens || 0;
    }
    
    // Show error indicator if present
    if (data.error) {
        analysisReport.innerHTML = `
            <div style="background: #f8d7da; padding: 1rem; border-radius: 8px; border: 1px solid #f5c6cb; color: #721c24; margin-bottom: 1rem;">
                ⚠️ This correction was completed with errors. Please check the report.
            </div>
            ${analysisReport.innerHTML}
        `;
    }
    
    // Scroll to results
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function generateStructuredReport(report) {
    if (!report || typeof report !== 'object') {
        return '<div class="error">Invalid report format</div>';
    }
    
    let html = '';
    
    // Overall Score
    if (report.overall_score !== undefined) {
        html += `
            <div class="overall-score">
                <h4>📊 Overall Score: ${report.overall_score}/100</h4>
                <div class="score-bar">
                    <div class="score-fill" style="width: ${report.overall_score}%"></div>
                </div>
            </div>
        `;
    }
    
    // Categories
    if (report.categories) {
        html += '<div class="categories-section">';
        html += '<h4>📋 Detailed Analysis</h4>';
        
        Object.entries(report.categories).forEach(([category, data]) => {
            html += generateCategoryHTML(category, data);
        });
        
        html += '</div>';
    }
    
    // Summary
    if (report.summary) {
        html += generateSummaryHTML(report.summary);
    }
    
    return html;
}

function generateCategoryHTML(category, data) {
    const categoryIcons = {
        'spelling': '✏️',
        'grammar': '📝',
        'structure': '🏗️',
        'clarity': '💡',
        'vocabulary': '📚'
    };
    
    const icon = categoryIcons[category] || '📋';
    const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
    
    let html = `
        <div class="category-card">
            <div class="category-header">
                <h5>${icon} ${categoryName}</h5>
                <div class="category-score">${data.score}/100</div>
            </div>
            <div class="category-score-bar">
                <div class="score-fill" style="width: ${data.score}%"></div>
            </div>
            <div class="category-feedback">${data.feedback}</div>
    `;
    
    // Errors
    if (data.errors && data.errors.length > 0) {
        html += '<div class="errors-section">';
        html += `<h6>🔍 Errors Found (${data.errors_found || data.errors.length}):</h6>`;
        html += '<ul class="errors-list">';
        
        data.errors.forEach(error => {
            html += '<li class="error-item">';
            if (error.word && error.correction) {
                html += `<strong>"${error.word}"</strong> → <strong>"${error.correction}"</strong>`;
            } else if (error.original && error.correction) {
                html += `<strong>"${error.original}"</strong> → <strong>"${error.correction}"</strong>`;
            } else if (error.error) {
                html += `<strong>${error.error}</strong>`;
            }
            if (error.explanation) {
                html += `<br><small>💡 ${error.explanation}</small>`;
            }
            if (error.position) {
                html += `<br><small>📍 ${error.position}</small>`;
            }
            html += '</li>';
        });
        
        html += '</ul></div>';
    }
    
    // Suggestions
    if (data.suggestions && data.suggestions.length > 0) {
        html += '<div class="suggestions-section">';
        html += '<h6>💡 Suggestions:</h6>';
        html += '<ul class="suggestions-list">';
        data.suggestions.forEach(suggestion => {
            html += `<li>${suggestion}</li>`;
        });
        html += '</ul></div>';
    }
    
    html += '</div>';
    return html;
}

function generateSummaryHTML(summary) {
    let html = '<div class="summary-section">';
    html += '<h4>📝 Summary</h4>';
    
    if (summary.total_errors !== undefined) {
        html += `<div class="summary-stats">
            <span class="stat-item">Total Errors: <strong>${summary.total_errors}</strong></span>
        </div>`;
    }
    
    if (summary.strengths && summary.strengths.length > 0) {
        html += '<div class="strengths-section">';
        html += '<h6>✅ Strengths:</h6>';
        html += '<ul class="strengths-list">';
        summary.strengths.forEach(strength => {
            html += `<li>${strength}</li>`;
        });
        html += '</ul></div>';
    }
    
    if (summary.areas_for_improvement && summary.areas_for_improvement.length > 0) {
        html += '<div class="improvements-section">';
        html += '<h6>🎯 Areas for Improvement:</h6>';
        html += '<ul class="improvements-list">';
        summary.areas_for_improvement.forEach(area => {
            html += `<li>${area}</li>`;
        });
        html += '</ul></div>';
    }
    
    if (summary.overall_feedback) {
        html += `<div class="overall-feedback">
            <h6>💬 Overall Feedback:</h6>
            <p>${summary.overall_feedback}</p>
        </div>`;
    }
    
    html += '</div>';
    return html;
}

async function checkAPIHealth() {
    apiStatus.className = 'api-status';
    apiStatus.style.display = 'none';
    
    try {
        const response = await fetch(`${apiUrl.value}/health`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        if (response.ok) {
            apiStatus.className = 'api-status success';
            apiStatus.textContent = '✅ API is running';
            showToast('API is healthy!', 'success');
        } else {
            apiStatus.className = 'api-status error';
            apiStatus.textContent = '❌ API is not responding';
            showToast('API is not responding properly', 'error');
        }
    } catch (error) {
        apiStatus.className = 'api-status error';
        apiStatus.textContent = '❌ Cannot connect to API';
        showToast('Cannot connect to API server', 'error');
    }
}

function copyToClipboard() {
    const text = correctedEssay.value;
    
    if (!text) {
        showToast('No corrected essay to copy', 'error');
        return;
    }
    
    // Modern clipboard API
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('Corrected essay copied to clipboard!', 'success');
        }).catch(err => {
            // Fallback
            fallbackCopy(text);
        });
    } else {
        // Fallback for older browsers
        fallbackCopy(text);
    }
}

function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
        document.execCommand('copy');
        showToast('Corrected essay copied to clipboard!', 'success');
    } catch (err) {
        showToast('Failed to copy to clipboard', 'error');
    }
    
    document.body.removeChild(textArea);
}

function toggleTokenVisibility() {
    const type = jwtToken.type === 'password' ? 'text' : 'password';
    jwtToken.type = type;
    toggleToken.textContent = type === 'password' ? '👁️' : '🙈';
}

function toggleSettings() {
    settingsContent.classList.toggle('open');
}

function showLoading(show) {
    loadingOverlay.style.display = show ? 'flex' : 'none';
}

function showToast(message, type = 'info') {
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to correct essay
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        correctEssay();
    }
    
    // Ctrl/Cmd + L to load sample
    if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        loadSample();
    }
    
    // Ctrl/Cmd + K to clear
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        clearEssay();
    }
});

// Auto-save settings to localStorage
apiUrl.addEventListener('change', () => {
    localStorage.setItem('essayCorrector_apiUrl', apiUrl.value);
});

jwtToken.addEventListener('change', () => {
    localStorage.setItem('essayCorrector_jwtToken', jwtToken.value);
});

// Load saved settings on page load
window.addEventListener('DOMContentLoaded', () => {
    const savedApiUrl = localStorage.getItem('essayCorrector_apiUrl');
    const savedJwtToken = localStorage.getItem('essayCorrector_jwtToken');
    
    if (savedApiUrl) {
        apiUrl.value = savedApiUrl;
    }
    
    if (savedJwtToken) {
        jwtToken.value = savedJwtToken;
    }
});

