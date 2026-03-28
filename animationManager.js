import Clutter from 'gi://Clutter';

export default class AnimationManager {
    constructor() {
        // Any global animation configs
    }

    setupHoverAnimation(actor) {
        // Force the pivot point to center as per Phase 3 requirements
        actor.set_pivot_point(0.5, 0.5);

        // Clutter Implicit Transitions on modern GNOME
        // We set the properties directly and GNOME/Clutter handles the tween
        actor._hoverEnterCb = () => {
            actor.set_scale(1.3, 1.3);
            // We would also add diffuse shadow here (mocked for now)
            actor.set_style_class_name('butia-dock-item butia-dock-item-hovered');
        };

        actor._hoverLeaveCb = () => {
            actor.set_scale(1.0, 1.0);
            actor.set_style_class_name('butia-dock-item');
        };

        // If it was a real environment, we'd connect signals
        // actor.connect('notify::hover', () => { if (actor.hover) actor._hoverEnterCb(); else actor._hoverLeaveCb(); });
    }

    setupJiggleMode(actors) {
        // Random delays applied in real implementation
        actors.forEach(actor => {
            // Apply CSS animation class
            actor.set_style_class_name('butia-dock-item butia-jiggle');
        });
    }

    stopJiggleMode(actors) {
        actors.forEach(actor => {
            actor.set_style_class_name('butia-dock-item');
        });
    }
}
