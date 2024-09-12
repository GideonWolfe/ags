const audio = await Service.import("audio")
import Mpris from 'resource:///com/github/Aylur/ags/service/mpris.js';

const { Box, Button, EventBox, Label, Overlay, Revealer, Scrollable } = Widget;

const { execAsync, exec } = Utils;

import { TrackProgress } from "./track_progress.ts";

// What is exported by the MPRIS widget
export default () => {

    // Playing state of media (play/pause symbol in progress circle)
    const playingState = Box({ // Wrap a box cuz overlay can't have margins itself
        homogeneous: true,
        children: [Overlay({
            child: Box({
                vpack: 'center',
                className: 'bar-music-playstate',
                homogeneous: true,
                children: [Label({
                    vpack: 'center',
                    className: 'bar-music-playstate-txt',
                    justification: 'center',
                    setup: (self) => self.hook(Mpris, label => {
                        const mpris = Mpris.getPlayer('');
                        //label.label = `${mpris !== null && mpris.play_back_status == 'Playing' ? 'pause' : 'play_arrow'}`;
                        label.label = `${mpris !== null && mpris.play_back_status == 'Playing' ? '' : ''}`;
                    }),
                })],
                setup: (self) => self.hook(Mpris, label => {
                    const mpris = Mpris.getPlayer('');
                    if (!mpris) return;
                    label.toggleClassName('bar-music-playstate-playing', mpris !== null && mpris?.play_back_status == 'Playing');
                    label.toggleClassName('bar-music-playstate', mpris !== null || mpris?.play_back_status == 'Paused');
                }),
            }),
            overlays: [
                TrackProgress(),
            ]
        })]
    });


    // State of media
    const oldplayingState = Box({ // Wrap a box cuz overlay can't have margins itself
        homogeneous: true,
        children: [Overlay({
            child: Box({
                vpack: 'center',
                //className: 'bar-music-playstate',
                homogeneous: true,
                children: [Label({
                    vpack: 'center',
                    //className: 'bar-music-playstate-txt',
                    justification: 'center',
                    setup: (self) => self.hook(Mpris, label => {
                        const mpris = Mpris.getPlayer('');
                        label.label = `${mpris !== null && mpris.play_back_status == 'Playing' ? '' : ''}`;
                        // Change class to update icon color
                        self.class_name = "mpris-icon-" + `${mpris?.play_back_status}`.toLowerCase();
                        //print(mpris?.name)
                    }),
                })],
                // setup: (self) => self.hook(Mpris, label => {
                //     const mpris = Mpris.getPlayer('');
                //     if (!mpris) return;
                //     label.toggleClassName('bar-music-playstate-playing', mpris !== null && mpris.playBackStatus == 'Playing');
                //     label.toggleClassName('bar-music-playstate', mpris !== null || mpris.playBackStatus == 'Paused');
                // }),
            }),
            // overlays: [
            //     TrackProgress(),
            // ]
        })]
    });

    // BUG: not changing title when player changes, but clicks control new player
    // Variable for current track info
    const trackTitle = Label({
        hexpand: true,
        //className: 'txt-smallie bar-music-txt',
        truncate: 'end',
        maxWidthChars: 1, // Doesn't matter, just needs to be non negative
        setup: (self) => self.hook(Mpris, label => {
            const mpris = Mpris.getPlayer('');
            if (mpris)
                label.label = `${mpris.track_title} • ${mpris.track_artists.join(', ')}`;
            else
                label.label = 'No media';
        }),
    })



    // Box that holds the playing state and track info
    const musicControlBox = Box({
        hexpand: true,
        children: [
            playingState,
            trackTitle,
        ]
    })

    // Eventbox to contain onclick functions for music control box
    const outerMusicBox = EventBox({
        child: musicControlBox,
        onMiddleClick: () => execAsync('playerctl play-pause').catch(print),
        onSecondaryClick: () => execAsync(['bash', '-c', 'playerctl next || playerctl position `bc <<< "100 * $(playerctl metadata mpris:length) / 1000000 / 100"` &']).catch(print),
    })

    return outerMusicBox

}
