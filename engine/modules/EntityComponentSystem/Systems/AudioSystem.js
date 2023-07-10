class AudioSystem{

    constructor(){
        this.id = "audioSystem";
        this.tracks={};
        this.counter = 0;
    }

    addTrackByElement(audioHtmlElement, id=null){
        if(!id){
            id = this.createId();
        }
        this.tracks[id] = audioHtmlElement;
    }

    addTrackByPath(path, id=null){
        if(!id){
            id = this.createId();
        }
    }

    static createId(){
        const id = `${this.counter}`;
        this.counter++;
        return id;
    }

    update(delta){

    }

    play(id, start=null, end=null, loop=false){
        if(!id in this.tracks){
            console.warn("No audio element stored with id: ", id);
            return;
        }
        this.tracks[id].play();
    }

    stop(id){
        if(!id in this.tracks){
            console.warn("No audio element stored with id: ", id);
            return;
        }
        this.tracks[id].pause();
        this.tracks[id].currentTime = 0;
    }

}

export const audioSystem = new AudioSystem();