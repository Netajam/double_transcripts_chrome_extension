// content.js
(function() {
    let transcriptData = [];
    let currentIndex = 0;
    let transcriptContainer = null;
    let contextLines = 2; // Default number of context lines

    function parseTranscript(rawTranscript) {
      const lines = rawTranscript.split('\n');
      let parsedData = [];
      let currentEntry = null;
  
      for (let line of lines) {
        const match = line.match(/\[(\d{2}:\d{2}:\d{2})\]\s*(.*)/);
        if (match) {
          // If we have a current entry, push it before starting a new one
          if (currentEntry) {
            parsedData.push(currentEntry);
          }
          // Start a new entry
          currentEntry = {
            time: timeToSeconds(match[1]),
            text: match[2].trim()
          };
        } else if (currentEntry) {
          // This is a continuation line, append to the current entry's text
          currentEntry.text += ' ' + line.trim();
        }
      }
  
      // Don't forget to push the last entry
      if (currentEntry) {
        parsedData.push(currentEntry);
      }
  
      return parsedData;
    }
  
    function timeToSeconds(timeStr) {
      const [hours, minutes, seconds] = timeStr.split(':').map(Number);
      return hours * 3600 + minutes * 60 + seconds;
    }
  
      function createTranscriptContainer() {
    if (transcriptContainer) {
      const content = transcriptContainer.querySelector('#transcript-content');
      if (content) content.innerHTML = '';
      return transcriptContainer;
    }

    transcriptContainer = document.createElement('div');
    transcriptContainer.id = 'auto-scroll-transcript';
    transcriptContainer.innerHTML = `
      <div id="transcript-header">
        <h3>Auto-Scrolling Transcript</h3>
        <button id="transcript-resize">↔</button>
      </div>
      <div id="transcript-content"></div>
      <div id="transcript-controls">
        <button id="decrease-context">-</button>
        <span id="context-lines">${contextLines}</span>
        <button id="increase-context">+</button>
      </div>
    `;
    document.body.appendChild(transcriptContainer);

    makeDraggable(transcriptContainer);
    makeResizable(transcriptContainer);
    setupContextControls();

    return transcriptContainer;
  }

  function updateTranscript(currentTime) {
    if (transcriptData.length === 0) return;

    let newIndex = transcriptData.findIndex(item => item.time > currentTime);
    if (newIndex === -1) {
      newIndex = transcriptData.length - 1;
    } else if (newIndex > 0) {
      newIndex--;
    }

    if (newIndex !== currentIndex) {
      currentIndex = newIndex;
      const content = document.getElementById('transcript-content');
      
      let html = '';
      for (let i = Math.max(0, currentIndex - contextLines); i < Math.min(transcriptData.length, currentIndex + contextLines + 1); i++) {
        html += `<p class="${i === currentIndex ? 'current' : ''}">${transcriptData[i].text}</p>`;
      }
      content.innerHTML = html;

      const currentLine = content.querySelector('.current');
      if (currentLine) {
        currentLine.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  function makeDraggable(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    element.querySelector('#transcript-header').onmousedown = dragMouseDown;

    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      element.style.top = (element.offsetTop - pos2) + "px";
      element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

  function makeResizable(element) {
    const resizer = element.querySelector('#transcript-resize');
    let startX, startY, startWidth, startHeight;

    resizer.addEventListener('mousedown', initResize, false);

    function initResize(e) {
      startX = e.clientX;
      startY = e.clientY;
      startWidth = parseInt(document.defaultView.getComputedStyle(element).width, 10);
      startHeight = parseInt(document.defaultView.getComputedStyle(element).height, 10);
      document.addEventListener('mousemove', resize, false);
      document.addEventListener('mouseup', stopResize, false);
    }

    function resize(e) {
      element.style.width = (startWidth + e.clientX - startX) + 'px';
      element.style.height = (startHeight + e.clientY - startY) + 'px';
      updateFontSize();
    }

    function stopResize() {
      document.removeEventListener('mousemove', resize, false);
      document.removeEventListener('mouseup', stopResize, false);
    }
  }

  function updateFontSize() {
    const width = transcriptContainer.offsetWidth;
    const height = transcriptContainer.offsetHeight;
    const size = Math.min(width / 20, height / 15);
    transcriptContainer.style.fontSize = size + 'px';
  }

  function setupContextControls() {
    const decreaseBtn = document.getElementById('decrease-context');
    const increaseBtn = document.getElementById('increase-context');
    const contextDisplay = document.getElementById('context-lines');

    decreaseBtn.addEventListener('click', () => {
      if (contextLines > 0) {
        contextLines--;
        contextDisplay.textContent = contextLines;
        updateTranscript(document.querySelector('video').currentTime);
      }
    });

    increaseBtn.addEventListener('click', () => {
      contextLines++;
      contextDisplay.textContent = contextLines;
      updateTranscript(document.querySelector('video').currentTime);
    });
  }
    
      function createAddTranscriptButton() {
        let button = document.getElementById('add-transcript-btn');
        if (button) {
          button.textContent = transcriptData.length > 0 ? 'Update Transcript' : 'Add Transcript';
          return;
        }
    
        console.log("Creating Add/Update Transcript button");
        button = document.createElement('button');
        button.id = 'add-transcript-btn';
        button.textContent = 'Add Transcript';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '20px';
        button.style.zIndex = '10000';
        button.style.padding = '5px 10px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.cursor = 'pointer';
        button.addEventListener('click', openTranscriptModal);
        document.body.appendChild(button);
        console.log("Add/Update Transcript button created and appended to body");
      }
    
      function openTranscriptModal() {
        fetch(chrome.runtime.getURL('modal.html'))
          .then(response => response.text())
          .then(data => {
            const modal = document.createElement('div');
            modal.innerHTML = data;
            document.body.appendChild(modal);
    
            if (transcriptData.length > 0) {
              const textArea = document.getElementById('transcript-text');
              textArea.value = transcriptData.map(item => `[${new Date(item.time * 1000).toISOString().substr(11, 8)}] ${item.text}`).join('\n');
            }
    
            document.getElementById('save-transcript').addEventListener('click', function() {
              const transcript = document.getElementById('transcript-text').value;
              saveTranscript(transcript);
              document.body.removeChild(modal);
            });
    
            document.getElementById('close-modal').addEventListener('click', function() {
              document.body.removeChild(modal);
            });
          });
      }
    
      function saveTranscript(transcript) {
        transcriptData = parseTranscript(transcript);
        if (transcriptData.length > 0) {
          createTranscriptContainer();
          const video = document.querySelector('video');
          if (video) {
            video.removeEventListener('timeupdate', onTimeUpdate);
            video.removeEventListener('seeked', onSeeked);
            
            video.addEventListener('timeupdate', onTimeUpdate);
            video.addEventListener('seeked', onSeeked);
          }
          updateTranscript(video.currentTime);
          createAddTranscriptButton();
        }
      }
    
      function onTimeUpdate() {
        updateTranscript(this.currentTime);
      }
    
      function onSeeked() {
        updateTranscript(this.currentTime);
      }
    
      function initializeExtension() {
        console.log("Initializing extension");
        if (document.readyState === "complete" || document.readyState === "interactive") {
          console.log("Document ready, creating button immediately");
          createAddTranscriptButton();
        } else {
          console.log("Document not ready, adding event listener");
          document.addEventListener('DOMContentLoaded', createAddTranscriptButton);
        }
        console.log("Extension initialized");
      }
    
      window.youtubeTranscriptExtension = {
        saveTranscript: saveTranscript,
        openTranscriptModal: openTranscriptModal
      };
    
      // Run initialization
      console.log("Content script loaded");
      initializeExtension();
    })();