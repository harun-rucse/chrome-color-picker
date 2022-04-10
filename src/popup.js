const pickerBtn = document.querySelector('.picker_btn');
const selectedResult = document.querySelector('.selected_color');
const colorGrid = document.querySelector('.selected_color_grid');
const colorValue = document.querySelector('.selected_color_value');

pickerBtn.addEventListener('click', async () => {
  // get chrome tab information
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // inject script in web page
  chrome.scripting.executeScript(
    {
      target: {
        tabId: tab.id,
      },
      function: pickColor,
    },
    async (injectionResults) => {
      // current selected result
      const { result: color } = injectionResults[0];

      // change color information in html
      if (color) {
        selectedResult.style.display = 'flex';
        colorGrid.style.backgroundColor = color;
        colorValue.innerHTML = color;

        // copy color text to the clickbord
        try {
          await navigator.clipboard.writeText(color);
        } catch (err) {
          console.error(err);
        }
      }
    }
  );
});

// get colorpicker with EyeDropper
async function pickColor() {
  try {
    const eyeDropper = new EyeDropper();
    const { sRGBHex } = await eyeDropper.open();
    return sRGBHex;
  } catch (err) {
    console.error(err);
  }
}
