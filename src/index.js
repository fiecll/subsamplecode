import * as THREE from "three";
import { Player } from "textalive-app-api";

/**
 * これはコミット用
 * 
 */
class Main
{
    constructor ()
    {
        this.lyricsContainer = document.getElementById("lyrics");  // 修正1: 参照を正しく取得
        this._initPlayer();
        this._update();
    }

    updateLyrics(position) {
        const currentChar = this._player.video.findChar(position);  // 修正5: プレイヤーのビデオを参照
        if (currentChar) {
            const currentPhrase = currentChar.parent;
            this.lyricsContainer.textContent = currentPhrase.text;  // 修正2: thisのスコープ修正
        }
    }

    // プレイヤー初期化
    _initPlayer ()
    {
        this._player = new Player({
            app: {
                // トークンは https://developer.textalive.jp/profile で取得したものを使う
                token: "rR1JoTmnx0KeK0Wn",
                parameters: [
                    {
                        title: "テキスト色",
                        name: "Color",
                        className: "Color",
                        initialValue: "#000000"
                    },
                    {
                        title: "背景色",
                        name: "BackgroundColor",
                        className: "Color",
                        initialValue: "#EEEEEE"
                    },
                ],
            },
            mediaElement: document.querySelector("#media")
        });
        
        this._player.addListener({
            onAppReady: (app) => this._onAppReady(app),
            onVideoReady: (v) => this._onVideoReady(v),
            onTimeUpdate: (pos) => this._onTimeUpdate(pos),  // 修正4: リスナーの重複を修正
        });
    }

    // アプリ準備完了
    _onAppReady (app)
    {
        if (! app.songUrl)
        {
            // 真島ゆろ / 嘘も本当も君だから
            this._player.createFromSongUrl("http://www.youtube.com/watch?v=XSLhsjepelI", {
             video: {
                     // 音楽地図訂正履歴: https://songle.jp/songs/1249410/history
                    beatId: 3818919,
                     chordId: 1207328,
                     repetitiveSegmentId: 1942131,
                     // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/www.youtube.com%2Fwatch%3Fv%3DXSLhsjepelI
                     lyricId: 50145,
                     lyricDiffId: 3168
                   }
                 });
        }

        // 画面クリックで再生／一時停止
        document.getElementById("view").addEventListener("click", () => {
            if (this._player.isPlaying) this._player.requestPause();
            else this._player.requestPlay();
        });  // 修正3: 関数呼び出し修正
    }

    // ビデオ準備完了
    _onVideoReady (v)
    {
        // 必要な初期化コードがあればここに追加
    }

    // 再生位置アップデート
    _onTimeUpdate (position)
    {
        this._position   = position;
        this._updateTime = Date.now();
        this.updateLyrics(position);
    }

    _update ()
    {
        if (this._player.isPlaying && 0 <= this._updateTime && 0 <= this._position)
        {
            var t = (Date.now() - this._updateTime) + this._position;
          
        }
        window.requestAnimationFrame(() => this._update());
    }
}

new Main();
