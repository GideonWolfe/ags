const audio = await Service.import("audio")

export default () => {

    // Slider to control volume
    const slider = Widget.Slider({
        hexpand: true,
        draw_value: false,
        className: "volume-slider",
        on_change: ({ value }) => audio.speaker.volume = value,
        setup: self => self.hook(audio.speaker, () => {
            self.value = audio.speaker.volume || 0
        }),
    })

    // TODO: the icon doesn't change when mute is active
    // Volume icon/button
    const volumeIndicator = Widget.Button({
        // toggle the mute state  when the button is clicked
        on_clicked: () => audio.speaker.is_muted = !audio.speaker.is_muted,

        // Bind right click to open qpwgraph
        on_secondary_click: () => {
            Utils.execAsync(['qpwgraph'])
                .then(out => print(out))
                .catch(err => print(err));
        },

        className: "volume-volumebutton",

        child: Widget.Icon().hook(audio.speaker, self => {
            // Get volume percentage
            const vol = audio.speaker.volume * 100;

            const iconTable = [
                [101, 'overamplified'],
                [67, 'high'],
                [34, 'medium'],
                [1, 'low'],
                [0, 'muted'],
            ]

            // Compare vol to current level and extract the name of level
            var currentLevel = iconTable.find(([threshold]) => {
                return typeof threshold === "number" && threshold <= vol
            })?.[1]

            // Set the icon name based on current volume level
            self.tooltip_text = `Volume ${Math.floor(vol)}%`;
            if (audio.speaker.is_muted) {
                self.class_name = 'volume-volumebutton-icon-muted';
                self.icon = `audio-volume-muted-symbolic`;
            }
            else {
                self.icon = `audio-volume-${currentLevel}-symbolic`;
                self.class_name = `volume-volumebutton-icon-${currentLevel}`;
            }


        }),
    })

    return Widget.Box({
        class_name: "volume",
        css: "min-width: 180px",
        children: [volumeIndicator, slider],
    })
}
