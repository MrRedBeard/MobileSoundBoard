class sbObj
{
    constructor(options)
    {
        if (typeof options === 'undefined')
        {
            throw 'options must be defined';
        }

        this.options = options;

        this.soundboard = options.soundBoardObj;

        this.title = this.options.title || '';
        this.imgSources = this.options.imgSources;
        this.audioSources = this.options.audioSources;

        this.imgArray = [];
        this.audioArray = [];

        this.imgReady = false;
        this.audioReady = false;
        this.isReady = false;

        this.load();
    }

    load()
    {
        for (var i = 0; i < this.imgSources.length; i++)
        {
            //let img = new Image();
            let img = document.createElement('IMG');
            img.onload = function () { this.ImageLoaded(img); }.bind(this);
            img.src = this.imgSources[i];
        }

        for (var j = 0; j < this.audioSources.length; j++)
        {
            let audio = document.createElement('AUDIO');
            audio.onloadeddata = function () { this.AudioLoaded(audio); }.bind(this);
            audio.src = this.audioSources[j];
        }
    }

    ImageLoaded(img)
    {
        this.imgArray.push(img);

        if (this.imgArray.length >= this.imgSources.length)
        {
            this.imgReady = true;
            this.Ready();
        }
    }

    getRandomImage()
    {
        return this.imgArray[Math.floor(Math.random() * this.imgArray.length)];
    }

    AudioLoaded(audio)
    {
        this.audioArray.push(audio);

        if (this.audioArray.length >= this.audioSources.length)
        {
            this.audioReady = true;
            this.Ready();
        }
    }

    Ready()
    {
        if (this.imgReady && this.audioReady)
        {
            if (!this.isReady)
            {
                this.soundboard.addBoard(this);
                this.isReady = true;
            }
        }
    }
}

class sb
{
    constructor()
    {
        this.soundboardWrapper = document.querySelector('.soundboardWrapper');

        this.soundboards = [];

        this.addRefresh();
    }

    addBoard(sbObject)
    {
        this.soundboards.push(sbObject);
        setTimeout(function ()
        {
            this.buildBoard(sbObject);
        }.bind(this), 500);
    }

    addRefresh()
    {
        this.refreshBtn = new Image();
        this.refreshBtn.src = 'img/refresh.png';
        this.refreshBtn.classList.add('refresh');
        this.refreshBtn.addEventListener('click', function ()
        {
            this.refresh();
        }.bind(this));

        this.soundboardWrapper.appendChild(this.refreshBtn);
    }

    buildBoard(sbObject)
    {
        let brd = document.createElement("DIV");
        brd.classList.add('soundBoard');

        let title = document.createElement("H1");
        title.innerText = sbObject.title;
        brd.appendChild(title);

        let hr = document.createElement("HR");
        brd.appendChild(hr);        

        for (var i = 0; i < sbObject.audioArray.length; i++)
        {
            let btn = document.createElement("DIV");
            btn.classList.add('button');

            let currentAudio = sbObject.audioArray[i];

            let img = sbObject.getRandomImage();
            img = img.cloneNode(true);

            img.addEventListener('click', function ()
            {
                currentAudio.play();
            }.bind(this));

            btn.appendChild(img);

            let p = document.createElement('P');
            p.innerText = sbObject.audioArray[i].src.split('/')[sbObject.audioArray[i].src.split('/').length - 1].split('.')[0];

            btn.appendChild(p);

            brd.appendChild(btn);
        }

        this.soundboardWrapper.appendChild(brd);
    }

    refresh()
    {
        this.soundboardWrapper.innerHTML = '';

        for (var i = 0; i < this.soundboards.length; i++)
        {
            this.buildBoard(this.soundboards[i]);
        }
        this.addRefresh();
    }
}
