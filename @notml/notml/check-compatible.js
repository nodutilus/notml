/**
 * Выполняет проверку поддержки браузером функционала используемого библиотекой NotML
 * В случае выявления проблемы покажет заглушку на странице
 */
(function compatible() {
  /* eslint-disable no-var, no-new-func */
  var customElements =
    typeof window.customElements === 'object' &&
    typeof window.customElements.define === 'function' &&
    typeof window.HTMLElement === 'function'
  var success = true
  var messages = []

  if (!customElements) {
    success = false
    messages.push('customElements are not supported')
  }

  try {
    var testFunction1 = new Function(
      'class TestClass {' +
      '  get(){};' +
      '  set(){};' +
      '  test(){};' +
      '  b(){};' +
      '}' +
      'const a = new TestClass()'
    )
    testFunction1()
  } catch (error) {
    success = false
    messages.push('JS classes are not supported')
    messages.push(error.message + '\n' + error.stack)
  }

  try {
    var testFunction2 = new Function(
      'class TestClass {' +
      '  static get(){};' +
      '  static set(){};' +
      '  static test(){};' +
      '  get(){};' +
      '  set(){};' +
      '  test(){};' +
      '  b(){};' +
      '}' +
      'const a = new TestClass()'
    )
    testFunction2()
  } catch (error) {
    success = false
    messages.push('Static methods are not supported in JS classes')
    messages.push(error.message + '\n' + error.stack)
  }

  try {
    var testFunction3 = new Function(
      'class TestClass {' +
      '  test(){};' +
      '  a = 1;' +
      '  b(){};' +
      '}' +
      'const a = new TestClass()'
    )
    testFunction3()
  } catch (error) {
    success = false
    messages.push('Properties are not supported in JS classes')
    messages.push(error.message + '\n' + error.stack)
  }

  try {
    var testFunction4 = new Function(
      'class TestClass {' +
      '  test(){};' +
      '  static a = 1;' +
      '  a = 1;' +
      '  b(){};' +
      '}' +
      'const a = new TestClass()'
    )
    testFunction4()
  } catch (error) {
    success = false
    messages.push('Static properties are not supported in JS classes')
    messages.push(error.message + '\n' + error.stack)
  }

  try {
    var testFunction5 = new Function(
      'class TestClass {' +
      '  static #a = 1;' +
      '  #b = 1;' +
      '}' +
      'const a = new TestClass()'
    )
    testFunction5()
  } catch (error) {
    success = false
    messages.push('Private properties are not supported in JS classes')
    messages.push(error.message + '\n' + error.stack)
  }

  try {
    var testFunction6 = new Function(
      'class TestClass {' +
      '  #test(){};' +
      '}' +
      'const a = new TestClass()'
    )
    testFunction6()
  } catch (error) {
    success = false
    messages.push('Private methods are not supported in JS classes')
    messages.push(error.message + '\n' + error.stack)
  }

  if (!success) {
    window.document.head.innerHTML = ''
    window.onload = function onload() {
      window.document.body.innerHTML =
        '<style>' +
        '  #errorMessages {' +
        '    white-space: pre-wrap;' +
        '    word-break: break-all;' +
        '    color: #B22222;' +
        '  }' +
        '  .flex-center {' +
        '    display: flex;' +
        '    flex-direction: column;' +
        '    align-items: center;' +
        '  }' +
        '</style>' +
        '<div class="flex-center" style="justify-content: space-around;">' +
        '  <div class="flex-center" style="margin: 1rem;">' +
        '    <p>Your browser or device is outdated and not supported.</p>' +
        '    <p>We recommend using the latest version of the Google Chrome browser</p>' +
        '    <p><a href="https://www.google.ru/chrome/">Install Google Chrome</a></p>' +
        '    <p>' +
        '      <button id="moreMessages">More details...</button>' +
        '      <code style="display: none;" id="errorMessages">' +
        '        <pre></pre>' +
        '      </code>' +
        '    </p>' +
        '  </div>' +
        '</div>'
      /** @type {HTMLElement} */
      var moreMessages = window.document.querySelector('#moreMessages')
      /** @type {HTMLElement} */
      var errorMessages = window.document.querySelector('#errorMessages')

      moreMessages.onclick = () => {
        moreMessages.style.display = 'none'
        errorMessages.innerHTML = messages.join('\n\n')
        errorMessages.style.display = 'inline'
      }
    }
  }
})()
