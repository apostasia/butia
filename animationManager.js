import Clutter from 'gi://Clutter';
import Gio from 'gi://Gio';

export default class AnimationManager {
    constructor() {
        this._settings = new Gio.Settings({ schema_id: 'org.gnome.shell.extensions.butia' });
    }

    setupHoverAnimation(actor) {
        actor.set_pivot_point(0.5, 0.5);

        actor._hoverEnterCb = () => {
            actor.set_scale(1.3, 1.3);
            actor.set_style_class_name('butia-dock-item butia-dock-item-hovered');
        };

        actor._hoverLeaveCb = () => {
            actor.set_scale(1.0, 1.0);
            actor.set_style_class_name('butia-dock-item');
        };
    }

    setupJiggleMode(actors) {
        actors.forEach(actor => {
            actor.set_style_class_name('butia-dock-item butia-jiggle');
        });
    }

    stopJiggleMode(actors) {
        actors.forEach(actor => {
            actor.set_style_class_name('butia-dock-item');
        });
    }

    playLaunchAnimation(actor) {
        let animType = this._settings.get_string('launch-animation');
        
        if (animType === 'zoom') {
            // Zoom effect
            actor.set_pivot_point(0.5, 0.5);
            actor.set_scale(1.5, 1.5);
            // Simple timeout for testing, GNOME 50 might use more advanced properties
            // In a real environment, we would also reset it via timeout or animation complete
        } else if (animType === 'glow') {
            // Glow effect
            actor.set_style_class_name('butia-dock-item butia-launch-glow');
        }
    }
}
