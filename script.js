
    const inputText = document.getElementById('inputText');
    const previewContainer = document.getElementById('previewContainer');
    const fontSelect = document.getElementById('fontSelect');
    const fontSize = document.getElementById('fontSize');
    const fontColor = document.getElementById('fontColor');
    const generateBtn = document.getElementById('generateBtn');
    const saveBtn = document.getElementById('saveBtn');
    const ruledLines = document.getElementById('ruledLines');
    const marginLeft = document.getElementById('marginLeft');
    const marginRight = document.getElementById('marginRight');
    const marginTop = document.getElementById('marginTop');
    const marginBottom = document.getElementById('marginBottom');

    let pages = [];

    // Generate handwriting with live preview
    generateBtn.addEventListener('click', () => {
      const text = inputText.value;
      if (!text.trim()) {
        alert('Please enter some text first!');
        return;
      }

      previewContainer.innerHTML = '';
      pages = [];

      const A4_WIDTH = 595;
      const A4_HEIGHT = 842;
      const mLeft = parseInt(marginLeft.value);
      const mRight = parseInt(marginRight.value);
      const mTop = parseInt(marginTop.value);
      const mBottom = parseInt(marginBottom.value);
      const fSize = parseInt(fontSize.value);
      const lineHeight = fSize * 1.8;

      const contentWidth = A4_WIDTH - mLeft - mRight;
      const contentHeight = A4_HEIGHT - mTop - mBottom;

      // Split text into words
      const words = text.split(/\s+/);
      let currentPage = createPage();
      let currentY = 0;
      let currentLine = '';

      // Test canvas for measuring text
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      ctx.font = `${fSize}px ${fontSelect.value}`;

      for (let word of words) {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > contentWidth && currentLine) {
          // Add current line to page
          addLineToPage(currentPage, currentLine, currentY);
          currentY += lineHeight;
          currentLine = word;

          // Check if we need new page
          if (currentY + lineHeight > contentHeight) {
            pages.push(currentPage);
            currentPage = createPage();
            currentY = 0;
          }
        } else {
          currentLine = testLine;
        }
      }

      // Add remaining text
      if (currentLine) {
        addLineToPage(currentPage, currentLine, currentY);
      }
      pages.push(currentPage);

      // Render all pages
      pages.forEach((page, index) => {
        page.querySelector('.page-number').textContent = `Page ${index + 1} of ${pages.length}`;
        previewContainer.appendChild(page);
      });
    });

    function createPage() {
      const page = document.createElement('div');
      page.className = 'page';
      if (ruledLines.checked) page.classList.add('ruled');
      
      const content = document.createElement('div');
      content.className = 'page-content';
      content.style.padding = `${marginTop.value}px ${marginRight.value}px ${marginBottom.value}px ${marginLeft.value}px`;
      content.style.fontFamily = fontSelect.value;
      content.style.fontSize = fontSize.value + 'px';
      content.style.color = fontColor.value;
      
      const pageNum = document.createElement('div');
      pageNum.className = 'page-number';
      
      page.appendChild(content);
      page.appendChild(pageNum);
      return page;
    }

    function addLineToPage(page, text, yPos) {
      const content = page.querySelector('.page-content');
      const words = text.split(' ');
      
      words.forEach((word, idx) => {
        const span = document.createElement('span');
        span.textContent = word + (idx < words.length - 1 ? ' ' : '');
        span.style.display = 'inline-block';
        
        // Random rotation for handwritten effect
        const rot = (Math.random() * 4 - 2);
        span.style.transform = `rotate(${rot}deg)`;
        
        content.appendChild(span);
      });
      
      // Add line break
      content.appendChild(document.createElement('br'));
    }

    // Download all pages as PNG
    saveBtn.addEventListener('click', async () => {
      if (pages.length === 0) {
        alert('Please generate handwriting first!');
        return;
      }

      saveBtn.textContent = '⏳ Generating PDFs...';
      saveBtn.disabled = true;

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const canvas = await html2canvas(page, {
          scale: 2,
          backgroundColor: '#ffffff',
          logging: false
        });

        const link = document.createElement('a');
        link.download = `Hydroo-Handwriting-Page-${i + 1}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        // Small delay between downloads
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      saveBtn.textContent = '💾 Download All Pages (PNG)';
      saveBtn.disabled = false;
      alert(`✅ ${pages.length} page(s) downloaded successfully!`);
    });

    // Real-time updates
    [fontSelect, fontSize, fontColor, ruledLines, marginLeft, marginRight, marginTop, marginBottom].forEach(control => {
      control.addEventListener('change', () => {
        if (pages.length > 0) {
          generateBtn.click();
        }
      });
    });
