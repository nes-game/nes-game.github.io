
class Game {
    constructor(_this) {
        this.$ = _this
    }

    screen()
    {

    }

    showGame()
    {
        GAMES.forEach(function (game){
            $(".menu-game > ul").append(
                `<li data-tag="${game.tag}" data-action="play"><h3>${game.name}</h3></li>`
            )
        })
    }

    init(){
        this.screen()
        this.showGame()
        this.$.on("click",'li[data-action="play"]',function (){
            window.location.href =  "./play.html#"+$(this).data('tag')
        })
    }
}
document.addEventListener("DOMContentLoaded",function (){
    new Game($(this)).init()
})

