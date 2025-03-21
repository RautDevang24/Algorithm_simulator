// Set delay duration to 1000ms for slower animations.
const animationDelay = 1000;
// Global flag to cancel ongoing algorithm execution.
let isCancelled = false;
let array = [];
let selectedAlgorithm = null;

function updateAlgoDropdown() {
  const algoType = document.getElementById("algoType").value;
  const algoSelect = document.getElementById("algorithmSelect");
  const searchInput = document.getElementById("searchNumber");
  algoSelect.innerHTML = "";

  let options =
    algoType === "searching"
      ? ["Linear Search", "Binary Search"]
      : ["Bubble Sort", "Insertion Sort", "Selection Sort"];

  options.forEach((algo) => {
    let option = document.createElement("option");
    option.value = algo.toLowerCase().replace(/\s/g, "");
    option.textContent = algo;
    algoSelect.appendChild(option);
  });

  searchInput.style.display =
    algoType === "searching" ? "inline-block" : "none";
}

function generateRandomArray() {
  array = Array.from({ length: 8 }, () => Math.floor(Math.random() * 50) + 1);
  renderGraph();
}

// New function: Sets the array from user input.
function setUserArray() {
  const input = document.getElementById("userArrayInput").value;
  if (!input.trim()) {
    alert("Please enter a valid array.");
    return;
  }
  const values = input
    .split(",")
    .map((item) => parseInt(item.trim()))
    .filter((item) => !isNaN(item));
  if (values.length === 0) {
    alert("Please enter valid numbers separated by commas.");
    return;
  }
  array = values;
  renderGraph();
  logStep("Custom array set to: " + array.join(", "));
}

function renderGraph() {
  const graphContainer = document.getElementById("graphContainer");
  graphContainer.innerHTML = "";
  array.forEach((value) => {
    const bar = document.createElement("div");
    bar.style.height = `${value * 4}px`;
    bar.textContent = value;
    graphContainer.appendChild(bar);
  });
}

// For searching: Highlight the selected index in cyan.
function renderGraphHighlight(index) {
  const graphContainer = document.getElementById("graphContainer");
  graphContainer.innerHTML = "";
  array.forEach((value, i) => {
    const bar = document.createElement("div");
    bar.style.height = `${value * 4}px`;
    bar.textContent = value;
    bar.style.backgroundColor = i === index ? "cyan" : "rgb(125, 10, 10)";
    graphContainer.appendChild(bar);
  });
}

// For sorting comparisons: Highlight first index in yellow and second in cyan.
function renderGraphHighlightPair(index1, index2) {
  const graphContainer = document.getElementById("graphContainer");
  graphContainer.innerHTML = "";
  array.forEach((value, i) => {
    const bar = document.createElement("div");
    bar.style.height = `${value * 4}px`;
    bar.textContent = value;
    if (i === index1) {
      bar.style.backgroundColor = "yellow";
    } else if (i === index2) {
      bar.style.backgroundColor = "cyan";
    } else {
      bar.style.backgroundColor = "rgb(125, 10, 10)";
    }
    graphContainer.appendChild(bar);
  });
}

