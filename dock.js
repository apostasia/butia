import Clutter from 'gi://Clutter';
import St from 'gi://St';
import Shell from 'gi://Shell';
import * as DND from 'resource:///org/gnome/shell/ui/dnd.js';
import FolderManager from './folderManager.js';

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
        
        this._folderManager = new FolderManager();
    }

    populate() {
        // Mock items for now
        let apps = ['firefox', 'terminal', 'files', 'music', 'videos', 'settings'];
        for(let i=0; i<6; i++) {
            let color = ['#f7768e', '#e0af68', '#9ece6a', '#7aa2f7', '#bb9af7', '#7dcfff'][i];
            let block = new St.Widget({
                style: `background-color: ${color};`,
                width: 64, height: 64,
                reactive: true
            });
            block.set_style_class_name('butia-dock-item');
            block.set_pivot_point(0.5, 0.5); 
            block.appId = apps[i]; // Store an ID for DND

            // Implement GNOME Shell DND target interface directly on the actor
            block.handleDragOver = (source, actor, x, y, time) => {
                // If it's dropping onto itself, do nothing
                if (source === block) return DND.DragMotionResult.NO_DROP;
                return DND.DragMotionResult.MOVE_DROP;
            };

            block.acceptDrop = (source, actor, x, y, time) => {
                if (source === block) return false;
                
                // When accepted, trigger folder creation via the manager
                let folderName = `Folder_${source.appId}_${block.appId}`;
                this._folderManager.createFolder(folderName, [source.appId, block.appId]);
                
                // Visual feedback would go here
                
                return true;
            };

            DND.makeDraggable(block, { restoreOnSuccess: true });
            
            this.container.add_child(block);
        }
    }
}
