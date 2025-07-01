function init() {
    setupEventListeners();
}

init()

// Functions
function setupEventListeners() {
    document.querySelectorAll('.div-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            document.querySelectorAll('.div-tab').forEach(tempTab => tempTab.classList.remove('active'))
            tab.classList.add('active')
        })
    })
}