// For binary search: Highlight mid in cyan and both low and high in yellow.
function renderGraphHighlightBinary(mid, low, high) {
  const graphContainer = document.getElementById("graphContainer");
  graphContainer.innerHTML = "";
  array.forEach((value, i) => {
    const bar = document.createElement("div");
    bar.style.height = `${value * 4}px`;
    bar.textContent = value;
    if (i === mid) {
      bar.style.backgroundColor = "cyan";
    } else if (i === low || i === high) {
      bar.style.backgroundColor = "yellow";
    } else {
      bar.style.backgroundColor = "rgb(125, 10, 10)";
    }
    graphContainer.appendChild(bar);
  });
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Helper to log educational steps.
function logStep(message) {
  const stepDiv = document.getElementById("algoSteps");
  stepDiv.innerHTML += "<p>" + message + "</p>";
}

function playWinnerSound() {
  const audio = document.getElementById("winnerSound");
  if (audio) {
    audio.play();
  }
}

async function executeAlgorithm() {
  // Clear previous steps and explanation.
  document.getElementById("algoSteps").innerHTML = "";
  document.getElementById("algoExplanation").innerHTML = "";
  // Reset cancellation flag before starting.
  isCancelled = false;

  selectedAlgorithm = document.getElementById("algorithmSelect").value;
  document.getElementById("animated-title").textContent =
    selectedAlgorithm.toUpperCase();
  const algoType = document.getElementById("algoType").value;

  if (algoType === "searching") {
    const num = parseInt(document.getElementById("searchNumber").value);
    if (isNaN(num)) {
      alert("Please enter a valid number to search");
      return;
    }
    if (selectedAlgorithm === "linearsearch") {
      await linearSearch(num);
    } else if (selectedAlgorithm === "binarysearch") {
      await binarySearch(num);
    }
  } else if (algoType === "sorting") {
    if (selectedAlgorithm === "bubblesort") {
      await bubbleSort();
    } else if (selectedAlgorithm === "insertionsort") {
      await insertionSort();
    } else if (selectedAlgorithm === "selectionsort") {
      await selectionSort();
    }
  }
}

async function linearSearch(target) {
  logStep("Starting Linear Search...");
  for (let i = 0; i < array.length; i++) {
    if (isCancelled) {
      logStep("Algorithm cancelled.");
      return;
    }
    logStep("Checking element at index " + i + " (value: " + array[i] + ").");
    renderGraphHighlight(i);
    await delay(animationDelay);
    if (isCancelled) {
      logStep("Algorithm cancelled.");
      return;
    }
    if (array[i] === target) {
      logStep("Element " + target + " found at index " + i + ".");
      document.getElementById(
        "algoExplanation"
      ).innerHTML = `<b>Linear Search:</b> Number found at index ${i}.`;
      playWinnerSound();
      return;
    }
  }
  logStep("Element " + target + " not found in the array.");
  document.getElementById(
    "algoExplanation"
  ).innerHTML = `<b>Linear Search:</b> Number not found.`;
  playWinnerSound();
}

async function binarySearch(target) {
  logStep("Starting Binary Search...");
  // Sort the array for binary search simulation.
  array.sort((a, b) => a - b);
  logStep("Sorted array: " + array.join(", ") + ".");
  renderGraph();
  await delay(animationDelay);
  if (isCancelled) {
    logStep("Algorithm cancelled.");
    return;
  }

  let low = 0;
  let high = array.length - 1;
  while (low <= high) {
    if (isCancelled) {
      logStep("Algorithm cancelled.");
      return;
    }
    let mid = Math.floor((low + high) / 2);
    logStep(
      "Checking middle element at index " +
        mid +
        " (value: " +
        array[mid] +
        "). [Low: " +
        low +
        ", High: " +
        high +
        "]"
    );
    renderGraphHighlightBinary(mid, low, high);
    await delay(animationDelay);
    if (isCancelled) {
      logStep("Algorithm cancelled.");
      return;
    }
    if (array[mid] === target) {
      logStep("Element " + target + " found at index " + mid + ".");
      document.getElementById(
        "algoExplanation"
      ).innerHTML = `<b>Binary Search:</b> Number found at index ${mid}.`;
      playWinnerSound();
      return;
    } else if (array[mid] < target) {
      logStep(
        "Element at index " +
          mid +
          " is less than " +
          target +
          ". Moving low pointer to " +
          (mid + 1) +
          "."
      );
      low = mid + 1;
    } else {
      logStep(
        "Element at index " +
          mid +
          " is greater than " +
          target +
          ". Moving high pointer to " +
          (mid - 1) +
          "."
      );
      high = mid - 1;
    }
  }
  logStep("Element " + target + " not found in the array.");
  document.getElementById(
    "algoExplanation"
  ).innerHTML = `<b>Binary Search:</b> Number not found.`;
  playWinnerSound();
}

async function bubbleSort() {
  logStep("Starting Bubble Sort...");
  let n = array.length;
  let swapped;
  do {
    if (isCancelled) {
      logStep("Algorithm cancelled.");
      return;
    }
    swapped = false;
    logStep("New pass of Bubble Sort: comparing adjacent elements.");
    for (let i = 0; i < n - 1; i++) {
      if (isCancelled) {
        logStep("Algorithm cancelled.");
        return;
      }
      logStep(
        "Comparing elements at index " +
          i +
          " (" +
          array[i] +
          ") and index " +
          (i + 1) +
          " (" +
          array[i + 1] +
          ")."
      );
      renderGraphHighlightPair(i, i + 1);
      await delay(animationDelay);
      if (isCancelled) {
        logStep("Algorithm cancelled.");
        return;
      }
      if (array[i] > array[i + 1]) {
        logStep(
          "Swapping elements because " + array[i] + " > " + array[i + 1] + "."
        );
        let temp = array[i];
        array[i] = array[i + 1];
        array[i + 1] = temp;
        swapped = true;
        renderGraph();
        await delay(animationDelay);
        if (isCancelled) {
          logStep("Algorithm cancelled.");
          return;
        }
      }
    }
    n--;
  } while (swapped);
  logStep("Bubble Sort complete. The array is now sorted.");
  document.getElementById(
    "algoExplanation"
  ).innerHTML = `<b>Bubble Sort:</b> Array is sorted.`;
  playWinnerSound();
}

async function insertionSort() {
  logStep("Starting Insertion Sort...");
  for (let i = 1; i < array.length; i++) {
    if (isCancelled) {
      logStep("Algorithm cancelled.");
      return;
    }
    let key = array[i];
    logStep(
      "Considering element at index " +
        i +
        " (key = " +
        key +
        ") for insertion."
    );
    let j = i - 1;
    while (j >= 0 && array[j] > key) {
      if (isCancelled) {
        logStep("Algorithm cancelled.");
        return;
      }
      logStep(
        "Element at index " +
          j +
          " (" +
          array[j] +
          ") is greater than key. Shifting it to the right."
      );
      renderGraphHighlightPair(j, j + 1);
      await delay(animationDelay);
      if (isCancelled) {
        logStep("Algorithm cancelled.");
        return;
      }
      array[j + 1] = array[j];
      j--;
      renderGraph();
      await delay(animationDelay);
    }
    array[j + 1] = key;
    logStep("Inserted key (" + key + ") at index " + (j + 1) + ".");
    renderGraph();
    await delay(animationDelay);
  }
  logStep("Insertion Sort complete. The array is now sorted.");
  document.getElementById(
    "algoExplanation"
  ).innerHTML = `<b>Insertion Sort:</b> Array is sorted.`;
  playWinnerSound();
}

async function selectionSort() {
  logStep("Starting Selection Sort...");
  let n = array.length;
  for (let i = 0; i < n; i++) {
    if (isCancelled) {
      logStep("Algorithm cancelled.");
      return;
    }
    logStep(
      "Selecting the minimum element from index " + i + " to " + (n - 1) + "."
    );
    let minIndex = i;
    for (let j = i + 1; j < n; j++) {
      if (isCancelled) {
        logStep("Algorithm cancelled.");
        return;
      }
      logStep(
        "Comparing element at index " +
          j +
          " (" +
          array[j] +
          ") with current minimum at index " +
          minIndex +
          " (" +
          array[minIndex] +
          ")."
      );
      renderGraphHighlightPair(minIndex, j);
      await delay(animationDelay);
      if (isCancelled) {
        logStep("Algorithm cancelled.");
        return;
      }
      if (array[j] < array[minIndex]) {
        minIndex = j;
        logStep(
          "New minimum found at index " +
            minIndex +
            " (value: " +
            array[minIndex] +
            ")."
        );
        renderGraphHighlightPair(i, minIndex);
        await delay(animationDelay);
      }
    }
    if (minIndex !== i) {
      logStep(
        "Swapping element at index " +
          i +
          " (" +
          array[i] +
          ") with minimum element at index " +
          minIndex +
          " (" +
          array[minIndex] +
          ")."
      );
      let temp = array[i];
      array[i] = array[minIndex];
      array[minIndex] = temp;
      renderGraph();
      await delay(animationDelay);
      if (isCancelled) {
        logStep("Algorithm cancelled.");
        return;
      }
    } else {
      logStep(
        "No swap needed at index " + i + " since it's already the minimum."
      );
    }
  }
  logStep("Selection Sort complete. The array is now sorted.");
  document.getElementById(
    "algoExplanation"
  ).innerHTML = `<b>Selection Sort:</b> Array is sorted.`;
  playWinnerSound();
}

// Display the explanation of the selected algorithm in the div.
function showAlgorithmInfo() {
  const algo = document.getElementById("algorithmSelect").value;
  let info = "";
  if (algo === "linearsearch") {
    info =
      "<b>Linear Search:</b> Sequentially checks each element until the target is found or the list ends.";
  } else if (algo === "binarysearch") {
    info =
      "<b>Binary Search:</b> Efficiently finds an item in a sorted array by repeatedly dividing the search interval in half.";
  } else if (algo === "bubblesort") {
    info =
      "<b>Bubble Sort:</b> Repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order until no swaps are needed.";
  } else if (algo === "insertionsort") {
    info =
      "<b>Insertion Sort:</b> Builds the final sorted array one element at a time by inserting each new element into its proper position.";
  } else if (algo === "selectionsort") {
    info =
      "<b>Selection Sort:</b> Repeatedly selects the minimum element from the unsorted portion of the list and moves it to the beginning.";
  } else {
    info = "Algorithm information is not available.";
  }
  document.getElementById("algoExplanation").innerHTML = info;
}

function resetSimulator() {
  // Set cancellation flag to true to stop any ongoing algorithm.
  isCancelled = true;
  array = [];
  renderGraph();
  document.getElementById("algoExplanation").innerHTML = "";
  document.getElementById("algoSteps").innerHTML = "";
}

updateAlgoDropdown();
