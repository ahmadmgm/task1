

// ************************ Drag and drop ***************** //
let dropArea = document.getElementById("drop-area")

    // Prevent default drag behaviors
    ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false)
        document.body.addEventListener(eventName, preventDefaults, false)
    })

    // Highlight drop area when item is dragged over it
    ;['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false)
    })

    ;['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false)
    })

// Handle dropped files
dropArea.addEventListener('drop', handleDrop, false)

function preventDefaults(e) {
    e.preventDefault()
    e.stopPropagation()
}

function highlight(e) {
    dropArea.classList.add('highlight')
}

function unhighlight(e) {
    dropArea.classList.remove('active')
}

function handleDrop(e) {
    var dt = e.dataTransfer
    var files = dt.files

    handleFiles(files)
}

let uploadProgress = []
let counterCV = 0;
let progressBar = document.getElementById('progress-bar')
let lastProgressBar = document.getElementById('lastProgress')
function initializeProgress(numFiles) {

    progressBar.value = 0
    uploadProgress = []
    for (var i = numFiles; i > 0; i--) {
        counterCV += 1;
        lastProgressBar.style.width = (counterCV * 6.7) + "%";
        lastProgressBar.style.transition = "width 4s ease 0s;";
        uploadProgress.push(0);
    }
    if(counterCV > 15){
        alert("you can't upload more than 15 files");
        return;
    }
    document.getElementsByClassName('numberFiles')[0].innerHTML = counterCV + " Resumes Uploaded";
}

function updateProgress(fileNumber, percent) {
    uploadProgress[fileNumber] = percent
    let total = uploadProgress.reduce((tot, curr) => tot + curr, 0) / uploadProgress.length
    console.debug('update', fileNumber, percent, total)
    progressBar.value = total
}

function handleFiles(files) {
    files = [...files]
    initializeProgress(files.length)
    files.forEach(uploadFile)
    files.forEach(previewFile)
}

function previewFile(file) {
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = function () {
        let parag = document.createElement('p')
        parag.innerHTML = "<img style='width:22px;' src='https://p7.hiclipart.com/preview/685/680/840/portable-document-format-computer-icons-download-pdf-icon-png-pdf-zum-download-thumbnail.jpg' /> " + file.name;
        document.getElementById('gallery').appendChild(parag)
    }
}

function uploadFile(file, i) {
    var url = 'https://api.cloudinary.com/v1_1/ahmadsharaira/auto/upload'
    var xhr = new XMLHttpRequest()
    var formData = new FormData()
    xhr.open('POST', url, true)
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')

    // Update progress (can be used to show progress indicator)
    xhr.upload.addEventListener("progress", function (e) {
        updateProgress(i, (e.loaded * 100.0 / e.total) || 100)
    })

    xhr.addEventListener('readystatechange', function (e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            updateProgress(i, 100) // <- Add this
        }
        else if (xhr.readyState == 4 && xhr.status != 200) {
            // Error. Inform the user
        }
    })

    formData.append('upload_preset', 'ujpu6gyk')
    formData.append('file', file)
    xhr.send(formData)
}