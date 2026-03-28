import Clutter from 'gi://Clutter';
import St from 'gi://St';
import Shell from 'gi://Shell';

export default class Dock {
    constructor() {
        this.container = new St.BoxLayout({
            name: 'ButiaDockContainer',
            reactive: true,
            track_hover: true
        });
        
        this.container.set_style_class_name('butia-dock-container');
        this.container.set_x_align(Clutter.ActorAlign.CENTER);
        this.container.set_y_align(Clutter.ActorAlign.END);

        let blurEffect = new Shell.BlurEffect({
            brightness: 0.60,
            sigma: 30,
            mode: Shell.BlurMode.BACKGROUND
        });
        this.container.add_effect(blurEffect);
    }

    populate() {
        // Mock items for now as per test requirement
        for(let i=0; i<6; i++) {
            let color = ['#f7768e', '#e0af68', '#9ece6a', '#7aa2f7', '#bb9af7', '#7dcfff'][i];
            let block = new St.Widget({
                style: `background-color: ${color};`,
                width: 64, height: 64
            });
            block.set_style_class_name('butia-dock-item');
            block.set_pivot_point(0.5, 0.5); // Updated from 0.5, 1.0 per requirements
            this.container.add_child(block);
        }
    }
}
