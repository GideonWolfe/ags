import Volume from './widgets/volume.ts';
import MprisWidget from './widgets/mpris.ts';
import Date from './widgets/date.ts';
import Calendar from './widgets/calendar.ts';



function Left() {
    return Widget.Box({
        spacing: 8,
        children: [
            //Calendar(),
            Volume(),
            MprisWidget(),
        ],
    })
}

function Right() {
    return Widget.Box({
        hpack: 'center',
        children: [
            Date(),
        ],
    })
}

const Bar = (monitor: number) => Widget.Window({
    monitor,
    name: `bar${monitor}`,
    anchor: ['top', 'left', 'right'],
    exclusivity: 'exclusive',
    child: Widget.CenterBox({
        start_widget: Left(),
        //center_widget: batteryProgress,
        end_widget: Right(),
    }),
});


// main scss file
// this file imports all the others
const scss = `${App.configDir}/styles/main.scss`

// target css file
const css = `/tmp/style.css`

// generates final CSS file
Utils.exec(`sassc ${scss} ${css}`)

App.config({
    windows: [Bar(0)],
    style: css,
});
