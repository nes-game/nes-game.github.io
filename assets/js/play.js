class Play {
    constructor(_this) {
        this.$ = _this
        this.nes = null
        this.isRunGame = true //
        this._modal = new bootstrap.Modal(document.getElementById("exampleModal"), {});
    }

    setScreen()
    {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        let canvasW = 0;
        let canvasH = 0;
        if (screenWidth > screenHeight) {
            canvasH = screenHeight;
            canvasW = canvasH * (256 / 240);

        } else {
            canvasW = screenWidth;
            canvasH = screenWidth * (240 / 256);
        }
        $("#mainCanvas").css({
            width: canvasW,
            height: canvasH
        })
    }

    loadRom() {
        var url = window.location.hash.replace("#",'');
        url = "./assets/roms/"+url+".nes"
        return new Promise((resolve)=>{
            let request = new XMLHttpRequest();
            request.responseType = 'arraybuffer';
            request.onload = function(e) {
                if(request.status===200 && request.readyState===4) return resolve(request.response);
                if(request.status!==200 && request.readyState===4) return resolve(null);
            };

            request.onerror = function(e) {
                console.log(e,'1')
                return resolve(null);
            };

            request.open('GET', url, true);
            request.send(null);
        })
    }

    modal(status){
        if(status) this._modal.show()
    }

    async init()
    {
        this.modal(true)
        let _this = this
        this.setScreen()
        let buffer = await this.loadRom()
        console.log(buffer)
        if(buffer===null) return false;
        const myModalEl = document.getElementById('exampleModal')
        myModalEl.addEventListener('hidden.bs.modal', event => {
            _this.run(buffer)
        })
        //
    }

    run(buffer) {
        let rom = null;
        try {
             rom = new NesJs.Rom(buffer);
        } catch(e) {
            return false;
        }

        let nes = this.nes = new NesJs.Nes();

        nes.addEventListener('fps', function(fps) {
            document.getElementById('fps').innerText = fps.toFixed(2);
        });

        nes.setRom(rom);

        nes.setDisplay(new NesJs.Display(document.getElementById('mainCanvas')));

        try {
            nes.setAudio(new NesJs.Audio());
        } catch(e) {
            console.log('Disables audio because this browser does not seems to support WebAudio.');
        }

        window.onkeydown = function(e) { nes.handleKeyDown(e); };
        window.onkeyup = function(e) { nes.handleKeyUp(e); };
        nes.bootup();
        nes.run();
    }

}
document.addEventListener("DOMContentLoaded",function (){
    new Play($(this)).init().then(function (res){
        console.log(res)
        if(res===false) return window.location.href = "./index.html"
    })
})

