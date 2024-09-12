export default () => {

    const time = Variable('', {
        poll: [1000, function() {
            return Date().toString();
        }],
    });

    const timeLabel = Widget.Label({
        hpack: 'center',
        label: time.bind(),
    })

    return timeLabel
}
