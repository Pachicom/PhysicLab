(() => { // Создаёт изолированную функцию, чтобы переменные не попадали в глобальную область.
  "use strict"; // Включает строгий режим JavaScript, помогающий находить ошибки.
  const $ = (selector) => document.querySelector(selector); // Объявляет константу для элемента, функции или значения, используемого ниже.

  // Навигация между разделами.
  const pages = { lab: $("#labPage"), quiz: $("#quizPage"), research: $("#researchPage") }; // Объявляет константу для элемента, функции или значения, используемого ниже.
  document.querySelectorAll(".nav-button").forEach(button => { // Обращается к элементу страницы или API браузера и выполняет действие.
    button.addEventListener("click", () => { // Назначает обработчик события пользователя или браузера.
      document.querySelectorAll(".nav-button").forEach(item => item.classList.toggle("active", item === button)); // Обращается к элементу страницы или API браузера и выполняет действие.
      Object.entries(pages).forEach(([key, page]) => page.classList.toggle("hidden", key !== button.dataset.page)); // Вычисляет значение или обновляет состояние, используемое приложением.
      if (button.dataset.page === "lab") resizeCanvases(); // Проверяет условие и выполняет блок только при его истинности.
      if (button.dataset.page === "quiz" && !quizStarted) startQuiz(); // Проверяет условие и выполняет блок только при его истинности.
      window.scrollTo({ top: 0, behavior: "smooth" }); // Обращается к элементу страницы или API браузера и выполняет действие.
    }); // Закрывает блок функции, условия, цикла или обработчика.
  }); // Закрывает блок функции, условия, цикла или обработчика.
  $("#goToLab").addEventListener("click", () => document.querySelector('[data-page="lab"]').click()); // Назначает обработчик события пользователя или браузера.

  // ---------- Дополнительные модели: создаём вкладки и панели автоматически. // Объясняет назначение следующего блока кода.
  const advancedSpecs = [ // Хранит описания десяти новых учебных экспериментов.
    { id:"gravity", tab:"05 / Тяготение", title:"Закон всемирного тяготения Ньютона", group:"PHYSICS / 05", description:"Измени массы тел и расстояние между ними: сила притяжения зависит от произведения масс и обратно пропорциональна квадрату расстояния.", formula:"F = G · m₁ · m₂ / r²", note:"При увеличении расстояния в 2 раза сила уменьшается в 4 раза.", controls:[{key:"m1",label:"Масса первого тела",unit:"кг",min:1,max:20,step:1,value:8},{key:"m2",label:"Масса второго тела",unit:"кг",min:1,max:20,step:1,value:12},{key:"r",label:"Расстояние между телами",unit:"м",min:1,max:10,step:0.5,value:4}]}, // Задаёт параметры гравитационной модели.
    { id:"refraction", tab:"06 / Преломление", title:"Закон преломления света", group:"PHYSICS / 06", description:"Сравни угол падения и угол преломления при переходе луча между двумя средами с разными показателями преломления.", formula:"n₁ sin θ₁ = n₂ sin θ₂", note:"Если свет переходит в оптически более плотную среду, луч отклоняется к нормали.", controls:[{key:"angle",label:"Угол падения",unit:"°",min:5,max:80,step:1,value:40},{key:"n1",label:"Показатель среды 1",unit:"",min:1,max:2,step:0.1,value:1},{key:"n2",label:"Показатель среды 2",unit:"",min:1,max:2.5,step:0.1,value:1.5}]}, // Задаёт параметры оптической модели.
    { id:"energy", tab:"07 / Энергия", title:"Закон сохранения механической энергии", group:"PHYSICS / 07", description:"Наблюдай, как потенциальная энергия переходит в кинетическую при движении тела вниз без потерь на трение.", formula:"E = Eₚ + Eₖ = mgh + mv²/2", note:"В идеальной системе полная механическая энергия остаётся постоянной.", controls:[{key:"height",label:"Начальная высота",unit:"м",min:1,max:20,step:1,value:10},{key:"position",label:"Пройденная доля пути",unit:"%",min:0,max:100,step:1,value:35},{key:"mass",label:"Масса тела",unit:"кг",min:1,max:10,step:1,value:2}]}, // Задаёт параметры модели энергии.
    { id:"laplace", tab:"08 / Лаплас", title:"Закон Лапласа для поверхностей", group:"PHYSICS / 08", description:"Модель мыльного пузыря: перепад давления зависит от поверхностного натяжения и радиуса. Для пузыря с двумя поверхностями используется множитель 4.", formula:"ΔP = 4γ / r", note:"При уменьшении радиуса пузыря перепад давления возрастает.", controls:[{key:"gamma",label:"Поверхностное натяжение γ",unit:"мН/м",min:10,max:80,step:5,value:30},{key:"radius",label:"Радиус пузыря",unit:"мм",min:2,max:30,step:1,value:10}]}, // Задаёт параметры закона Лапласа для мыльного пузыря.
    { id:"wave", tab:"09 / Волна", title:"Волновое уравнение", group:"PHYSICS / 09", description:"Меняй амплитуду, частоту и скорость распространения волны. График показывает мгновенную форму бегущей синусоидальной волны.", formula:"∂²y/∂t² = v² · ∂²y/∂x²;  λ = v/f", note:"При неизменной скорости рост частоты уменьшает длину волны.", controls:[{key:"amplitude",label:"Амплитуда",unit:"см",min:1,max:10,step:1,value:5},{key:"frequency",label:"Частота",unit:"Гц",min:1,max:10,step:1,value:3},{key:"speed",label:"Скорость волны",unit:"м/с",min:1,max:20,step:1,value:12}]}, // Задаёт параметры волновой модели.
    { id:"euclid", tab:"10 / Евклид", title:"Евклидова геометрия", group:"GEOMETRY / 10", description:"Изменяй два угла треугольника и наблюдай, как третий определяется евклидовой геометрией. Сумма внутренних углов плоского треугольника равна 180°.", formula:"α + β + γ = 180°", note:"Модель относится к обычной плоской геометрии, а не к поверхности сферы.", controls:[{key:"alpha",label:"Угол α",unit:"°",min:20,max:100,step:1,value:55},{key:"beta",label:"Угол β",unit:"°",min:20,max:100,step:1,value:65}]}, // Задаёт параметры плоского треугольника.
    { id:"cycloid", tab:"11 / Циклоида", title:"Циклоида — траектория точки колеса", group:"GEOMETRY / 11", description:"Точка на ободе катящегося без скольжения круга описывает циклоиду. Перемещай параметр и смотри, как точка проходит по кривой.", formula:"x = R(t − sin t),  y = R(1 − cos t)", note:"За один полный оборот круг проходит расстояние 2πR.", controls:[{key:"radius",label:"Радиус круга",unit:"усл. ед.",min:1,max:5,step:0.5,value:3},{key:"progress",label:"Положение точки",unit:"°",min:0,max:720,step:5,value:120}]}, // Задаёт параметры циклоиды.
    { id:"similarity", tab:"12 / Подобие", title:"Подобие треугольников", group:"GEOMETRY / 12", description:"У подобных треугольников соответствующие углы равны, а соответствующие стороны пропорциональны. Изменяй масштаб второго треугольника.", formula:"a′/a = b′/b = c′/c = k", note:"Площади подобных фигур относятся как квадрат коэффициента подобия: S′/S = k².", controls:[{key:"a",label:"Сторона a",unit:"см",min:2,max:10,step:1,value:4},{key:"scale",label:"Коэффициент подобия k",unit:"×",min:0.5,max:3,step:0.1,value:1.5}]}, // Задаёт параметры подобия треугольников.
    { id:"minimal", tab:"13 / Мин. поверхность", title:"Уравнение Лапласа и минимальные поверхности", group:"GEOMETRY / 13", description:"Исследуй проволочную поверхность в форме катеноида — пример минимальной поверхности. Уравнение Лапласа Δu = 0 описывает гармонические функции и приближённо связано с минимальными поверхностями при малых наклонах; общее уравнение минимальной поверхности нелинейно.", formula:"Δu = uₓₓ + uᵧᵧ = 0 (приближение);  div(∇u/√(1+|∇u|²)) = 0", note:"Это учебная визуализация катеноида, а не численный решатель общего уравнения минимальной поверхности.", controls:[{key:"waist",label:"Радиус горловины",unit:"усл. ед.",min:0.5,max:2.5,step:0.1,value:1.2},{key:"height",label:"Высота поверхности",unit:"усл. ед.",min:1,max:4,step:0.2,value:2.5}]} // Задаёт параметры визуализации минимальной поверхности.
  ]; // Завершает список конфигураций дополнительных моделей.
  const advancedPanels = {}; // Создаёт объект для хранения новых панелей.
  const tabHost = document.querySelector('.segmented'); // Находит контейнер вкладок лаборатории.
  const panelHost = document.querySelector('#ohmPanel').parentElement; // Находит общий контейнер моделей.
  advancedSpecs.forEach((spec, index) => { // Создаёт интерфейс для каждого дополнительного эксперимента.
    const tab = document.createElement('button'); // Создаёт кнопку вкладки.
    tab.className = 'model-tab'; // Применяет стиль существующих вкладок.
    tab.dataset.model = spec.id; // Связывает вкладку с конкретной моделью.
    tab.setAttribute('role', 'tab'); // Объявляет кнопку частью набора вкладок для доступности.
    tab.setAttribute('aria-selected', 'false'); // Указывает, что новая вкладка пока не выбрана.
    tab.textContent = spec.tab; // Показывает короткое название эксперимента.
    tabHost.appendChild(tab); // Добавляет вкладку в лабораторию.
    const panel = document.createElement('div'); // Создаёт контейнер панели модели.
    panel.id = `${spec.id}Panel`; // Присваивает панели уникальный идентификатор.
    panel.className = 'model-layout hidden advanced-model'; // Скрывает панель до выбора и применяет сетку.
    const controls = spec.controls.map((control, i) => `<div class="control-group"><div class="control-title"><label for="${spec.id}-${control.key}">${control.label}</label><output id="${spec.id}-${control.key}-out">${control.value} ${control.unit}</output></div><input id="${spec.id}-${control.key}" data-key="${control.key}" type="range" min="${control.min}" max="${control.max}" step="${control.step}" value="${control.value}"><div class="range-labels"><span>${control.min}</span><span>${control.max} ${control.unit}</span></div></div>`).join(''); // Создаёт подписанные ползунки управления параметрами модели.
    panel.innerHTML = `<article class="panel visual-panel"><div class="panel-top"><div><span class="tiny-label">${spec.group}</span><h3>${spec.title}</h3></div><span class="live-pill"><i></i> ИНТЕРАКТИВНАЯ МОДЕЛЬ</span></div><p class="panel-description">${spec.description}</p><div class="canvas-wrap advanced-canvas-wrap"><canvas id="${spec.id}Canvas" aria-label="Интерактивная модель: ${spec.title}"></canvas><div class="canvas-caption"><span>СХЕМАТИЧЕСКАЯ ВИЗУАЛИЗАЦИЯ</span><span id="${spec.id}-status">ГОТОВО</span></div></div><div class="formula-box"><span>ФОРМУЛА МОДЕЛИ</span><div>${spec.formula}</div><p>${spec.note}</p></div></article><aside class="panel controls-panel"><div class="panel-top"><div><span class="tiny-label">ПАРАМЕТРЫ</span><h3>Измени условия</h3></div><span class="number-chip">${String(index + 5).padStart(2,'0')}</span></div>${controls}<div class="metrics-grid single"><div class="metric"><span>РАСЧЁТ МОДЕЛИ</span><strong id="${spec.id}-result">—</strong><em id="${spec.id}-detail">Изменяй ползунки для наблюдения.</em></div></div><button class="button secondary advanced-reset" data-reset="${spec.id}">↺ Сбросить параметры</button></aside>`; // Заполняет панель описанием, холстом, формулой, настройками и результатами.
    panelHost.appendChild(panel); // Добавляет панель после существующих моделей.
    advancedPanels[spec.id] = panel; // Сохраняет ссылку на панель для переключения вкладок.
  }); // Завершает создание динамических вкладок и панелей.
  const advancedState = Object.fromEntries(advancedSpecs.map(spec => [spec.id, Object.fromEntries(spec.controls.map(control => [control.key, control.value]))])); // Сохраняет текущие значения ползунков всех новых моделей.
  advancedSpecs.forEach(spec => { // Настраивает события для параметров каждой модели.
    const panel = advancedPanels[spec.id]; // Получает панель текущего эксперимента.
    panel.querySelectorAll('input[type="range"]').forEach(input => input.addEventListener('input', () => { // Следит за изменением любого ползунка.
      advancedState[spec.id][input.dataset.key] = Number(input.value); // Сохраняет новое числовое значение параметра.
      panel.querySelector(`#${spec.id}-${input.dataset.key}-out`).textContent = `${input.value} ${spec.controls.find(c => c.key === input.dataset.key).unit}`; // Обновляет текстовое значение рядом с ползунком.
      drawAdvancedModels(); // Пересчитывает и перерисовывает все дополнительные модели.
    })); // Завершает настройку обработчика ползунка.
    panel.querySelector('.advanced-reset').addEventListener('click', () => { // Обрабатывает нажатие кнопки сброса.
      spec.controls.forEach(control => { advancedState[spec.id][control.key] = control.value; const input = panel.querySelector(`[data-key="${control.key}"]`); input.value = control.value; panel.querySelector(`#${spec.id}-${control.key}-out`).textContent = `${control.value} ${control.unit}`; }); // Возвращает все параметры к исходным значениям.
      drawAdvancedModels(); // Перерисовывает модель после сброса.
    }); // Завершает обработчик кнопки сброса.
  }); // Завершает настройку всех дополнительных моделей.

  // Переключение двух учебных моделей.
  const pendulumPanel = $("#pendulumPanel"); // Объявляет константу для элемента, функции или значения, используемого ниже.
  const trianglePanel = $("#trianglePanel"); // Объявляет константу для элемента, функции или значения, используемого ниже.
  const springPanel = $("#springPanel"); // Объявляет константу для элемента, функции или значения, используемого ниже.
  const ohmPanel = $("#ohmPanel"); // Объявляет константу для элемента, функции или значения, используемого ниже.
  const modelPanels = { pendulum: pendulumPanel, triangle: trianglePanel, spring: springPanel, ohm: ohmPanel, ...advancedPanels }; // Объединяет старые и новые панели в общий список вкладок.
  document.querySelectorAll(".model-tab").forEach(button => { // Обращается к элементу страницы или API браузера и выполняет действие.
    button.addEventListener("click", () => { // Назначает обработчик события пользователя или браузера.
      document.querySelectorAll(".model-tab").forEach(item => { // Обращается к элементу страницы или API браузера и выполняет действие.
        item.classList.toggle("active", item === button); // Вычисляет значение или обновляет состояние, используемое приложением.
        item.setAttribute("aria-selected", String(item === button)); // Вычисляет значение или обновляет состояние, используемое приложением.
      }); // Закрывает блок функции, условия, цикла или обработчика.
      Object.entries(modelPanels).forEach(([key, panel]) => panel.classList.toggle("hidden", key !== button.dataset.model)); // Вычисляет значение или обновляет состояние, используемое приложением.
      resizeCanvases(); // Выполняет очередной шаг логики приложения.
    }); // Закрывает блок функции, условия, цикла или обработчика.
  }); // Закрывает блок функции, условия, цикла или обработчика.

  // ---------- Маятник ----------
  const pCanvas = $("#pendulumCanvas"); // Объявляет константу для элемента, функции или значения, используемого ниже.
  const pCtx = pCanvas.getContext("2d"); // Объявляет константу для элемента, функции или значения, используемого ниже.
  const lengthSlider = $("#lengthSlider"); // Объявляет константу для элемента, функции или значения, используемого ниже.
  const angleSlider = $("#angleSlider"); // Объявляет константу для элемента, функции или значения, используемого ниже.
  const gravitySlider = $("#gravitySlider"); // Объявляет константу для элемента, функции или значения, используемого ниже.
  let running = false; // Объявляет переменную, значение которой может изменяться во время работы.
  let elapsed = 0; // Объявляет переменную, значение которой может изменяться во время работы.
  let previousTimestamp = null; // Объявляет переменную, значение которой может изменяться во время работы.
  let lastDrawTime = 0; // Объявляет переменную, значение которой может изменяться во время работы.

  function pendulumValues() { // Объявляет функцию, выполняющую указанную задачу.
    const L = Number(lengthSlider.value); // Объявляет константу для элемента, функции или значения, используемого ниже.
    const angle = Number(angleSlider.value); // Объявляет константу для элемента, функции или значения, используемого ниже.
    const g = Number(gravitySlider.value); // Объявляет константу для элемента, функции или значения, используемого ниже.
    const period = 2 * Math.PI * Math.sqrt(L / g); // Объявляет константу для элемента, функции или значения, используемого ниже.
    return { L, angle, g, period, frequency: 1 / period }; // Возвращает вычисленное значение вызывающему коду.
  } // Закрывает блок функции, условия, цикла или обработчика.
  function updatePendulumMetrics() { // Объявляет функцию, выполняющую указанную задачу.
    const v = pendulumValues(); // Объявляет константу для элемента, функции или значения, используемого ниже.
    $("#lengthOutput").textContent = `${v.L.toFixed(1)} м`; // Обращается к элементу страницы или API браузера и выполняет действие.
    $("#angleOutput").textContent = `${v.angle}°`; // Обращается к элементу страницы или API браузера и выполняет действие.
    $("#gravityOutput").textContent = `${v.g.toFixed(2)} м/с²`; // Обращается к элементу страницы или API браузера и выполняет действие.
    $("#periodValue").innerHTML = `${v.period.toFixed(2)} <small>с</small>`; // Обращается к элементу страницы или API браузера и выполняет действие.
    $("#frequencyValue").innerHTML = `${v.frequency.toFixed(2)} <small>Гц</small>`; // Обращается к элементу страницы или API браузера и выполняет действие.
    drawPendulum(); // Выполняет очередной шаг логики приложения.
  } // Закрывает блок функции, условия, цикла или обработчика.
  function fitCanvas(canvas, ctx) { // Объявляет функцию, выполняющую указанную задачу.
    const rect = canvas.getBoundingClientRect(); // Объявляет константу для элемента, функции или значения, используемого ниже.
    const dpr = Math.min(window.devicePixelRatio || 1, 2); // Объявляет константу для элемента, функции или значения, используемого ниже.
    const width = Math.max(1, Math.round(rect.width * dpr)); // Объявляет константу для элемента, функции или значения, используемого ниже.
    const height = Math.max(1, Math.round(rect.height * dpr)); // Объявляет константу для элемента, функции или значения, используемого ниже.
    if (canvas.width !== width || canvas.height !== height) { // Проверяет условие и выполняет блок только при его истинности.
      canvas.width = width; // Вычисляет значение или обновляет состояние, используемое приложением.
      canvas.height = height; // Вычисляет значение или обновляет состояние, используемое приложением.
    } // Закрывает блок функции, условия, цикла или обработчика.
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // Выполняет очередной шаг логики приложения.
    return { width: rect.width, height: rect.height }; // Возвращает вычисленное значение вызывающему коду.
  } // Закрывает блок функции, условия, цикла или обработчика.
  function drawPendulum() { // Объявляет функцию, выполняющую указанную задачу.
    const { width, height } = fitCanvas(pCanvas, pCtx); // Объявляет константу для элемента, функции или значения, используемого ниже.
    const ctx = pCtx; // Объявляет константу для элемента, функции или значения, используемого ниже.
    ctx.clearRect(0, 0, width, height); // Выполняет очередной шаг логики приложения.
    // Фоновая сетка.
    ctx.strokeStyle = "rgba(151,169,220,.055)"; // Вычисляет значение или обновляет состояние, используемое приложением.
    ctx.lineWidth = 1; // Вычисляет значение или обновляет состояние, используемое приложением.
    for (let x = 0; x < width; x += 28) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke(); } // Повторяет действие для каждого шага цикла.
    for (let y = 0; y < height; y += 28) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); } // Повторяет действие для каждого шага цикла.

    const v = pendulumValues(); // Объявляет константу для элемента, функции или значения, используемого ниже.
    const pivotX = width / 2; // Объявляет константу для элемента, функции или значения, используемого ниже.
    const pivotY = Math.max(34, height * 0.15); // Объявляет константу для элемента, функции или значения, используемого ниже.
    const rodLength = Math.min(height * .62, width * .37) * (.65 + .35 * (v.L / 3)); // Объявляет константу для элемента, функции или значения, используемого ниже.
    const theta0 = v.angle * Math.PI / 180; // Объявляет константу для элемента, функции или значения, используемого ниже.
    const omega = Math.sqrt(v.g / v.L); // Объявляет константу для элемента, функции или значения, используемого ниже.
    const theta = running ? theta0 * Math.cos(omega * elapsed) : theta0; // Объявляет константу для элемента, функции или значения, используемого ниже.
    const bobX = pivotX + rodLength * Math.sin(theta); // Объявляет константу для элемента, функции или значения, используемого ниже.
    const bobY = pivotY + rodLength * Math.cos(theta); // Объявляет константу для элемента, функции или значения, используемого ниже.

    // Дуга возможного движения.
    ctx.beginPath(); // Выполняет очередной шаг логики приложения.
    ctx.arc(pivotX, pivotY, rodLength, Math.PI / 2 - theta0, Math.PI / 2 + theta0); // Выполняет очередной шаг логики приложения.
    ctx.strokeStyle = "rgba(146,113,255,.32)"; // Вычисляет значение или обновляет состояние, используемое приложением.
    ctx.setLineDash([4, 5]); ctx.stroke(); ctx.setLineDash([]); // Выполняет очередной шаг логики приложения.

    // Опора.
    ctx.fillStyle = "#9aa9c9"; // Вычисляет значение или обновляет состояние, используемое приложением.
    ctx.fillRect(pivotX - 45, pivotY - 8, 90, 5); // Выполняет очередной шаг логики приложения.
    ctx.fillStyle = "#677799"; // Вычисляет значение или обновляет состояние, используемое приложением.
    for (let i = 0; i < 5; i++) { // Повторяет действие для каждого шага цикла.
      ctx.beginPath(); ctx.moveTo(pivotX - 38 + i * 18, pivotY - 3); ctx.lineTo(pivotX - 45 + i * 18, pivotY + 5); ctx.strokeStyle = "#677799"; ctx.stroke(); // Вычисляет значение или обновляет состояние, используемое приложением.
    } // Закрывает блок функции, условия, цикла или обработчика.
    // Нить и груз.
    ctx.beginPath(); ctx.moveTo(pivotX, pivotY); ctx.lineTo(bobX, bobY); // Выполняет очередной шаг логики приложения.
    ctx.strokeStyle = "#b8c8ef"; ctx.lineWidth = 2; ctx.stroke(); // Вычисляет значение или обновляет состояние, используемое приложением.
    ctx.beginPath(); ctx.arc(pivotX, pivotY, 5, 0, Math.PI * 2); ctx.fillStyle = "#f4f6ff"; ctx.fill(); // Вычисляет значение или обновляет состояние, используемое приложением.
    const gradient = ctx.createRadialGradient(bobX - 7, bobY - 8, 2, bobX, bobY, 22); // Объявляет константу для элемента, функции или значения, используемого ниже.
    gradient.addColorStop(0, "#e4dcff"); gradient.addColorStop(.35, "#a28aff"); gradient.addColorStop(1, "#624bd1"); // Выполняет очередной шаг логики приложения.
    ctx.beginPath(); ctx.arc(bobX, bobY, 17, 0, Math.PI * 2); ctx.fillStyle = gradient; ctx.fill(); // Вычисляет значение или обновляет состояние, используемое приложением.
    ctx.strokeStyle = "rgba(198,185,255,.7)"; ctx.lineWidth = 1.5; ctx.stroke(); // Вычисляет значение или обновляет состояние, используемое приложением.
    ctx.beginPath(); ctx.arc(bobX, bobY, 23, 0, Math.PI * 2); ctx.strokeStyle = "rgba(146,113,255,.16)"; ctx.stroke(); // Вычисляет значение или обновляет состояние, используемое приложением.

    ctx.fillStyle = "#9caed3"; ctx.font = "11px Inter, Arial"; // Вычисляет значение или обновляет состояние, используемое приложением.
    ctx.fillText(`L = ${v.L.toFixed(1)} м`, 15, 23); // Вычисляет значение или обновляет состояние, используемое приложением.
    ctx.fillText(`θ = ${(theta * 180 / Math.PI).toFixed(1)}°`, 15, 41); // Вычисляет значение или обновляет состояние, используемое приложением.
    ctx.fillText(`t = ${elapsed.toFixed(1)} с`, 15, 59); // Вычисляет значение или обновляет состояние, используемое приложением.
    $("#motionLabel").textContent = running ? "ДВИЖЕНИЕ" : "ПАУЗА"; // Обращается к элементу страницы или API браузера и выполняет действие.
  } // Закрывает блок функции, условия, цикла или обработчика.
  function animatePendulum(timestamp) { // Объявляет функцию, выполняющую указанную задачу.
    if (!running) { previousTimestamp = null; return; } // Проверяет условие и выполняет блок только при его истинности.
    if (previousTimestamp !== null) elapsed += Math.min((timestamp - previousTimestamp) / 1000, .05); // Проверяет условие и выполняет блок только при его истинности.
    previousTimestamp = timestamp; // Вычисляет значение или обновляет состояние, используемое приложением.
    if (timestamp - lastDrawTime > 15) { drawPendulum(); lastDrawTime = timestamp; } // Проверяет условие и выполняет блок только при его истинности.
    requestAnimationFrame(animatePendulum); // Планирует следующий кадр анимации средствами браузера.
  } // Закрывает блок функции, условия, цикла или обработчика.
  $("#startPendulum").addEventListener("click", () => { // Назначает обработчик события пользователя или браузера.
    if (running) return; // Проверяет условие и выполняет блок только при его истинности.
    running = true; // Вычисляет значение или обновляет состояние, используемое приложением.
    $("#startPendulum").disabled = true; // Обращается к элементу страницы или API браузера и выполняет действие.
    $("#pausePendulum").disabled = false; // Обращается к элементу страницы или API браузера и выполняет действие.
    $("#motionLabel").textContent = "ДВИЖЕНИЕ"; // Обращается к элементу страницы или API браузера и выполняет действие.
    requestAnimationFrame(animatePendulum); // Планирует следующий кадр анимации средствами браузера.
  }); // Закрывает блок функции, условия, цикла или обработчика.
  $("#pausePendulum").addEventListener("click", () => { // Назначает обработчик события пользователя или браузера.
    running = false; // Вычисляет значение или обновляет состояние, используемое приложением.
    $("#startPendulum").disabled = false; // Обращается к элементу страницы или API браузера и выполняет действие.
    $("#pausePendulum").disabled = true; // Обращается к элементу страницы или API браузера и выполняет действие.
    $("#motionLabel").textContent = "ПАУЗА"; // Обращается к элементу страницы или API браузера и выполняет действие.
    drawPendulum(); // Выполняет очередной шаг логики приложения.
  }); // Закрывает блок функции, условия, цикла или обработчика.
  $("#resetPendulum").addEventListener("click", () => { // Назначает обработчик события пользователя или браузера.
    running = false; elapsed = 0; previousTimestamp = null; // Вычисляет значение или обновляет состояние, используемое приложением.
    $("#startPendulum").disabled = false; // Обращается к элементу страницы или API браузера и выполняет действие.
    $("#pausePendulum").disabled = true; // Обращается к элементу страницы или API браузера и выполняет действие.
    drawPendulum(); // Выполняет очередной шаг логики приложения.
  }); // Закрывает блок функции, условия, цикла или обработчика.
  [lengthSlider, angleSlider, gravitySlider].forEach(slider => slider.addEventListener("input", updatePendulumMetrics)); // Назначает обработчик события пользователя или браузера.

  // ---------- Геометрия ----------
  const tCanvas = $("#triangleCanvas"); // Объявляет константу для элемента, функции или значения, используемого ниже.
  const tCtx = tCanvas.getContext("2d"); // Объявляет константу для элемента, функции или значения, используемого ниже.
  function drawTriangle() { // Объявляет функцию, выполняющую указанную задачу.
    const { width, height } = fitCanvas(tCanvas, tCtx); // Объявляет константу для элемента, функции или значения, используемого ниже.
    const ctx = tCtx; // Объявляет константу для элемента, функции или значения, используемого ниже.
    ctx.clearRect(0, 0, width, height); // Выполняет очередной шаг логики приложения.
    ctx.strokeStyle = "rgba(151,169,220,.055)"; // Вычисляет значение или обновляет состояние, используемое приложением.
    for (let x = 0; x < width; x += 28) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke(); } // Повторяет действие для каждого шага цикла.
    for (let y = 0; y < height; y += 28) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); } // Повторяет действие для каждого шага цикла.

    const a = Number($("#aSlider").value), b = Number($("#bSlider").value); // Объявляет константу для элемента, функции или значения, используемого ниже.
    const c = Math.sqrt(a*a + b*b); // Объявляет константу для элемента, функции или значения, используемого ниже.
    const scale = Math.min((width - 100) / (a + 1), (height - 85) / (b + 1)); // Объявляет константу для элемента, функции или значения, используемого ниже.
    const unit = Math.min(scale, 28); // Объявляет константу для элемента, функции или значения, используемого ниже.
    const x0 = Math.max(36, (width - a * unit) / 2 - 10); // Объявляет константу для элемента, функции или значения, используемого ниже.
    const y0 = height - 52; // Объявляет константу для элемента, функции или значения, используемого ниже.
    const x1 = x0 + a * unit, y1 = y0; // Объявляет константу для элемента, функции или значения, используемого ниже.
    const x2 = x0, y2 = y0 - b * unit; // Объявляет константу для элемента, функции или значения, используемого ниже.

    ctx.beginPath(); ctx.moveTo(x0,y0); ctx.lineTo(x1,y1); ctx.lineTo(x2,y2); ctx.closePath(); // Выполняет очередной шаг логики приложения.
    const grad = ctx.createLinearGradient(x0,y2,x1,y0); grad.addColorStop(0,"rgba(109,228,231,.13)"); grad.addColorStop(1,"rgba(146,113,255,.19)"); // Объявляет константу для элемента, функции или значения, используемого ниже.
    ctx.fillStyle = grad; ctx.fill(); // Вычисляет значение или обновляет состояние, используемое приложением.
    ctx.strokeStyle = "#9d8aff"; ctx.lineWidth = 2.5; ctx.stroke(); // Вычисляет значение или обновляет состояние, используемое приложением.
    // Прямой угол.
    const q = Math.min(16, unit * .45); // Объявляет константу для элемента, функции или значения, используемого ниже.
    ctx.beginPath(); ctx.moveTo(x0,y0-q); ctx.lineTo(x0+q,y0-q); ctx.lineTo(x0+q,y0); // Выполняет очередной шаг логики приложения.
    ctx.strokeStyle = "#6de4e7"; ctx.lineWidth = 1.5; ctx.stroke(); // Вычисляет значение или обновляет состояние, используемое приложением.
    ctx.fillStyle = "#d9d2ff"; ctx.font = "bold 13px Inter, Arial"; // Вычисляет значение или обновляет состояние, используемое приложением.
    ctx.fillText(`a = ${a.toFixed(1)}`, (x0+x1)/2-22, y0+22); // Вычисляет значение или обновляет состояние, используемое приложением.
    ctx.fillText(`b = ${b.toFixed(1)}`, x0-4, (y0+y2)/2); // Вычисляет значение или обновляет состояние, используемое приложением.
    ctx.fillStyle = "#8de7e5"; ctx.fillText(`c = ${c.toFixed(2)}`, (x1+x2)/2+8, (y1+y2)/2-4); // Вычисляет значение или обновляет состояние, используемое приложением.
    ctx.fillStyle = "#9caed3"; ctx.font = "11px Inter, Arial"; ctx.fillText("90°", x0+q+5, y0-q-4); // Вычисляет значение или обновляет состояние, используемое приложением.
  } // Закрывает блок функции, условия, цикла или обработчика.
  function updateTriangle() { // Объявляет функцию, выполняющую указанную задачу.
    const a = Number($("#aSlider").value), b = Number($("#bSlider").value); // Объявляет константу для элемента, функции или значения, используемого ниже.
    const c = Math.sqrt(a*a + b*b); // Объявляет константу для элемента, функции или значения, используемого ниже.
    $("#aOutput").textContent = a.toFixed(1); // Обращается к элементу страницы или API браузера и выполняет действие.
    $("#bOutput").textContent = b.toFixed(1); // Обращается к элементу страницы или API браузера и выполняет действие.
    $("#hypotenuseValue").textContent = c.toFixed(2); // Обращается к элементу страницы или API браузера и выполняет действие.
    $("#substitution").textContent = `c = √(${a.toFixed(1)}² + ${b.toFixed(1)}²) = ${c.toFixed(2)}`; // Обращается к элементу страницы или API браузера и выполняет действие.
    drawTriangle(); // Выполняет очередной шаг логики приложения.
  } // Закрывает блок функции, условия, цикла или обработчика.
  $("#aSlider").addEventListener("input", updateTriangle); // Назначает обработчик события пользователя или браузера.
  $("#bSlider").addEventListener("input", updateTriangle); // Назначает обработчик события пользователя или браузера.

  // ---------- Эксперимент 3: закон Гука ----------
  const springCanvas = $("#springCanvas"); // Находим холст, на котором рисуется пружина.
  const springCtx = springCanvas.getContext("2d"); // Получаем инструменты двухмерного рисования.
  const forceSlider = $("#forceSlider"); // Ползунок приложенной силы в ньютонах.
  const springKSlider = $("#springKSlider"); // Ползунок жёсткости пружины в ньютонах на метр.
  let springProgress = 1; // Доля достигнутого растяжения: 0 — без растяжения, 1 — полное.
  let springAnimating = false; // Флаг плавного показа растяжения.
  let springAnimationStart = 0; // Время начала анимации растяжения.

  function springValues() { // Считает удлинение по закону Гука.
    const force = Number(forceSlider.value); // Считывает силу с ползунка.
    const k = Number(springKSlider.value); // Считывает жёсткость пружины.
    return { force, k, stretch: force / k }; // Возвращает силу, жёсткость и удлинение x = F / k.
  } // Закрывает блок функции, условия, цикла или обработчика.

  function drawSpring() { // Рисует пружину и груз на Canvas.
    const { width, height } = fitCanvas(springCanvas, springCtx); // Подгоняет разрешение холста под размер экрана.
    const ctx = springCtx; // Сокращает имя контекста для удобства.
    ctx.clearRect(0, 0, width, height); // Очищает предыдущий кадр.
    const values = springValues(); // Получает актуальные параметры опыта.
    const anchorX = width / 2; // Размещает точку крепления по центру.
    const anchorY = 35; // Задаёт вертикальную координату крепления.
    const naturalLength = Math.min(100, height * 0.32); // Выбирает длину пружины без растяжения.
    const stretchPixels = values.stretch * Math.min(22, height * 0.08); // Переводит метры удлинения в пиксели для рисунка.
    const shownStretch = stretchPixels * springProgress; // Применяет текущую долю анимации.
    const endY = anchorY + naturalLength + shownStretch; // Вычисляет положение нижнего конца пружины.
    ctx.strokeStyle = "rgba(151,169,220,.10)"; // Выбирает цвет вспомогательной сетки.
    for (let y = 25; y < height; y += 28) { ctx.beginPath(); ctx.moveTo(15, y); ctx.lineTo(width - 15, y); ctx.stroke(); } // Рисует горизонтальную сетку.
    ctx.fillStyle = "#9aa9c9"; // Задаёт цвет крепления.
    ctx.fillRect(anchorX - 48, anchorY - 8, 96, 7); // Рисует верхнюю опору.
    ctx.strokeStyle = "#b8c8ef"; // Задаёт цвет витков пружины.
    ctx.lineWidth = 2.5; // Устанавливает толщину линии пружины.
    ctx.beginPath(); // Начинает контур пружины.
    ctx.moveTo(anchorX, anchorY); // Начинает рисование от опоры.
    const coils = 12; // Определяет число зигзагообразных витков.
    const coilHeight = (naturalLength + shownStretch) / coils; // Вычисляет вертикальную высоту одного витка.
    for (let i = 1; i <= coils; i++) { ctx.lineTo(anchorX + (i % 2 ? 16 : -16), anchorY + i * coilHeight); } // Рисует зигзаг пружины.
    ctx.lineTo(anchorX, endY); // Подводит пружину к грузу.
    ctx.stroke(); // Отображает пружину.
    ctx.fillStyle = "#9271ff"; // Выбирает цвет груза.
    ctx.fillRect(anchorX - 27, endY, 54, 34); // Рисует груз на конце пружины.
    ctx.strokeStyle = "#c8baff"; // Выбирает цвет контура груза.
    ctx.strokeRect(anchorX - 27, endY, 54, 34); // Обводит груз.
    ctx.fillStyle = "#d9e2ff"; // Выбирает цвет поясняющей надписи.
    ctx.font = "12px Inter, Arial"; // Устанавливает шрифт надписи.
    ctx.fillText(`F = ${values.force} Н`, 18, 24); // Показывает приложенную силу.
    ctx.fillText(`k = ${values.k} Н/м`, 18, 43); // Показывает жёсткость пружины.
    ctx.fillText(`x = ${(values.stretch * springProgress).toFixed(2)} м`, 18, 62); // Показывает текущее удлинение.
    $("#springState").textContent = springAnimating ? "РАСТЯЖЕНИЕ" : "РАВНОВЕСИЕ"; // Обновляет подпись состояния.
  } // Закрывает блок функции, условия, цикла или обработчика.

  function updateSpring() { // Обновляет показатели закона Гука.
    const values = springValues(); // Получает рассчитанные параметры.
    $("#forceOutput").textContent = `${values.force} Н`; // Показывает выбранную силу.
    $("#springKOutput").textContent = `${values.k} Н/м`; // Показывает выбранную жёсткость.
    $("#stretchValue").innerHTML = `${values.stretch.toFixed(2)} <small>м</small>`; // Выводит удлинение с двумя знаками.
    $("#springForceValue").innerHTML = `${values.force} <small>Н</small>`; // Выводит силу с единицей измерения.
    drawSpring(); // Перерисовывает модель с новыми параметрами.
  } // Закрывает блок функции, условия, цикла или обработчика.

  function animateSpring(timestamp) { // Плавно показывает, как растягивается пружина.
    if (!springAnimating) return; // Прерывает кадры, если анимация остановлена.
    if (!springAnimationStart) springAnimationStart = timestamp; // Запоминает время первого кадра.
    springProgress = Math.min(1, (timestamp - springAnimationStart) / 900); // За 900 мс доводит растяжение до расчётного значения.
    drawSpring(); // Рисует текущий кадр растяжения.
    if (springProgress < 1) requestAnimationFrame(animateSpring); // Планирует следующий кадр до завершения анимации.
    else springAnimating = false; // Снимает флаг после завершения растяжения.
  } // Закрывает блок функции, условия, цикла или обработчика.

  $("#springAnimate").addEventListener("click", () => { springProgress = 0; springAnimating = true; springAnimationStart = 0; requestAnimationFrame(animateSpring); }); // Запускает плавное растяжение пружины.
  $("#springReset").addEventListener("click", () => { springAnimating = false; springProgress = 0; springAnimationStart = 0; drawSpring(); }); // Возвращает пружину к ненатянутому состоянию.
  [forceSlider, springKSlider].forEach(slider => slider.addEventListener("input", updateSpring)); // Пересчитывает модель при изменении ползунков.

  // ---------- Эксперимент 4: закон Ома ----------
  const ohmCanvas = $("#ohmCanvas"); // Находит холст для электрической цепи.
  const ohmCtx = ohmCanvas.getContext("2d"); // Получает контекст для рисования цепи.
  const voltageSlider = $("#voltageSlider"); // Находит ползунок напряжения.
  const resistanceSlider = $("#resistanceSlider"); // Находит ползунок сопротивления.
  let currentFlowing = true; // Определяет, движутся ли условные заряды по цепи.
  let currentAnimationTime = 0; // Хранит время для анимации движущихся точек.
  let lastOhmTimestamp = null; // Хранит время предыдущего кадра.

  function ohmValues() { // Рассчитывает электрические величины по закону Ома.
    const voltage = Number(voltageSlider.value); // Считывает напряжение в вольтах.
    const resistance = Number(resistanceSlider.value); // Считывает сопротивление в омах.
    const current = voltage / resistance; // Вычисляет силу тока I = U / R.
    return { voltage, resistance, current, power: voltage * current }; // Возвращает напряжение, сопротивление, ток и мощность P = U · I.
  } // Закрывает блок функции, условия, цикла или обработчика.

  function drawOhm() { // Рисует простую схему электрической цепи.
    const { width, height } = fitCanvas(ohmCanvas, ohmCtx); // Учитывает размер холста и плотность пикселей.
    const ctx = ohmCtx; // Сохраняет короткую ссылку на контекст рисования.
    ctx.clearRect(0, 0, width, height); // Очищает предыдущий кадр.
    const values = ohmValues(); // Получает текущие параметры цепи.
    const left = width * 0.2; // Определяет левую вертикальную часть цепи.
    const right = width * 0.8; // Определяет правую вертикальную часть цепи.
    const top = height * 0.25; // Определяет верхнюю часть цепи.
    const bottom = height * 0.72; // Определяет нижнюю часть цепи.
    ctx.strokeStyle = "#9db1d8"; // Выбирает цвет проводов.
    ctx.lineWidth = 3; // Устанавливает толщину проводов.
    ctx.beginPath(); // Начинает рисовать замкнутую цепь.
    ctx.moveTo(left, top); ctx.lineTo(right, top); ctx.lineTo(right, bottom); ctx.lineTo(left, bottom); ctx.lineTo(left, top); // Соединяет провода в прямоугольный контур.
    ctx.stroke(); // Отображает контур цепи.
    ctx.fillStyle = "#9271ff"; // Выбирает цвет резистора.
    ctx.fillRect(width / 2 - 34, top - 13, 68, 26); // Рисует резистор на верхнем проводе.
    ctx.strokeStyle = "#d7ccff"; // Выбирает цвет контура резистора.
    ctx.strokeRect(width / 2 - 34, top - 13, 68, 26); // Обводит резистор.
    ctx.strokeStyle = "#6de4e7"; // Выбирает цвет источника напряжения.
    ctx.lineWidth = 4; // Делает символ источника заметным.
    ctx.beginPath(); ctx.moveTo(left - 10, (top + bottom) / 2 - 15); ctx.lineTo(left + 10, (top + bottom) / 2 - 15); ctx.moveTo(left - 17, (top + bottom) / 2 + 15); ctx.lineTo(left + 17, (top + bottom) / 2 + 15); ctx.stroke(); // Рисует условный символ батареи.
    ctx.fillStyle = "#d9e2ff"; // Выбирает цвет подписей.
    ctx.font = "12px Inter, Arial"; // Устанавливает размер текста.
    ctx.fillText(`U = ${values.voltage} В`, left - 40, bottom + 25); // Показывает напряжение источника.
    ctx.fillText(`R = ${values.resistance} Ом`, width / 2 - 42, top - 25); // Подписывает резистор.
    ctx.fillText(`I = ${values.current.toFixed(2)} А`, right - 58, bottom + 25); // Показывает рассчитанную силу тока.
    if (currentFlowing) { // Рисует движущиеся точки только при включённом потоке.
      const perimeter = 2 * ((right - left) + (bottom - top)); // Вычисляет длину условного пути по контуру.
      for (let i = 0; i < 14; i++) { // Создаёт четырнадцать условных носителей заряда.
        let distance = (currentAnimationTime * 55 + i * perimeter / 14) % perimeter; // Вычисляет положение точки вдоль контура.
        let x = left; // Изначально ставит точку у левого провода.
        let y = top; // Изначально ставит точку на верхнем уровне.
        if (distance < right - left) { x += distance; y = top; } // Двигает точку по верхнему проводу слева направо.
        else if ((distance -= right - left) < bottom - top) { x = right; y = top + distance; } // Двигает точку вниз по правому проводу.
        else if ((distance -= bottom - top) < right - left) { x = right - distance; y = bottom; } // Двигает точку по нижнему проводу справа налево.
        else { distance -= right - left; x = left; y = bottom - distance; } // Двигает точку вверх по левому проводу.
        ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fillStyle = "#6de4e7"; ctx.fill(); // Рисует условный движущийся заряд.
      } // Закрывает блок функции, условия, цикла или обработчика.
    } // Закрывает блок функции, условия, цикла или обработчика.
    $("#currentState").textContent = currentFlowing ? "ТОК ВИЗУАЛИЗИРОВАН" : "АНИМАЦИЯ ОСТАНОВЛЕНА"; // Показывает состояние визуализации.
  } // Закрывает блок функции, условия, цикла или обработчика.

  function updateOhm() { // Обновляет вычисленные значения электрической цепи.
    const values = ohmValues(); // Получает результаты расчёта.
    $("#voltageOutput").textContent = `${values.voltage} В`; // Отображает напряжение.
    $("#resistanceOutput").textContent = `${values.resistance} Ом`; // Отображает сопротивление.
    $("#currentValue").innerHTML = `${values.current.toFixed(2)} <small>А</small>`; // Отображает силу тока.
    $("#powerValue").innerHTML = `${values.power.toFixed(1)} <small>Вт</small>`; // Отображает мощность.
    drawOhm(); // Перерисовывает схему цепи.
  } // Закрывает блок функции, условия, цикла или обработчика.

  function animateOhm(timestamp) { // Поддерживает плавное движение точек в цепи.
    if (lastOhmTimestamp !== null && currentFlowing) currentAnimationTime += Math.min((timestamp - lastOhmTimestamp) / 1000, 0.05); // Обновляет анимационное время с ограничением большого скачка.
    lastOhmTimestamp = timestamp; // Запоминает время текущего кадра.
    drawOhm(); // Рисует очередной кадр цепи.
    requestAnimationFrame(animateOhm); // Планирует следующий кадр для непрерывной визуализации.
  } // Закрывает блок функции, условия, цикла или обработчика.

  $("#toggleCurrent").addEventListener("click", () => { currentFlowing = !currentFlowing; $("#toggleCurrent").textContent = currentFlowing ? "Ⅱ Остановить поток" : "▶ Запустить поток"; drawOhm(); }); // Включает или останавливает движущиеся точки.
  $("#resetOhm").addEventListener("click", () => { voltageSlider.value = 6; resistanceSlider.value = 3; currentFlowing = true; currentAnimationTime = 0; updateOhm(); $("#toggleCurrent").textContent = "Ⅱ Остановить поток"; }); // Возвращает исходные параметры цепи.
  [voltageSlider, resistanceSlider].forEach(slider => slider.addEventListener("input", updateOhm)); // Пересчитывает ток и мощность при изменении параметров.

  // ---------- Отрисовка десяти дополнительных интерактивных моделей. // Объясняет назначение следующего блока кода.
  let animationClock = 0; // Хранит время непрерывной анимации в секундах.
  function drawAdvancedModels() { // Пересчитывает показатели и рисует каждый дополнительный эксперимент.
    advancedSpecs.forEach(spec => { // Перебирает все новые модели.
      const canvas = document.getElementById(`${spec.id}Canvas`); // Находит холст текущей модели.
      if (!canvas || !canvas.isConnected) return; // Пропускает отсутствующий или ещё не подключённый холст.
      const ctx = canvas.getContext('2d'); // Получает инструмент рисования Canvas.
      const rect = canvas.getBoundingClientRect(); // Определяет фактический размер холста на странице.
      if (rect.width < 20) return; // Не рисует в скрытой панели с нулевой шириной.
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // Ограничивает плотность пикселей для производительности.
      const desiredWidth = Math.round(rect.width * dpr); // Вычисляет необходимую ширину холста в физических пикселях.
      const desiredHeight = Math.round(Math.max(230, rect.height || 270) * dpr); // Вычисляет необходимую высоту холста в физических пикселях.
      if (canvas.width !== desiredWidth) canvas.width = desiredWidth; // Меняет ширину только при реальном изменении размера.
      if (canvas.height !== desiredHeight) canvas.height = desiredHeight; // Меняет высоту только при реальном изменении размера.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // Переводит рисование в CSS-пиксели.
      const w = rect.width; // Сохраняет ширину рабочей области.
      const h = Math.max(230, rect.height || 270); // Сохраняет высоту рабочей области.
      ctx.clearRect(0, 0, w, h); // Очищает предыдущий кадр.
      ctx.fillStyle = '#0b1120'; // Задаёт тёмный фон модели.
      ctx.fillRect(0, 0, w, h); // Закрашивает фон.
      ctx.strokeStyle = '#24314b'; // Задаёт цвет вспомогательной сетки.
      ctx.lineWidth = 1; // Устанавливает толщину сетки.
      for (let x = 20; x < w; x += 30) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); } // Рисует вертикальную сетку.
      for (let y = 20; y < h; y += 30) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); } // Рисует горизонтальную сетку.
      const state = advancedState[spec.id]; // Получает параметры выбранной модели.
      let result = ''; // Подготавливает главный вычисленный результат.
      let detail = ''; // Подготавливает пояснение результата.
      const line = (x1,y1,x2,y2,color='#a9b9d7',width=2) => { ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.strokeStyle=color; ctx.lineWidth=width; ctx.stroke(); }; // Рисует отрезок заданного цвета и толщины.
      const dot = (x,y,r,color) => { ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fillStyle=color; ctx.fill(); }; // Рисует круг для тела, точки или маркера.
      const label = (text,x,y,color='#e7edff',size=12) => { ctx.fillStyle=color; ctx.font=`${size}px system-ui`; ctx.fillText(text,x,y); }; // Выводит подпись на холсте.
      if (spec.id === 'gravity') { // Рисует два притягивающихся тела.
        const m1=state.m1, m2=state.m2, r=state.r, force=6.674e-11*m1*m2/(r*r); const y=h*0.48, x1=w*0.25, x2=w*0.75; // Рассчитывает силу тяготения в СИ и координаты тел.
        line(x1+24,y,x2-24,y,'#61739a',2); dot(x1,y,12+Math.sqrt(m1)*2,'#9e8bff'); dot(x2,y,12+Math.sqrt(m2)*2,'#63d9c3'); // Рисует линию расстояния и тела разных масс.
        line(x1+40,y,x1+85,y,'#9e8bff',3); line(x2-40,y,x2-85,y,'#63d9c3',3); // Показывает стрелками притяжение тел друг к другу.
        const orbitAngle = animationClock * 1.5; // Рассчитывает фазу движения частиц вокруг масс.
        for (let i=0;i<3;i++) { const phase=orbitAngle+i*Math.PI*2/3; dot(x1+Math.cos(phase)*30,y+Math.sin(phase)*24,3,'#d9caff'); dot(x2+Math.cos(-phase)*30,y+Math.sin(-phase)*24,3,'#b5fff0'); } // Анимирует частицы возле обоих притягивающихся тел.
        const pulse = 1 + .12 * Math.sin(animationClock * 3); dot((x1+x2)/2,y,4*pulse,'#ffbd75'); // Пульсирующая точка подчёркивает направление взаимодействия.
        label(`m₁ = ${m1} кг`,x1-25,y-42); label(`m₂ = ${m2} кг`,x2-25,y-42); label(`r = ${r} м`,w/2-22,y+35); label('F₁₂ = F₂₁',w/2-28,y+60,'#b6a9ff'); result=`${force.toExponential(2)} Н`; detail='Сила между указанными массами в модели СИ.'; // Отображает массу, расстояние и вычисленную силу.
      } else if (spec.id === 'refraction') { // Рисует падающий и преломлённый лучи.
        const a=state.angle*Math.PI/180, n1=state.n1, n2=state.n2, sint=n1*Math.sin(a)/n2, total=sint>1, b=total?Math.PI/2:Math.asin(sint), cx=w/2, cy=h/2; // Рассчитывает угол преломления по закону Снеллиуса и проверяет полное внутреннее отражение.
        ctx.fillStyle='#172944'; ctx.fillRect(0,cy,w,h/2); line(0,cy,w,cy,'#63d9c3',2); line(cx,20,cx,h-18,'#7788aa',1); // Рисует границу сред и нормаль.
        line(cx-130*Math.sin(a),cy-130*Math.cos(a),cx,cy,'#ffbd75',3); if(total){line(cx,cy,cx+130*Math.sin(a),cy-130*Math.cos(a),'#ffbd75',3);} else {line(cx,cy,cx+150*Math.sin(b),cy+150*Math.cos(b),'#8eabff',3);} // Рисует падающий и отражённый либо преломлённый луч.
        const rayT = (animationClock * .42) % 1; // Определяет положение светового импульса на луче.
        const rayStart = {x:cx-130*Math.sin(a),y:cy-130*Math.cos(a)}; dot(rayStart.x+(cx-rayStart.x)*rayT,rayStart.y+(cy-rayStart.y)*rayT,5,'#fff0b0'); // Двигает световой импульс по падающему лучу.
        const outEnd = total ? {x:cx+130*Math.sin(a),y:cy-130*Math.cos(a)} : {x:cx+150*Math.sin(b),y:cy+150*Math.cos(b)}; dot(cx+(outEnd.x-cx)*((animationClock*.42)%1),cy+(outEnd.y-cy)*((animationClock*.42)%1),4,'#b7c7ff'); // Показывает движение импульса после границы сред.
        dot(cx,cy,5,'#ffffff'); label(`n₁ = ${n1.toFixed(1)}`,18,cy-18); label(`n₂ = ${n2.toFixed(1)}`,18,cy+25); label(`θ₁ = ${state.angle}°`,cx-120,cy-65,'#ffbd75'); result=total?'Полное отражение':`${(b*180/Math.PI).toFixed(1)}°`; detail=total?'Луч не проходит во вторую среду.':'Угол преломления относительно нормали.'; // Показывает показатели преломления и итоговый угол.
      } else if (spec.id === 'energy') { // Рисует спуск тела и столбцы энергии.
        const H=state.height, baseFrac=state.position/100, frac=Math.max(0,Math.min(1,baseFrac+.28*Math.sin(animationClock*1.15))), m=state.mass, g=9.81, ep=m*g*H*(1-frac), ek=m*g*H*frac, total=m*g*H, x=70, top=35, bottom=h-35; // Непрерывно меняет положение тела и пересчитывает обе формы энергии.
        line(x,top,x,bottom,'#8b9abb',2); line(x,bottom,w*0.52,bottom,'#8b9abb',2); line(x,bottom- H/H*(bottom-top)*0.7,w*0.52,bottom,'#6c7da0',2); dot(x+frac*(w*.42),bottom-frac*(bottom-top)*.7-12,11,'#9e8bff'); // Рисует наклонный путь и положение тела.
        const bx=w*.64, bw=34, maxH=h-85; ctx.fillStyle='#9e8bff'; ctx.fillRect(bx,bottom-maxH*(ep/total),bw,maxH*(ep/total)); ctx.fillStyle='#63d9c3'; ctx.fillRect(bx+48,bottom-maxH*(ek/total),bw,maxH*(ek/total)); ctx.fillStyle='#ffbd75'; ctx.fillRect(bx+96,bottom-maxH,bw,maxH); // Рисует столбцы потенциальной, кинетической и полной энергии.
        label('Eₚ',bx,bottom+20); label('Eₖ',bx+48,bottom+20); label('E',bx+103,bottom+20); result=`${total.toFixed(1)} Дж`; detail=`Eₚ ${ep.toFixed(1)} Дж · Eₖ ${ek.toFixed(1)} Дж; сумма постоянна.`; // Показывает сохранение полной энергии.
      } else if (spec.id === 'laplace') { // Рисует мыльный пузырь и схему перепада давления.
        const r=state.radius, gamma=state.gamma/1000, dp=4*gamma/(r/1000), radius=Math.min(w,h)*0.28*(r/30); dot(w*.38,h*.47,Math.max(16,radius),'#8bdcf0'); ctx.strokeStyle='#d7f7ff'; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(w*.38,h*.47,Math.max(16,radius),0,Math.PI*2); ctx.stroke(); // Рассчитывает давление и рисует пузырь.
        for(let i=0;i<8;i++){const a=i*Math.PI/4+animationClock*.35; line(w*.38+Math.cos(a)*(radius+4),h*.47+Math.sin(a)*(radius+4),w*.38+Math.cos(a)*(radius+22),h*.47+Math.sin(a)*(radius+22),'#ffbd75',2);} for(let i=0;i<12;i++){const a=animationClock*.6+i*Math.PI/6; dot(w*.38+Math.cos(a)*(radius+8),h*.47+Math.sin(a)*(radius+8),2.5,'#e8ffff');} label(`r = ${r} мм`,w*.66,h*.35); label(`γ = ${state.gamma} мН/м`,w*.66,h*.43); result=`${dp.toFixed(1)} Па`; detail='Перепад давления для идеализированного мыльного пузыря.'; // Рисует стрелки давления и выводит параметры пузыря.
      } else if (spec.id === 'wave') { // Рисует график бегущей волны.
        const A=state.amplitude, f=state.frequency, v=state.speed, lambda=v/f, mid=h*.52, scale=(h*.34)/10, phase=animationClock*f*1.7; line(15,mid,w-15,mid,'#7788aa',1); ctx.beginPath(); for(let x=0;x<=w;x+=2){const y=mid-Math.sin((x/w)*Math.PI*4-phase)*A*scale; if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);} ctx.strokeStyle='#8eabff'; ctx.lineWidth=3; ctx.stroke(); label('y(x)',18,22); label('x →',w-48,mid-12); result=`λ = ${lambda.toFixed(2)} м`; detail=`v = ${v} м/с, f = ${f} Гц, A = ${A} см.`; // Показывает длину волны и параметры колебаний.
      } else if (spec.id === 'euclid') { // Рисует треугольник и показывает сумму углов.
        const a=state.alpha*Math.PI/180, b=state.beta*Math.PI/180, c=Math.PI-a-b, p1={x:w*.13,y:h*.78}, p2={x:w*.87,y:h*.78}, base=p2.x-p1.x, apexX=p1.x+base*Math.tan(b)/(Math.tan(a)+Math.tan(b)), apexY=p1.y-base*Math.tan(a)*Math.tan(b)/(Math.tan(a)+Math.tan(b)), p3={x:apexX,y:apexY}; line(p1.x,p1.y,p2.x,p2.y,'#8eabff',3); line(p1.x,p1.y,p3.x,p3.y,'#63d9c3',3); line(p3.x,p3.y,p2.x,p2.y,'#ffbd75',3); dot(p1.x,p1.y,4,'#fff');dot(p2.x,p2.y,4,'#fff');dot(p3.x,p3.y,4,'#fff'); label(`α=${state.alpha}°`,p1.x+12,p1.y-12); label(`β=${state.beta}°`,p2.x-55,p2.y-12); label(`γ=${(c*180/Math.PI).toFixed(1)}°`,p3.x+12,p3.y+20); result=`γ = ${(c*180/Math.PI).toFixed(1)}°`; detail='Сумма углов равна 180° только если α + β < 180°.'; // Выводит третий угол и поясняет условие существования треугольника.
        if(c>0){const markerT=(animationClock*.18)%1; dot(p1.x+(p3.x-p1.x)*markerT,p1.y+(p3.y-p1.y)*markerT,4,'#fff0a8');} // Двигает контрольную точку по стороне, не меняя геометрию треугольника.
        if(c<=0){result='Углы не образуют треугольник';detail='Уменьши один из двух заданных углов.';} // Предупреждает о невозможных значениях углов.
      } else if (spec.id === 'cycloid') { // Рисует циклоиду и движущуюся точку катящегося колеса.
        const R=state.radius, animatedProgress=(state.progress+animationClock*38)%720, t=animatedProgress*Math.PI/180, base=h*.72, sc=Math.min(w/(4*Math.PI*R+30),(h*.48)/(2*R+1)); line(10,base,w-10,base,'#7788aa',2); ctx.beginPath(); for(let q=0;q<=Math.PI*4;q+=.025){const x=20+R*sc*(q-Math.sin(q)), y=base-R*sc*(1-Math.cos(q)); if(q===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);} ctx.strokeStyle='#8eabff';ctx.lineWidth=2.5;ctx.stroke(); const cx=20+R*sc*(t-Math.sin(t)), cy=base-R*sc*(1-Math.cos(t)); dot(cx,cy,6,'#ffbd75'); ctx.beginPath();ctx.arc(cx,base-R*sc,R*sc,0,Math.PI*2);ctx.strokeStyle='#63d9c3';ctx.lineWidth=1.5;ctx.stroke(); line(cx,base-R*sc,cx,cy,'#63d9c3',1.5); result=`t = ${(t).toFixed(2)} рад`; detail=`Текущий угол точки: ${animatedProgress.toFixed(0)}°; R = ${R}.`; // Показывает циклоиду, колесо и положение точки на ободе.
      } else if (spec.id === 'similarity') { // Рисует два подобных треугольника разного масштаба.
        const a=state.a,k=state.scale, baseY=h*.82, x1=w*.12, x2=w*.55, unit=Math.min(w*.3/10,h*.48/10); const drawTri=(x,scale,color)=>{const p=[{x,y:baseY},{x:x+a*unit*scale,y:baseY},{x:x+a*unit*.48*scale,y:baseY-a*unit*.8*scale}]; line(p[0].x,p[0].y,p[1].x,p[1].y,color,3);line(p[1].x,p[1].y,p[2].x,p[2].y,color,3);line(p[2].x,p[2].y,p[0].x,p[0].y,color,3);}; drawTri(x1,1,'#63d9c3'); drawTri(x2,k,'#9e8bff'); const compareT=(animationClock*.3)%1; dot(x1+a*unit*compareT,baseY,4,'#fff0a8'); dot(x2+a*unit*k*compareT,baseY,4,'#fff0a8'); label('Исходный',x1,baseY+20); label(`Масштаб k=${k.toFixed(1)}`,x2,baseY+20); result=`S′/S = ${(k*k).toFixed(2)}`; detail=`Сторона ${a} см превращается в ${(a*k).toFixed(1)} см.`; // Сравнивает исходный треугольник и увеличенную либо уменьшенную копию.
      } else if (spec.id === 'minimal') { // Рисует проволочную модель катеноида как пример минимальной поверхности.
        const waist=state.waist, height=state.height, cx=w/2, cy=h/2, sx=Math.min(w*.12,24), sy=Math.min(h*.11,24); for(let j=0;j<=16;j++){const v=-1+2*j/16, radius=waist*Math.cosh(v*height/2); ctx.beginPath(); for(let i=0;i<=100;i++){const u=i*Math.PI*2/100+animationClock*.22, X=cx+radius*Math.cos(u)*sx, Y=cy+v*height*sy+radius*Math.sin(u)*sx*.35; if(i===0)ctx.moveTo(X,Y);else ctx.lineTo(X,Y);} ctx.strokeStyle=j%4===0?'#63d9c3':'#52668b';ctx.lineWidth=j%4===0?1.8:1;ctx.stroke();} for(let i=0;i<20;i++){const u=i*Math.PI*2/20;ctx.beginPath();for(let j=0;j<=80;j++){const v=-1+2*j/80, radius=waist*Math.cosh(v*height/2), angle=u+animationClock*.22, X=cx+radius*Math.cos(angle)*sx, Y=cy+v*height*sy+radius*Math.sin(angle)*sx*.35;if(j===0)ctx.moveTo(X,Y);else ctx.lineTo(X,Y);}ctx.strokeStyle='#9e8bff';ctx.lineWidth=1;ctx.stroke();} result='Катеноид'; detail=`Радиус горловины ${waist.toFixed(1)}; высота ${height.toFixed(1)}. Геометрическая иллюстрация.`; // Строит сетку линий на поверхности катеноида.
      } // Завершает выбор алгоритма рисования для конкретной модели.
      const resultNode=document.getElementById(`${spec.id}-result`); // Находит поле результата модели.
      const detailNode=document.getElementById(`${spec.id}-detail`); // Находит поле пояснения модели.
      if(resultNode)resultNode.textContent=result; // Обновляет главный вычисленный результат.
      if(detailNode)detailNode.textContent=detail; // Обновляет пояснение вычисления.
    }); // Завершает отрисовку одной модели.
  } // Завершает функцию отрисовки дополнительных моделей.

  function resizeCanvases() { // Перерисовывает все модели после изменения размера окна.
    drawPendulum(); // Обновляет модель маятника.
    drawTriangle(); // Обновляет геометрическую модель.
    drawSpring(); // Обновляет модель пружины.
    drawOhm(); // Обновляет схему электрической цепи.
    drawAdvancedModels(); // Обновляет все девять дополнительных моделей.
  } // Закрывает блок функции, условия, цикла или обработчика.
  window.addEventListener("resize", resizeCanvases); // Перерисовывает Canvas при изменении размеров окна.
  requestAnimationFrame(animateOhm); // Запускает цикл анимации электрической цепи.
  let lastModelFrame = 0; // Хранит время предыдущего общего кадра.
  function animateAllModels(timestamp) { // Непрерывно обновляет все видимые дополнительные модели.
    if (lastModelFrame) animationClock += Math.min((timestamp - lastModelFrame) / 1000, 0.05); // Увеличивает время анимации с защитой от больших скачков.
    lastModelFrame = timestamp; // Запоминает время текущего кадра.
    drawAdvancedModels(); // Перерисовывает динамические сцены и синхронно обновляет расчёты.
    requestAnimationFrame(animateAllModels); // Планирует следующий кадр анимации.
  } // Завершает непрерывный цикл анимации.
  requestAnimationFrame(animateAllModels); // Запускает общий цикл анимации моделей.

  // Состояние теста объявлено заранее, чтобы строгий режим JavaScript не прерывал запуск теста.
  let quizStarted = false; // Показывает, запускался ли тест хотя бы один раз.
  let quizIndex = 0; // Хранит индекс текущего вопроса.
  let quizScore = 0; // Хранит количество правильных ответов.
  let answered = false; // Не позволяет отвечать на один вопрос несколько раз.

  // ---------- Тест ----------
  const questionBanks = { // Хранит независимые наборы вопросов по предметам.
    physics: [ // Вопросы по физике.
      {q:"Как изменится сила тяготения, если расстояние между телами увеличить в 2 раза?",a:["Увеличится в 2 раза","Уменьшится в 2 раза","Уменьшится в 4 раза","Не изменится"],correct:2,explain:"Сила обратно пропорциональна квадрату расстояния: 1 / 2² = 1/4."}, // Вопрос с вариантами ответа, индексом правильного варианта и объяснением.
      {q:"Как записывается закон преломления света?",a:["n₁ sin θ₁ = n₂ sin θ₂","n₁ cos θ₁ = n₂ cos θ₂","θ₁ + θ₂ = 90° всегда","n₁ / θ₁ = n₂ / θ₂"],correct:0,explain:"Закон Снеллиуса связывает показатели преломления и синусы углов относительно нормали."}, // Вопрос с вариантами ответа, индексом правильного варианта и объяснением.
      {q:"В идеальной системе без трения полная механическая энергия…",a:["Постоянно растёт","Сохраняется","Всегда равна нулю","Полностью превращается в тепло"],correct:1,explain:"Потенциальная и кинетическая энергия могут переходить друг в друга, а их сумма сохраняется."}, // Вопрос с вариантами ответа, индексом правильного варианта и объяснением.
      {q:"Для мыльного пузыря перепад давления по закону Лапласа равен…",a:["ΔP = γr","ΔP = 4γ/r","ΔP = r/4γ","ΔP = γ/r²"],correct:1,explain:"У мыльного пузыря две поверхности, поэтому ΔP = 4γ/r."}, // Вопрос с вариантами ответа, индексом правильного варианта и объяснением.
      {q:"Как связаны скорость волны, частота и длина волны?",a:["v = f/λ","v = λ/f","v = fλ","v = f + λ"],correct:2,explain:"За один период волна проходит одну длину волны, поэтому v = fλ."}, // Вопрос с вариантами ответа, индексом правильного варианта и объяснением.
      {q:"В каких единицах измеряется сила в СИ?",a:["Джоулях","Ньютонах","Ваттах","Паскалях"],correct:1,explain:"Единица силы в Международной системе единиц — ньютон (Н)."}, // Вопрос с вариантами ответа, индексом правильного варианта и объяснением.
      {q:"Что происходит с лучом при переходе в оптически более плотную среду под углом?",a:["Он обычно отклоняется к нормали","Он всегда идёт вдоль границы","Его частота обязательно возрастает","Он всегда отражается полностью"],correct:0,explain:"При переходе в среду с большим показателем преломления угол преломления становится меньше угла падения."}, // Вопрос с вариантами ответа, индексом правильного варианта и объяснением.
      {q:"Как выражается кинетическая энергия тела массой m со скоростью v?",a:["mv","mgh","mv²/2","F/s"],correct:2,explain:"Кинетическая энергия поступательного движения равна половине произведения массы на квадрат скорости."}, // Вопрос с вариантами ответа, индексом правильного варианта и объяснением.
      {q:"Что произойдёт с длиной волны, если скорость постоянна, а частота удвоится?",a:["Удвоится","Уменьшится в 2 раза","Уменьшится в 4 раза","Не изменится"],correct:1,explain:"Из λ = v/f следует, что при удвоении частоты длина волны уменьшается вдвое."}, // Вопрос с вариантами ответа, индексом правильного варианта и объяснением.
      {q:"Какое утверждение о законе всемирного тяготения верно?",a:["Сила растёт с квадратом расстояния","Сила зависит только от одной массы","Сила пропорциональна произведению масс","Сила не зависит от расстояния"],correct:2,explain:"F = Gm₁m₂/r², поэтому сила прямо пропорциональна произведению масс."} // Вопрос с вариантами ответа, индексом правильного варианта и объяснением.
    ], // Завершает набор физических вопросов.
    geometry: [ // Вопросы по геометрии.
      {q:"Чему равна сумма внутренних углов обычного плоского треугольника?",a:["90°","180°","270°","360°"],correct:1,explain:"В евклидовой геометрии сумма внутренних углов любого плоского треугольника равна 180°."}, // Вопрос с вариантами ответа, индексом правильного варианта и объяснением.
      {q:"Катеты прямоугольного треугольника равны 6 и 8. Чему равна гипотенуза?",a:["10","12","14","√28"],correct:0,explain:"По теореме Пифагора c = √(6² + 8²) = √100 = 10."}, // Вопрос с вариантами ответа, индексом правильного варианта и объяснением.
      {q:"У двух подобных треугольников коэффициент подобия сторон k = 3. Во сколько раз отличаются их площади?",a:["В 3 раза","В 6 раз","В 9 раз","Не отличаются"],correct:2,explain:"Площади подобных фигур относятся как квадрат коэффициента: k² = 3² = 9."}, // Вопрос с вариантами ответа, индексом правильного варианта и объяснением.
      {q:"Какая формула задаёт циклоиду для точки на ободе катящегося круга радиуса R?",a:["x = R(t − sin t), y = R(1 − cos t)","x = R cos t, y = R sin t","x = t², y = t³","x = R/t, y = Rt"],correct:0,explain:"Параметрические уравнения циклоиды учитывают поступательное движение круга и вращение точки вокруг его центра."}, // Вопрос с вариантами ответа, индексом правильного варианта и объяснением.
      {q:"Если стороны одного треугольника равны 3, 4, 5, а коэффициент подобия второго равен 2, какова его наибольшая сторона?",a:["5","7","10","20"],correct:2,explain:"Соответствующие стороны умножаются на коэффициент подобия: 5 × 2 = 10."}, // Вопрос с вариантами ответа, индексом правильного варианта и объяснением.
      {q:"Как называется сторона прямоугольного треугольника, лежащая напротив прямого угла?",a:["Медиана","Катет","Биссектриса","Гипотенуза"],correct:3,explain:"Гипотенуза — сторона напротив угла 90°; она является самой длинной стороной прямоугольного треугольника."}, // Вопрос с вариантами ответа, индексом правильного варианта и объяснением.
      {q:"Если один угол треугольника равен 90°, а второй 35°, чему равен третий?",a:["45°","55°","65°","125°"],correct:1,explain:"Третий угол равен 180° − 90° − 35° = 55°."}, // Вопрос с вариантами ответа, индексом правильного варианта и объяснением.
      {q:"Что верно для соответствующих сторон подобных треугольников?",a:["Их разности всегда равны","Они пропорциональны","Они всегда равны независимо от масштаба","Их сумма всегда равна 180"],correct:1,explain:"У подобных треугольников отношения соответствующих сторон одинаковы и равны коэффициенту подобия."}, // Вопрос с вариантами ответа, индексом правильного варианта и объяснением.
      {q:"Какое утверждение описывает теорему Пифагора?",a:["a + b = c","a² + b² = c² для прямоугольного треугольника","a² − b² = c² для любого треугольника","a × b = c²"],correct:1,explain:"Квадрат гипотенузы равен сумме квадратов катетов."}, // Вопрос с вариантами ответа, индексом правильного варианта и объяснением.
      {q:"Какое свойство относится к минимальной поверхности?",a:["Она имеет наибольшую возможную площадь при заданном контуре","Она локально минимизирует площадь при заданном контуре","Она всегда является плоскостью","Её поверхность обязательно имеет постоянный положительный изгиб"],correct:1,explain:"Минимальная поверхность является стационарной точкой площади при допустимых малых изменениях с фиксированным контуром."} // Вопрос с вариантами ответа, индексом правильного варианта и объяснением.
    ] // Завершает набор геометрических вопросов.
  }; // Завершает наборы вопросов.
  let selectedSubject = "physics"; // Запоминает выбранный предмет.
  let questions = questionBanks[selectedSubject]; // Указывает текущий набор вопросов.
  const HISTORY_KEY = "physicslab.quiz.history.v1"; // Объявляет константу для элемента, функции или значения, используемого ниже.
  function getHistory() { try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); } catch { return []; } } // Объявляет функцию, выполняющую указанную задачу.
  function renderHistory() { // Объявляет функцию, выполняющую указанную задачу.
    const history = getHistory(); // Объявляет константу для элемента, функции или значения, используемого ниже.
    $("#historyList").innerHTML = history.length // Обращается к элементу страницы или API браузера и выполняет действие.
      ? history.slice(0,8).map(item => `<div>${escapeHTML(item.date)} · ${item.subject === "geometry" ? "Геометрия" : "Физика"} — <strong>${item.score}/10</strong></div>`).join("") // Вычисляет значение или обновляет состояние, используемое приложением.
      : "Пока нет попыток."; // Выполняет очередной шаг логики приложения.
  } // Закрывает блок функции, условия, цикла или обработчика.
  function escapeHTML(value) { return String(value).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch])); } // Объявляет функцию, выполняющую указанную задачу.
  function startQuiz() { // Начинает тест по выбранному предмету.
    questions = questionBanks[selectedSubject]; // Выбирает правильный набор вопросов.
    quizStarted = true; quizIndex = 0; quizScore = 0; answered = false; // Вычисляет значение или обновляет состояние, используемое приложением.
    $("#currentScore").textContent = "0"; // Обращается к элементу страницы или API браузера и выполняет действие.
    $("#scoreMessage").textContent = "Ответь на вопросы, чтобы увидеть результат."; // Обращается к элементу страницы или API браузера и выполняет действие.
    showQuestion(); // Выполняет очередной шаг логики приложения.
  } // Закрывает блок функции, условия, цикла или обработчика.
  function showQuestion() { // Объявляет функцию, выполняющую указанную задачу.
    answered = false; // Вычисляет значение или обновляет состояние, используемое приложением.
    const item = questions[quizIndex]; // Объявляет константу для элемента, функции или значения, используемого ниже.
    $("#questionCounter").textContent = `ВОПРОС ${quizIndex+1} ИЗ ${questions.length}`; // Обращается к элементу страницы или API браузера и выполняет действие.
    $("#scoreLive").textContent = `СЧЁТ: ${quizScore}`; // Обращается к элементу страницы или API браузера и выполняет действие.
    $("#progressBar").style.width = `${(quizIndex / questions.length) * 100}%`; // Обращается к элементу страницы или API браузера и выполняет действие.
    $("#questionText").textContent = item.q; // Обращается к элементу страницы или API браузера и выполняет действие.
    $("#feedback").textContent = ""; // Обращается к элементу страницы или API браузера и выполняет действие.
    $("#nextQuestion").disabled = true; // Обращается к элементу страницы или API браузера и выполняет действие.
    $("#nextQuestion").textContent = quizIndex === questions.length-1 ? "Завершить тест ✓" : "Следующий вопрос →"; // Обращается к элементу страницы или API браузера и выполняет действие.
    const answers = $("#answers"); answers.innerHTML = ""; // Объявляет константу для элемента, функции или значения, используемого ниже.
    item.a.forEach((answer,index) => { // Вычисляет значение или обновляет состояние, используемое приложением.
      const button = document.createElement("button"); // Объявляет константу для элемента, функции или значения, используемого ниже.
      button.className = "answer-option"; button.textContent = `${String.fromCharCode(65+index)}. ${answer}`; // Вычисляет значение или обновляет состояние, используемое приложением.
      button.addEventListener("click", () => chooseAnswer(index, button)); // Назначает обработчик события пользователя или браузера.
      answers.appendChild(button); // Выполняет очередной шаг логики приложения.
    }); // Закрывает блок функции, условия, цикла или обработчика.
  } // Закрывает блок функции, условия, цикла или обработчика.
  function chooseAnswer(index, selectedButton) { // Объявляет функцию, выполняющую указанную задачу.
    if (answered) return; // Проверяет условие и выполняет блок только при его истинности.
    answered = true; // Вычисляет значение или обновляет состояние, используемое приложением.
    const item = questions[quizIndex]; // Объявляет константу для элемента, функции или значения, используемого ниже.
    const buttons = [...$("#answers").querySelectorAll("button")]; // Объявляет константу для элемента, функции или значения, используемого ниже.
    buttons.forEach((button,i) => { // Вычисляет значение или обновляет состояние, используемое приложением.
      button.disabled = true; // Вычисляет значение или обновляет состояние, используемое приложением.
      if (i === item.correct) button.classList.add("correct"); // Проверяет условие и выполняет блок только при его истинности.
    }); // Закрывает блок функции, условия, цикла или обработчика.
    if (index === item.correct) { // Проверяет условие и выполняет блок только при его истинности.
      quizScore++; selectedButton.classList.add("correct"); // Выполняет очередной шаг логики приложения.
      $("#feedback").textContent = `Верно! ${item.explain}`; // Обращается к элементу страницы или API браузера и выполняет действие.
    } else { // Закрывает блок функции, условия, цикла или обработчика.
      selectedButton.classList.add("wrong"); // Выполняет очередной шаг логики приложения.
      $("#feedback").textContent = `Не совсем. ${item.explain}`; // Обращается к элементу страницы или API браузера и выполняет действие.
    } // Закрывает блок функции, условия, цикла или обработчика.
    $("#currentScore").textContent = String(quizScore); // Обращается к элементу страницы или API браузера и выполняет действие.
    $("#scoreLive").textContent = `СЧЁТ: ${quizScore}`; // Обращается к элементу страницы или API браузера и выполняет действие.
    $("#progressBar").style.width = `${((quizIndex+1) / questions.length) * 100}%`; // Обращается к элементу страницы или API браузера и выполняет действие.
    $("#nextQuestion").disabled = false; // Обращается к элементу страницы или API браузера и выполняет действие.
  } // Закрывает блок функции, условия, цикла или обработчика.
  $("#nextQuestion").addEventListener("click", () => { // Назначает обработчик события пользователя или браузера.
    if (!answered) return; // Проверяет условие и выполняет блок только при его истинности.
    if (quizIndex < questions.length - 1) { quizIndex++; showQuestion(); return; } // Проверяет условие и выполняет блок только при его истинности.
    const history = getHistory(); // Объявляет константу для элемента, функции или значения, используемого ниже.
    history.unshift({ score: quizScore, subject: selectedSubject, date: new Date().toLocaleDateString("ru-RU") }); // Выполняет очередной шаг логики приложения.
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0,10))); } catch {} // Начинает блок, ошибки которого обрабатываются отдельно.
    $("#questionCounter").textContent = "ТЕСТ ЗАВЕРШЁН"; // Обращается к элементу страницы или API браузера и выполняет действие.
    $("#questionText").textContent = `Твой результат: ${quizScore} из ${questions.length}`; // Обращается к элементу страницы или API браузера и выполняет действие.
    $("#answers").innerHTML = ""; // Обращается к элементу страницы или API браузера и выполняет действие.
    $("#feedback").textContent = quizScore >= 9 ? "Отличный результат! Ты хорошо освоил материал." : quizScore >= 7 ? "Хороший результат. Повтори вопросы, в которых ошибся." : "Повтори конспект и попробуй ещё раз."; // Обращается к элементу страницы или API браузера и выполняет действие.
    $("#nextQuestion").textContent = "Пройти заново ↻"; // Обращается к элементу страницы или API браузера и выполняет действие.
    $("#nextQuestion").disabled = false; // Обращается к элементу страницы или API браузера и выполняет действие.
    $("#nextQuestion").onclick = () => { $("#nextQuestion").onclick = null; startQuiz(); }; // Обращается к элементу страницы или API браузера и выполняет действие.
    $("#scoreMessage").textContent = quizScore >= 9 ? "Прекрасно! Продолжай исследовать модели." : "Посмотри объяснения к ответам и повтори попытку."; // Обращается к элементу страницы или API браузера и выполняет действие.
    renderHistory(); // Выполняет очередной шаг логики приложения.
  }); // Закрывает блок функции, условия, цикла или обработчика.
  $("#clearHistory").addEventListener("click", () => { // Назначает обработчик события пользователя или браузера.
    localStorage.removeItem(HISTORY_KEY); renderHistory(); // Выполняет очередной шаг логики приложения.
  }); // Закрывает блок функции, условия, цикла или обработчика.
  document.querySelectorAll("[data-quiz-subject]").forEach(button => button.addEventListener("click", () => { // Подключает переключатель предмета для теста.
    selectedSubject = button.dataset.quizSubject; // Сохраняет выбранный предмет.
    document.querySelectorAll("[data-quiz-subject]").forEach(item => item.classList.toggle("active", item === button)); // Подсвечивает активный предмет.
    $("#quizSubjectDescription").textContent = selectedSubject === "physics" ? "10 вопросов по физике: механика, свет, энергия и волны." : "10 вопросов по геометрии: Пифагор, подобие, углы и кривые."; // Обновляет описание выбранного теста.
    startQuiz(); // Начинает новую попытку по выбранному предмету.
  })); // Завершает настройку переключателя предмета.
  renderHistory(); // Обновляет историю попыток.

  // Первичная отрисовка после готовности layout.
  requestAnimationFrame(() => { // Планирует следующий кадр анимации средствами браузера.
    updatePendulumMetrics(); // Выполняет очередной шаг логики приложения.
    updateTriangle(); // Выполняет очередной шаг логики приложения.
    updateSpring(); // Выполняет очередной шаг логики приложения.
    updateOhm(); // Выполняет очередной шаг логики приложения.
    resizeCanvases(); // Выполняет очередной шаг логики приложения.
  }); // Закрывает блок функции, условия, цикла или обработчика.
})();  // Закрывает блок функции, условия, цикла или обработчика.
