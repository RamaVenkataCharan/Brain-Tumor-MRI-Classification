document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const uploadContent = document.getElementById('upload-content');
    const previewContent = document.getElementById('preview-content');
    const imagePreview = document.getElementById('image-preview');
    const btnReset = document.getElementById('btn-reset');
    const btnAnalyze = document.getElementById('btn-analyze');
    const btnNewScan = document.getElementById('btn-new-scan');
    const scanLine = document.getElementById('scan-line');
    
    const resultsSection = document.getElementById('results-section');
    const resultClass = document.getElementById('result-class');
    const confidenceBars = document.getElementById('confidence-bars');

    let currentFile = null;

    // --- Drag and Drop Handling ---
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.add('drag-active');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.remove('drag-active');
        }, false);
    });

    dropZone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    });

    fileInput.addEventListener('change', function() {
        handleFiles(this.files);
    });

    function handleFiles(files) {
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                currentFile = file;
                showPreview(file);
            } else {
                alert('Please upload an image file (e.g., .jpg, .png)');
            }
        }
    }

    // --- UI State Management ---
    function showPreview(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            uploadContent.classList.add('hidden');
            previewContent.classList.remove('hidden');
            resultsSection.classList.add('hidden');
            btnAnalyze.disabled = false;
            btnAnalyze.textContent = "Analyze Scan";
        }
        reader.readAsDataURL(file);
    }

    function resetUI() {
        currentFile = null;
        fileInput.value = '';
        imagePreview.src = '';
        uploadContent.classList.remove('hidden');
        previewContent.classList.add('hidden');
        resultsSection.classList.add('hidden');
        scanLine.classList.add('hidden');
    }

    btnReset.addEventListener('click', resetUI);
    btnNewScan.addEventListener('click', resetUI);

    // --- API Interaction ---
    btnAnalyze.addEventListener('click', async () => {
        if (!currentFile) return;

        // Set Loading State
        btnAnalyze.disabled = true;
        btnAnalyze.textContent = "Scanning...";
        btnReset.disabled = true;
        scanLine.classList.remove('hidden');

        const formData = new FormData();
        formData.append('file', currentFile);

        try {
            const response = await fetch('/predict', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.statusText}`);
            }

            const data = await response.json();
            displayResults(data);

        } catch (error) {
            console.error(error);
            alert("Analysis failed. Check console or server logs.");
        } finally {
            // Remove Loading State
            scanLine.classList.add('hidden');
            btnReset.disabled = false;
        }
    });

    function displayResults(data) {
        dropZone.classList.add('hidden'); // hide the drop zone temporarily
        resultsSection.classList.remove('hidden');

        // Set Top Result
        resultClass.textContent = data.class_name;
        
        // Render Bars
        confidenceBars.innerHTML = '';
        
        // Sort probabilities descending
        const sortedProbs = Object.entries(data.probabilities).sort((a, b) => b[1] - a[1]);

        sortedProbs.forEach(([className, prob], index) => {
            const percentage = (prob * 100).toFixed(1);
            
            // Create DOM elements
            const container = document.createElement('div');
            container.className = 'bar-container';

            const header = document.createElement('div');
            header.className = 'bar-header';
            
            const nameSpan = document.createElement('span');
            nameSpan.className = 'bar-class';
            nameSpan.textContent = className;
            
            const valSpan = document.createElement('span');
            valSpan.className = 'bar-value';
            valSpan.textContent = `${percentage}%`;

            header.appendChild(nameSpan);
            header.appendChild(valSpan);

            const track = document.createElement('div');
            track.className = 'bar-track';

            const fill = document.createElement('div');
            fill.className = 'bar-fill';
            // Optional: change color of the highest probability
            if (index === 0) {
                fill.style.background = 'linear-gradient(90deg, var(--success), #00ffcc)';
            }
            
            track.appendChild(fill);
            container.appendChild(header);
            container.appendChild(track);
            
            confidenceBars.appendChild(container);

            // Animate fill width after a tiny delay to trigger CSS transition
            setTimeout(() => {
                fill.style.width = `${percentage}%`;
            }, 50 * (index + 1));
        });

        // Tweak the new scan button to show the drop zone again
        btnNewScan.onclick = () => {
            dropZone.classList.remove('hidden');
            resetUI();
        };
    }
});
