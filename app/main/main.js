const file_explorer_svg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
class="bi bi-folder2-open" viewBox="0 0 16 16">
<path
    d="M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.76.56 2.311 1.184C7.985 3.648 8.48 4 9 4h4.5A1.5 1.5 0 0 1 15 5.5v.64c.57.265.94.876.856 1.546l-.64 5.124A2.5 2.5 0 0 1 12.733 15H3.266a2.5 2.5 0 0 1-2.481-2.19l-.64-5.124A1.5 1.5 0 0 1 1 6.14V3.5zM2 6h12v-.5a.5.5 0 0 0-.5-.5H9c-.964 0-1.71-.629-2.174-1.154C6.374 3.334 5.82 3 5.264 3H2.5a.5.5 0 0 0-.5.5V6zm-.367 1a.5.5 0 0 0-.496.562l.64 5.124A1.5 1.5 0 0 0 3.266 14h9.468a1.5 1.5 0 0 0 1.489-1.314l.64-5.124A.5.5 0 0 0 14.367 7H1.633z" />
</svg>`;



(async () => {
    let currentDir = (await window.api.invoke("getCurrentDir")).toString();
    console.log(`Starting Dir: ${currentDir}`)
    pathInputEl.value = currentDir;

    const folderUpBtn = document.getElementById("folderUpBtn");
    const directoryInfo = document.getElementById('directoryInfo')
    updateDirectoryButtons()

    function updateDirectoryButtons() {
        
        if (`${currentDir}`.split("/").length == 1) {
            currentDir = currentDir+="/"
            folderUpBtn.classList.add('disabled')
        }
        pathInputEl.value = currentDir;

        if(this.currentFilesAndFolders){
            directoryInfo.innerText = `${currentFilesAndFolders.filter(x => !x.isFolder).length} files | ${currentFilesAndFolders.filter(x => x.isFolder).length} folders`
        }
    }

    async function updateCurrentDirectoryFiles(){
        const currentFilesAndFolders = await window.api.invoke("getDirFilesAndFolders", currentDir);

        let html = `<div class="directoryInfo" id="directoryInfo">${currentFilesAndFolders.filter(x => !x.isFolder).length} files | ${currentFilesAndFolders.filter(x => x.isFolder).length} folders</div>`;
        explorer.innerHTML = html;
    
        currentFilesAndFolders.forEach((file) => {
            console.log(file);
    
            const fileEl = document.createElement('div');
            fileEl.classList.add("file");
    
            const iconEl = document.createElement('div');
            iconEl.classList.add("icon");
            fileEl.append(iconEl)
    
            const iconIMG = document.createElement('img');
            iconIMG.src = file.icon;
            iconEl.append(iconIMG);
    
            const fileNameEl = document.createElement("div");
            fileNameEl.classList.add("filename");
            fileNameEl.innerText = file.filename;
            fileEl.append(fileNameEl);

            fileNameEl.onclick = (() => {
                window.api.send("fil")
            })
    
            const revearlInFileExplorerEl = document.createElement("div");
            revearlInFileExplorerEl.classList.add("show");
            revearlInFileExplorerEl.title = `Show more options`;
            revearlInFileExplorerEl.innerHTML = `...`;
            fileEl.append(revearlInFileExplorerEl);
    
            explorer.append(fileEl)
    
        })
    }

  
    folderUpBtn.onclick = (async () => {
        if (folderUpBtn.classList.contains("disabled")) return
        currentDir = `${currentDir}`.split("/");
        currentDir.pop();
        currentDir = currentDir.join("/")
        console.log(currentDir)
        updateDirectoryButtons()
        updateCurrentDirectoryFiles()
    })

    updateCurrentDirectoryFiles()


})()