import Mpris from 'resource:///com/github/Aylur/ags/service/mpris.js';
// import the circular progress widget
import { AnimatedCircProg } from "./cairo_circularprogress.ts";


// Returns circle progress widget that updates based on MPRIS info
export const TrackProgress = () => {
    const _updateProgress = (circprog) => {
        const mpris = Mpris.getPlayer('');
        if (!mpris) return;
        // Set circular progress value
        circprog.css = `font-size: ${Math.max(mpris.position / mpris.length * 100, 0)}px;`
    }
    return AnimatedCircProg({
        className: 'bar-music-circprog',
        vpack: 'center', hpack: 'center',
        extraSetup: (self) => self
            .hook(Mpris, _updateProgress)
            .poll(3000, _updateProgress)
        ,
    })
}
