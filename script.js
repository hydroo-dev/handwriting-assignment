const inputText = document.getElementById('inputText');
const outputArea = document.getElementById('outputArea');
const fontSelect = document.getElementById('fontSelect');
const fontSize = document.getElementById('fontSize');
const fontColor = document.getElementById('fontColor');
const generateBtn = document.getElementById('generateBtn');
const saveBtn = document.getElementById('saveBtn');

// Handwriting animation
generateBtn.addEventListener('click', () => {
  const text = inputText.value.trim();
  if (!text) return;

  outputArea.innerHTML = '';
  outputArea.style.fontFamily = fontSelect.value;
  outputArea.style.fontSize = fontSize.value + 'px';
  outputArea.style.color = fontColor.value;
  outputArea.style.background = "#fff"; // force white background in visible area

  let i = 0;
  function typeLetter() {
    if (i < text.length) {
      const span = document.createElement('span');
      span.textContent = text[i];

      // Messy Indian-style rotation
      span.style.display = 'inline-block';
      const rot = (Math.random() * 10 - 5);
      span.style.transform = `rotate(${rot}deg)`;

      outputArea.appendChild(span);
      i++;
      setTimeout(typeLetter, 50 + Math.random() * 50);
    }
  }
  typeLetter();
});

// Save visible output as A4 PNG with guaranteed white background
saveBtn.addEventListener('click', () => {
  if (!outputArea.innerHTML) return;

  const A4_WIDTH = 595; 
  const A4_HEIGHT = 842; 

  html2canvas(outputArea, {backgroundColor: "#fff", scale: 2}).then(canvas => {
    // Create A4 canvas
    const a4Canvas = document.createElement('canvas');
    a4Canvas.width = A4_WIDTH;
    a4Canvas.height = A4_HEIGHT;
    const ctx = a4Canvas.getContext('2d');

    // Fill A4 canvas white
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, A4_WIDTH, A4_HEIGHT);

    // Scale and draw handwriting
    const scale = Math.min(A4_WIDTH / canvas.width, A4_HEIGHT / canvas.height);
    ctx.drawImage(canvas, 0, 0, canvas.width * scale, canvas.height * scale);

    // Save PNG
    const link = document.createElement('a');
    link.download = 'Hydroo-Handwriting-A4.png';
    link.href = a4Canvas.toDataURL('image/png');
    link.click();
  });
});
