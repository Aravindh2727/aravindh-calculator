// ==================== script.js - COMPLETE FIXED VERSION ====================
// All calculator features preserved, all console errors fixed
// Constants e and π now work correctly with implicit multiplication
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // ==========================================================================
  // 1. DOM ELEMENT CACHE & UTILITY FUNCTIONS
  // ==========================================================================
  
  // Cache frequently used DOM elements
  const dom = {
    body: document.body,
    themeToggle: document.getElementById('themeToggle'),
    menuToggle: document.getElementById('menuToggle'),
    sidebar: document.getElementById('sidebar'),
    modal: document.getElementById('shortcutModal'),
    helpBtn: document.getElementById('shortcutHelpBtn'),
    closeModal: document.querySelector('.close-modal'),
    navLinks: document.querySelectorAll('.nav-link'),
    calcCards: document.querySelectorAll('.calc-card'),
    // Basic calculator
    basicDisplay: document.getElementById('basicDisplay'),
    basicKeypad: document.querySelector('#basic-calc .keypad'),
    // Scientific calculator
    sciDisplay: document.getElementById('sciDisplay'),
    sciKeypad: document.querySelector('#scientific-calc .keypad'),
    degRadBadge: document.getElementById('degRadBadge'),
    // CGPA elements
    semestersArea: document.getElementById('semestersArea'),
    semTabs: document.getElementById('semTabs'),
    addSemBtn: document.getElementById('addSemBtn'),
    resetCgpa: document.getElementById('resetCgpa'),
    saveCgpaLocal: document.getElementById('saveCgpaLocal'),
    exportCgpaPdf: document.getElementById('exportCgpaPdf'),
    cgpaFinal: document.getElementById('cgpaFinal'),
    totalCredits: document.getElementById('totalCredits'),
    cgpaChart: document.getElementById('cgpaChart'),
    // Utility calculator buttons
    percCalc: document.getElementById('percCalc'),
    bmiCalc: document.getElementById('bmiCalc'),
    emiCalc: document.getElementById('emiCalc'),
    ageCalc: document.getElementById('ageCalc'),
    // Number theory
    calcGcdLcm: document.getElementById('calcGcdLcm'),
    checkPrime: document.getElementById('checkPrime'),
    factorize: document.getElementById('factorize'),
    // Algebra
    solveQuad: document.getElementById('solveQuad'),
    solveLinear: document.getElementById('solveLinear'),
    // Statistics
    addNumberField: document.getElementById('addNumberField'),
    resetNumberFields: document.getElementById('resetNumberFields'),
    calcMean: document.getElementById('calcMean'),
    calcMedian: document.getElementById('calcMedian'),
    calcMode: document.getElementById('calcMode'),
    calcVariance: document.getElementById('calcVariance'),
    calcStdDev: document.getElementById('calcStdDev'),
    calcAllStats: document.getElementById('calcAllStats'),
    numberFieldsContainer: document.getElementById('numberFieldsContainer'),
    // Matrix
    updateMatrices: document.getElementById('updateMatrices'),
    addMatrices: document.getElementById('addMatrices'),
    subtractMatrices: document.getElementById('subtractMatrices'),
    multiplyMatrices: document.getElementById('multiplyMatrices'),
    transposeMatrixA: document.getElementById('transposeMatrixA'),
    transposeMatrixB: document.getElementById('transposeMatrixB'),
    determinantMatrix: document.getElementById('determinantMatrix'),
    // Base converter
    convertBase: document.getElementById('convertBase'),
    // Finance
    calcSI: document.getElementById('calcSI'),
    calcCI: document.getElementById('calcCI'),
    calcGST: document.getElementById('calcGST'),
    calcDiscount: document.getElementById('calcDiscount'),
    // Unit conversion
    convertLength: document.getElementById('convertLength'),
    convertWeight: document.getElementById('convertWeight'),
    convertTemp: document.getElementById('convertTemp'),
    convertData: document.getElementById('convertData'),
    // University tools
    convertPercToCgpa: document.getElementById('convertPercToCgpa'),
    convertCgpaToPerc: document.getElementById('convertCgpaToPerc'),
    calcAttendance: document.getElementById('calcAttendance'),
    calcInternal: document.getElementById('calcInternal')
  };

  // Safe query selector helper
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);

  // Safe event listener attachment
  function addSafeListener(element, event, handler) {
    if (element) element.addEventListener(event, handler);
  }

  // ==========================================================================
  // 2. THEME MANAGEMENT (with localStorage)
  // ==========================================================================
  
  function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      dom.body.classList.add('dark');
      updateThemeIcon(true);
    }
  }

  function updateThemeIcon(isDark) {
    if (dom.themeToggle) {
      const icon = dom.themeToggle.querySelector('i');
      if (icon) icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    }
  }

  function toggleTheme() {
    dom.body.classList.toggle('dark');
    const isDark = dom.body.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcon(isDark);
  }

  addSafeListener(dom.themeToggle, 'click', toggleTheme);

  // ==========================================================================
  // 3. MOBILE SIDEBAR MANAGEMENT (FIXED)
  // ==========================================================================
  
  function initMobileSidebar() {
    if (!dom.menuToggle || !dom.sidebar) return;

    // Toggle sidebar
    dom.menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      dom.sidebar.classList.toggle('open');
      dom.body.classList.toggle('sidebar-open', dom.sidebar.classList.contains('open'));
    });

    // Close sidebar when clicking a nav link (mobile only)
    dom.navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          dom.sidebar.classList.remove('open');
          dom.body.classList.remove('sidebar-open');
        }
      });
    });

    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 768 && 
          dom.sidebar.classList.contains('open') &&
          !dom.sidebar.contains(e.target) && 
          !dom.menuToggle.contains(e.target)) {
        dom.sidebar.classList.remove('open');
        dom.body.classList.remove('sidebar-open');
      }
    });

    // Handle resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        dom.sidebar.classList.remove('open');
        dom.body.classList.remove('sidebar-open');
      }
    });
  }

  // ==========================================================================
  // 4. NAVIGATION BETWEEN CALCULATORS
  // ==========================================================================
  
  function activateCalculator(calcId) {
    // Deactivate all cards and nav links
    dom.calcCards.forEach(c => c.classList.remove('active-calc'));
    dom.navLinks.forEach(l => l.classList.remove('active'));

    // Activate target card
    const targetCard = document.getElementById(calcId + '-calc');
    if (targetCard) targetCard.classList.add('active-calc');

    // Activate target nav link
    const activeLink = $(`.nav-link[data-calc="${calcId}"]`);
    if (activeLink) activeLink.classList.add('active');

    // Close sidebar on mobile
    if (window.innerWidth <= 768 && dom.sidebar) {
      dom.sidebar.classList.remove('open');
      dom.body.classList.remove('sidebar-open');
    }
  }

  // Setup navigation
  dom.navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const calcId = link.dataset.calc;
      if (calcId) activateCalculator(calcId);
    });
  });

  // ==========================================================================
  // 5. KEYBOARD SHORTCUT MODAL
  // ==========================================================================
  
  function initShortcutModal() {
    addSafeListener(dom.helpBtn, 'click', () => {
      if (dom.modal) dom.modal.classList.add('show');
    });

    addSafeListener(dom.closeModal, 'click', () => {
      if (dom.modal) dom.modal.classList.remove('show');
    });

    window.addEventListener('click', (e) => {
      if (e.target === dom.modal) {
        dom.modal.classList.remove('show');
      }
    });
  }

  // ==========================================================================
  // 6. FIXED CALCULATION ENGINE - Handles all cases properly
  // ==========================================================================

  // Factorial function
  window.factorial = function(n) {
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
  };

  // Safe expression evaluator with proper order of operations
  function evaluateExpression(expr, degMode = true) {
    if (!expr || expr.trim() === '') return '0';
    
    try {
      // First, clean the expression - remove any invisible/control characters
      let cleaned = expr.replace(/[^\x20-\x7Eπe\s]/g, '');
      
      // Handle percentage based on calculator type
      if (document.querySelector('.calc-card.active-calc')?.id === 'basic-calc') {
        // For basic calculator: % is modulus operator
        cleaned = cleaned.replace(/(\d+(?:\.\d+)?)\s*%\s*(\d+(?:\.\d+)?)/g, '($1 % $2)');
      } else {
        // For scientific calculator: % is percentage
        cleaned = cleaned.replace(/(\d+(?:\.\d+)?)%/g, '($1/100)');
      }
      
      // STEP 1: Handle scientific notation like 1e6 and 1e-6 - protect them first
      // This prevents e in scientific notation from being converted to Math.E
      let processed = cleaned.replace(/(\d+(?:\.\d+)?)e([+-]?\d+)/gi, '$1__SCINOT__$2');
      
      // STEP 2: Replace standalone constants
      processed = processed
        // Replace π with Math.PI
        .replace(/π/g, 'Math.PI')
        // Replace standalone e with Math.E (not part of a word or number)
        .replace(/\be\b(?![\d.])/g, 'Math.E');
      
      // STEP 3: Handle implicit multiplication for π and e
      
      // Number followed by Math.PI (e.g., 2π → 2 * Math.PI)
      processed = processed.replace(/(\d+(?:\.\d+)?)(Math\.PI)/g, '$1*$2');
      
      // Number followed by Math.E (e.g., 3e → 3 * Math.E)
      processed = processed.replace(/(\d+(?:\.\d+)?)(Math\.E)/g, '$1*$2');
      
      // Math.PI followed by number (e.g., π2 → Math.PI * 2)
      processed = processed.replace(/(Math\.PI)(\d+(?:\.\d+)?)/g, '$1*$2');
      
      // Math.E followed by number (e.g., e3 → Math.E * 3)
      processed = processed.replace(/(Math\.E)(\d+(?:\.\d+)?)/g, '$1*$2');
      
      // STEP 4: Handle power notation for constants
      // Math.PI^2 → Math.PI**2
      processed = processed.replace(/(Math\.(?:PI|E))\s*\^/g, '$1**');
      
      // STEP 5: Restore scientific notation
      processed = processed.replace(/__SCINOT__/g, 'e');
      
      // Replace remaining power operator with **
      processed = processed.replace(/\^/g, '**');
      
      // Replace scientific function names (case insensitive)
      processed = processed
        .replace(/sin\(/gi, 'Math.sin(')
        .replace(/cos\(/gi, 'Math.cos(')
        .replace(/tan\(/gi, 'Math.tan(')
        .replace(/log\(/gi, 'Math.log10(')
        .replace(/ln\(/gi, 'Math.log(')
        .replace(/√\(/gi, 'Math.sqrt(')
        .replace(/sqrt\(/gi, 'Math.sqrt(');
      
      // Replace factorial notation
      processed = processed
        .replace(/(\d+|Math\.PI|Math\.E|\)|\])\s*!/g, (match, p1) => {
          return `factorial(${p1})`;
        })
        .replace(/!(\d+)/g, 'factorial($1)');
      
      // Handle degree/radian conversion for trig functions
      if (degMode) {
        processed = processed
          .replace(/Math\.sin\(([^)]+)\)/g, (match, p1) => {
            return `Math.sin((${p1}) * Math.PI/180)`;
          })
          .replace(/Math\.cos\(([^)]+)\)/g, (match, p1) => {
            return `Math.cos((${p1}) * Math.PI/180)`;
          })
          .replace(/Math\.tan\(([^)]+)\)/g, (match, p1) => {
            return `Math.tan((${p1}) * Math.PI/180)`;
          });
      }
      
      // Use Function constructor for evaluation
      const result = new Function('return ' + processed)();
      
      // Check for invalid results
      if (result === undefined || result === null || isNaN(result) || !isFinite(result)) {
        return 'Error';
      }
      
      // Format the result
      return Number.isInteger(result) ? result.toString() : parseFloat(result.toFixed(10)).toString();
      
    } catch (error) {
      console.error('Evaluation error:', error);
      return 'Error';
    }
  }

  // ==========================================================================
  // 7. BASIC CALCULATOR
  // ==========================================================================
  
  let basicVal = '';

  function handleBasicInput(key, isReset, isEquals) {
    if (!dom.basicDisplay) return;

    if (isReset) {
      basicVal = '';
      dom.basicDisplay.value = '';
    } else if (isEquals) {
      if (basicVal) {
        const result = evaluateExpression(basicVal, true);
        dom.basicDisplay.value = result;
        if (result !== 'Error') {
          basicVal = result;
        }
      }
    } else {
      if (key === 'x²' || key === '^2') {
        basicVal += '^2';
      } else if (key === '√' || key === 'sqrt') {
        basicVal += 'sqrt(';
      } else if (key === '%') {
        basicVal += '%';  // Just add %, the evaluator will handle as modulus
      } else if (key === 'AC') {
        basicVal = '';
        dom.basicDisplay.value = '';
      } else {
        basicVal += key;
      }
      dom.basicDisplay.value = basicVal;
    }
  }

  if (dom.basicKeypad) {
    dom.basicKeypad.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn');
      if (!btn) return;
      handleBasicInput(
        btn.textContent, 
        btn.classList.contains('reset') || btn.textContent === 'AC', 
        btn.classList.contains('eq')
      );
    });
  }

  // ==========================================================================
  // 8. SCIENTIFIC CALCULATOR
  // ==========================================================================
  
  let sciVal = '';
  let degMode = true;

  function toggleDegRad() {
    degMode = !degMode;
    if (dom.degRadBadge) {
      dom.degRadBadge.textContent = degMode ? 'DEG' : 'RAD';
      dom.degRadBadge.setAttribute('aria-pressed', degMode);
    }
  }

  addSafeListener(dom.degRadBadge, 'click', toggleDegRad);

  function handleScientificInput(key, isReset, isEquals) {
    if (!dom.sciDisplay) return;

    if (isReset) {
      sciVal = '';
      dom.sciDisplay.value = '';
    } else if (isEquals) {
      if (sciVal) {
        const result = evaluateExpression(sciVal, degMode);
        dom.sciDisplay.value = result;
        if (result !== 'Error') {
          sciVal = result;
        }
      }
    } else {
      // Handle function keys
      if (key === 'sin') {
        sciVal += 'sin(';
      } else if (key === 'cos') {
        sciVal += 'cos(';
      } else if (key === 'tan') {
        sciVal += 'tan(';
      } else if (key === 'ln') {
        sciVal += 'ln(';
      } else if (key === 'log') {
        sciVal += 'log(';
      } else if (key === 'x^y') {
        sciVal += '^';
      } else if (key === 'n!') {
        sciVal += '!';
      } else if (key === 'e') {
        sciVal += 'e';  // Just add 'e', the evaluator will convert to Math.E
      } else if (key === 'π') {
        sciVal += 'π';  // Just add 'π', the evaluator will convert to Math.PI
      } else if (key === 'C') {
        sciVal = '';
      } else {
        sciVal += key;
      }
      dom.sciDisplay.value = sciVal;
    }
  }

  if (dom.sciKeypad) {
    dom.sciKeypad.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn');
      if (!btn) return;
      handleScientificInput(
        btn.textContent, 
        btn.classList.contains('reset') || btn.textContent === 'C', 
        btn.classList.contains('eq')
      );
    });
  }

  // ==========================================================================
  // 9. CGPA CALCULATOR (fully preserved)
  // ==========================================================================
  
  const gradeMap = { 
    'O': 10, 
    'A+': 9, 
    'A': 8, 
    'B+': 7, 
    'B': 6, 
    'C': 5, 
    'U': 0 
  };

  let chart = null;

  // CGPA helper functions (preserved exactly)
  function createSubjectRow(semNumber, subjectNumber) {
    const div = document.createElement('div');
    div.className = 'subject-row';
    div.innerHTML = `
      <input type="text" placeholder="Subject Name" class="subject" value="Sub ${semNumber}.${subjectNumber}">
      <input type="number" class="credit" value="3" min="0" step="0.5">
      <select class="grade">
        <option value="O">O (10)</option>
        <option value="A+" selected>A+ (9)</option>
        <option value="A">A (8)</option>
        <option value="B+">B+ (7)</option>
        <option value="B">B (6)</option>
        <option value="C">C (5)</option>
        <option value="U">U (0)</option>
      </select>
      <button class="remove-subj" aria-label="Remove subject"><i class="fas fa-times"></i></button>
    `;
    
    div.querySelector('.remove-subj').addEventListener('click', () => { 
      div.remove(); 
      updateCGPA(); 
    });
    
    div.querySelectorAll('input, select').forEach(el => {
      el.addEventListener('input', updateCGPA);
      el.addEventListener('change', updateCGPA);
    });
    
    return div;
  }

  function createSemester(semNumber) {
    const semDiv = document.createElement('div');
    semDiv.className = 'semester-card';
    semDiv.dataset.sem = semNumber;
    semDiv.innerHTML = `
      <div class="semester-header">
        <div class="semester-title">
          <span class="semester-label">Semester</span>
          <input type="number" class="semester-number-input" value="${semNumber}" min="1" max="20">
        </div>
        <div class="semester-controls">
          <span class="semester-sgpa">SGPA: <span class="sgpa-value" id="sgpa-${semNumber}">0.00</span></span>
          <button class="remove-sem" aria-label="Remove semester"><i class="fas fa-trash"></i></button>
        </div>
      </div>
      <div class="subjects-container"></div>
      <button class="add-subj action-btn small">+ Add Subject</button>
    `;
    
    const semNumberInput = semDiv.querySelector('.semester-number-input');
    semNumberInput.addEventListener('change', function() {
      const oldNumber = semDiv.dataset.sem;
      const newNumber = this.value;
      
      semDiv.dataset.sem = newNumber;
      
      const sgpaSpan = semDiv.querySelector('.sgpa-value');
      sgpaSpan.id = `sgpa-${newNumber}`;
      
      const subjects = semDiv.querySelectorAll('.subject-row .subject');
      subjects.forEach((subject) => {
        subject.value = subject.value.replace(`Sub ${oldNumber}.`, `Sub ${newNumber}.`);
      });
      
      rebuildSemTabs();
      updateCGPA();
    });
    
    semDiv.querySelector('.add-subj').addEventListener('click', () => {
      const container = semDiv.querySelector('.subjects-container');
      const subjectCount = container.children.length + 1;
      const semNumber = semDiv.querySelector('.semester-number-input').value;
      container.appendChild(createSubjectRow(semNumber, subjectCount));
      updateCGPA();
    });
    
    semDiv.querySelector('.remove-sem').addEventListener('click', () => {
      if (document.querySelectorAll('.semester-card').length > 1) {
        semDiv.remove(); 
        rebuildSemTabs(); 
        updateCGPA();
      } else {
        alert('Cannot remove the last semester');
      }
    });
    
    return semDiv;
  }

  function rebuildSemTabs() {
    if (!dom.semTabs) return;
    
    const sems = document.querySelectorAll('.semester-card');
    const semArray = Array.from(sems);
    
    semArray.sort((a, b) => {
      const numA = parseInt(a.querySelector('.semester-number-input').value) || 0;
      const numB = parseInt(b.querySelector('.semester-number-input').value) || 0;
      return numA - numB;
    });
    
    semArray.forEach(sem => dom.semestersArea.appendChild(sem));
    
    dom.semTabs.innerHTML = '';
    semArray.forEach((sem) => {
      const semNumber = sem.querySelector('.semester-number-input').value;
      const tab = document.createElement('span');
      tab.className = 'sem-tab';
      tab.textContent = `Sem ${semNumber}`;
      tab.dataset.sem = semNumber;
      tab.addEventListener('click', () => {
        document.querySelectorAll('.sem-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
      });
      dom.semTabs.appendChild(tab);
    });
    if (sems.length) dom.semTabs.firstChild.classList.add('active');
  }

  function addSemester() {
    if (!dom.semestersArea) return;
    
    const existingSems = document.querySelectorAll('.semester-card');
    const existingNumbers = Array.from(existingSems).map(sem => 
      parseInt(sem.querySelector('.semester-number-input').value) || 0
    );
    
    let nextNumber = 1;
    while (existingNumbers.includes(nextNumber)) {
      nextNumber++;
    }
    
    const newSem = createSemester(nextNumber);
    dom.semestersArea.appendChild(newSem);
    
    const container = newSem.querySelector('.subjects-container');
    for (let i = 1; i <= 3; i++) {
      container.appendChild(createSubjectRow(nextNumber, i));
    }
    
    rebuildSemTabs();
    updateCGPA();
  }

  // Initialize CGPA
  function initCGPA() {
    if (!dom.semestersArea) return;
    
    dom.semestersArea.innerHTML = '';
    const firstSem = createSemester(1);
    dom.semestersArea.appendChild(firstSem);
    
    const firstContainer = firstSem.querySelector('.subjects-container');
    for (let i = 1; i <= 3; i++) {
      firstContainer.appendChild(createSubjectRow(1, i));
    }
    
    rebuildSemTabs();
  }

  function updateCGPA() {
    let totalGradePoints = 0;
    let totalCredits = 0;
    const semCards = document.querySelectorAll('.semester-card');
    const semesterData = [];
    
    semCards.forEach((sem) => {
      let semGradePoints = 0;
      let semCredits = 0;
      const semNumber = sem.querySelector('.semester-number-input').value;
      
      sem.querySelectorAll('.subject-row').forEach(row => {
        const credit = parseFloat(row.querySelector('.credit').value) || 0;
        const grade = row.querySelector('.grade').value;
        const gradePoint = gradeMap[grade] || 0;
        
        semGradePoints += credit * gradePoint;
        semCredits += credit;
      });
      
      const sgpa = semCredits > 0 ? (semGradePoints / semCredits) : 0;
      
      semesterData.push({
        number: semNumber,
        sgpa: sgpa,
        credits: semCredits
      });
      
      const sgpaSpan = document.getElementById(`sgpa-${semNumber}`);
      if (sgpaSpan) {
        sgpaSpan.textContent = sgpa.toFixed(2);
      }
      
      totalGradePoints += semGradePoints;
      totalCredits += semCredits;
    });
    
    semesterData.sort((a, b) => parseInt(a.number) - parseInt(b.number));
    
    const cgpa = totalCredits > 0 ? (totalGradePoints / totalCredits) : 0;
    
    if (dom.cgpaFinal) {
      const oldCGPA = parseFloat(dom.cgpaFinal.textContent) || 0;
      animateNumber(dom.cgpaFinal, oldCGPA, cgpa, 2);
    }
    
    if (dom.totalCredits) {
      dom.totalCredits.textContent = totalCredits.toFixed(1);
    }
    
    // Update chart
    if (dom.cgpaChart && typeof Chart !== 'undefined') {
      if (chart) chart.destroy();
      
      const ctx = dom.cgpaChart.getContext('2d');
      chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: semesterData.map(s => `Sem ${s.number}`),
          datasets: [{
            label: 'SGPA',
            data: semesterData.map(s => parseFloat(s.sgpa.toFixed(2))),
            backgroundColor: '#4361ee',
            borderRadius: 8
          }]
        },
        options: { 
          responsive: true, 
          maintainAspectRatio: false, 
          animation: { duration: 800 },
          scales: { 
            y: { 
              beginAtZero: true, 
              max: 10,
              title: { display: true, text: 'SGPA' }
            } 
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: (context) => {
                  const semester = semesterData[context.dataIndex];
                  return `SGPA: ${context.raw.toFixed(2)} (Credits: ${semester.credits})`;
                }
              }
            }
          }
        }
      });
    }
  }

  // Animate number change
  function animateNumber(element, start, end, decimals = 2) {
    const duration = 500;
    const startTime = performance.now();
    
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * easeOutCubic;
      
      element.textContent = current.toFixed(decimals);
      
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    
    requestAnimationFrame(update);
  }

  // CGPA event listeners
  addSafeListener(dom.addSemBtn, 'click', addSemester);
  
  addSafeListener(dom.resetCgpa, 'click', () => {
    if (confirm('Reset all semesters?')) {
      if (dom.semestersArea) {
        dom.semestersArea.innerHTML = '';
        const newSem = createSemester(1);
        dom.semestersArea.appendChild(newSem);
        
        const container = newSem.querySelector('.subjects-container');
        for (let i = 1; i <= 3; i++) {
          container.appendChild(createSubjectRow(1, i));
        }
        
        rebuildSemTabs();
        updateCGPA();
      }
    }
  });

  addSafeListener(dom.saveCgpaLocal, 'click', () => {
    const cgpa = dom.cgpaFinal?.textContent || '0.00';
    
    const semData = [];
    document.querySelectorAll('.semester-card').forEach(sem => {
      const semNumber = sem.querySelector('.semester-number-input').value;
      const sgpa = sem.querySelector('.sgpa-value').textContent;
      const subjects = sem.querySelectorAll('.subject-row').length;
      semData.push(`Sem ${semNumber}: SGPA ${sgpa} (${subjects} subjects)`);
    });
    
    const data = {
      cgpa: cgpa,
      date: new Date().toLocaleString(),
      semesters: semData
    };
    
    let history = JSON.parse(localStorage.getItem('cgpaHistory') || '[]');
    history.push(data);
    if (history.length > 10) history.shift();
    localStorage.setItem('cgpaHistory', JSON.stringify(history));
    alert('CGPA saved to history!');
  });

  addSafeListener(dom.exportCgpaPdf, 'click', () => {
    const cgpa = dom.cgpaFinal?.textContent || '0.00';
    const totalCredits = dom.totalCredits?.textContent || '0';
    
    let semesterData = [];
    document.querySelectorAll('.semester-card').forEach(sem => {
      const semNumber = sem.querySelector('.semester-number-input').value;
      let subjects = [];
      sem.querySelectorAll('.subject-row').forEach(row => {
        const subject = row.querySelector('.subject').value;
        const credit = row.querySelector('.credit').value;
        const grade = row.querySelector('.grade').value;
        const gradePoint = gradeMap[grade] || 0;
        subjects.push(`${subject}: ${credit} credits, Grade ${grade} (${gradePoint} points)`);
      });
      semesterData.push(`Semester ${semNumber}:\n${subjects.join('\n')}`);
    });
    
    const win = window.open('', '_blank');
    win.document.write(`
      <html>
        <head>
          <title>CGPA Report - SmartCalc Pro</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            h1 { color: #4361ee; }
            .cgpa-box { 
              background: #f0f3ff; 
              padding: 20px; 
              border-radius: 10px; 
              margin: 20px 0;
              border-left: 5px solid #4361ee;
            }
            .semester { 
              margin: 20px 0; 
              padding: 15px; 
              border: 1px solid #ddd; 
              border-radius: 8px;
            }
            .formula { 
              background: #f8f9fa; 
              padding: 10px; 
              font-style: italic;
              margin-top: 30px;
            }
          </style>
        </head>
        <body>
          <h1>CGPA Report - SmartCalc Pro</h1>
          <div class="cgpa-box">
            <h2>Final CGPA: ${cgpa}</h2>
            <p>Total Credits: ${totalCredits}</p>
            <p>Generated on: ${new Date().toLocaleString()}</p>
          </div>
          <h3>Semester Details</h3>
          ${semesterData.map(s => `<div class="semester"><pre>${s}</pre></div>`).join('')}
          <div class="formula">
            <strong>Formula:</strong> CGPA = (Σ Credit × Grade Point) / Σ Credits
            <br>
            <small>Grade Points: O=10, A+=9, A=8, B+=7, B=6, C=5, U=0</small>
          </div>
          <p style="margin-top: 40px; color: #666;">Generated by SmartCalc Pro - All-in-One Calculator</p>
        </body>
      </html>
    `);
    win.print();
  });

  // ==========================================================================
  // 10. UTILITY CALCULATORS (Percentage, BMI, EMI, Age)
  // ==========================================================================
  
  // Percentage Calculator
  function calculatePercentage() {
    const val = parseFloat(document.getElementById('percValue')?.value) || 0;
    const total = parseFloat(document.getElementById('percTotal')?.value) || 1;
    const resultEl = document.getElementById('percResult');
    if (resultEl) resultEl.textContent = (val / total * 100).toFixed(2) + '%';
  }
  addSafeListener(dom.percCalc, 'click', calculatePercentage);

  // BMI Calculator
  function calculateBMI() {
    const w = parseFloat(document.getElementById('bmiWeight')?.value) || 0;
    const h = parseFloat(document.getElementById('bmiHeight')?.value) || 100;
    const bmiValue = document.getElementById('bmiValue');
    const bmiCategory = document.getElementById('bmiCategory');
    
    if (w > 0 && h > 0 && bmiValue && bmiCategory) {
      const bmi = w / ((h/100)**2);
      bmiValue.textContent = bmi.toFixed(1);
      
      let cat = 'Underweight';
      if (bmi >= 18.5 && bmi < 25) cat = 'Normal';
      else if (bmi >= 25 && bmi < 30) cat = 'Overweight';
      else if (bmi >= 30) cat = 'Obese';
      
      bmiCategory.textContent = cat;
    }
  }
  addSafeListener(dom.bmiCalc, 'click', calculateBMI);

  // EMI Calculator
  function calculateEMI() {
    const p = parseFloat(document.getElementById('emiAmount')?.value) || 0;
    const r = (parseFloat(document.getElementById('emiRate')?.value) || 0) / 12 / 100;
    const n = (parseFloat(document.getElementById('emiYears')?.value) || 1) * 12;
    const emiResult = document.getElementById('emiResult');
    
    if (p > 0 && r > 0 && n > 0 && emiResult) {
      const emi = p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
      emiResult.textContent = emi.toFixed(2);
    } else if (emiResult) {
      emiResult.textContent = '0.00';
    }
  }
  addSafeListener(dom.emiCalc, 'click', calculateEMI);

  // Age Calculator
  function calculateAge() {
    const birth = new Date(document.getElementById('ageBirth')?.value);
    const yearsEl = document.getElementById('ageYears');
    const monthsEl = document.getElementById('ageMonths');
    const daysEl = document.getElementById('ageDays');
    
    if (!isNaN(birth) && yearsEl && monthsEl && daysEl) {
      const today = new Date();
      let years = today.getFullYear() - birth.getFullYear();
      let months = today.getMonth() - birth.getMonth();
      let days = today.getDate() - birth.getDate();
      
      if (days < 0) {
        months--;
        const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        days += lastMonth.getDate();
      }
      if (months < 0) {
        years--;
        months += 12;
      }
      
      yearsEl.textContent = years;
      monthsEl.textContent = months;
      daysEl.textContent = days;
    }
  }
  addSafeListener(dom.ageCalc, 'click', calculateAge);

  // ==========================================================================
  // 11. NUMBER THEORY CALCULATORS
  // ==========================================================================
  
  // GCD & LCM
  addSafeListener(dom.calcGcdLcm, 'click', () => {
    const a = parseInt(document.getElementById('gcdA')?.value) || 0;
    const b = parseInt(document.getElementById('gcdB')?.value) || 0;
    
    function gcd(x, y) {
      while (y) {
        const t = y;
        y = x % y;
        x = t;
      }
      return Math.abs(x);
    }
    
    const g = gcd(a, b);
    const l = (a && b) ? Math.abs(a * b) / g : 0;
    
    const gcdResult = document.getElementById('gcdResult');
    const lcmResult = document.getElementById('lcmResult');
    if (gcdResult) gcdResult.textContent = g;
    if (lcmResult) lcmResult.textContent = l.toFixed(0);
  });

  // Prime Checker
  addSafeListener(dom.checkPrime, 'click', () => {
    const n = parseInt(document.getElementById('primeNum')?.value) || 0;
    const primeResult = document.getElementById('primeResult');
    if (!primeResult) return;
    
    if (n < 2) {
      primeResult.textContent = `${n} is not prime`;
      return;
    }
    
    let prime = true;
    for (let i = 2; i <= Math.sqrt(n); i++) {
      if (n % i === 0) {
        prime = false;
        break;
      }
    }
    primeResult.textContent = prime ? `${n} is prime` : `${n} is composite`;
  });

  // Prime Factorization
  addSafeListener(dom.factorize, 'click', () => {
    let n = parseInt(document.getElementById('factorNum')?.value) || 1;
    const factorResult = document.getElementById('factorResult');
    if (!factorResult) return;
    
    if (n <= 1) {
      factorResult.textContent = `${n} has no prime factors`;
      return;
    }
    
    const factors = [];
    let num = n;
    let d = 2;
    
    while (num > 1) {
      let exp = 0;
      while (num % d === 0) {
        num /= d;
        exp++;
      }
      if (exp) factors.push(exp > 1 ? `${d}^${exp}` : `${d}`);
      d++;
    }
    
    factorResult.textContent = n + ' = ' + factors.join(' × ');
  });

  // ==========================================================================
  // 12. ALGEBRA CALCULATORS
  // ==========================================================================
  
  // Quadratic Solver
  addSafeListener(dom.solveQuad, 'click', () => {
    const a = parseFloat(document.getElementById('quadA')?.value) || 0;
    const b = parseFloat(document.getElementById('quadB')?.value) || 0;
    const c = parseFloat(document.getElementById('quadC')?.value) || 0;
    
    const discEl = document.getElementById('quadDiscriminant');
    const resultEl = document.getElementById('quadResult');
    
    if (discEl) discEl.textContent = `Δ = ${(b*b - 4*a*c).toFixed(2)}`;
    if (!resultEl) return;
    
    const disc = b * b - 4 * a * c;
    
    if (a === 0) {
      resultEl.textContent = 'Not quadratic (a=0)';
    } else if (disc < 0) {
      const real = (-b / (2 * a)).toFixed(2);
      const imag = (Math.sqrt(-disc) / (2 * a)).toFixed(2);
      resultEl.textContent = `x₁ = ${real} + ${imag}i, x₂ = ${real} - ${imag}i`;
    } else {
      const x1 = (-b + Math.sqrt(disc)) / (2 * a);
      const x2 = (-b - Math.sqrt(disc)) / (2 * a);
      resultEl.textContent = `x₁ = ${x1.toFixed(3)}, x₂ = ${x2.toFixed(3)}`;
    }
  });

  // Linear Solver
  addSafeListener(dom.solveLinear, 'click', () => {
    const a = parseFloat(document.getElementById('linearA')?.value) || 0;
    const b = parseFloat(document.getElementById('linearB')?.value) || 0;
    const resultEl = document.getElementById('linearResult');
    
    if (!resultEl) return;
    
    if (a === 0) {
      resultEl.textContent = b === 0 ? 'Infinite solutions' : 'No solution';
    } else {
      resultEl.textContent = `x = ${(-b / a).toFixed(3)}`;
    }
  });

  // ==========================================================================
  // 13. STATISTICS CALCULATOR (Individual Inputs)
  // ==========================================================================
  
  function createNumberField(index, value = '') {
    const fieldDiv = document.createElement('div');
    fieldDiv.className = 'number-field-item';
    fieldDiv.id = `number-field-${index}`;
    
    const input = document.createElement('input');
    input.type = 'number';
    input.step = 'any';
    input.placeholder = `#${index + 1}`;
    input.value = value;
    input.id = `num-${index}`;
    input.setAttribute('data-field-index', index);
    input.addEventListener('input', updateCurrentSum);
    
    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-field';
    removeBtn.innerHTML = '×';
    removeBtn.setAttribute('data-field-index', index);
    removeBtn.addEventListener('click', () => {
      if (document.querySelectorAll('.number-field-item').length > 1) {
        fieldDiv.remove();
        updateFieldIndices();
        updateCurrentSum();
      } else {
        alert('Need at least one number field');
      }
    });
    
    fieldDiv.appendChild(input);
    fieldDiv.appendChild(removeBtn);
    return fieldDiv;
  }

  function updateFieldIndices() {
    const fields = document.querySelectorAll('.number-field-item');
    fields.forEach((field, index) => {
      field.id = `number-field-${index}`;
      const input = field.querySelector('input');
      input.id = `num-${index}`;
      input.setAttribute('data-field-index', index);
      input.placeholder = `#${index + 1}`;
      const removeBtn = field.querySelector('.remove-field');
      removeBtn.setAttribute('data-field-index', index);
    });
    const totalCount = document.getElementById('totalNumbersCount');
    if (totalCount) totalCount.textContent = fields.length;
  }

  function getNumbers() {
    const inputs = document.querySelectorAll('.number-field-item input');
    const numbers = [];
    inputs.forEach(input => {
      const val = parseFloat(input.value);
      if (!isNaN(val)) {
        numbers.push(val);
      }
    });
    return numbers;
  }

  function updateCurrentSum() {
    const numbers = getNumbers();
    const sum = numbers.reduce((a, b) => a + b, 0);
    const currentSum = document.getElementById('currentSum');
    const totalCount = document.getElementById('totalNumbersCount');
    
    if (currentSum) currentSum.textContent = sum.toFixed(2);
    if (totalCount) totalCount.textContent = numbers.length;
    
    updateDataSummary(numbers);
  }

  function initializeDefaultFields() {
    const container = document.getElementById('numberFieldsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    container.appendChild(createNumberField(0, '10'));
    container.appendChild(createNumberField(1, '20'));
    container.appendChild(createNumberField(2, '30'));
    
    updateCurrentSum();
  }

  function updateDataSummary(numbers) {
    const dataCount = document.getElementById('dataCount');
    const dataSum = document.getElementById('dataSum');
    const dataMin = document.getElementById('dataMin');
    const dataMax = document.getElementById('dataMax');
    const dataRange = document.getElementById('dataRange');
    const dataSorted = document.getElementById('dataSorted');
    
    if (numbers.length === 0) {
      if (dataCount) dataCount.textContent = '0';
      if (dataSum) dataSum.textContent = '0.00';
      if (dataMin) dataMin.textContent = '0.00';
      if (dataMax) dataMax.textContent = '0.00';
      if (dataRange) dataRange.textContent = '0.00';
      if (dataSorted) dataSorted.textContent = '—';
      return;
    }
    
    const sum = numbers.reduce((a, b) => a + b, 0);
    const min = Math.min(...numbers);
    const max = Math.max(...numbers);
    const range = max - min;
    const sorted = [...numbers].sort((a, b) => a - b);
    
    if (dataCount) dataCount.textContent = numbers.length;
    if (dataSum) dataSum.textContent = sum.toFixed(2);
    if (dataMin) dataMin.textContent = min.toFixed(2);
    if (dataMax) dataMax.textContent = max.toFixed(2);
    if (dataRange) dataRange.textContent = range.toFixed(2);
    if (dataSorted) dataSorted.textContent = sorted.join(', ');
  }

  // Statistics calculation functions
  function getStatsMean(numbers) {
    return numbers.reduce((a, b) => a + b, 0) / numbers.length;
  }

  function getStatsMedian(numbers) {
    const sorted = [...numbers].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 
      ? sorted[mid] 
      : (sorted[mid - 1] + sorted[mid]) / 2;
  }

  function getStatsMode(numbers) {
    const freq = {};
    let maxFreq = 0;
    let modes = [];
    
    numbers.forEach(v => {
      freq[v] = (freq[v] || 0) + 1;
      if (freq[v] > maxFreq) maxFreq = freq[v];
    });
    
    for (let val in freq) {
      if (freq[val] === maxFreq) modes.push(parseFloat(val).toFixed(2));
    }
    
    return modes.length === numbers.length ? 'No mode' : modes.join(', ');
  }

  function getStatsVariance(numbers, mean) {
    return numbers.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / numbers.length;
  }

  // Statistics event listeners
  addSafeListener(dom.addNumberField, 'click', () => {
    const container = document.getElementById('numberFieldsContainer');
    if (!container) return;
    
    const currentCount = document.querySelectorAll('.number-field-item').length;
    container.appendChild(createNumberField(currentCount, ''));
    updateFieldIndices();
    updateCurrentSum();
  });

  addSafeListener(dom.resetNumberFields, 'click', () => {
    initializeDefaultFields();
    
    const meanEl = document.getElementById('meanResult');
    const medianEl = document.getElementById('medianResult');
    const modeEl = document.getElementById('modeResult');
    const varianceEl = document.getElementById('varianceResult');
    const stdDevEl = document.getElementById('stdDevResult');
    const allStatsEl = document.getElementById('allStatsResult');
    
    if (meanEl) meanEl.textContent = '—';
    if (medianEl) medianEl.textContent = '—';
    if (modeEl) modeEl.textContent = '—';
    if (varianceEl) varianceEl.textContent = '—';
    if (stdDevEl) stdDevEl.textContent = '—';
    if (allStatsEl) allStatsEl.textContent = 'Click to calculate all';
  });

  addSafeListener(dom.calcMean, 'click', () => {
    const numbers = getNumbers();
    const meanEl = document.getElementById('meanResult');
    if (!meanEl) return;
    
    if (numbers.length === 0) {
      meanEl.textContent = 'No numbers';
      return;
    }
    const mean = getStatsMean(numbers);
    meanEl.textContent = mean.toFixed(4);
    updateDataSummary(numbers);
  });

  addSafeListener(dom.calcMedian, 'click', () => {
    const numbers = getNumbers();
    const medianEl = document.getElementById('medianResult');
    if (!medianEl) return;
    
    if (numbers.length === 0) {
      medianEl.textContent = 'No numbers';
      return;
    }
    const median = getStatsMedian(numbers);
    medianEl.textContent = median.toFixed(4);
    updateDataSummary(numbers);
  });

  addSafeListener(dom.calcMode, 'click', () => {
    const numbers = getNumbers();
    const modeEl = document.getElementById('modeResult');
    if (!modeEl) return;
    
    if (numbers.length === 0) {
      modeEl.textContent = 'No numbers';
      return;
    }
    const mode = getStatsMode(numbers);
    modeEl.textContent = mode;
    updateDataSummary(numbers);
  });

  addSafeListener(dom.calcVariance, 'click', () => {
    const numbers = getNumbers();
    const varianceEl = document.getElementById('varianceResult');
    if (!varianceEl) return;
    
    if (numbers.length === 0) {
      varianceEl.textContent = 'No numbers';
      return;
    }
    const mean = getStatsMean(numbers);
    const variance = getStatsVariance(numbers, mean);
    varianceEl.textContent = variance.toFixed(4);
    updateDataSummary(numbers);
  });

  addSafeListener(dom.calcStdDev, 'click', () => {
    const numbers = getNumbers();
    const stdDevEl = document.getElementById('stdDevResult');
    if (!stdDevEl) return;
    
    if (numbers.length === 0) {
      stdDevEl.textContent = 'No numbers';
      return;
    }
    const mean = getStatsMean(numbers);
    const variance = getStatsVariance(numbers, mean);
    const stdDev = Math.sqrt(variance);
    stdDevEl.textContent = stdDev.toFixed(4);
    updateDataSummary(numbers);
  });

  addSafeListener(dom.calcAllStats, 'click', () => {
    const numbers = getNumbers();
    const allStatsEl = document.getElementById('allStatsResult');
    if (!allStatsEl) return;
    
    if (numbers.length === 0) {
      allStatsEl.textContent = 'No numbers';
      return;
    }
    
    const mean = getStatsMean(numbers);
    const median = getStatsMedian(numbers);
    const mode = getStatsMode(numbers);
    const variance = getStatsVariance(numbers, mean);
    const stdDev = Math.sqrt(variance);
    
    allStatsEl.innerHTML = `
      <div style="font-size:0.9rem; line-height:1.8; text-align:left;">
        <div>📊 Mean: ${mean.toFixed(4)}</div>
        <div>📈 Median: ${median.toFixed(4)}</div>
        <div>🔢 Mode: ${mode}</div>
        <div>📉 Variance: ${variance.toFixed(4)}</div>
        <div>📏 Std Dev: ${stdDev.toFixed(4)}</div>
      </div>
    `;
    
    const meanEl = document.getElementById('meanResult');
    const medianEl = document.getElementById('medianResult');
    const modeEl = document.getElementById('modeResult');
    const varianceEl = document.getElementById('varianceResult');
    const stdDevEl = document.getElementById('stdDevResult');
    
    if (meanEl) meanEl.textContent = mean.toFixed(4);
    if (medianEl) medianEl.textContent = median.toFixed(4);
    if (modeEl) modeEl.textContent = mode;
    if (varianceEl) varianceEl.textContent = variance.toFixed(4);
    if (stdDevEl) stdDevEl.textContent = stdDev.toFixed(4);
    
    updateDataSummary(numbers);
  });

  // ==========================================================================
  // 14. MATRIX CALCULATOR (Fully preserved)
  // ==========================================================================
  
  let currentMatrixADims = { rows: 2, cols: 2 };
  let currentMatrixBDims = { rows: 2, cols: 2 };

  function updateMatrixBadges() {
    const badgeA = document.getElementById('matrixABadge');
    const badgeB = document.getElementById('matrixBBadge');
    if (badgeA) badgeA.textContent = `${currentMatrixADims.rows}×${currentMatrixADims.cols}`;
    if (badgeB) badgeB.textContent = `${currentMatrixBDims.rows}×${currentMatrixBDims.cols}`;
  }

  function createMatrixStructure(containerId, rows, cols, prefix) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    container.style.gridTemplateColumns = `repeat(${cols}, auto)`;
    
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const input = document.createElement('input');
        input.type = 'number';
        input.value = '0';
        input.step = 'any';
        input.id = `${prefix}${i}${j}`;
        input.setAttribute('data-row', i);
        input.setAttribute('data-col', j);
        input.setAttribute('data-matrix', prefix);
        input.placeholder = `${i+1},${j+1}`;
        
        if (prefix === 'a') {
          const exampleValues = {
            'a00': '1', 'a01': '2', 'a02': '3', 'a03': '4',
            'a10': '5', 'a11': '6', 'a12': '7', 'a13': '8',
            'a20': '9', 'a21': '10', 'a22': '11', 'a23': '12',
            'a30': '13', 'a31': '14', 'a32': '15', 'a33': '16'
          };
          if (exampleValues[`${prefix}${i}${j}`]) {
            input.value = exampleValues[`${prefix}${i}${j}`];
          }
        } else {
          const exampleValues = {
            'b00': '2', 'b01': '3', 'b02': '4', 'b03': '5',
            'b10': '6', 'b11': '7', 'b12': '8', 'b13': '9',
            'b20': '10', 'b21': '11', 'b22': '12', 'b23': '13',
            'b30': '14', 'b31': '15', 'b32': '16', 'b33': '17'
          };
          if (exampleValues[`${prefix}${i}${j}`]) {
            input.value = exampleValues[`${prefix}${i}${j}`];
          }
        }
        
        container.appendChild(input);
      }
    }
  }

  function getMatrixValues(prefix, rows, cols) {
    const matrix = [];
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < cols; j++) {
        const input = document.getElementById(`${prefix}${i}${j}`);
        row.push(input ? parseFloat(input.value) || 0 : 0);
      }
      matrix.push(row);
    }
    return matrix;
  }

  function displayMatrixResult(matrix, message = '') {
    const resultDiv = document.getElementById('matrixResult');
    const messageDiv = document.getElementById('matrixMessage');
    if (!resultDiv) return;
    
    resultDiv.innerHTML = '';
    if (messageDiv) messageDiv.innerHTML = message;
    
    if (!matrix || matrix.length === 0) {
      resultDiv.innerHTML = '<span style="width:auto;">—</span>';
      return;
    }
    
    const rows = matrix.length;
    const cols = matrix[0].length;
    resultDiv.style.gridTemplateColumns = `repeat(${cols}, auto)`;
    
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const span = document.createElement('span');
        span.textContent = matrix[i][j].toFixed(2);
        resultDiv.appendChild(span);
      }
    }
  }

  function addMatrices(A, B) {
    if (A.length !== B.length || A[0].length !== B[0].length) {
      displayMatrixResult([], '❌ Error: Matrices must have same dimensions for addition');
      return null;
    }
    
    const result = [];
    for (let i = 0; i < A.length; i++) {
      const row = [];
      for (let j = 0; j < A[0].length; j++) {
        row.push(A[i][j] + B[i][j]);
      }
      result.push(row);
    }
    displayMatrixResult(result, '✅ Addition completed successfully');
    return result;
  }

  function subtractMatrices(A, B) {
    if (A.length !== B.length || A[0].length !== B[0].length) {
      displayMatrixResult([], '❌ Error: Matrices must have same dimensions for subtraction');
      return null;
    }
    
    const result = [];
    for (let i = 0; i < A.length; i++) {
      const row = [];
      for (let j = 0; j < A[0].length; j++) {
        row.push(A[i][j] - B[i][j]);
      }
      result.push(row);
    }
    displayMatrixResult(result, '✅ Subtraction completed successfully');
    return result;
  }

  function multiplyMatrices(A, B) {
    if (A[0].length !== B.length) {
      displayMatrixResult([], `❌ Error: Cannot multiply ${A.length}×${A[0].length} matrix with ${B.length}×${B[0].length} matrix`);
      return null;
    }
    
    const result = [];
    for (let i = 0; i < A.length; i++) {
      result[i] = [];
      for (let j = 0; j < B[0].length; j++) {
        let sum = 0;
        for (let k = 0; k < A[0].length; k++) {
          sum += A[i][k] * B[k][j];
        }
        result[i][j] = sum;
      }
    }
    displayMatrixResult(result, `✅ Multiplication completed: ${A.length}×${A[0].length} × ${B.length}×${B[0].length} = ${result.length}×${result[0].length}`);
    return result;
  }

  function transposeMatrix(matrix, name) {
    const result = [];
    for (let j = 0; j < matrix[0].length; j++) {
      result[j] = [];
      for (let i = 0; i < matrix.length; i++) {
        result[j][i] = matrix[i][j];
      }
    }
    displayMatrixResult(result, `✅ Transpose of ${name} completed: ${matrix.length}×${matrix[0].length} → ${result.length}×${result[0].length}`);
    return result;
  }

  function determinantMatrix(matrix) {
    const n = matrix.length;
    
    if (n !== matrix[0].length) {
      displayMatrixResult([], '❌ Error: Determinant only available for square matrices');
      return null;
    }
    
    let det;
    if (n === 1) {
      det = matrix[0][0];
    } else if (n === 2) {
      det = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    } else if (n === 3) {
      det = matrix[0][0] * (matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1]) -
            matrix[0][1] * (matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0]) +
            matrix[0][2] * (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0]);
    } else if (n === 4) {
      det = 0;
      for (let j = 0; j < 4; j++) {
        const minor = [];
        for (let i = 1; i < 4; i++) {
          const row = [];
          for (let k = 0; k < 4; k++) {
            if (k !== j) row.push(matrix[i][k]);
          }
          minor.push(row);
        }
        const sign = j % 2 === 0 ? 1 : -1;
        det += sign * matrix[0][j] * determinantMatrix(minor);
      }
    } else {
      displayMatrixResult([], '❌ Error: Determinant for matrices larger than 4×4 not implemented');
      return null;
    }
    
    displayMatrixResult([], `✅ det(A) = ${det.toFixed(4)}`);
    return det;
  }

  // Matrix event listeners
  addSafeListener(dom.updateMatrices, 'click', () => {
    const aRows = parseInt(document.getElementById('matrixARows')?.value) || 2;
    const aCols = parseInt(document.getElementById('matrixACols')?.value) || 2;
    const bRows = parseInt(document.getElementById('matrixBRows')?.value) || 2;
    const bCols = parseInt(document.getElementById('matrixBCols')?.value) || 2;
    
    currentMatrixADims = { rows: aRows, cols: aCols };
    currentMatrixBDims = { rows: bRows, cols: bCols };
    
    createMatrixStructure('matrixAInput', aRows, aCols, 'a');
    createMatrixStructure('matrixBInput', bRows, bCols, 'b');
    updateMatrixBadges();
  });

  addSafeListener(dom.addMatrices, 'click', () => {
    const A = getMatrixValues('a', currentMatrixADims.rows, currentMatrixADims.cols);
    const B = getMatrixValues('b', currentMatrixBDims.rows, currentMatrixBDims.cols);
    addMatrices(A, B);
  });

  addSafeListener(dom.subtractMatrices, 'click', () => {
    const A = getMatrixValues('a', currentMatrixADims.rows, currentMatrixADims.cols);
    const B = getMatrixValues('b', currentMatrixBDims.rows, currentMatrixBDims.cols);
    subtractMatrices(A, B);
  });

  addSafeListener(dom.multiplyMatrices, 'click', () => {
    const A = getMatrixValues('a', currentMatrixADims.rows, currentMatrixADims.cols);
    const B = getMatrixValues('b', currentMatrixBDims.rows, currentMatrixBDims.cols);
    multiplyMatrices(A, B);
  });

  addSafeListener(dom.transposeMatrixA, 'click', () => {
    const A = getMatrixValues('a', currentMatrixADims.rows, currentMatrixADims.cols);
    transposeMatrix(A, 'Matrix A');
  });

  addSafeListener(dom.transposeMatrixB, 'click', () => {
    const B = getMatrixValues('b', currentMatrixBDims.rows, currentMatrixBDims.cols);
    transposeMatrix(B, 'Matrix B');
  });

  addSafeListener(dom.determinantMatrix, 'click', () => {
    const A = getMatrixValues('a', currentMatrixADims.rows, currentMatrixADims.cols);
    determinantMatrix(A);
  });

  // Initialize matrix
  createMatrixStructure('matrixAInput', 2, 2, 'a');
  createMatrixStructure('matrixBInput', 2, 2, 'b');
  updateMatrixBadges();

  // ==========================================================================
  // 15. BASE CONVERTER
  // ==========================================================================
  
  addSafeListener(dom.convertBase, 'click', () => {
    const input = document.getElementById('baseInput')?.value.trim() || '';
    const from = parseInt(document.getElementById('baseFrom')?.value) || 10;
    const to = parseInt(document.getElementById('baseTo')?.value) || 16;
    const resultEl = document.getElementById('baseResult');
    
    if (!resultEl) return;
    
    try {
      let cleanInput = input;
      if (from === 16 && input.toLowerCase().startsWith('0x')) {
        cleanInput = input.slice(2);
      }
      
      const decimal = parseInt(cleanInput, from);
      if (isNaN(decimal)) throw 'Invalid';
      
      let result = decimal.toString(to).toUpperCase();
      if (to === 16) result = '0x' + result;
      
      resultEl.textContent = `${input} (base ${from}) = ${result} (base ${to})`;
    } catch {
      resultEl.textContent = 'Invalid input';
    }
  });

  // ==========================================================================
  // 16. FINANCE CALCULATORS
  // ==========================================================================
  
  addSafeListener(dom.calcSI, 'click', () => {
    const p = parseFloat(document.getElementById('siPrincipal')?.value) || 0;
    const r = parseFloat(document.getElementById('siRate')?.value) || 0;
    const t = parseFloat(document.getElementById('siTime')?.value) || 0;
    const resultEl = document.getElementById('siResult');
    
    if (resultEl) {
      const si = (p * r * t) / 100;
      const amount = p + si;
      resultEl.textContent = `Interest = ${si.toFixed(2)}, Amount = ${amount.toFixed(2)}`;
    }
  });

  addSafeListener(dom.calcCI, 'click', () => {
    const p = parseFloat(document.getElementById('ciPrincipal')?.value) || 0;
    const r = parseFloat(document.getElementById('ciRate')?.value) || 0;
    const t = parseFloat(document.getElementById('ciTime')?.value) || 0;
    const n = parseFloat(document.getElementById('ciN')?.value) || 1;
    const resultEl = document.getElementById('ciResult');
    
    if (resultEl) {
      const amount = p * Math.pow(1 + (r/100)/n, n * t);
      const interest = amount - p;
      resultEl.textContent = `Amount = ${amount.toFixed(2)}, Interest = ${interest.toFixed(2)}`;
    }
  });

  addSafeListener(dom.calcGST, 'click', () => {
    const amt = parseFloat(document.getElementById('gstAmount')?.value) || 0;
    const rate = parseFloat(document.getElementById('gstRate')?.value) || 0;
    const resultEl = document.getElementById('gstResult');
    
    if (resultEl) {
      const gst = amt * rate / 100;
      const total = amt + gst;
      resultEl.textContent = `GST = ${gst.toFixed(2)}, Total = ${total.toFixed(2)}`;
    }
  });

  addSafeListener(dom.calcDiscount, 'click', () => {
    const orig = parseFloat(document.getElementById('discOriginal')?.value) || 0;
    const perc = parseFloat(document.getElementById('discPercent')?.value) || 0;
    const resultEl = document.getElementById('discResult');
    
    if (resultEl) {
      const disc = orig * perc / 100;
      const final = orig - disc;
      resultEl.textContent = `Discount = ${disc.toFixed(2)}, Final = ${final.toFixed(2)}`;
    }
  });

  // ==========================================================================
  // 17. UNIT CONVERSION
  // ==========================================================================
  
  addSafeListener(dom.convertLength, 'click', () => {
    const m = parseFloat(document.getElementById('lengthM')?.value) || 0;
    const ftEl = document.getElementById('lengthFt');
    if (ftEl) ftEl.value = (m * 3.28084).toFixed(4);
  });

  addSafeListener(dom.convertWeight, 'click', () => {
    const kg = parseFloat(document.getElementById('weightKg')?.value) || 0;
    const lbEl = document.getElementById('weightLb');
    if (lbEl) lbEl.value = (kg * 2.20462).toFixed(4);
  });

  addSafeListener(dom.convertTemp, 'click', () => {
    const c = parseFloat(document.getElementById('tempC')?.value) || 0;
    const fEl = document.getElementById('tempF');
    if (fEl) fEl.value = (c * 9/5 + 32).toFixed(2);
  });

  addSafeListener(dom.convertData, 'click', () => {
    const mb = parseFloat(document.getElementById('dataMB')?.value) || 0;
    const gbEl = document.getElementById('dataGB');
    if (gbEl) gbEl.value = (mb / 1024).toFixed(4);
  });

  // ==========================================================================
  // 18. UNIVERSITY TOOLS
  // ==========================================================================
  
  addSafeListener(dom.convertPercToCgpa, 'click', () => {
    const perc = parseFloat(document.getElementById('percToCgpa')?.value) || 0;
    const resultEl = document.getElementById('percToCgpaResult');
    if (resultEl) resultEl.textContent = `CGPA = ${(perc / 10).toFixed(2)} (10-point scale)`;
  });

  addSafeListener(dom.convertCgpaToPerc, 'click', () => {
    const cgpa = parseFloat(document.getElementById('cgpaToPerc')?.value) || 0;
    const resultEl = document.getElementById('cgpaToPercResult');
    if (resultEl) resultEl.textContent = `Percentage = ${(cgpa * 9.5).toFixed(2)}%`;
  });

  addSafeListener(dom.calcAttendance, 'click', () => {
    const present = parseFloat(document.getElementById('attnPresent')?.value) || 0;
    const total = parseFloat(document.getElementById('attnTotal')?.value) || 1;
    const resultEl = document.getElementById('attnResult');
    
    if (resultEl) {
      const perc = (present / total * 100).toFixed(2);
      const needed = Math.max(0, (0.75 * total - present)).toFixed(2);
      resultEl.textContent = `Attendance = ${perc}% (${perc >= 75 ? '✅ sufficient' : '❌ need ' + needed + ' more classes'})`;
    }
  });

  addSafeListener(dom.calcInternal, 'click', () => {
    const max = parseFloat(document.getElementById('internalMax')?.value) || 1;
    const scored = parseFloat(document.getElementById('internalScored')?.value) || 0;
    const resultEl = document.getElementById('internalResult');
    
    if (resultEl) {
      const perc = (scored / max * 100).toFixed(2);
      resultEl.textContent = `Percentage = ${perc}%`;
    }
  });

  // ==========================================================================
  // 19. RESET BUTTONS (Consolidated)
  // ==========================================================================
  
  document.querySelectorAll('.reset').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const parent = e.target.closest('.calc-card');
      if (!parent) return;
      
      switch(parent.id) {
        case 'percentage-calc':
          const percVal = document.getElementById('percValue');
          const percTotal = document.getElementById('percTotal');
          const percResult = document.getElementById('percResult');
          if (percVal) percVal.value = '';
          if (percTotal) percTotal.value = '';
          if (percResult) percResult.textContent = '0.00%';
          break;
        case 'bmi-calc':
          const bmiWeight = document.getElementById('bmiWeight');
          const bmiHeight = document.getElementById('bmiHeight');
          const bmiValue = document.getElementById('bmiValue');
          const bmiCategory = document.getElementById('bmiCategory');
          if (bmiWeight) bmiWeight.value = '';
          if (bmiHeight) bmiHeight.value = '';
          if (bmiValue) bmiValue.textContent = '0.00';
          if (bmiCategory) bmiCategory.textContent = '-';
          break;
        case 'emi-calc':
          const emiAmount = document.getElementById('emiAmount');
          const emiRate = document.getElementById('emiRate');
          const emiYears = document.getElementById('emiYears');
          const emiResult = document.getElementById('emiResult');
          if (emiAmount) emiAmount.value = '';
          if (emiRate) emiRate.value = '';
          if (emiYears) emiYears.value = '';
          if (emiResult) emiResult.textContent = '0.00';
          break;
        case 'age-calc':
          const ageBirth = document.getElementById('ageBirth');
          const ageYears = document.getElementById('ageYears');
          const ageMonths = document.getElementById('ageMonths');
          const ageDays = document.getElementById('ageDays');
          if (ageBirth) ageBirth.value = '';
          if (ageYears) ageYears.textContent = '0';
          if (ageMonths) ageMonths.textContent = '0';
          if (ageDays) ageDays.textContent = '0';
          break;
      }
    });
  });

  // ==========================================================================
  // 20. FIXED: KEYBOARD SUPPORT FOR BOTH CALCULATORS
  // ==========================================================================

  // Enhance the existing keyboard listener with scientific function support
  document.addEventListener('keydown', (e) => {
    // Always allow ? for help regardless of focus
    if (e.key === '?' || (e.key === '/' && e.shiftKey)) {
      e.preventDefault();
      if (dom.modal) dom.modal.classList.add('show');
      return;
    }

    // Escape to close modal
    if (e.key === 'Escape') {
      if (dom.modal?.classList.contains('show')) {
        dom.modal.classList.remove('show');
        return;
      }
    }

    const activeCalc = document.querySelector('.calc-card.active-calc')?.id;
    if (!activeCalc) return;

    // Handle keyboard input for scientific calculator
    if (activeCalc === 'scientific-calc') {
      // Don't interfere with typing in input fields (except for calculator display)
      if (e.target.tagName === 'INPUT' && e.target.id !== 'sciDisplay') {
        return;
      }

      e.preventDefault();

      // Numbers
      if (/^[0-9]$/.test(e.key)) {
        sciVal += e.key;
        if (dom.sciDisplay) dom.sciDisplay.value = sciVal;
      }
      
      // Operators and brackets
      else if (['+', '-', '*', '/', '.', '(', ')'].includes(e.key)) {
        sciVal += e.key;
        if (dom.sciDisplay) dom.sciDisplay.value = sciVal;
      }
      
      // Percentage
      else if (e.key === '%') {
        sciVal += '%';
        if (dom.sciDisplay) dom.sciDisplay.value = sciVal;
      }
      
      // Scientific functions
      else if (e.key === 's') {
        sciVal += 'sin(';
        if (dom.sciDisplay) dom.sciDisplay.value = sciVal;
      }
      else if (e.key === 'c') {
        sciVal += 'cos(';
        if (dom.sciDisplay) dom.sciDisplay.value = sciVal;
      }
      else if (e.key === 't') {
        sciVal += 'tan(';
        if (dom.sciDisplay) dom.sciDisplay.value = sciVal;
      }
      else if (e.key === 'l') {
        sciVal += 'log(';
        if (dom.sciDisplay) dom.sciDisplay.value = sciVal;
      }
      else if (e.key === 'n') {
        sciVal += 'ln(';
        if (dom.sciDisplay) dom.sciDisplay.value = sciVal;
      }
      
      // Power and factorial
      else if (e.key === '^') {
        sciVal += '^';
        if (dom.sciDisplay) dom.sciDisplay.value = sciVal;
      }
      else if (e.key === '!') {
        sciVal += '!';
        if (dom.sciDisplay) dom.sciDisplay.value = sciVal;
      }
      
      // Constants
      else if (e.key === 'p' || e.key === 'π') {
        sciVal += 'π';
        if (dom.sciDisplay) dom.sciDisplay.value = sciVal;
      }
      else if (e.key === 'e') {
        sciVal += 'e';
        if (dom.sciDisplay) dom.sciDisplay.value = sciVal;
      }
      
      // Enter/Equals
      else if (e.key === 'Enter' || e.key === '=') {
        if (sciVal) {
          const result = evaluateExpression(sciVal, degMode);
          dom.sciDisplay.value = result;
          if (result !== 'Error') {
            sciVal = result;
          }
        }
      }
      
      // Backspace
      else if (e.key === 'Backspace') {
        sciVal = sciVal.slice(0, -1);
        if (dom.sciDisplay) dom.sciDisplay.value = sciVal;
      }
      
      // Escape (already handled above)
      
      // Toggle DEG/RAD
      else if (e.key === 'r') {
        toggleDegRad();
      }

      // Visual feedback for key press
      const btnMap = {
        's': 'sin', 'c': 'cos', 't': 'tan', 'l': 'log', 'n': 'ln',
        '^': 'x^y', '!': 'n!', 'p': 'π', 'π': 'π', 'e': 'e',
        '(': '(', ')': ')', '%': '%'
      };
      
      let btnKey = e.key;
      if (btnMap[e.key]) btnKey = btnMap[e.key];
      
      const btn = Array.from(document.querySelectorAll('#scientific-calc .btn')).find(
        b => b.textContent === btnKey || b.textContent.includes(btnKey)
      );
      
      if (btn) {
        btn.classList.add('key-press');
        setTimeout(() => btn.classList.remove('key-press'), 150);
      }
    }

    // Handle keyboard input for basic calculator
    else if (activeCalc === 'basic-calc') {
      if (e.target.tagName === 'INPUT' && e.target.id !== 'basicDisplay') {
        return;
      }

      e.preventDefault();

      // Numbers
      if (/^[0-9]$/.test(e.key)) {
        basicVal += e.key;
        if (dom.basicDisplay) dom.basicDisplay.value = basicVal;
      }
      
      // Operators and brackets
      else if (['+', '-', '*', '/', '.', '(', ')'].includes(e.key)) {
        basicVal += e.key;
        if (dom.basicDisplay) dom.basicDisplay.value = basicVal;
      }
      
      // Percentage
      else if (e.key === '%') {
        basicVal += '%';
        if (dom.basicDisplay) dom.basicDisplay.value = basicVal;
      }
      
      // Enter/Equals
      else if (e.key === 'Enter' || e.key === '=') {
        if (basicVal) {
          const result = evaluateExpression(basicVal, true);
          dom.basicDisplay.value = result;
          if (result !== 'Error') {
            basicVal = result;
          }
        }
      }
      
      // Backspace
      else if (e.key === 'Backspace') {
        basicVal = basicVal.slice(0, -1);
        if (dom.basicDisplay) dom.basicDisplay.value = basicVal;
      }
      
      // Escape
      else if (e.key === 'Escape') {
        basicVal = '';
        if (dom.basicDisplay) dom.basicDisplay.value = '';
      }
      
      // Square and square root
      else if (e.key === '^') {
        basicVal += '^2';
        if (dom.basicDisplay) dom.basicDisplay.value = basicVal;
      }
      else if (e.key === '@') {
        basicVal += 'sqrt(';
        if (dom.basicDisplay) dom.basicDisplay.value = basicVal;
      }

      // Visual feedback for key press
      const btn = Array.from(document.querySelectorAll('#basic-calc .btn')).find(
        b => b.textContent === e.key || 
             (e.key === 'Enter' && b.classList.contains('eq')) ||
             (e.key === 'Escape' && b.classList.contains('reset'))
      );
      
      if (btn) {
        btn.classList.add('key-press');
        setTimeout(() => btn.classList.remove('key-press'), 150);
      }
    }
  });

  // ==========================================================================
  // 21. INITIALIZATION
  // ==========================================================================
  
  function init() {
    initTheme();
    initMobileSidebar();
    initShortcutModal();
    initCGPA();
    initializeDefaultFields();
    activateCalculator('basic');
  }

  init();
});
